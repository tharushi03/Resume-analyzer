// Server-side AI proxy for Vercel
// Receives POST requests from the client and forwards them to the configured
// AI provider using server-side environment variables for API keys.

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { provider = 'openai', endpoint, body } = req.body || {};
    if (!endpoint) return res.status(400).json({ error: 'Missing endpoint' });

    try {
        let baseURL;
        let apiKey;
        if (provider === 'openai') {
            baseURL = 'https://api.openai.com';
            apiKey = process.env.OPENAI_API_KEY;
        } else if (provider === 'google') {
            baseURL = 'https://generativelanguage.googleapis.com';
            apiKey = process.env.GOOGLE_API_KEY;
        } else if (provider === 'huggingface') {
            baseURL = 'https://api-inference.huggingface.co';
            apiKey = process.env.HUGGINGFACE_API_KEY;
        } else {
            return res.status(400).json({ error: 'Unsupported provider' });
        }

        if (!apiKey) {
            return res.status(500).json({ error: `Server missing API key for ${provider}` });
        }

        const url = `${baseURL}${endpoint}`;

        const fetchOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body || {})
        };

        // Add provider-specific auth
        if (provider === 'openai') {
            fetchOptions.headers['Authorization'] = `Bearer ${apiKey}`;
        } else if (provider === 'huggingface') {
            fetchOptions.headers['Authorization'] = `Bearer ${apiKey}`;
        }

        const resp = await fetch(url, fetchOptions);
        const text = await resp.text();

        // Try to parse JSON; otherwise return raw text
        try {
            const json = JSON.parse(text);
            res.status(resp.status).json(json);
        } catch (e) {
            res.status(resp.status).send(text);
        }
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({ error: 'Proxy failed', details: String(error) });
    }
}
