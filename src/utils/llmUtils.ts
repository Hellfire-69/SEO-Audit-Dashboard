import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getAPIConfig } from './apiConfig';

export function formatAuditResultsForLLM(auditData: any): string {
  return `
URL: ${auditData.url}
Date: ${new Date(auditData.date).toLocaleDateString()}
Overall Score: ${auditData.score}%

Performance Metrics:
- Performance: ${auditData.performance}%
- SEO: ${auditData.seo}%
- Accessibility: ${auditData.accessibility}%
- Best Practices: ${auditData.bestPractices}%

Core Web Vitals:
- LCP: ${auditData.coreWebVitals?.lcp ? `${(auditData.coreWebVitals.lcp / 1000).toFixed(2)}s` : 'N/A'}
- CLS: ${auditData.coreWebVitals?.cls ? auditData.coreWebVitals.cls.toFixed(3) : 'N/A'}
- FID: ${auditData.coreWebVitals?.fid ? `${auditData.coreWebVitals.fid.toFixed(0)}ms` : 'N/A'}
- FCP: ${auditData.coreWebVitals?.fcp ? `${(auditData.coreWebVitals.fcp / 1000).toFixed(2)}s` : 'N/A'}

Issues Found: ${auditData.issuesCount}

Please provide 3 actionable recommendations to improve this website's SEO performance. Focus on specific, practical steps that can be implemented.
`;
}

export async function getLLMRecommendations(prompt: string): Promise<string[]> {
  try {
    // Get API config (throws error if missing)
    const { geminiApiKey } = getAPIConfig();
    
    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Create the SEO-focused prompt
    const seoPrompt = `You are an expert SEO auditor. I just scanned a website and got these metrics: ${prompt}

Write a 3-bullet-point summary of the most critical issues and exactly how a developer should fix them. Keep each bullet point concise but actionable.`;

    // Generate content
    const result = await model.generateContent(seoPrompt);
    const response = result.response;
    const content = response.text();

    // Split by newlines and filter empty lines
    const lines = content.split('\n').filter((line: string) => line.trim().length > 0);
    
    // Extract bullet points (handle various formats like "-", "•", "*", or numbered)
    const recommendations: string[] = [];
    for (const line of lines) {
      // Remove bullet characters and numbering
      const cleaned = line.replace(/^[\d\.\)\-\*\•]+\s*/, '').trim();
      if (cleaned.length > 10) { // Filter out very short lines
        recommendations.push(cleaned);
      }
    }

    // If we got recommendations, return them
    if (recommendations.length > 0) {
      return recommendations.slice(0, 3); // Limit to 3
    }

    // Fallback if parsing fails
    return [
      '• Optimize your title tag to 50-60 characters',
      '• Add meta description between 150-160 characters',
      '• Include alt text for all images'
    ];

  } catch (error: any) {
    console.error('LLM API error:', error);
    
    // Provide helpful error messages based on the error type
    if (error.message?.includes('API key')) {
      throw new Error('Invalid or missing API key. Please check your .env configuration.');
    }
    
    if (error.message?.includes('quota')) {
      throw new Error('API quota exceeded. Please try again later or check your billing.');
    }
    
    // Return fallback recommendations on error
    return [
      '• Optimize your title tag to 50-60 characters',
      '• Add meta description between 150-160 characters',
      '• Include alt text for all images'
    ];
  }
}

/**
 * Analyze website using dual-API approach:
 * 1. PageSpeed Insights API for real-time metrics
 * 2. Gemini API for AI-powered recommendations
 */
export async function analyzeWebsite(url: string): Promise<{
  pageSpeedData: any;
  recommendations: string[];
  loadingMessage: string;
}> {
  let loadingMessage = 'Initializing scan...';
  
  try {
    // Part 1: The Scanner - PageSpeed API
    loadingMessage = 'Scanning website with PageSpeed API...';
    
    const pageSpeedUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&category=performance&category=seo&category=accessibility&category=best-practices&strategy=mobile`;
    
    const psResponse = await fetch(pageSpeedUrl);
    if (!psResponse.ok) {
      throw new Error(`PageSpeed API error: ${psResponse.status}`);
    }
    
    const pageSpeedData = await psResponse.json();
    
    // Extract scores from PageSpeed response
    const lighthouse = pageSpeedData?.lighthouseResult;
    const categories = lighthouse?.categories;
    
    const metrics = {
      performance: Math.round((categories?.performance?.score || 0) * 100),
      seo: Math.round((categories?.seo?.score || 0) * 100),
      accessibility: Math.round((categories?.accessibility?.score || 0) * 100),
      bestPractices: Math.round((categories?.['best-practices']?.score || 0) * 100),
      coreWebVitals: {
        lcp: pageSpeedData?.lighthouseResult?.audits?.['largest-contentful-paint']?.numericValue,
        cls: pageSpeedData?.lighthouseResult?.audits?.['cumulative-layout-shift']?.numericValue,
        fid: pageSpeedData?.lighthouseResult?.audits?.['max-potential-fid']?.numericValue,
        fcp: pageSpeedData?.lighthouseResult?.audits?.['first-contentful-paint']?.numericValue,
      }
    };

    // Format the data for Gemini
    const prompt = formatAuditResultsForLLM({
      url,
      date: new Date().toISOString(),
      score: Math.round((metrics.performance + metrics.seo + metrics.accessibility + metrics.bestPractices) / 4),
      ...metrics,
      issuesCount: 0
    });

    // Part 2: The Brain - Gemini API
    loadingMessage = 'AI analyzing results with Gemini...';
    
    const recommendations = await getLLMRecommendations(prompt);

    // Part 3: Return combined results
    return {
      pageSpeedData: metrics,
      recommendations,
      loadingMessage: 'Analysis complete!'
    };

  } catch (error: any) {
    console.error('Website analysis error:', error);
    loadingMessage = 'Error during analysis';
    throw error;
  }
}

export default getLLMRecommendations;
