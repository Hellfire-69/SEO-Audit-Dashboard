import { useState, useEffect } from 'react';
import { useSparkles } from '../context/SparklesContext';
import { useTheme } from '../context/ThemeContext';
import { formatAuditResultsForLLM, getLLMRecommendations } from '../utils/llmUtils';
import { Lightbulb, Trophy, AlertCircle, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

function AuditResults() {
  const { currentAudit, auditHistory } = useSparkles();
  const { isDark } = useTheme();
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [expandedDiagnostics, setExpandedDiagnostics] = useState<Set<string>>(new Set());

  const latestAudit = currentAudit;

  // Clear recommendations when audit is reset
  useEffect(() => {
    if (!latestAudit) {
      setRecommendations([]);
      setLoadingMessage('');
    }
  }, [latestAudit]);

  // Auto-trigger AI recommendations when audit is available
  useEffect(() => {
    if (latestAudit && recommendations.length === 0 && !loadingRecommendations) {
      handleGetRecommendations();
    }
  }, [latestAudit]);

  const toggleDiagnostic = (id: string) => {
    const newExpanded = new Set(expandedDiagnostics);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedDiagnostics(newExpanded);
  };

  const auditCategories = [
    {
      name: 'Performance',
      score: latestAudit?.performance || 0,
      icon: '⚡',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      name: 'SEO',
      score: latestAudit?.seo || 0,
      icon: '🔍',
      color: 'from-green-500 to-emerald-500'
    },
    {
      name: 'Accessibility',
      score: latestAudit?.accessibility || 0,
      icon: '♿',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Best Practices',
      score: latestAudit?.bestPractices || 0,
      icon: '✨',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const overallScore = latestAudit?.score || Math.round(
    auditCategories.reduce((acc, cat) => acc + cat.score, 0) / auditCategories.length
  );

  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getProgressBarColor = (score: number): string => {
    if (score >= 90) return 'bg-gradient-to-r from-green-500 to-emerald-500';
    if (score >= 50) return 'bg-gradient-to-r from-yellow-500 to-orange-500';
    return 'bg-gradient-to-r from-red-500 to-pink-500';
  };

  const getDiagnosticSeverityColor = (score: number): string => {
    if (score >= 90) return 'border-green-500/30 bg-green-500/10';
    if (score >= 50) return 'border-amber-500/30 bg-amber-500/10';
    return 'border-red-500/30 bg-red-500/10';
  };

  const getDiagnosticValueColor = (score: number): string => {
    if (score >= 90) return 'text-green-400';
    if (score >= 50) return 'text-amber-400';
    return 'text-red-400';
  };

  const handleGetRecommendations = async () => {
    if (!latestAudit) return;

    setLoadingRecommendations(true);
    setLoadingMessage('Analyzing with AI...');
    
    try {
      setLoadingMessage('AI analyzing results with Gemini...');
      const prompt = formatAuditResultsForLLM(latestAudit);
      const recs = await getLLMRecommendations(prompt);
      setRecommendations(recs);
      setLoadingMessage('');
    } catch (error) {
      console.error('Failed to get recommendations:', error);
      setLoadingMessage('');
      setRecommendations([
        '• Optimize your title tag to 50-60 characters',
        '• Add meta description between 150-160 characters',
        '• Include alt text for all images'
      ]);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  if (!latestAudit) {
    return (
      <div className={`backdrop-blur-xl rounded-2xl p-6 border shadow-lg ${isDark ? 'bg-white/5 border-white/10' : 'bg-warm-100 border-warm-200'}`}>
        <div className="text-center py-12">
          <div className="text-6xl mb-4 opacity-50">📊</div>
          <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-warm-900'}`}>No Audit Results Yet</h2>
          <p className={isDark ? 'text-gray-400' : 'text-warm-500'}>Run an audit to see your website's performance metrics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Score Card */}
      <div className={`backdrop-blur-xl rounded-2xl p-6 border shadow-lg ${isDark ? 'bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 border-white/10' : 'bg-gradient-to-r from-cyan-100 via-purple-100 to-pink-100 border-warm-200'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-2xl font-bold mb-2 flex items-center ${isDark ? 'text-white' : 'text-warm-900'}`}>
              <Trophy className="mr-2 w-6 h-6 text-yellow-400" /> Overall SEO Score
            </h2>
            <p className={isDark ? 'text-gray-400' : 'text-warm-500'}>Based on all audit categories</p>
          </div>
          <div className={`text-6xl font-bold ${isDark ? 'bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent' : 'text-warm-900'}`}>
            {overallScore}%
          </div>
        </div>
        <div className={`mt-4 h-3 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-warm-300'}`}>
          <div
            className={`h-full ${getProgressBarColor(overallScore)} transition-all duration-1000 ease-out`}
            style={{ width: `${overallScore}%` }}
          ></div>
        </div>
      </div>

      {/* Core Web Vitals */}
      {latestAudit?.coreWebVitals && (
        <div className={`backdrop-blur-xl rounded-2xl p-6 border shadow-lg ${isDark ? 'bg-white/5 border-white/10' : 'bg-warm-100 border-warm-200'}`}>
          <h2 className={`text-2xl font-bold mb-4 flex items-center ${isDark ? 'text-white' : 'text-warm-900'}`}>
            <AlertCircle className="mr-2 w-6 h-6" /> Core Web Vitals
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={`rounded-xl p-4 border ${isDark ? 'bg-black/30 border-white/10' : 'bg-warm-50 border-warm-200'}`}>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-warm-600'}`}>LCP</p>
              <p className={`font-bold text-lg ${isDark ? 'text-white' : 'text-warm-900'}`}>
                {latestAudit.coreWebVitals.lcpDisplayValue || (latestAudit.coreWebVitals.lcp ? `${(latestAudit.coreWebVitals.lcp / 1000).toFixed(2)}s` : 'N/A')}
              </p>
            </div>
            <div className={`rounded-xl p-4 border ${isDark ? 'bg-black/30 border-white/10' : 'bg-warm-50 border-warm-200'}`}>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-warm-600'}`}>CLS</p>
              <p className={`font-bold text-lg ${isDark ? 'text-white' : 'text-warm-900'}`}>
                {latestAudit.coreWebVitals.clsDisplayValue || (latestAudit.coreWebVitals.cls ? latestAudit.coreWebVitals.cls.toFixed(3) : 'N/A')}
              </p>
            </div>
            <div className={`rounded-xl p-4 border ${isDark ? 'bg-black/30 border-white/10' : 'bg-warm-50 border-warm-200'}`}>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-warm-600'}`}>FID/INP</p>
              <p className={`font-bold text-lg ${isDark ? 'text-white' : 'text-warm-900'}`}>
                {latestAudit.coreWebVitals.fidDisplayValue || (latestAudit.coreWebVitals.fid ? `${latestAudit.coreWebVitals.fid.toFixed(0)}ms` : 'N/A')}
              </p>
            </div>
            <div className={`rounded-xl p-4 border ${isDark ? 'bg-black/30 border-white/10' : 'bg-warm-50 border-warm-200'}`}>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-warm-600'}`}>FCP</p>
              <p className={`font-bold text-lg ${isDark ? 'text-white' : 'text-warm-900'}`}>
                {latestAudit.coreWebVitals.fcpDisplayValue || (latestAudit.coreWebVitals.fcp ? `${(latestAudit.coreWebVitals.fcp / 1000).toFixed(2)}s` : 'N/A')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {auditCategories.map((category, index) => (
          <div
            key={index}
            className={`backdrop-blur-xl rounded-xl p-5 border shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 ${isDark ? 'bg-white/5 border-white/10' : 'bg-warm-100 border-warm-200'}`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{category.icon}</span>
              <span className={`text-3xl font-bold ${getScoreColor(category.score)}`}>
                {category.score}%
              </span>
            </div>
            <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-warm-900'}`}>{category.name}</h3>
            <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-warm-300'}`}>
              <div
                className={`h-full bg-gradient-to-r ${category.color} transition-all duration-1000`}
                style={{ width: `${category.score}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Diagnostics Section */}
      {latestAudit?.diagnostics && latestAudit.diagnostics.length > 0 && (
        <div className={`backdrop-blur-xl rounded-2xl p-6 border shadow-lg ${isDark ? 'bg-white/5 border-white/10' : 'bg-warm-100 border-warm-200'}`}>
          <h2 className={`text-2xl font-bold mb-4 flex items-center ${isDark ? 'text-white' : 'text-warm-900'}`}>
            <AlertTriangle className="mr-2 w-6 h-6 text-amber-500" /> Detailed Diagnostics
          </h2>
          <div className="space-y-3">
            {latestAudit.diagnostics.map((diagnostic: any) => (
              <div
                key={diagnostic.id}
                className={`rounded-xl border ${getDiagnosticSeverityColor(diagnostic.score)} overflow-hidden transition-all duration-300`}
              >
                <button
                  onClick={() => toggleDiagnostic(diagnostic.id)}
                  className={`w-full flex items-center justify-between p-4 text-left ${
                    isDark ? 'hover:bg-white/5' : 'hover:bg-warm-50'
                  } transition-colors`}
                >
                  <div className="flex items-center gap-3">
                    <AlertTriangle className={`w-5 h-5 ${getDiagnosticValueColor(diagnostic.score)}`} />
                    <div>
                      <p className={`font-semibold ${isDark ? 'text-white' : 'text-warm-900'}`}>
                        {diagnostic.title}
                      </p>
                      {diagnostic.displayValue && (
                        <span className={`text-sm ${getDiagnosticValueColor(diagnostic.score)}`}>
                          {diagnostic.displayValue}
                        </span>
                      )}
                    </div>
                  </div>
                  {expandedDiagnostics.has(diagnostic.id) ? (
                    <ChevronUp className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-warm-500'}`} />
                  ) : (
                    <ChevronDown className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-warm-500'}`} />
                  )}
                </button>
                
                {expandedDiagnostics.has(diagnostic.id) && diagnostic.description && (
                  <div className={`px-4 pb-4 pt-2 border-t ${isDark ? 'border-white/10' : 'border-warm-200'}`}>
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-warm-600'}`}>
                      {diagnostic.description}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Recommendations Card */}
      <div className={`backdrop-blur-xl rounded-2xl p-6 border shadow-lg ${isDark ? 'bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 border-white/10' : 'bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 border-warm-200'}`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-2xl font-bold flex items-center ${isDark ? 'text-white' : 'text-warm-900'}`}>
            <Lightbulb className="mr-2 w-6 h-6" /> AI Recommendations
          </h2>
        </div>

        {/* Loading State Message */}
        {loadingMessage && (
          <div className={`flex items-center justify-center p-4 rounded-xl border ${
            isDark ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-cyan-50 border-cyan-200'
          }`}>
            <div className={`animate-pulse mr-3 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
            <span className={isDark ? 'text-cyan-300' : 'text-cyan-700'}>
              {loadingMessage}
            </span>
          </div>
        )}

        {!loadingMessage && recommendations.length > 0 && (
          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                className={`flex items-start p-4 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-warm-50 border-warm-200'}`}
              >
                <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                  {index + 1}
                </span>
                <p className={isDark ? 'text-gray-200' : 'text-warm-800'}>{rec}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AuditResults;
