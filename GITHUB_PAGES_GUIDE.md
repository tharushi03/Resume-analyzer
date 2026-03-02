# GitHub Pages Hosting Guide




### Solution 2: Backend Proxy Server (Secure)

Create a backend server to handle AI API calls:

**Option A: Using Node.js + Express**

File: `server.js`
```javascript
const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Store API key securely on backend
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post('/api/keywords', async (req, res) => {
    const { jobRole, jobRoleName } = req.body;
    
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: [{
                    role: 'user',
                    content: `Generate 10 keywords for ${jobRoleName}. Return as JSON array only.`
                }],
                max_tokens: 150
            },
            {
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`
                }
            }
        );
        
        res.json({ keywords: response.data.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch keywords' });
    }
});

app.listen(3000, () => console.log('Server ready on port 3000'));
```

Deploy to:
- **Heroku** (free tier available)
- **Railway** (free tier)
- **Render** (free tier)
- **Replit** (free tier)
- **** (free tier)

**Frontend Changes:**
```javascript
// Update AIService to call your backend instead
async fetchFromOpenAI(jobRole, jobRoleName) {
    const response = await fetch('https://your-backend.com/api/keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobRole, jobRoleName })
    });
    // ... handle response
}
```

✅ **Pros**: Secure, no API key exposure, full AI features  
❌ **Cons**: Requires backend server setup

---

