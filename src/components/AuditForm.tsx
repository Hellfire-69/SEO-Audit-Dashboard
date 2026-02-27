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
    setUrl('');
    resetDashboard();
  };

  const sanitizeUrl = (input: string) => {
    let url = input.trim();
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }
    return url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Assuming Vite or CRA, ensure your API keys are loaded. 
    const pageSpeedKey = process.env.REACT_APP_PAGESPEED_API_KEY;
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    if (!pageSpeedKey) {
      setError('CRITICAL ERROR: API Key is missing. Check .env');
      return;
    }

    if (!url.trim()) return;

    resetDashboard();
    setLoading(true);
    setError(null);
    
    try {
      const cleanUrl = sanitizeUrl(url);

      // 1. Setup default SEO Data in case your backend fails
      let seoData = { titleLength: 0, metaDescriptionLength: 0, h1Count: 0, imagesWithoutAlt: 0 };

      // 2. Fire BOTH requests concurrently
      const pageSpeedUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(cleanUrl)}&key=${process.env.REACT_APP_PAGESPEED_API_KEY}&category=performance&category=seo&category=accessibility&category=best-practices`;
      
      const [seoResult, psResult] = await Promise.allSettled([
        fetch(`${apiUrl}/api/scrape`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: cleanUrl })
        }).then(res => {
            if (!res.ok) throw new Error('Local API failed');
            return res.json();
        }),
        fetch(pageSpeedUrl).then(res => {
            if (!res.ok) throw new Error(`Google API HTTP Error: ${res.status}`);
            return res.json();
        })
      ]);

      // 3. Handle Local SEO Response securely
      if (seoResult.status === 'fulfilled') {
        seoData = seoResult.value;
      } else {
        console.warn("Backend scrape failed, proceeding with default SEO data:", seoResult.reason);
      }

      // 4. Handle PageSpeed Response strictly (This one is mandatory)
      if (psResult.status === 'rejected') {
         throw new Error(psResult.reason.message);
      }

      const pagespeedData = psResult.value;

      if (pagespeedData?.id && typeof pagespeedData.id === 'string' && pagespeedData.id.includes('sorry')) {
        throw new Error('Google rate-limited this request or flagged it as a bot.');
      }

      const lighthouse = pagespeedData?.lighthouseResult;
      const categories = lighthouse?.categories;

      if (!categories) {
        throw new Error("Failed to extract Lighthouse categories. The URL might be unreachable by Google.");
      }

      // --- The rest of your data extraction logic remains the same ---
      const performance = Math.round((categories.performance?.score ?? 0) * 100);
const seoScore = Math.round((categories.seo?.score ?? 0) * 100);
const accessibility = Math.round((categories.accessibility?.score ?? 0) * 100);
const bestPractices = Math.round((categories['best-practices']?.score ?? 0) * 100);

      const metrics = lighthouse?.audits;
      const coreWebVitals: CoreWebVitals = {
        lcp: metrics?.['largest-contentful-paint']?.numericValue ?? null,
        lcpDisplayValue: metrics?.['largest-contentful-paint']?.displayValue ?? undefined,
        cls: metrics?.['cumulative-layout-shift']?.numericValue ?? null,
        clsDisplayValue: metrics?.['cumulative-layout-shift']?.displayValue ?? undefined,
        fid: metrics?.['max-potential-fid']?.numericValue ?? null,
        fidDisplayValue: metrics?.['max-potential-fid']?.displayValue ?? undefined,
        fcp: metrics?.['first-contentful-paint']?.numericValue ?? null,
        fcpDisplayValue: metrics?.['first-contentful-paint']?.displayValue ?? undefined,
        si: metrics?.['speed-index']?.numericValue ?? null,
        siDisplayValue: metrics?.['speed-index']?.displayValue ?? undefined
      };

      const diagnostics: DiagnosticItem[] = [];
      const audits = lighthouse?.audits ?? {};

      Object.entries(audits).forEach(([key, audit]: [string, any]) => {
        const score = audit.score;
        const detailsType = audit.details?.type;
        const category = audit.details?.type === 'opportunity' ? 'performance' :
                         key.includes('seo') ? 'seo' :
                         key.includes('accessibility') ? 'accessibility' :
                         key.includes('best-practices') ? 'best-practices' : 'performance';

        if ((score !== null && score < 1) || detailsType === 'opportunity' || detailsType === 'table') {
          if (score === 1) return;

          diagnostics.push({
            id: key,
            title: audit.title ?? key,
            description: audit.description ?? '',
            displayValue: audit.displayValue ?? '',
            category,
            score: score !== null ? score * 100 : 0
          });
        }
      });

      const topDiagnostics = diagnostics.slice(0, 10);
      const overallScore = Math.round((performance + seoScore + accessibility + bestPractices) / 4);

      const issuesCount =
        (seoData.titleLength < 30 || seoData.titleLength > 60 ? 1 : 0) +
        (seoData.metaDescriptionLength < 120 || seoData.metaDescriptionLength > 160 ? 1 : 0) +
        (seoData.h1Count === 0 ? 1 : 0) +
        (seoData.imagesWithoutAlt > 0 ? 1 : 0) +
        (performance < 90 ? 1 : 0) +
        topDiagnostics.length;

      const newAudit: AuditResult = {
        id: Date.now().toString(),
        url: cleanUrl,
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

    } catch (err: any) {
      console.error("AUDIT PIPELINE ERROR:", err);
      
      const errorMessage = err?.message?.toLowerCase() || '';
      
      if (errorMessage.includes('429') || errorMessage.includes('rate limit')) {
        setError('Google API rate limit exceeded. Slow down or check your billing setup.');
      } else if (errorMessage.includes('failed to fetch')) {
        setError('Network error. Check your connection or verify the URL is publicly accessible.');
      } else {
        setError(err.message || 'Audit failed. Check the URL and try again.');
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
