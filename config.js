/**
 * AI Configuration - Set your API credentials here
 * 
 * ⚠️ IMPORTANT SECURITY WARNING ⚠️
 * 
 * If hosting on GitHub Pages or any public platform:
 * NEVER commit your real API key to version control!
 * 
 * Anyone can see it and use it to cost you money.
 * 
 * Options:
 * 1. Keep ENABLED: false for public deployment (SIMPLEST)
 * 2. Use backend proxy (SECURE - see GITHUB_PAGES_GUIDE.md)
 * 3. Create local config file (add config.local.js to .gitignore)
 * 
 * See GITHUB_PAGES_GUIDE.md for detailed instructions.
 * 
 * Supported AI Providers:
 * 1. OpenAI (ChatGPT)
 *    - Get API key: https://platform.openai.com/api-keys
 *    - Model: gpt-3.5-turbo
 * 
 * 2. Google Gemini
 *    - Get API key: https://ai.google.dev/tutorials/setup
 *    - Model: gemini-pro
 * 
 * 3. HuggingFace
 *    - Get API key: https://huggingface.co/settings/tokens
 *    - Model: mistralai/Mistral-7B-Instruct-v0.1
 */

const AI_CONFIG = {
    // Set to true to enable AI integration (DO NOT USE with real API key on GitHub!)
    ENABLED: false,
    // When true, the client will call a server-side proxy at `PROXY_ENDPOINT`.
    // Configure this when deploying to Vercel and set your provider API key
    // as an environment variable on the server (see DEPLOY_VERCEL.md).
    USE_PROXY: false,
    // The path to the server-side proxy endpoint (relative to site root)
    PROXY_ENDPOINT: '/api/ai-proxy',
    
    // Choose your AI provider: 'openai', 'google', or 'huggingface'
    PROVIDER: 'openai',
    
    // Your API Key (for local development ONLY - NEVER commit with real key!)
    // When using `USE_PROXY` on the server you should leave this blank.
    API_KEY: '',
    
    // Instructions for setup:
    SETUP_INSTRUCTIONS: {
        openai: {
            name: 'OpenAI',
            url: 'https://platform.openai.com/api-keys',
            steps: [
                '1. Visit https://platform.openai.com/api-keys',
                '2. Sign up or log in to your OpenAI account',
                '3. Create a new API key',
                '4. Copy the key and paste it below in API_KEY field',
                '5. Keep your API key private and never commit it to version control'
            ]
        },
        google: {
            name: 'Google Gemini',
            url: 'https://ai.google.dev/tutorials/setup',
            steps: [
                '1. Visit https://ai.google.dev/tutorials/setup',
                '2. Sign in with your Google account',
                '3. Create an API key for Gemini',
                '4. Copy the key and paste it below',
                '5. Ensure you have billing enabled'
            ]
        },
        huggingface: {
            name: 'HuggingFace',
            url: 'https://huggingface.co/settings/tokens',
            steps: [
                '1. Visit https://huggingface.co/settings/tokens',
                '2. Create a new access token',
                '3. Copy the token and paste it below',
                '4. Ensure you have sufficient API quota'
            ]
        }
    }
};

/**
 * Initialize AI Service based on configuration
 */
function initializeAIService() {
    // Allow initialization when using a server-side proxy even if API_KEY is empty.
    if (!AI_CONFIG.ENABLED || (!AI_CONFIG.API_KEY && !AI_CONFIG.USE_PROXY)) {
        console.log('AI integration is disabled. Using fallback keywords.');
        return null;
    }
    
    try {
        // Pass API_KEY (may be empty) — `AIService` will use client-side calls
        // or route through the proxy when `AI_CONFIG.USE_PROXY` is true.
        const aiService = new AIService(AI_CONFIG.API_KEY || null, AI_CONFIG.PROVIDER);
        console.log(`AI Service initialized with ${AI_CONFIG.PROVIDER} provider`);
        return aiService;
    } catch (error) {
        console.error('Failed to initialize AI Service:', error);
        return null;
    }
}

// Export for use in script.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AI_CONFIG, initializeAIService };
}
