# Resume Analyzer - AI Integration Guide

## Overview
The Resume Analyzer now supports AI integration for dynamic keyword generation and insights. Instead of hardcoded keywords, the app can fetch relevant keywords from AI APIs based on the job role.

## File Structure
```
├── index.html           # Main HTML file
├── styles.css          # CSS styling
├── config.js           # AI configuration
├── ai-service.js       # AI integration service
├── model.js            # Business logic (MVC Model)
├── view.js             # UI handling (MVC View)
├── controller.js       # Event handling (MVC Controller)
└── script.js           # Application entry point
```

## How to Enable AI Integration

### Step 1: Choose Your AI Provider

The application supports three AI providers:

#### Option A: OpenAI (ChatGPT)
1. Visit https://platform.openai.com/api-keys
2. Sign up or log in
3. Create a new API key
4. Copy your API key

#### Option B: Google Gemini
1. Visit https://ai.google.dev/tutorials/setup
2. Sign in with your Google account
3. Create an API key
4. Copy your API key

#### Option C: HuggingFace
1. Visit https://huggingface.co/settings/tokens
2. Create a new access token
3. Copy your token

### Step 2: Configure the Application

Open `config.js` and update:

```javascript
const AI_CONFIG = {
    ENABLED: true,                    // Set to true to enable
    PROVIDER: 'openai',               // Choose: 'openai', 'google', or 'huggingface'
    API_KEY: 'your-api-key-here',    // Paste your API key
};
```

### Step 3: Test the Application

1. Open `index.html` in your browser
2. Upload a resume or use the sample
3. Click "Analyze with AI"
4. The app will now fetch keywords from your AI provider

## Features

### What AI Integration Provides

1. **Dynamic Keywords**: Instead of hardcoded keywords, the AI generates relevant keywords for each job role
2. **Personalized Insights**: AI generates custom insights based on the job role and keywords
3. **Resume Content Analysis**: When you upload a file the app now inspects the actual resume text even if AI is disabled. Keyword matching, word‑count, and basic structure heuristics drive the scores and suggestions so results vary per document.
4. **Smart Analysis**: Keywords and insights are cached to avoid repeated API calls

### Demo Mode
- On page load a sample text resume is selected automatically; clicking Analyze will run the heuristic engine against this text, so you can see non‑hardcoded results immediately.
- Uploading your own file will also produce live analysis based on its content.

### Fallback Mechanism

If the AI service fails or is not configured:
- The app automatically falls back to hardcoded keywords
- All functionality continues to work normally
- No changes required from the user

## API Usage and Costs

### OpenAI
- **Free Tier**: $5 free credit (expires after 3 months)
- **Pricing**: Pay-as-you-go (typically $0.50-$2 per 1M tokens)
- **Best For**: High quality, versatile AI

### Google Gemini
- **Free Tier**: Limited free usage
- **Pricing**: Pay-as-you-go
- **Best For**: Google ecosystem integration

### HuggingFace
- **Free Tier**: Available with usage limits
- **Pricing**: Pay-as-you-go
- **Best For**: Open-source models

## Important Security Notes

⚠️ **Never commit your API key to version control!**

1. **Local Development**: 
   - Keep API keys in `config.js` locally only
   - Add `config.js` to `.gitignore`

2. **Production Deployment**:
   - Use environment variables instead
   - Never expose API keys in frontend code
   - Consider using a backend proxy for API calls

3. **Safety**:
   - Regenerate API keys if accidentally exposed
   - Monitor API usage for unexpected charges
   - Set usage limits in your AI provider's dashboard

## Architecture

The application uses **MVC (Model-View-Controller)** pattern:

- **Model** (`model.js`): Handles data and business logic
  - Integrates with AI service
  - Manages analysis results
  - Provides fallback mechanisms

- **View** (`view.js`): Manages the UI
  - Renders results
  - Handles DOM updates
  - Binds events

- **Controller** (`controller.js`): Coordinates Model and View
  - Handles user interactions
  - Makes async calls to Model
  - Updates View with results

- **AI Service** (`ai-service.js`): Manages AI integration
  - Communicates with AI APIs
  - Caches results
  - Handles errors gracefully

## Troubleshooting

### "AI Service is disabled"
- Check that `AI_CONFIG.ENABLED` is set to `true` in `config.js`

### API Key Error
- Verify your API key is correct and not expired
- Check that you're using the correct provider
- Ensure you have billing enabled (if required)

### Empty Keywords Returned
- The model might have rate limits
- Try again in a few moments
- Check your API quota

### Application Still Works Despite API Error
- This is intended! The fallback keywords are used
- Check browser console for error messages
- Verify your API configuration

## Customization

### Add More Job Roles

1. Update `jobRoleNames` in `model.js`:
```javascript
this.jobRoleNames = {
    // ... existing roles
    data_engineer: "Data Engineer"
};
```

2. Add option in `index.html`:
```html
<option value="data_engineer">Data Engineer</option>
```

3. Add fallback keywords in `model.js`:
```javascript
this.keywordMap = {
    // ... existing mappings
    data_engineer: ["SQL", "Python", "ETL", "Spark", ...]
};
```

## Performance Tips

1. **Caching**: Keywords and insights are cached to reduce API calls
2. **Async Loading**: Analysis happens asynchronously (2.5 second delay)
3. **Error Handling**: Graceful fallbacks prevent app crashes

## Future Enhancements

- [ ] Backend proxy for secure API key handling
- [ ] Support for more AI providers
- [ ] Batch analysis for multiple resumes
- [ ] Custom training data for specific industries
- [ ] Integration with resume parsing APIs

## Support

For issues or questions:
1. Check the browser console for error messages
2. Verify your API configuration in `config.js`
3. Test with fallback keywords (disable AI)
4. Review the AI provider's documentation

---

**Happy analyzing! 🚀**
