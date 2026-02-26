import React, { useState } from 'react';
import { useSparkles } from '../context/SparklesContext';
import { useTheme } from '../context/ThemeContext';
import { Search, Loader2, X } from 'lucide-react';
import { AuditResult, CoreWebVitals, DiagnosticItem } from '../types';

function AuditForm() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addAudit, resetDashboard } = useSparkles();
  const { isDark } = useTheme();

  const handleReset = () => {
    // Clear URL input
    setUrl('');
    // Reset dashboard state
    resetDashboard();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    // Reset dashboard BEFORE starting new audit - this clears old scores immediately
    resetDashboard();
    
    setLoading(true);
    
    try {
      // Make sure URL has protocol
      let fullUrl = url.trim();
      if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
        fullUrl = 'https://' + fullUrl;
      }

      // Call our backend API for SEO data
      const seoResponse = await fetch('http://localhost:5000/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: fullUrl })
      });

      let seoData = {
        titleLength: 0,
        metaDescriptionLength: 0,
        h1Count: 0,
        imagesWithoutAlt: 0
      };

      if (seoResponse.ok) {
        seoData = await seoResponse.json();
      }

      // Call Google PageSpeed Insights API - use env variable
      const pageSpeedKey = process.env.REACT_APP_PAGESPEED_API_KEY || '';
      const pagespeedUrl = pageSpeedKey 
        ? `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(fullUrl)}&key=${pageSpeedKey}`
        : `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(fullUrl)}`;
      
      let pagespeedData = null;
      try {
        const psResponse = await fetch(pagespeedUrl);
        
        // Handle different HTTP status codes with specific error messages
        if (psResponse.status === 400) {
          throw new Error('400: Bad Request - The URL may be invalid. Please check the URL and try again.');
        }
        if (psResponse.status === 401) {
          throw new Error('401: Invalid API key. Please check REACT_APP_PAGESPEED_API_KEY in your .env file.');
        }
        if (psResponse.status === 403) {
          throw new Error('403: API key disabled. Please check your Google Cloud Console.');
        }
        if (psResponse.status === 429) {
          throw new Error('429: Rate limit exceeded. Please wait a moment and try again.');
        }
        
        if (psResponse.ok) {
          pagespeedData = await psResponse.json();
        } else {
          const errorText = await psResponse.text();
          throw new Error(`PageSpeed API error (${psResponse.status}): ${errorText}`);
        }
      } catch (psError: any) {
        console.log('PageSpeed API error:', psError);
        // Re-throw specific errors to be handled by outer catch
        if (psError.message?.includes('400:') || 
            psError.message?.includes('401:') || 
            psError.message?.includes('403:') || 
            psError.message?.includes('429:') ||
            psError.message?.includes('PageSpeed API error')) {
          throw psError;
        }
      }

      // Extract metrics from PageSpeed response - throw error if API fails
      const lighthouse = pagespeedData?.lighthouseResult;
      const categories = lighthouse?.categories;
      
      if (!categories?.performance?.score || !categories?.seo?.score || !categories?.accessibility?.score || !categories?.['best-practices']?.score) {
        throw new Error('Failed to fetch complete audit data from Google PageSpeed API. Please check the URL and try again.');
      }
      
      const performance = Math.round(categories.performance.score * 100);
      const accessibility = Math.round(categories.accessibility.score * 100);
      const bestPractices = Math.round(categories['best-practices'].score * 100);
      const seoScore = Math.round(categories.seo.score * 100);

      // Extract Core Web Vitals with display values
      const metrics = pagespeedData?.lighthouseResult?.audits;
      const coreWebVitals: CoreWebVitals = {
        lcp: metrics?.['largest-contentful-paint']?.numericValue || null,
        lcpDisplayValue: metrics?.['largest-contentful-paint']?.displayValue || undefined,
        cls: metrics?.['cumulative-layout-shift']?.numericValue || null,
        clsDisplayValue: metrics?.['cumulative-layout-shift']?.displayValue || undefined,
        fid: metrics?.['max-potential-fid']?.numericValue || null,
        fidDisplayValue: metrics?.['max-potential-fid']?.displayValue || undefined,
        fcp: metrics?.['first-contentful-paint']?.numericValue || null,
        fcpDisplayValue: metrics?.['first-contentful-paint']?.displayValue || undefined,
        si: metrics?.['speed-index']?.numericValue || null,
        siDisplayValue: metrics?.['speed-index']?.displayValue || undefined
      };

      // Extract detailed diagnostics from failed audits
      const diagnostics: DiagnosticItem[] = [];
      const audits = pagespeedData?.lighthouseResult?.audits || {};
      
      // Loop through all audits and filter for failed ones
      Object.entries(audits).forEach(([key, audit]: [string, any]) => {
        // Check if audit failed (score < 1 and not passed)
        const score = audit.score;
        const detailsType = audit.details?.type;
        const category = audit.details?.type === 'opportunity' ? 'performance' : 
                        key.includes('seo') ? 'seo' :
                        key.includes('accessibility') ? 'accessibility' :
                        key.includes('best-practices') ? 'best-practices' : 'performance';
        
        // Include opportunities, failed audits, and SEO issues
        if ((score !== null && score < 1) || detailsType === 'opportunity' || detailsType === 'table') {
          // Skip passed audits
          if (score === 1) return;
          
          diagnostics.push({
            id: key,
            title: audit.title || key,
            description: audit.description || '',
            displayValue: audit.displayValue || '',
            category: category,
            score: score !== null ? score * 100 : 0
          });
        }
      });

      // Limit to top 10 most important diagnostics
      const topDiagnostics = diagnostics.slice(0, 10);

      // Calculate overall score
      const overallScore = Math.round((performance + seoScore + accessibility + bestPractices) / 4);

      // Count issues
      const issuesCount = 
        (seoData.titleLength < 30 || seoData.titleLength > 60 ? 1 : 0) +
        (seoData.metaDescriptionLength < 120 || seoData.metaDescriptionLength > 160 ? 1 : 0) +
        (seoData.h1Count === 0 ? 1 : 0) +
        (seoData.imagesWithoutAlt > 0 ? 1 : 0) +
        (performance < 90 ? 1 : 0) +
        topDiagnostics.length;

      const newAudit: AuditResult = {
        id: Date.now().toString(),
        url: fullUrl,
        date: new Date().toISOString(),
        score: overallScore,
        performance,
        seo: seoScore,
        accessibility,
        bestPractices,
        coreWebVitals,
        diagnostics: topDiagnostics,
        issuesCount
      };

      addAudit(newAudit);
      
      setUrl('');
    } catch (error: any) {
      console.error("FULL API ERROR:", error);
      
      // Check for 429 rate limit error or missing API key
      const errorMessage = error?.message || '';
      const isRateLimit = errorMessage.includes('429') || 
                         errorMessage.toLowerCase().includes('rate limit') ||
                         errorMessage.toLowerCase().includes('api key');
      
      if (isRateLimit) {
        setError('Rate limit exceeded or missing API key. Please check your .env configuration.');
      } else {
        setError(errorMessage || 'Failed to complete audit. Please check the URL and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`backdrop-blur-xl rounded-2xl p-6 border shadow-lg ${
      isDark 
        ? 'bg-white/5 border-white/10' 
        : 'bg-warm-100 border-warm-200'
    }`}>
      <h2 className={`text-2xl font-bold mb-4 flex items-center ${isDark ? 'text-white' : 'text-warm-900'}`}>
        <Search className="mr-2 w-6 h-6" /> Start New Audit
      </h2>

      {/* Error Message Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter website URL (e.g., example.com)"
            className={`w-full px-4 py-3 pl-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
              isDark 
                ? 'bg-black/30 border border-white/10 text-white placeholder-gray-400' 
                : 'bg-warm-50 border border-warm-300 text-warm-900 placeholder-warm-400'
            }`}
          />
          <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-warm-500'}`} />
        </div>
        
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleReset}
            disabled={loading}
            className={`px-4 py-3 font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
              isDark 
                ? 'bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300' 
                : 'bg-warm-200 hover:bg-warm-300 border border-warm-300 text-warm-700'
            }`}
          >
            <X className="w-4 h-4" />
            Clear
          </button>
          
          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-xl hover:from-cyan-400 hover:to-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Start Audit'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AuditForm;
