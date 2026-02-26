import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import AuditForm from '../components/AuditForm';
import AuditResults from '../components/AuditResults';

function Audit() {
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
          Start a New{' '}
          <span className={isDark ? 'bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent' : 'text-purple-600'}>
            SEO Audit
          </span>
        </h2>
        <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-warm-600'}`}>
          Enter your website URL to get a comprehensive analysis of your site's SEO performance, Core Web Vitals, and actionable recommendations.
        </p>
      </section>

      <div className="grid gap-8">
        <section>
          <AuditForm />
        </section>

        <section>
          <AuditResults />
        </section>
      </div>
    </motion.div>
  );
}

export default Audit;
