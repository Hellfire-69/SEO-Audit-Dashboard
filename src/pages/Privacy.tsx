import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

function Privacy() {
  return (
    <div className="min-h-screen bg-slate-950 text-gray-200">
      {/* Background Effects */}
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

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6">
        <div className="flex items-center space-x-3">
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white">SEO Audit</span>
          </Link>
        </div>
      </nav>

      {/* Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        <Link 
          to="/" 
          className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-white/10">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Privacy Policy
          </h1>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction</h2>
              <p className="text-gray-400 leading-relaxed">
                At SEO Audit Tool, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the application.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Data Collection</h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                We believe in transparency regarding data collection. Here's what you need to know:
              </p>
              <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                <li><strong className="text-white">No URL Storage:</strong> We do not store the URLs you audit. When you submit a website for analysis, we process it in real-time and do not retain any record of the URL in our databases.</li>
                <li><strong className="text-white">Temporary Processing:</strong> URLs are only processed temporarily during the audit operation and are immediately discarded after the analysis is complete.</li>
                <li><strong className="text-white">No User Accounts Required:</strong> Our basic service does not require account creation, meaning we don't collect personal identification information.</li>
                <li><strong className="text-white">Analytics Data:</strong> We collect anonymous usage analytics to improve our service, but this data cannot be used to identify individual users.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. API Usage</h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                Our service utilizes third-party APIs to provide comprehensive SEO analysis:
              </p>
              <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                <li><strong className="text-white">Google PageSpeed Insights API:</strong> We use Google's official API to analyze website performance, accessibility, and SEO metrics. This processing is subject to Google's Privacy Policy.</li>
                <li><strong className="text-white">API Key Handling:</strong> For advanced features, users may provide their own API keys. These keys are encrypted and stored securely. We never share API keys with third parties.</li>
                <li><strong className="text-white">Rate Limiting:</strong> To ensure fair usage, we implement rate limiting on API requests. Excessive requests may be temporarily throttled.</li>
                <li><strong className="text-white">Data Processing:</strong> All API requests are made on behalf of the user, and any data returned is only displayed to the user who initiated the request.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Information We Collect</h2>
              <p className="text-gray-400 leading-relaxed">
                We may collect personal information that you voluntarily provide to us when you express an interest in obtaining information about us or our products and services, when you participate in activities on the Website, or otherwise when you contact us. This includes information such as your name, email address (if provided), and any other information you choose to provide.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. How We Use Your Information</h2>
              <p className="text-gray-400 leading-relaxed">
                We use personal information collected via our Website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Cookies and Tracking Technologies</h2>
              <p className="text-gray-400 leading-relaxed">
                We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Contact Us</h2>
              <p className="text-gray-400 leading-relaxed">
                If you have questions or comments about this policy, you may email us at support@seoaudittool.com. We will respond to your inquiry as soon as possible.
              </p>
            </section>

            <section>
              <p className="text-gray-500 text-sm mt-8">
                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-8 py-8 border-t border-white/10 bg-slate-950">
        <div className="max-w-6xl mx-auto text-center text-gray-500">
          <p>© {new Date().getFullYear()} SEO Audit Tool. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Privacy;
