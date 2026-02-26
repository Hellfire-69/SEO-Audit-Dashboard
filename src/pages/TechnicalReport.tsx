import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { FileText, CheckCircle, XCircle, AlertTriangle, Info, Search, Loader2 } from 'lucide-react';

interface TechnicalData {
  url: string;
  titleLength: number;
  metaDescriptionLength: number;
  h1Count: number;
  imagesWithoutAlt: number;
  securityStatus: string;
  loading: boolean;
  error: string | null;
}

function TechnicalReport() {
  const { isDark } = useTheme();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [technicalData, setTechnicalData] = useState<TechnicalData | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setTechnicalData(null);

    try {
      // Ensure URL has protocol
      let fullUrl = url.trim();
      if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
        fullUrl = 'https://' + fullUrl;
      }

      // Connect to local Express scraper backend
      const response = await fetch('http://localhost:5000/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: fullUrl })
      });

      if (!response.ok) {
        throw new Error('Failed to scrape website');
      }

      const data = await response.json();
      
      // Handle securityStatus - it can be an object or string
      let securityStatusValue = 'unknown';
      if (typeof data.securityStatus === 'string') {
        securityStatusValue = data.securityStatus;
      } else if (data.securityStatus && typeof data.securityStatus === 'object') {
        securityStatusValue = data.securityStatus.isSecure === true ? 'secure' : 'not-secure';
      }
      
      setTechnicalData({
        url: fullUrl,
        titleLength: data.titleLength || 0,
        metaDescriptionLength: data.metaDescriptionLength || 0,
        h1Count: data.h1Count || 0,
        imagesWithoutAlt: data.imagesWithoutAlt || 0,
        securityStatus: securityStatusValue,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Scraping error:', error);
      setTechnicalData({
        url: url,
        titleLength: 0,
        metaDescriptionLength: 0,
        h1Count: 0,
        imagesWithoutAlt: 0,
        securityStatus: 'unknown',
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to scrape website'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'fail':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Info className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string, isDark: boolean) => {
    switch (status) {
      case 'pass':
        return isDark ? 'bg-green-500/10 border-green-500/20' : 'bg-green-50 border-green-200';
      case 'warning':
        return isDark ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-yellow-50 border-yellow-200';
      case 'fail':
        return isDark ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-200';
      default:
        return isDark ? 'bg-gray-500/10 border-gray-500/20' : 'bg-gray-50 border-gray-200';
    }
  };

  // Calculate status based on data
  const getTitleStatus = () => technicalData?.titleLength === 0 ? 'fail' : 
    technicalData?.titleLength && technicalData.titleLength < 30 || technicalData?.titleLength && technicalData.titleLength > 60 ? 'warning' : 'pass';
  
  const getMetaDescriptionStatus = () => technicalData?.metaDescriptionLength === 0 ? 'fail' :
    technicalData?.metaDescriptionLength && technicalData.metaDescriptionLength < 120 ? 'warning' : 'pass';
  
  const getH1Status = () => technicalData?.h1Count === 0 ? 'fail' : technicalData?.h1Count && technicalData.h1Count > 1 ? 'warning' : 'pass';
  
  const getImagesStatus = () => !technicalData || technicalData.imagesWithoutAlt === 0 ? 'pass' : 'fail';
  
  const getSecurityStatus = () => technicalData?.securityStatus === 'secure' ? 'pass' : 'warning';

  const passedCount = [getTitleStatus(), getMetaDescriptionStatus(), getImagesStatus(), getSecurityStatus()].filter(s => s === 'pass').length;
  const warningCount = [getTitleStatus(), getMetaDescriptionStatus(), getH1Status()].filter(s => s === 'warning').length;
  const failedCount = [getTitleStatus(), getMetaDescriptionStatus(), getH1Status(), getImagesStatus()].filter(s => s === 'fail').length;
  const score = Math.round((passedCount / 4) * 100);

  // Skeleton loader component
  const SkeletonLoader = () => (
    <div className="animate-pulse space-y-4">
      <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
      <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
      <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <section className="text-center py-8">
        <h2 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-warm-900'}`}>
          Technical{' '}
          <span className={isDark ? 'bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent' : 'text-purple-600'}>
            SEO Report
          </span>
        </h2>
        <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-warm-600'}`}>
          Detailed technical analysis of your website's SEO implementation.
        </p>
      </section>

      {/* URL Input */}
      <div className={`backdrop-blur-xl rounded-2xl p-6 border shadow-lg mb-6 ${isDark ? 'bg-white/5 border-white/10' : 'bg-warm-100 border-warm-200'}`}>
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter website URL (e.g., example.com)"
              className={`w-full px-4 py-3 pl-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                isDark ? 'bg-black/30 border border-white/10 text-white placeholder-gray-400' : 'bg-warm-50 border border-warm-300 text-warm-900 placeholder-warm-400'
              }`}
            />
            <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-warm-500'}`} />
          </div>
          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-xl hover:from-cyan-400 hover:to-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Scraping DOM elements...
              </>
            ) : (
              <>
                <FileText className="w-5 h-5" />
                Generate Report
              </>
            )}
          </button>
        </form>
      </div>

      {/* Loading State */}
      {loading && (
        <div className={`backdrop-blur-xl rounded-2xl p-6 border shadow-lg mb-6 ${isDark ? 'bg-white/5 border-white/10' : 'bg-warm-100 border-warm-200'}`}>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className={`w-12 h-12 mx-auto mb-4 animate-spin ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
              <p className={isDark ? 'text-gray-400' : 'text-warm-500'}>Scraping DOM elements...</p>
              <p className={`text-sm mt-2 ${isDark ? 'text-gray-500' : 'text-warm-400'}`}>Analyzing {url}</p>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {!loading && technicalData?.error && (
        <div className={`backdrop-blur-xl rounded-2xl p-6 border shadow-lg mb-6 ${isDark ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-200'}`}>
          <div className="flex items-center">
            <XCircle className={`w-6 h-6 mr-3 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
            <div>
              <p className={isDark ? 'text-white font-medium' : 'text-warm-900 font-medium'}>Error generating report</p>
              <p className={isDark ? 'text-gray-400 text-sm' : 'text-warm-600 text-sm'}>{technicalData.error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {!loading && technicalData && !technicalData.error && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className={`backdrop-blur-xl rounded-2xl p-6 border ${isDark ? 'bg-white/5 border-white/10' : 'bg-warm-100 border-warm-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-warm-600'}`}>Passed</p>
                  <p className="text-3xl font-bold text-green-400">{passedCount}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </div>
            <div className={`backdrop-blur-xl rounded-2xl p-6 border ${isDark ? 'bg-white/5 border-white/10' : 'bg-warm-100 border-warm-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-warm-600'}`}>Warnings</p>
                  <p className="text-3xl font-bold text-yellow-400">{warningCount}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-yellow-400" />
              </div>
            </div>
            <div className={`backdrop-blur-xl rounded-2xl p-6 border ${isDark ? 'bg-white/5 border-white/10' : 'bg-warm-100 border-warm-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-warm-600'}`}>Failed</p>
                  <p className="text-3xl font-bold text-red-400">{failedCount}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-400" />
              </div>
            </div>
            <div className={`backdrop-blur-xl rounded-2xl p-6 border ${isDark ? 'bg-white/5 border-white/10' : 'bg-warm-100 border-warm-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-warm-600'}`}>Score</p>
                  <p className={`text-3xl font-bold ${isDark ? 'bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent' : 'text-purple-600'}`}>{score}%</p>
                </div>
                <FileText className="w-8 h-8 text-purple-400" />
              </div>
            </div>
          </div>

          {/* Technical Categories - Dynamic Data */}
          <div className={`backdrop-blur-xl rounded-2xl p-6 border shadow-lg mb-6 ${isDark ? 'bg-white/5 border-white/10' : 'bg-warm-100 border-warm-200'}`}>
            <div className="flex items-center mb-6">
              <FileText className={`w-6 h-6 mr-2 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
              <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-warm-900'}`}>Technical Analysis</h3>
            </div>

            <div className="space-y-3">
              {/* Title Tag */}
              <div className={`flex items-center justify-between p-4 rounded-xl border ${getStatusColor(getTitleStatus(), isDark)}`}>
                <div className="flex items-center space-x-4">
                  {getStatusIcon(getTitleStatus())}
                  <span className={isDark ? 'text-white font-medium' : 'text-warm-900 font-medium'}>Title Tag</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={isDark ? 'text-gray-400 text-sm' : 'text-warm-600 text-sm'}>
                    {technicalData.titleLength} characters
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    getTitleStatus() === 'pass' ? (isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700') :
                    getTitleStatus() === 'warning' ? (isDark ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700') :
                    (isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700')
                  }`}>
                    {getTitleStatus() === 'pass' ? 'OPTIMAL' : getTitleStatus() === 'warning' ? 'NEEDS WORK' : 'MISSING'}
                  </span>
                </div>
              </div>

              {/* Meta Description */}
              <div className={`flex items-center justify-between p-4 rounded-xl border ${getStatusColor(getMetaDescriptionStatus(), isDark)}`}>
                <div className="flex items-center space-x-4">
                  {getStatusIcon(getMetaDescriptionStatus())}
                  <span className={isDark ? 'text-white font-medium' : 'text-warm-900 font-medium'}>Meta Description</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={isDark ? 'text-gray-400 text-sm' : 'text-warm-600 text-sm'}>
                    {technicalData.metaDescriptionLength} characters
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    getMetaDescriptionStatus() === 'pass' ? (isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700') :
                    getMetaDescriptionStatus() === 'warning' ? (isDark ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700') :
                    (isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700')
                  }`}>
                    {getMetaDescriptionStatus() === 'pass' ? 'OPTIMAL' : getMetaDescriptionStatus() === 'warning' ? 'NEEDS WORK' : 'MISSING'}
                  </span>
                </div>
              </div>

              {/* H1 Tag */}
              <div className={`flex items-center justify-between p-4 rounded-xl border ${getStatusColor(getH1Status(), isDark)}`}>
                <div className="flex items-center space-x-4">
                  {getStatusIcon(getH1Status())}
                  <span className={isDark ? 'text-white font-medium' : 'text-warm-900 font-medium'}>H1 Tag</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={isDark ? 'text-gray-400 text-sm' : 'text-warm-600 text-sm'}>
                    {technicalData.h1Count} found
                  </span>
                  {technicalData.h1Count === 0 && (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700'}`}>
                      Missing H1 Tag
                    </span>
                  )}
                  {technicalData.h1Count > 1 && (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${isDark ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700'}`}>
                      Multiple H1 Tags
                    </span>
                  )}
                  {technicalData.h1Count === 1 && (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'}`}>
                      PASS
                    </span>
                  )}
                </div>
              </div>

              {/* Images without Alt */}
              <div className={`flex items-center justify-between p-4 rounded-xl border ${getStatusColor(getImagesStatus(), isDark)}`}>
                <div className="flex items-center space-x-4">
                  {getStatusIcon(getImagesStatus())}
                  <span className={isDark ? 'text-white font-medium' : 'text-warm-900 font-medium'}>Images without Alt Text</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={isDark ? 'text-gray-400 text-sm' : 'text-warm-600 text-sm'}>
                    {technicalData.imagesWithoutAlt} images
                  </span>
                  {technicalData.imagesWithoutAlt > 0 && (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700'}`}>
                      Needs Attention
                    </span>
                  )}
                  {technicalData.imagesWithoutAlt === 0 && (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'}`}>
                      PASS
                    </span>
                  )}
                </div>
              </div>

              {/* Security Status */}
              <div className={`flex items-center justify-between p-4 rounded-xl border ${getStatusColor(getSecurityStatus(), isDark)}`}>
                <div className="flex items-center space-x-4">
                  {getStatusIcon(getSecurityStatus())}
                  <span className={isDark ? 'text-white font-medium' : 'text-warm-900 font-medium'}>Security (HTTPS)</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={isDark ? 'text-gray-400 text-sm' : 'text-warm-600 text-sm'}>
                    {technicalData.securityStatus}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    getSecurityStatus() === 'pass' ? (isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700') :
                    (isDark ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700')
                  }`}>
                    {getSecurityStatus() === 'pass' ? 'SECURE' : 'CHECK'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Priority Recommendations */}
          <div className={`mt-6 backdrop-blur-xl rounded-2xl p-6 border ${isDark ? 'bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10 border-white/10' : 'bg-gradient-to-r from-purple-100 via-pink-100 to-cyan-100 border-warm-200'}`}>
            <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-warm-900'}`}>Priority Recommendations</h3>
            <div className="space-y-3">
              {technicalData.h1Count === 0 && (
                <div className={`flex items-start p-4 rounded-xl border ${isDark ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-200'}`}>
                  <XCircle className={`w-5 h-5 mt-0.5 mr-3 flex-shrink-0 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
                  <div>
                    <p className={isDark ? 'text-white font-medium' : 'text-warm-900 font-medium'}>Add H1 Tag</p>
                    <p className={isDark ? 'text-gray-400 text-sm' : 'text-warm-600 text-sm'}>Your page is missing an H1 tag. Add one H1 tag with your main keyword.</p>
                  </div>
                </div>
              )}
              {technicalData.imagesWithoutAlt > 0 && (
                <div className={`flex items-start p-4 rounded-xl border ${isDark ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-yellow-50 border-yellow-200'}`}>
                  <AlertTriangle className={`w-5 h-5 mt-0.5 mr-3 flex-shrink-0 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`} />
                  <div>
                    <p className={isDark ? 'text-white font-medium' : 'text-warm-900 font-medium'}>Add alt text to {technicalData.imagesWithoutAlt} images</p>
                    <p className={isDark ? 'text-gray-400 text-sm' : 'text-warm-600 text-sm'}>Images without alt text hurt accessibility and SEO. Add descriptive alt text to all images.</p>
                  </div>
                </div>
              )}
              {technicalData.titleLength === 0 && (
                <div className={`flex items-start p-4 rounded-xl border ${isDark ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-200'}`}>
                  <XCircle className={`w-5 h-5 mt-0.5 mr-3 flex-shrink-0 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
                  <div>
                    <p className={isDark ? 'text-white font-medium' : 'text-warm-900 font-medium'}>Add a Title Tag</p>
                    <p className={isDark ? 'text-gray-400 text-sm' : 'text-warm-600 text-sm'}>Your page is missing a title tag. Add a title between 50-60 characters.</p>
                  </div>
                </div>
              )}
              {technicalData.metaDescriptionLength === 0 && (
                <div className={`flex items-start p-4 rounded-xl border ${isDark ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-yellow-50 border-yellow-200'}`}>
                  <AlertTriangle className={`w-5 h-5 mt-0.5 mr-3 flex-shrink-0 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`} />
                  <div>
                    <p className={isDark ? 'text-white font-medium' : 'text-warm-900 font-medium'}>Add a Meta Description</p>
                    <p className={isDark ? 'text-gray-400 text-sm' : 'text-warm-600 text-sm'}>Add a meta description between 150-160 characters for better click-through rates.</p>
                  </div>
                </div>
              )}
              {passedCount === 4 && (
                <div className={`flex items-start p-4 rounded-xl border ${isDark ? 'bg-green-500/10 border-green-500/20' : 'bg-green-50 border-green-200'}`}>
                  <CheckCircle className={`w-5 h-5 mt-0.5 mr-3 flex-shrink-0 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                  <div>
                    <p className={isDark ? 'text-white font-medium' : 'text-warm-900 font-medium'}>Great job!</p>
                    <p className={isDark ? 'text-gray-400 text-sm' : 'text-warm-600 text-sm'}>All technical SEO checks passed. Your page is well-optimized.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Empty State - No URL submitted yet */}
      {!loading && !technicalData && (
        <div className={`backdrop-blur-xl rounded-2xl p-6 border shadow-lg ${isDark ? 'bg-white/5 border-white/10' : 'bg-warm-100 border-warm-200'}`}>
          <div className="text-center py-12">
            <div className="text-6xl mb-4 opacity-50">📊</div>
            <p className={isDark ? 'text-gray-400' : 'text-warm-500'}>Enter a URL above to generate a technical SEO report</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default TechnicalReport;
