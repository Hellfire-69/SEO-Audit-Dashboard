import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

function Terms() {
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
            Terms of Service
          </h1>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-400 leading-relaxed">
                By accessing and using SEO Audit Tool ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. Additionally, when using the Service's services, you shall be subject to any posted guidelines or rules applicable to such services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Description of Service</h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                SEO Audit Tool provides users with comprehensive website analysis tools, including but not limited to:
              </p>
              <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                <li>Performance analysis using Google PageSpeed Insights</li>
                <li>SEO optimization recommendations</li>
                <li>Accessibility audits</li>
                <li>Competitor comparison features</li>
                <li>Technical SEO reporting</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. User Obligations</h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                As a user of the Service, you agree to:
              </p>
              <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                <li>Provide accurate information when using the Service</li>
                <li>Not use the Service for any unlawful purpose</li>
                <li>Not attempt to gain unauthorized access to any part of the Service</li>
                <li>Not interfere with or disrupt the Service or its underlying infrastructure</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Intellectual Property</h2>
              <p className="text-gray-400 leading-relaxed">
                The Service and its original content, features, and functionality are and will remain the exclusive property of SEO Audit Tool and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Limitation of Liability</h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                In no event shall SEO Audit Tool, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
              </p>
              <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                <li>Your access to or use of or inability to access or use the Service</li>
                <li>Any conduct or content of any third party on the Service</li>
                <li>Any content obtained from the Service</li>
                <li>Unauthorized access, use or alteration of your transmissions or content</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Disclaimer</h2>
              <p className="text-gray-400 leading-relaxed">
                Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement or course of performance.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Third-Party Services</h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                Our Service may utilize third-party services, including:
              </p>
              <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                <li><strong className="text-white">Google PageSpeed Insights API:</strong> Performance and SEO metrics are derived from Google's APIs. We are not responsible for the accuracy or availability of Google's services.</li>
                <li><strong className="text-white">API Providers:</strong> Any API keys provided by users remain their responsibility. We do not guarantee API uptime or availability.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Subscription and Billing</h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                For paid subscriptions:
              </p>
              <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                <li>Billing is processed on a monthly or annual basis, depending on your selected plan</li>
                <li>Subscriptions automatically renew unless canceled at least 24 hours before the end of the current period</li>
                <li>Refunds are available within the first 14 days of subscription for annual plans</li>
                <li>You can upgrade or downgrade your plan at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Termination</h2>
              <p className="text-gray-400 leading-relaxed">
                We may terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">10. Governing Law</h2>
              <p className="text-gray-400 leading-relaxed">
                These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">11. Changes to Terms</h2>
              <p className="text-gray-400 leading-relaxed">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after any revisions become effective, you agree to be bound by the revised terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">12. Contact Us</h2>
              <p className="text-gray-400 leading-relaxed">
                If you have any questions about these Terms, please contact us at support@seoaudittool.com. We will respond to your inquiry as soon as possible.
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

export default Terms;
