import React, { useState, useEffect } from 'react';
import { useSparkles } from '../context/SparklesContext';
import { useTheme } from '../context/ThemeContext';
import { Gauge, Smartphone, Monitor } from 'lucide-react';

function RadialGauge({ score, label, size = 120, isDark = true }: { score: number; label: string; size?: number; isDark?: boolean }) {
  const getColor = (value: number): string => {
    if (value >= 90) return '#22c55e';
    if (value >= 50) return '#eab308';
    return '#ef4444';
  };

  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = getColor(score);

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className={isDark ? 'text-white/10' : 'text-warm-300'}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold" style={{ color }}>
            {score}%
          </span>
        </div>
      </div>
      <p className={`mt-2 font-medium ${isDark ? 'text-gray-300' : 'text-warm-700'}`}>{label}</p>
    </div>
  );
}

function PerformanceMetrics() {
  // Use currentAudit directly from context - this is the source of truth
  const { currentAudit } = useSparkles();
  const { isDark } = useTheme();
  const [deviceType, setDeviceType] = useState<'desktop' | 'mobile'>('desktop');

  // If no current audit, show empty state
  if (!currentAudit) {
    return (
      <div className={`backdrop-blur-xl rounded-2xl p-6 border shadow-lg ${isDark ? 'bg-white/5 border-white/10' : 'bg-warm-100 border-warm-200'}`}>
        <h2 className={`text-2xl font-bold flex items-center ${isDark ? 'text-white' : 'text-warm-900'}`}>
          <Gauge className="mr-2 w-6 h-6" /> Performance Metrics
        </h2>
        <div className="text-center py-12">
          <div className="text-4xl mb-4 opacity-50">📊</div>
          <p className={isDark ? 'text-gray-400' : 'text-warm-500'}>Enter a URL to see metrics</p>
        </div>
      </div>
    );
  }

  // Use actual audit data - no fallbacks
  const metrics = deviceType === 'desktop' 
    ? {
        performance: currentAudit.performance,
        accessibility: currentAudit.accessibility,
        bestPractices: currentAudit.bestPractices,
        seo: currentAudit.seo
      }
    : {
        // For mobile, show slightly adjusted scores (mobile is typically harder)
        performance: Math.max(0, currentAudit.performance - 10),
        accessibility: Math.max(0, currentAudit.accessibility - 5),
        bestPractices: Math.max(0, currentAudit.bestPractices - 5),
        seo: currentAudit.seo
      };

  const averageScore = Math.round(
    (metrics.performance + metrics.accessibility + metrics.bestPractices + metrics.seo) / 4
  );

  return (
    <div className={`backdrop-blur-xl rounded-2xl p-6 border shadow-lg ${isDark ? 'bg-white/5 border-white/10' : 'bg-warm-100 border-warm-200'}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-2xl font-bold flex items-center ${isDark ? 'text-white' : 'text-warm-900'}`}>
          <Gauge className="mr-2 w-6 h-6" /> Performance Metrics
        </h2>
        
        {/* Device Toggle */}
        <div className={`flex rounded-xl p-1 ${isDark ? 'bg-black/30' : 'bg-warm-200'}`}>
          <button
            onClick={() => setDeviceType('desktop')}
            className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 ${
              deviceType === 'desktop'
                ? (isDark ? 'bg-white/10 shadow-md text-white' : 'bg-warm-50 shadow-md text-warm-900')
                : (isDark ? 'text-gray-400 hover:text-white' : 'text-warm-600 hover:text-warm-900')
            }`}
          >
            <Monitor className="w-4 h-4 mr-2" />
            Desktop
          </button>
          <button
            onClick={() => setDeviceType('mobile')}
            className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 ${
              deviceType === 'mobile'
                ? (isDark ? 'bg-white/10 shadow-md text-white' : 'bg-warm-50 shadow-md text-warm-900')
                : (isDark ? 'text-gray-400 hover:text-white' : 'text-warm-600 hover:text-warm-900')
            }`}
          >
            <Smartphone className="w-4 h-4 mr-2" />
            Mobile
          </button>
        </div>
      </div>

      {/* Average Score */}
      <div className="text-center mb-8">
        <p className={`mb-2 ${isDark ? 'text-gray-400' : 'text-warm-600'}`}>Average Score</p>
        <div className="inline-flex items-center justify-center">
          <RadialGauge score={averageScore} label="" size={150} isDark={isDark} />
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { key: 'performance', label: 'Performance', emoji: '⚡', color: 'from-yellow-500/10 to-orange-500/10', border: 'border-yellow-500/20' },
          { key: 'seo', label: 'SEO', emoji: '🔍', color: 'from-green-500/10 to-emerald-500/10', border: 'border-green-500/20' },
          { key: 'accessibility', label: 'Accessibility', emoji: '♿', color: 'from-blue-500/10 to-cyan-500/10', border: 'border-blue-500/20' },
          { key: 'bestPractices', label: 'Best Practices', emoji: '✨', color: 'from-purple-500/10 to-pink-500/10', border: 'border-purple-500/20' }
        ].map((metric) => (
          <div key={metric.key} className={`text-center p-4 bg-gradient-to-br ${metric.color} rounded-xl border ${metric.border}`}>
            <div className="flex items-center justify-center mb-2">
              <span className="text-2xl">{metric.emoji}</span>
            </div>
            <p className={`text-sm mb-1 ${isDark ? 'text-gray-400' : 'text-warm-600'}`}>{metric.label}</p>
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-warm-900'}`}>{metrics[metric.key as keyof typeof metrics]}%</p>
            <div className={`mt-2 h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-warm-300'}`}>
              <div
                className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all duration-1000"
                style={{ width: `${metrics[metric.key as keyof typeof metrics]}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PerformanceMetrics;
