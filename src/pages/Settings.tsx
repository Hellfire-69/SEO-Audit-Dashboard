import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useSparkles } from '../context/SparklesContext';
import { Trash2, Download, Info } from 'lucide-react';

function Settings() {
  const { toggleTheme, isDark } = useTheme();
  const { auditHistory, clearHistory } = useSparkles();

  const handleExport = () => {
    const dataStr = JSON.stringify(auditHistory, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'seo-audit-history.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <section className="text-center py-8">
        <h2 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-warm-900'}`}>
          <span className={isDark ? 'bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent' : 'text-purple-600'}>
            Settings
          </span>
        </h2>
        <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-warm-600'}`}>
          Customize your SEO Audit Tool experience and manage your data.
        </p>
      </section>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Appearance Section */}
        <div className={`backdrop-blur-xl rounded-2xl p-6 border shadow-lg ${isDark ? 'bg-white/5 border-white/10' : 'bg-warm-100 border-warm-200'}`}>
          <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-warm-900'}`}>Appearance</h3>
          
          <div className={`flex items-center justify-between py-3 border-b ${isDark ? 'border-white/10' : 'border-warm-300'}`}>
            <div>
              <p className={isDark ? 'text-white font-medium' : 'text-warm-900 font-medium'}>Dark Mode</p>
              <p className={isDark ? 'text-gray-400 text-sm' : 'text-warm-600 text-sm'}>Toggle between light and dark themes</p>
            </div>
            <button
              onClick={toggleTheme}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                isDark ? 'bg-purple-600' : 'bg-warm-400'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                  isDark ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Data Management Section */}
        <div className={`backdrop-blur-xl rounded-2xl p-6 border shadow-lg ${isDark ? 'bg-white/5 border-white/10' : 'bg-warm-100 border-warm-200'}`}>
          <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-warm-900'}`}>Data Management</h3>
          
          <div className="space-y-4">
            <div className={`flex items-center justify-between py-3 border-b ${isDark ? 'border-white/10' : 'border-warm-300'}`}>
              <div>
                <p className={isDark ? 'text-white font-medium' : 'text-warm-900 font-medium'}>Export History</p>
                <p className={isDark ? 'text-gray-400 text-sm' : 'text-warm-600 text-sm'}>Download your audit history as JSON</p>
              </div>
              <button
                onClick={handleExport}
                disabled={auditHistory.length === 0}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-xl hover:from-cyan-400 hover:to-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className={isDark ? 'text-white font-medium' : 'text-warm-900 font-medium'}>Clear All Data</p>
                <p className={isDark ? 'text-gray-400 text-sm' : 'text-warm-600 text-sm'}>Remove all audit history from local storage</p>
              </div>
              <button
                onClick={clearHistory}
                disabled={auditHistory.length === 0}
                className="flex items-center px-4 py-2 bg-red-500/20 text-red-400 font-semibold rounded-xl hover:bg-red-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-red-500/30"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className={`backdrop-blur-xl rounded-2xl p-6 border shadow-lg ${isDark ? 'bg-white/5 border-white/10' : 'bg-warm-100 border-warm-200'}`}>
          <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-warm-900'}`}>About</h3>
          
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Info className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className={isDark ? 'text-white font-medium' : 'text-warm-900 font-medium'}>SEO Audit Tool v1.0.0</p>
              <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-warm-600'}`}>
                A powerful SEO audit tool that helps you analyze and improve your website's search engine optimization.
                Built with React, Tailwind CSS, and TypeScript.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Settings;
