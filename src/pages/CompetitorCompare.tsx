import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { GitCompare, TrendingUp, TrendingDown, Minus, Loader2, Search } from 'lucide-react';

interface CompetitorData {
  url: string;
  score: number;
  performance: number;
  seo: number;
  accessibility: number;
  bestPractices: number;
  loading: boolean;
  error: string | null;
}

function CompetitorCompare() {
  const { isDark } = useTheme();
   
  const [urlA, setUrlA] = useState('');
  const [urlB, setUrlB] = useState('');
  const [dataA, setDataA] = useState<CompetitorData | null>(null);
  const [dataB, setDataB] = useState<CompetitorData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAuditData = async (url: string): Promise<CompetitorData> => {
    // Ensure URL has protocol
    let fullUrl = url.trim();
    if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
      fullUrl = 'https://' + fullUrl;
    }

    // Call Google PageSpeed Insights API
    const pageSpeedKey = process.env.REACT_APP_PAGESPEED_API_KEY || '';
    const encodedUrl = encodeURIComponent(fullUrl);
    const pagespeedUrl = pageSpeedKey 
      ? `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodedUrl}&key=${pageSpeedKey}`
      : `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodedUrl}`;
    
    // Debug: Log the URL being fetched
    console.log('Fetching URL:', pagespeedUrl);
    console.log('API Key present:', pageSpeedKey ? 'Yes' : 'No');
    
    let psResponse;
    try {
      psResponse = await fetch(pagespeedUrl);
    } catch (networkError: any) {
      throw new Error(`Network error: ${networkError.message}`);
    }
    
    if (!psResponse.ok) {
      // Check for 429 rate limit error
      if (psResponse.status === 429) {
        throw new Error('429: Rate limit exceeded or missing API key. Please check your .env configuration.');
      }
      throw new Error(`Failed to fetch data for ${fullUrl}`);
    }
    
    const pagespeedData = await psResponse.json();
    const lighthouse = pagespeedData?.lighthouseResult;
    const categories = lighthouse?.categories;
    
    const performance = Math.round((categories?.performance?.score || 0) * 100);
    const seo = Math.round((categories?.seo?.score || 0) * 100);
    const accessibility = Math.round((categories?.accessibility?.score || 0) * 100);
    const bestPractices = Math.round((categories?.['best-practices']?.score || 0) * 100);
    const overallScore = Math.round((performance + seo + accessibility + bestPractices) / 4);
    
    return {
      url: fullUrl,
      score: overallScore,
      performance,
      seo,
      accessibility,
      bestPractices,
      loading: false,
      error: null
    };
  };

  const handleCompare = async () => {
    if (!urlA.trim() || !urlB.trim()) return;
    
    setLoading(true);
    setDataA(null);
    setDataB(null);
    
    // Normalize URLs - prepend https:// if missing
    const normalizedUrlA = urlA.trim().startsWith('http://') || urlA.trim().startsWith('https://') ? urlA.trim() : 'https://' + urlA.trim();
    const normalizedUrlB = urlB.trim().startsWith('http://') || urlB.trim().startsWith('https://') ? urlB.trim() : 'https://' + urlB.trim();
    
    // Initialize with loading state
    setDataA({ url: normalizedUrlA, score: 0, performance: 0, seo: 0, accessibility: 0, bestPractices: 0, loading: true, error: null });
    setDataB({ url: normalizedUrlB, score: 0, performance: 0, seo: 0, accessibility: 0, bestPractices: 0, loading: true, error: null });
    
    try {
      // Use Promise.all to fetch both URLs with normalized URLs
      const [resultA, resultB] = await Promise.all([
        fetchAuditData(normalizedUrlA).catch(err => ({ 
          url: normalizedUrlA, score: 0, performance: 0, seo: 0, accessibility: 0, bestPractices: 0, loading: false, error: err.message 
        })),
        fetchAuditData(normalizedUrlB).catch(err => ({ 
          url: normalizedUrlB, score: 0, performance: 0, seo: 0, accessibility: 0, bestPractices: 0, loading: false, error: err.message 
        }))
      ]);
      
      setDataA(resultA);
      setDataB(resultB);
    } catch (error: any) {
      console.error('Compare error:', error);
      
      const errorMessage = error?.message || '';
      const isRateLimit = errorMessage.includes('429') || 
                         errorMessage.toLowerCase().includes('rate limit') ||
                         errorMessage.toLowerCase().includes('api key');
      
      if (isRateLimit) {
        setError('Rate limit exceeded or missing API key. Please check your .env configuration.');
      } else {
        setError(errorMessage || 'Failed to compare websites. Please check the URLs and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper function to compare scores and return color
  const getScoreColor = (scoreA: number, scoreB: number, score: number): string => {
    if (scoreA === scoreB) return isDark ? 'text-white' : 'text-warm-900';
    if (score === Math.max(scoreA, scoreB)) return 'text-green-400';
    return isDark ? 'text-gray-400' : 'text-warm-600';
  };

  // Helper to get trend icon based on comparison
  const getTrendIcon = (scoreA: number, scoreB: number, isA: boolean) => {
    if (!dataA || !dataB || dataA.loading || dataB.loading) return <Minus className="w-4 h-4 text-gray-400" />;
    if (scoreA === scoreB) return <Minus className="w-4 h-4 text-gray-400" />;
    if (isA ? scoreA > scoreB : scoreB > scoreA) return <TrendingUp className="w-4 h-4 text-green-400" />;
    return <TrendingDown className="w-4 h-4 text-red-400" />;
  };

  const hasResults = dataA && dataB && !dataA.loading && !dataB.loading && !dataA.error && !dataB.error;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <section className="text-center py-8">
        <h2 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-warm-900'}`}>
          Competitor{' '}
          <span className={isDark ? 'bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent' : 'text-purple-600'}>
            Comparison
          </span>
        </h2>
        <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-warm-600'}`}>
          Compare your website's SEO performance against your competitors in real-time.
        </p>
      </section>

      {/* URL Input Section */}
      <div className={`backdrop-blur-xl rounded-2xl p-6 border shadow-lg mb-6 ${isDark ? 'bg-white/5 border-white/10' : 'bg-warm-100 border-warm-200'}`}>
        <div className="flex items-center mb-4">
          <GitCompare className={`w-6 h-6 mr-2 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
          <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-warm-900'}`}>Enter URLs to Compare</h3>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={urlA}
              onChange={(e) => setUrlA(e.target.value)}
              placeholder="Enter first URL (e.g., example.com)"
              className={`w-full px-4 py-3 pl-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                isDark ? 'bg-black/30 border border-white/10 text-white placeholder-gray-400' : 'bg-warm-50 border border-warm-300 text-warm-900 placeholder-warm-400'
              }`}
            />
            <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-warm-500'}`} />
          </div>
          
          <div className="flex-1 relative">
            <input
              type="text"
              value={urlB}
              onChange={(e) => setUrlB(e.target.value)}
              placeholder="Enter second URL (e.g., competitor.com)"
              className={`w-full px-4 py-3 pl-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                isDark ? 'bg-black/30 border border-white/10 text-white placeholder-gray-400' : 'bg-warm-50 border border-warm-300 text-warm-900 placeholder-warm-400'
              }`}
            />
            <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-warm-500'}`} />
          </div>
        </div>
        
        <button
          onClick={handleCompare}
          disabled={loading || !urlA.trim() || !urlB.trim()}
          className="w-full px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-xl hover:from-cyan-400 hover:to-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Comparing...
            </>
          ) : (
            <>
              <GitCompare className="w-5 h-5" />
              Compare
            </>
          )}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
          <p className="text-red-400 text-center">{error}</p>
        </div>
      )}

      {/* Results Section */}
      {hasResults ? (
        <>
          {/* Overall Score Comparison */}
          <div className={`backdrop-blur-xl rounded-2xl p-6 border shadow-lg mb-6 ${isDark ? 'bg-white/5 border-white/10' : 'bg-warm-100 border-warm-200'}`}>
            <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-warm-900'}`}>Overall SEO Score</h3>
            
            <div className="grid grid-cols-2 gap-6">
              {/* Site A */}
              <div className={`p-4 rounded-xl border ${isDark ? 'bg-black/30 border-white/10' : 'bg-warm-50 border-warm-200'}`}>
                <p className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-warm-600'}`}>Site A</p>
                <p className={`text-3xl font-bold ${getScoreColor(dataA.score, dataB.score, dataA.score)}`}>{dataA.score}%</p>
                <p className={`text-xs truncate ${isDark ? 'text-gray-500' : 'text-warm-500'}`}>{dataA.url}</p>
              </div>
              
              {/* Site B */}
              <div className={`p-4 rounded-xl border ${isDark ? 'bg-black/30 border-white/10' : 'bg-warm-50 border-warm-200'}`}>
                <p className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-warm-600'}`}>Site B</p>
                <p className={`text-3xl font-bold ${getScoreColor(dataA.score, dataB.score, dataB.score)}`}>{dataB.score}%</p>
                <p className={`text-xs truncate ${isDark ? 'text-gray-500' : 'text-warm-500'}`}>{dataB.url}</p>
              </div>
            </div>
          </div>

          {/* Detailed Comparison Table */}
          <div className={`backdrop-blur-xl rounded-2xl p-6 border shadow-lg mb-6 ${isDark ? 'bg-white/5 border-white/10' : 'bg-warm-100 border-warm-200'}`}>
            <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-warm-900'}`}>Detailed Metrics Comparison</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={isDark ? 'border-b border-white/10' : 'border-b border-warm-200'}>
                    <th className={`px-4 py-3 text-left ${isDark ? 'text-gray-400' : 'text-warm-600'}`}>Metric</th>
                    <th className={`px-4 py-3 text-right ${isDark ? 'text-gray-400' : 'text-warm-600'}`}>Site A</th>
                    <th className={`px-4 py-3 text-center ${isDark ? 'text-gray-400' : 'text-warm-600'}`}>vs</th>
                    <th className={`px-4 py-3 text-right ${isDark ? 'text-gray-400' : 'text-warm-600'}`}>Site B</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { key: 'performance', label: 'Performance', emoji: '⚡' },
                    { key: 'seo', label: 'SEO', emoji: '🔍' },
                    { key: 'accessibility', label: 'Accessibility', emoji: '♿' },
                    { key: 'bestPractices', label: 'Best Practices', emoji: '✨' }
                  ].map((metric) => {
                    const scoreA = dataA[metric.key as keyof typeof dataA] as number;
                    const scoreB = dataB[metric.key as keyof typeof dataB] as number;
                    
                    return (
                      <tr key={metric.key} className={isDark ? 'border-b border-white/5' : 'border-b border-warm-100'}>
                        <td className={`px-4 py-3 font-medium ${isDark ? 'text-white' : 'text-warm-900'}`}>
                          <span className="mr-2">{metric.emoji}</span>
                          {metric.label}
                        </td>
                        <td className={`px-4 py-3 text-right font-bold ${getScoreColor(scoreA, scoreB, scoreA)}`}>
                          {scoreA}%
                          {getTrendIcon(scoreA, scoreB, true)}
                        </td>
                        <td className={`px-4 py-3 text-center ${isDark ? 'text-gray-500' : 'text-warm-400'}`}>vs</td>
                        <td className={`px-4 py-3 text-right font-bold ${getScoreColor(scoreA, scoreB, scoreB)}`}>
                          {getTrendIcon(scoreA, scoreB, false)}
                          {scoreB}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Key Insights */}
          <div className={`backdrop-blur-xl rounded-2xl p-6 border shadow-lg ${isDark ? 'bg-white/5 border-white/10' : 'bg-warm-100 border-warm-200'}`}>
            <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-warm-900'}`}>Key Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`p-4 bg-gradient-to-br rounded-xl border ${isDark ? 'from-cyan-500/10 to-purple-500/10 border-cyan-500/20' : 'from-cyan-100 to-purple-100 border-cyan-200'}`}>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-warm-600'}`}>Winner</p>
                <p className={`text-2xl font-bold ${dataA.score > dataB.score ? 'text-green-400' : dataB.score > dataA.score ? 'text-purple-400' : (isDark ? 'text-white' : 'text-warm-900')}`}>
                  {dataA.score === dataB.score ? 'Tie' : dataA.score > dataB.score ? 'Site A' : 'Site B'}
                </p>
                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-warm-500'}`}>by {Math.abs(dataA.score - dataB.score)}%</p>
              </div>
              <div className={`p-4 bg-gradient-to-br rounded-xl border ${isDark ? 'from-green-500/10 to-emerald-500/10 border-green-500/20' : 'from-green-100 to-emerald-100 border-green-200'}`}>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-warm-600'}`}>Performance Leader</p>
                <p className={`text-2xl font-bold ${getScoreColor(dataA.performance, dataB.performance, Math.max(dataA.performance, dataB.performance))}`}>
                  {dataA.performance > dataB.performance ? 'Site A' : dataB.performance > dataA.performance ? 'Site B' : 'Tie'}
                </p>
              </div>
              <div className={`p-4 bg-gradient-to-br rounded-xl border ${isDark ? 'from-purple-500/10 to-pink-500/10 border-purple-500/20' : 'from-purple-100 to-pink-100 border-purple-200'}`}>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-warm-600'}`}>SEO Leader</p>
                <p className={`text-2xl font-bold ${getScoreColor(dataA.seo, dataB.seo, Math.max(dataA.seo, dataB.seo))}`}>
                  {dataA.seo > dataB.seo ? 'Site A' : dataB.seo > dataA.seo ? 'Site B' : 'Tie'}
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Loading or Empty State */
        <div className={`backdrop-blur-xl rounded-2xl p-6 border shadow-lg ${isDark ? 'bg-white/5 border-white/10' : 'bg-warm-100 border-warm-200'}`}>
          <div className="text-center py-12">
            {loading ? (
              <>
                <Loader2 className={`w-12 h-12 mx-auto mb-4 animate-spin ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                <p className={isDark ? 'text-gray-400' : 'text-warm-500'}>Fetching data from Google PageSpeed API...</p>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4 opacity-50">📊</div>
                <p className={isDark ? 'text-gray-400' : 'text-warm-500'}>Enter two URLs above to compare their SEO performance</p>
              </>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default CompetitorCompare;

