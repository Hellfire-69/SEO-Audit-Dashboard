import { motion } from 'framer-motion';
import { useSparkles } from '../context/SparklesContext';
import { useTheme } from '../context/ThemeContext';
import { Trash2, BarChart3 } from 'lucide-react';

// Animation variants for staggered children
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.9,
  },
  show: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 15,
      mass: 0.8,
    },
  },
  hover: {
    scale: 1.02,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 20,
    },
  },
};

function Dashboard() {
  const { auditHistory, deleteAudit, clearHistory } = useSparkles();
  const { isDark } = useTheme();

  const totalAudits = auditHistory.length;
  const averageScore = totalAudits > 0
    ? Math.round(auditHistory.reduce((acc, a) => acc + (a.score || 0), 0) / totalAudits)
    : 0;
  const totalIssues = auditHistory.reduce((acc, a) => acc + (a.issuesCount || 0), 0);

  const stats = [
    {
      label: 'Total Audits',
      value: totalAudits,
      icon: '📊',
      gradient: 'from-pink-500/20 to-rose-500/20',
      border: 'border-pink-500/30',
      iconBg: 'bg-pink-500/20',
      iconColor: 'text-pink-400'
    },
    {
      label: 'Average Score',
      value: `${averageScore}%`,
      icon: '🎯',
      gradient: 'from-green-500/20 to-emerald-500/20',
      border: 'border-green-500/30',
      iconBg: 'bg-green-500/20',
      iconColor: 'text-green-400'
    },
    {
      label: 'Issues Found',
      value: totalIssues,
      icon: '⚠️',
      gradient: 'from-red-500/20 to-orange-500/20',
      border: 'border-red-500/30',
      iconBg: 'bg-red-500/20',
      iconColor: 'text-red-400'
    },
    {
      label: 'Recommendations',
      value: totalAudits * 3,
      icon: '💡',
      gradient: 'from-yellow-500/20 to-amber-500/20',
      border: 'border-yellow-500/30',
      iconBg: 'bg-yellow-500/20',
      iconColor: 'text-yellow-400'
    },
  ];

  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`backdrop-blur-xl rounded-2xl p-6 border shadow-lg ${
      isDark 
        ? 'bg-white/5 border-white/10' 
        : 'bg-warm-100 border-warm-200'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-2xl font-bold flex items-center ${isDark ? 'text-white' : 'text-warm-900'}`}>
          <BarChart3 className="mr-2 w-6 h-6" /> Dashboard
        </h2>
        {auditHistory.length > 0 && (
          <button
            onClick={clearHistory}
            className={`text-sm px-3 py-1 rounded-lg transition-colors ${
              isDark 
                ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10' 
                : 'text-red-600 hover:text-red-700 hover:bg-red-100'
            }`}
          >
            Clear All
          </button>
        )}
      </div>

      {/* Glassmorphism Stats Grid with Staggered Animation */}
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            whileHover="hover"
            className={`relative overflow-hidden bg-gradient-to-br ${stat.gradient} rounded-2xl p-5 border ${stat.border} shadow-md hover:shadow-lg transition-all duration-300`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className={`text-sm mb-1 ${isDark ? 'text-gray-300' : 'text-warm-700'}`}>{stat.label}</p>
                <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-warm-900'}`}>{stat.value}</p>
              </div>
              <div className={`${stat.iconBg} ${stat.iconColor} p-2 rounded-lg`}>
                <span className="text-xl">{stat.icon}</span>
              </div>
            </div>
            {/* Subtle glow effect */}
            <div className={`absolute -bottom-4 -right-4 w-16 h-16 bg-gradient-to-t rounded-full ${
              isDark ? 'from-white/5 to-transparent' : 'from-warm-200/50 to-transparent'
            }`}></div>
          </motion.div>
        ))}
      </motion.div>

      {/* Audit History Table */}
      <div className={`rounded-xl overflow-hidden border ${
        isDark 
          ? 'bg-black/20 border-white/10' 
          : 'bg-warm-50 border-warm-200'
      }`}>
        <div className={`p-4 border-b ${isDark ? 'border-white/10' : 'border-warm-200'}`}>
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-warm-900'}`}>Recent Audits</h3>
        </div>

        {auditHistory.length === 0 ? (
          <div className={`p-8 text-center ${isDark ? 'text-gray-400' : 'text-warm-500'}`}>
            <div className="text-4xl mb-2 opacity-50">📋</div>
            <p>No audits yet. Start by auditing a URL above!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={isDark ? 'bg-white/5' : 'bg-warm-100'}>
                <tr>
                  <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDark ? 'text-gray-400' : 'text-warm-600'
                  }`}>Audited URL</th>
                  <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDark ? 'text-gray-400' : 'text-warm-600'
                  }`}>Date</th>
                  <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDark ? 'text-gray-400' : 'text-warm-600'
                  }`}>Overall SEO Score</th>
                  <th className={`px-4 py-3 text-right text-xs font-medium uppercase tracking-wider ${
                    isDark ? 'text-gray-400' : 'text-warm-600'
                  }`}>Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-white/5' : 'divide-warm-200'}`}>
                {auditHistory.map((audit) => (
                  <tr key={audit.id} className={`transition-colors duration-300 ${
                    isDark ? 'hover:bg-white/5' : 'hover:bg-warm-100'
                  }`}>
                    <td className="px-4 py-4">
                      <a
                        href={audit.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:text-purple-300 truncate block max-w-xs"
                      >
                        {audit.url}
                      </a>
                    </td>
                    <td className={`px-4 py-4 text-sm ${isDark ? 'text-gray-300' : 'text-warm-700'}`}>
                      {formatDate(audit.date)}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`font-bold ${getScoreColor(audit.score || 0)}`}>
                        {audit.score || 0}%
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button
                        onClick={() => deleteAudit(audit.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          isDark 
                            ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10' 
                            : 'text-red-600 hover:text-red-700 hover:bg-red-100'
                        }`}
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
