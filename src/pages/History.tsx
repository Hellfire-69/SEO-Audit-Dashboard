import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import Dashboard from '../components/Dashboard';

function History() {
  const { isDark } = useTheme();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <section className="text-center py-8">
        <h2 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-warm-900'}`}>
          Audit{' '}
          <span className={isDark ? 'bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent' : 'text-purple-600'}>
            History
          </span>
        </h2>
        <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-warm-600'}`}>
          View all your previous SEO audits, track improvements over time, and manage your audit history.
        </p>
      </section>

      <section>
        <Dashboard />
      </section>
    </motion.div>
  );
}

export default History;
