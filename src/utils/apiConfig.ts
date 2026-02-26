/**
 * API Configuration Utility
 * Safely imports API keys from environment variables
 */

interface APIConfig {
  geminiApiKey: string;
  pageSpeedApiKey: string;
}

/**
 * Get API keys from environment variables
 * Throws clear error if required keys are missing
 */
export function getAPIConfig(): APIConfig {
  const geminiApiKey = process.env.REACT_APP_GEMINI_API_KEY;
  const pageSpeedApiKey = process.env.REACT_APP_PAGESPEED_API_KEY;

  // Check if the Gemini API key is missing or is the placeholder value
  if (!geminiApiKey || geminiApiKey === 'your_actual_api_key_here') {
    const errorMessage = `
🔴 API Key Configuration Error 🔴
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
The GEMINI_API_KEY is not properly configured.

Please follow these steps to fix:

1. Open the .env file in your project root
2. Add or update your API keys:
   REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
   REACT_APP_PAGESPEED_API_KEY=your_pagespeed_api_key_here
3. Restart your development server

To get API keys:
- Gemini API: Visit Google AI Studio (https://makersuite.google.com/app/apikey)
- PageSpeed API: Visit Google Cloud Console (https://console.cloud.google.com)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `.trim();

    console.error(errorMessage);
    throw new Error('Missing required API key: REACT_APP_GEMINI_API_KEY');
  }

  // PageSpeed key is optional - will fallback to no key if not provided
  if (!pageSpeedApiKey || pageSpeedApiKey === 'your_pagespeed_api_key_here') {
    console.warn('PageSpeed API key not configured. Using default approach.');
  }

  return {
    geminiApiKey,
    pageSpeedApiKey: pageSpeedApiKey || '',
  };
}

/**
 * Get a specific environment variable with optional validation
 * @param key - The environment variable name (without REACT_APP_ prefix)
 * @param required - Whether the variable is required
 * @param defaultValue - Default value if not set
 */
export function getEnvVariable(
  key: string,
  required: boolean = false,
  defaultValue?: string
): string | undefined {
  const fullKey = key.startsWith('REACT_APP_') ? key : `REACT_APP_${key}`;
  const value = process.env[fullKey] || defaultValue;

  if (required && !value) {
    const errorMessage = `
🔴 Environment Variable Error 🔴
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Required environment variable '${fullKey}' is not set.

Please add it to your .env file:
${fullKey}=your_value_here

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `.trim();

    console.error(errorMessage);
    throw new Error(`Missing required environment variable: ${fullKey}`);
  }

  return value;
}

export default getAPIConfig;
