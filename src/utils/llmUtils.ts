import { GoogleGenerativeAI } from '@google/generative-ai';
import { getAPIConfig } from './apiConfig';

export function formatAuditResultsForLLM(auditData: any): string {
  let diagnosticsText = '';
  if (auditData.diagnostics && auditData.diagnostics.length > 0) {
    diagnosticsText = auditData.diagnostics.map((d: any) => 
      `- Issue: ${d.title}\n  Details: ${d.description}`
    ).join('\n\n');
  } else {
    diagnosticsText = 'No specific critical diagnostics reported.';
  }

  return `
You are a friendly, expert SEO consultant speaking directly to a non-technical small business owner.
I ran a website audit on (${auditData.url}). 

Here are the issues found:
${diagnosticsText}

YOUR TASK:
Explain the 3 most critical issues in plain, simple English. Tell the user exactly what is wrong and how to fix it in a way a beginner can understand.

STRICT RULES:
1. Do NOT write an introductory sentence.
2. Do NOT write a concluding sentence.
3. Do NOT use markdown bolding (like **this**). 
4. Start your response immediately with the first recommendation.
`;
}

export async function getLLMRecommendations(prompt: string): Promise<string[]> {
  try {
    const { geminiApiKey } = getAPIConfig();
    if (!geminiApiKey) throw new Error("Missing Gemini API Key");

    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Gemini API timeout')), 15000)
    );

    const result = await Promise.race([
      model.generateContent(prompt),
      timeoutPromise
    ]) as any;
    
    const response = result.response;
    const content = response.text();

    const lines = content.split('\n').filter((line: string) => line.trim().length > 0);
    const recommendations: string[] = [];
    
    for (const line of lines) {
      // Strips out bullets, numbers, and any stray markdown asterisks
      const cleaned = line.replace(/^[\d\.\)\-\*\•]+\s*/, '').replace(/\*\*/g, '').trim();
      
      if (cleaned.length > 15) { 
        recommendations.push(cleaned);
      }
    }

    if (recommendations.length > 0) {
      return recommendations.slice(0, 3);
    }

    throw new Error("Empty response");

  } catch (error: any) {
    console.error('LLM Pipeline Error:', error);
    return [
      'Your website is taking a little too long to load. Try compressing your images.',
      'Make sure every page has a clear, descriptive title for search engines.',
      'Check your website on a mobile phone to ensure buttons are easy to tap.'
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
