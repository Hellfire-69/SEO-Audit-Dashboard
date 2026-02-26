import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, History, Settings, Menu, X, Sun, Moon, Search as SearchIcon, GitCompare, FileText } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Audit', path: '/audit', icon: SearchIcon },
  { name: 'Technical', path: '/technical', icon: FileText },
  { name: 'Compare', path: '/compare', icon: GitCompare },
  { name: 'History', path: '/history', icon: History },
  { name: 'Settings', path: '/settings', icon: Settings },
];

function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { theme, toggleTheme, isDark } = useTheme();

  const sidebarVariants = {
    open: { width: 256, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { width: 80, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  };

  const linkVariants = {
    hover: { x: 4, transition: { type: 'spring', stiffness: 400, damping: 25 } },
  };

  return (
    <div className={`flex min-h-screen ${isDark ? 'bg-slate-950 text-gray-100' : 'bg-warm-50 text-warm-900'}`}>
      {/* Dark Mode Background Effects */}
      {isDark && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
                `,
                backgroundSize: '60px 60px',
              }}
            />
          </div>
        </div>
      )}

      <motion.aside
        initial={false}
        animate={sidebarOpen ? 'open' : 'closed'}
        variants={sidebarVariants}
        className={`fixed left-0 top-0 h-full z-50 flex flex-col ${
          isDark 
            ? 'bg-slate-900/50 backdrop-blur-xl border-r border-white/10' 
            : 'bg-warm-100/90 backdrop-blur-xl border-r border-warm-200 shadow-sm'
        }`}
      >
        <div className={`p-4 flex items-center justify-between border-b ${isDark ? 'border-white/10' : 'border-warm-200'}`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <SearchIcon className="w-6 h-6 text-white" />
            </div>
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`font-bold text-lg whitespace-nowrap ${isDark ? 'text-white' : 'text-warm-900'}`}
              >
                SEO Audit
              </motion.span>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-1 transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-warm-600 hover:text-warm-900'}`}
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 py-6 px-3">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-300 relative group
                    ${isActive 
                      ? (isDark ? 'bg-purple-500/10 text-purple-400' : 'bg-purple-100 text-purple-700') 
                      : (isDark ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-warm-600 hover:text-warm-900 hover:bg-warm-200')}
                  `}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.div
                          layoutId="activeBorder"
                          className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full ${
                            isDark ? 'bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]' : 'bg-purple-500'
                          }`}
                        />
                      )}
                      
                      <motion.div
                        variants={linkVariants}
                        whileHover="hover"
                        className="flex items-center space-x-3"
                      >
                        <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-purple-400' : ''}`} />
                        {sidebarOpen && (
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="whitespace-nowrap"
                          >
                            {item.name}
                          </motion.span>
                        )}
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`absolute inset-0 rounded-xl -z-10 transition-colors duration-300 ${
                          isActive 
                            ? (isDark ? 'bg-purple-500/10' : 'bg-purple-100') 
                            : (isDark ? 'bg-white/5 group-hover:bg-white/10' : 'bg-warm-200/50 group-hover:bg-warm-200')
                        }`}
                      />
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className={`p-4 border-t ${isDark ? 'border-white/10' : 'border-warm-200'}`}>
          <button
            onClick={toggleTheme}
            className={`flex items-center space-x-3 w-full px-3 py-3 rounded-xl transition-all duration-300 ${
              isDark 
                ? 'text-gray-400 hover:text-white hover:bg-white/5' 
                : 'text-warm-600 hover:text-warm-900 hover:bg-warm-200'
            }`}
          >
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.div>
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="whitespace-nowrap"
              >
                {isDark ? 'Light Mode' : 'Dark Mode'}
              </motion.span>
            )}
          </button>
        </div>
      </motion.aside>

      <motion.main
        animate={{ marginLeft: sidebarOpen ? 256 : 80 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="flex-1 min-h-screen relative"
      >
        {/* Header with glassmorphism */}
        <header className={`py-4 backdrop-blur-xl border-b ${isDark ? 'bg-slate-950/80 border-white/10' : 'bg-warm-100/80 border-warm-200'}`}>
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className={`text-2xl font-bold ${isDark ? 'bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent' : 'text-warm-900'}`}>
                  SEO Audit Tool
                </h1>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          {children}
        </div>

        <footer className={`border-t py-6 mt-12 ${isDark ? 'border-white/5' : 'border-warm-200'}`}>
          <div className="container mx-auto px-4 text-center">
            <p className={isDark ? 'text-gray-500' : 'text-warm-500'}>
              {new Date().getFullYear()} SEO Audit Tool. All rights reserved.
            </p>
          </div>
        </footer>
      </motion.main>
    </div>
  );
}

export default Layout;
