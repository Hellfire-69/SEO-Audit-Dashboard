import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import AuditForm from '../components/AuditForm';
import Dashboard from '../components/Dashboard';
import AuditResults from '../components/AuditResults';
import PerformanceMetrics from '../components/PerformanceMetrics';

function Home() {
  const { isDark } = useTheme();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Hero Section */}
      <section className="text-center py-8">
        <h2 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-warm-900'}`}>
          Boost Your Website's{' '}
          <span className={isDark ? 'bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent' : 'text-purple-600'}>
            SEO Performance
          </span>
        </h2>
        <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-warm-600'}`}>
          Get comprehensive insights into your website's SEO, performance, and accessibility with our advanced audit tool.
        </p>
      </section>

      <div className="grid gap-8">
        <section>
          <AuditForm />
        </section>

        <section>
          <PerformanceMetrics />
        </section>

        <section>
          <Dashboard />
        </section>

        <section>
          <AuditResults />
        </section>
      </div>
    </motion.div>
  );
}

export default Home;
