const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Common stop words to ignore in keyword analysis
const STOP_WORDS = new Set([
  'and', 'the', 'is', 'in', 'at', 'of', 'for', 'to', 'a', 'an',
  'on', 'with', 'as', 'by', 'from', 'it', 'that', 'this', 'are',
  'was', 'be', 'have', 'has', 'had', 'will', 'would', 'could',
  'should', 'may', 'might', 'can', 'need', 'must', 'but', 'or',
  'not', 'no', 'so', 'if', 'then', 'when', 'where', 'how', 'what',
  'who', 'which', 'about', 'into', 'more', 'some', 'such', 'out',
  'up', 'down', 'only', 'also', 'just', 'than', 'them', 'they',
  'their', 'we', 'you', 'your', 'his', 'her', 'its', 'our', 'me',
  'my', 'do', 'does', 'did', 'done', 'being', 'been', 'get', 'got',
  'going', 'go', 'here', 'there', 'all', 'any', 'each', 'every',
  'other', 'most', 'many', 'much', 'very', 'too', 'even', 'back'
]);

// Keyword Analyzer function
function analyzeKeywords($) {
  const bodyText = $('body').text();
  
  const words = bodyText
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2);

  const wordCount = {};
  words.forEach(word => {
    if (!STOP_WORDS.has(word)) {
      wordCount[word] = (wordCount[word] || 0) + 1;
    }
  });

  const topKeywords = Object.entries(wordCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word, count]) => ({ word, count }));

  return topKeywords;
}

// Web scraping endpoint with robust error handling
app.post('/api/scrape', async (req, res) => {
  try {
    const { url } = req.body;
    
    // Check if URL is provided
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Validate and normalize URL
    let validUrl;
    try {
      let urlToValidate = url.trim();
      if (!urlToValidate.startsWith('http://') && !urlToValidate.startsWith('https://')) {
        urlToValidate = 'https://' + urlToValidate;
      }
      
      const urlObj = new URL(urlToValidate);
      
      // Check for valid hostname
      if (!urlObj.hostname.includes('.') && urlObj.hostname !== 'localhost') {
        return res.status(400).json({ 
          error: 'Invalid URL format. Please enter a valid domain (e.g., example.com)' 
        });
      }
      
      validUrl = urlToValidate;
    } catch (urlError) {
      return res.status(400).json({ 
        error: 'Invalid URL format. Please enter a valid URL (e.g., https://example.com)' 
      });
    }

    // Security Check
    let securityStatus = {
      httpsEnforced: false,
      statusCode: null,
      isSecure: false
    };

    try {
      const urlObj = new URL(validUrl);
      securityStatus.httpsEnforced = urlObj.protocol === 'https:';
      
      const headResponse = await axios.head(validUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 10000,
        validateStatus: () => true
      });
      
      securityStatus.statusCode = headResponse.status;
      securityStatus.isSecure = headResponse.status === 200 && securityStatus.httpsEnforced;
    } catch (securityError) {
      console.error('Security check error:', securityError.message);
    }

    // Fetch the webpage
    let response;
    try {
      response = await axios.get(validUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 10000
      });
    } catch (fetchError) {
      const errorMessage = fetchError.message || '';
      
      if (errorMessage.includes('ECONNREFUSED')) {
        return res.status(502).json({ 
          error: 'Cannot connect to the website. Please check if the URL is correct and the website is accessible.' 
        });
      }
      
      if (errorMessage.includes('timeout') || errorMessage.includes('ETIMEDOUT')) {
        return res.status(504).json({ 
          error: 'The website took too long to respond. Please try again or use a different URL.' 
        });
      }
      
      return res.status(502).json({ 
        error: 'Failed to fetch the website. Please check if the URL is correct.',
        details: errorMessage
      });
    }

    const $ = cheerio.load(response.data);

    const title = $('title').text().trim();
    const titleLength = title ? title.length : 0;
    const metaDescription = $('meta[name="description"]').attr('content') || '';
    const metaDescriptionLength = metaDescription.length;
    const h1Count = $('h1').length;

    const imagesWithoutAlt = [];
    $('img').each((i, elem) => {
      const alt = $(elem).attr('alt');
      const src = $(elem).attr('src') || $(elem).attr('data-src') || '';
      if (!alt || alt.trim() === '') {
        imagesWithoutAlt.push({ src, index: i });
      }
    });

    const hasViewportMeta = $('meta[name="viewport"]').length > 0;
    const hasCanonical = $('link[rel="canonical"]').length > 0;
    const h1Tags = [];
    $('h1').each((i, elem) => {
      h1Tags.push($(elem).text().trim());
    });

    const keywordAnalysis = analyzeKeywords($);

    const results = {
      url: validUrl,
      title,
      titleLength,
      metaDescription,
      metaDescriptionLength,
      h1Count,
      h1Tags,
      imagesWithoutAlt,
      imagesWithoutAltCount: imagesWithoutAlt.length,
      hasViewportMeta,
      hasCanonical,
      securityStatus,
      keywordAnalysis,
      timestamp: new Date().toISOString()
    };

    res.json(results);
  } catch (error) {
    console.error('Scraping error:', error.message);
    res.status(500).json({ 
      error: 'Failed to scrape the website',
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
