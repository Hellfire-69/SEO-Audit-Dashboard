import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Zap, Eye, Search, ArrowRight, ChevronRight, Link as LinkIcon, Code, Lightbulb, Check, X, Github, ExternalLink } from 'lucide-react';

function LandingPage() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const currentYear = new Date().getFullYear();

  const features = [
    {
      icon: Zap,
      title: 'Performance',
      description: 'Analyze Core Web Vitals and get actionable insights to improve your site speed.',
      gradient: 'from-yellow-400 to-orange-500',
      hoverGradient: 'hover:from-yellow-500 hover:to-orange-600',
    },
    {
      icon: Eye,
      title: 'Accessibility',
      description: 'Ensure your website is accessible to all users with comprehensive a11y audits.',
      gradient: 'from-blue-400 to-cyan-500',
      hoverGradient: 'hover:from-blue-500 hover:to-cyan-600',
    },
    {
      icon: Search,
      title: 'SEO',
      description: 'Boost your search rankings with detailed SEO analysis and recommendations.',
      gradient: 'from-purple-400 to-pink-500',
      hoverGradient: 'hover:from-purple-500 hover:to-pink-600',
    },
  ];

  const howItWorks = [
    {
      step: '01',
      title: 'Enter Your URL',
      description: 'Simply paste your website URL into our audit form',
      icon: LinkIcon,
    },
    {
      step: '02',
      title: 'AI Analyzes Your Code',
      description: 'Our AI-powered engine scans every aspect of your site',
      icon: Code,
    },
    {
      step: '03',
      title: 'Get Actionable Insights',
      description: 'Receive detailed recommendations to improve your site',
      icon: Lightbulb,
    },
  ];

  const pricingTiers = [
    {
      name: 'Hobby',
      price: 'Free',
      description: 'Perfect for personal projects',
      features: ['5 audits per month', 'Basic SEO metrics', 'Performance scores', 'Email support'],
      notIncluded: ['Advanced analytics', 'Competitor comparison', 'Priority support'],
      cta: 'Get Started',
      highlighted: false,
    },
    {
      name: 'Pro',
      price: '$19',
      period: '/mo',
      description: 'For growing businesses',
      features: ['Unlimited audits', 'Advanced SEO metrics', 'Performance scores', 'Competitor comparison', 'Priority support', 'API access'],
      notIncluded: [],
      cta: 'Get Started',
      highlighted: true,
    },
  ];

  const faqs = [
    {
      question: 'Do I need an API key?',
      answer: 'No API key required for basic audits. We use Google PageSpeed Insights API which is free for standard usage. For advanced features, you can optionally add your own API key.',
    },
    {
      question: 'How accurate is the data?',
      answer: 'Our audits are powered by Google\'s Lighthouse technology, the same engine used by Google Search Console. This gives you industry-standard, reliable metrics.',
    },
    {
      question: 'Can I compare my site with competitors?',
      answer: 'Yes! Our Pro plan includes competitor comparison features. You can analyze up to 5 competitor URLs and see how you stack up against industry leaders.',
    },
  ];

  const floatingShapes = [
    { size: 300, top: '10%', left: '5%', delay: 0, gradient: 'from-pink-500/30 to-purple-500/30' },
    { size: 200, top: '60%', left: '70%', delay: 0.5, gradient: 'from-cyan-500/30 to-blue-500/30' },
    { size: 250, top: '70%', left: '10%', delay: 1, gradient: 'from-yellow-500/30 to-orange-500/30' },
    { size: 180, top: '20%', left: '75%', delay: 1.5, gradient: 'from-green-500/30 to-teal-500/30' },
    { size: 150, top: '40%', left: '50%', delay: 2, gradient: 'from-purple-500/30 to-pink-500/30' },
  ];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Floating Background Shapes */}
      <div className="fixed inset-0 pointer-events-none">
        {floatingShapes.map((shape, index) => (
          <motion.div
            key={index}
            className={`absolute rounded-full bg-gradient-to-br ${shape.gradient} blur-3xl`}
            style={{
              width: shape.size,
              height: shape.size,
              top: shape.top,
              left: shape.left,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 15, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              delay: shape.delay,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Grid Pattern Background */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
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

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center">
            <Search className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold">SEO Audit</span>
        </div>
        <div className="flex items-center space-x-6">
          <button 
            onClick={() => navigate('/dashboard')}
            className="text-gray-400 hover:text-white transition-colors"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center px-4 py-2 bg-white/5 rounded-full border border-white/10 mb-8"
          >
            <span className="w-2 h-2 bg-cyan-400 rounded-full mr-2 animate-pulse" />
            <span className="text-sm text-gray-300">Powered by Google PageSpeed API</span>
            <ChevronRight className="w-4 h-4 ml-2 text-gray-400" />
          </motion.div>

          {/* Main Headline */}
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Optimize Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Web Vitals
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Get comprehensive insights into your website's performance, accessibility, and SEO.
            Make data-driven decisions to boost your rankings.
          </p>

          {/* CTA Button - Go to dashboard if user is logged in */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <button
              onClick={() => {
                const isLoggedIn = localStorage.getItem('seo_audit_token') || sessionStorage.getItem('seo_audit_token');
                if (isLoggedIn) {
                  navigate('/dashboard');
                } else {
                  navigate('/signup');
                }
              }}
              className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl text-lg font-semibold overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative flex items-center">
                Start Auditing
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* Feature Grid - Bento Layout */}
      <section className="relative z-10 px-8 py-20 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <Link to="/dashboard" key={feature.title}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300 cursor-pointer h-full"
              >
                {/* Gradient Border on Hover */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>

                {/* Arrow */}
                <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1">
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 px-8 py-16 border-t border-white/5">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-16">
          {[
            { value: '10K+', label: 'Websites Audited' },
            { value: '99.9%', label: 'Uptime' },
            { value: '50+', label: 'SEO Metrics' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-gray-500 mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative z-10 px-8 py-20 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-center mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              How It Works
            </span>
          </h2>
          <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
            Get your website analyzed in three simple steps
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                {/* Connector Line */}
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 left-full w-full h-0.5 bg-gradient-to-r from-cyan-500/50 to-purple-500/50 -translate-y-1/2 z-0" />
                )}
                
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 text-center hover:bg-white/10 transition-all duration-300">
                  {/* Step Number */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-lg font-bold">
                    {item.step}
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 mx-auto mt-4 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
                    <item.icon className="w-8 h-8 text-cyan-400" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Pricing Section */}
      <section className="relative z-10 px-8 py-20 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-center mb-4">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Simple, Transparent Pricing
              </span>
            </h2>
            <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
              Choose the plan that fits your needs
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {pricingTiers.map((tier, index) => (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative rounded-3xl p-8 ${
                    tier.highlighted 
                      ? 'bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border-2 border-cyan-500/50 shadow-lg shadow-cyan-500/20' 
                      : 'bg-white/5 border border-white/10'
                  }`}
                >
                  {tier.highlighted && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  )}

                  <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                  <div className="flex items-baseline mb-4">
                    <span className="text-4xl font-bold">{tier.price}</span>
                    {tier.period && <span className="text-gray-400 ml-1">{tier.period}</span>}
                  </div>
                  <p className="text-gray-400 mb-6">{tier.description}</p>

                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-gray-300">
                        <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                    {tier.notIncluded.map((feature, i) => (
                      <li key={i} className="flex items-center text-gray-500">
                        <X className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => navigate('/signup')}
                    className={`w-full py-3 rounded-xl font-semibold transition-all ${
                      tier.highlighted
                        ? 'bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    {tier.cta}
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative z-10 px-8 py-20 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-center mb-4">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Frequently Asked Questions
              </span>
            </h2>
            <p className="text-gray-400 text-center mb-16">
              Got questions? We've got answers.
            </p>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                  >
                    <span className="font-semibold text-lg">{faq.question}</span>
                    <ChevronRight 
                      className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                        openFaq === index ? 'rotate-90' : ''
                      }`} 
                    />
                  </button>
                  <motion.div
                    initial={false}
                    animate={{
                      height: openFaq === index ? 'auto' : 0,
                      opacity: openFaq === index ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 text-gray-400">
                      {faq.answer}
                    </p>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-8 py-12 border-t border-white/10 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Search className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold">SEO Audit Tool</span>
            </div>

            <div className="flex items-center space-x-8 text-gray-400">
              <Link to="/privacy" className="hover:text-white transition-colors flex items-center gap-2">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-white transition-colors flex items-center gap-2">
                Terms of Service
              </Link>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors flex items-center gap-2"
              >
                <Github className="w-5 h-5" />
                GitHub
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10 text-center text-gray-500">
            <p>© {currentYear} SEO Audit Tool. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
