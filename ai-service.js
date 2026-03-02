/**
 * AI Service - Handles integration with AI APIs for dynamic content generation
 */
class AIService {
    constructor(apiKey, provider = 'openai') {
        this.apiKey = apiKey;
        this.provider = provider;
        this.baseURL = this.getBaseURL(provider);
        this.cache = new Map(); // Cache to avoid repeated API calls
    }
    
    getBaseURL(provider) {
        const baseURLs = {
            openai: 'https://api.openai.com/v1',
            google: 'https://generativelanguage.googleapis.com/v1beta',
            huggingface: 'https://api-inference.huggingface.co'
        };
        return baseURLs[provider] || baseURLs.openai;
    }
    
    /**
     * Fetch keywords for a specific job role using AI
     * @param {string} jobRole - The job role (e.g., 'software_engineer')
     * @param {string} jobRoleName - The readable job role name (e.g., 'Software Engineer')
     * @returns {Promise<Array>} - Array of relevant keywords
     */
    async getKeywordsForRole(jobRole, jobRoleName) {
        // Check cache first
        if (this.cache.has(jobRole)) {
            return this.cache.get(jobRole);
        }
        
        try {
            const keywords = await this.fetchFromAI(jobRole, jobRoleName);
            
            // Cache the result
            this.cache.set(jobRole, keywords);
            
            return keywords;
        } catch (error) {
            console.error('AI Service Error:', error);
            return this.getFallbackKeywords(jobRole); // Return fallback on error
        }
    }
    
    /**
     * Fetch keywords from the AI API
     * @private
     */
    async fetchFromAI(jobRole, jobRoleName) {
        if (this.provider === 'openai') {
            return await this.fetchFromOpenAI(jobRole, jobRoleName);
        } else if (this.provider === 'google') {
            return await this.fetchFromGoogle(jobRole, jobRoleName);
        } else if (this.provider === 'huggingface') {
            return await this.fetchFromHuggingFace(jobRole, jobRoleName);
        }
        
        return this.getFallbackKeywords(jobRole);
    }
    
    /**
     * Fetch from OpenAI API
     * @private
     */
    async fetchFromOpenAI(jobRole, jobRoleName) {
        const prompt = `Generate exactly 10 relevant technical and professional keywords for a ${jobRoleName} position. 
        Format: Return only a JSON array of keywords as strings, like ["keyword1", "keyword2", ...]. 
        No explanations, just the JSON array.`;
        
        const payload = {
            model: 'gpt-3.5-turbo',
            messages: [ { role: 'user', content: prompt } ],
            temperature: 0.7,
            max_tokens: 150
        };

        let data;
        // If a proxy is configured in `config.js`, route the request through it
        if (typeof AI_CONFIG !== 'undefined' && AI_CONFIG.USE_PROXY) {
            data = await this.proxyFetch('/v1/chat/completions', payload);
        } else {
            const response = await fetch(`${this.baseURL}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`OpenAI API error: ${response.statusText}`);
            }

            data = await response.json();
        }

        const content = data.choices[0].message.content;
        
        try {
            // Extract JSON array from response
            const jsonMatch = content.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
        } catch (e) {
            console.warn('Failed to parse AI response:', content);
        }
        
        return this.getFallbackKeywords(jobRole);
    }
    
    /**
     * Fetch from Google Gemini API
     * @private
     */
    async fetchFromGoogle(jobRole, jobRoleName) {
        const prompt = `Generate exactly 10 relevant technical and professional keywords for a ${jobRoleName} position. 
        Format: Return only a JSON array of keywords as strings, like ["keyword1", "keyword2", ...]. 
        No explanations, just the JSON array.`;
        
        const response = await fetch(`${this.baseURL}/models/gemini-pro:generateContent?key=${this.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: prompt
                            }
                        ]
                    }
                ]
            })
        });
        
        if (!response.ok) {
            throw new Error(`Google Gemini API error: ${response.statusText}`);
        }
        
        const data = await response.json();
        const content = data.candidates[0].content.parts[0].text;
        
        try {
            const jsonMatch = content.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
        } catch (e) {
            console.warn('Failed to parse AI response:', content);
        }
        
        return this.getFallbackKeywords(jobRole);
    }
    
    /**
     * Fetch from HuggingFace API
     * @private
     */
    async fetchFromHuggingFace(jobRole, jobRoleName) {
        const prompt = `Generate exactly 10 relevant technical and professional keywords for a ${jobRoleName} position. 
        Return only a JSON array like: ["keyword1", "keyword2", ...]`;
        
        const response = await fetch(`${this.baseURL}/models/mistralai/Mistral-7B-Instruct-v0.1`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                inputs: prompt
            })
        });
        
        if (!response.ok) {
            throw new Error(`HuggingFace API error: ${response.statusText}`);
        }
        
        const data = await response.json();
        const content = Array.isArray(data) ? data[0].generated_text : data.generated_text;
        
        try {
            const jsonMatch = content.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
        } catch (e) {
            console.warn('Failed to parse AI response:', content);
        }
        
        return this.getFallbackKeywords(jobRole);
    }
    
    /**
     * Fallback keywords for when API is not available
     * @private
     */
    getFallbackKeywords(jobRole) {
        const fallbackKeywords = {
            software_engineer: ["JavaScript", "Python", "React", "Node.js", "AWS", "Docker", "Git", "REST APIs", "Agile", "Testing"],
            data_scientist: ["Python", "Machine Learning", "SQL", "Statistics", "Pandas", "TensorFlow", "Data Visualization", "Big Data", "A/B Testing", "Deep Learning"],
            product_manager: ["Product Strategy", "User Research", "Roadmapping", "Agile", "Go-to-Market", "Stakeholder Management", "Metrics", "User Stories", "Competitive Analysis", "Prototyping"],
            marketing: ["SEO", "Content Marketing", "Social Media", "Google Analytics", "Email Campaigns", "Conversion Rate", "Brand Awareness", "PPC", "Marketing Automation", "ROI"],
            ux_designer: ["User Research", "Wireframing", "Prototyping", "Figma", "Usability Testing", "Information Architecture", "Interaction Design", "User Flows", "Design Systems", "Accessibility"]
        };
        
        return fallbackKeywords[jobRole] || fallbackKeywords.software_engineer;
    }
    
    /**
     * Generate AI insights for resume analysis
     * @param {string} jobRoleName - The job role name
     * @param {Array} keywords - List of relevant keywords
     * @returns {Promise<string>} - AI-generated insight text
     */
    async generateInsight(jobRoleName, keywords) {
        const cacheKey = `insight_${jobRoleName}`;
        
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }
        
        try {
            const topKeywords = keywords.slice(0, 3).join(', ');
            const prompt = `Generate a brief personalized insight (1-2 sentences) for a resume for a ${jobRoleName} position. 
            Mention these key focus areas: ${topKeywords}. 
            Include advice about resume improvement. Be specific and actionable.`;
            
            const insight = await this.fetchInsightFromAI(prompt);
            
            this.cache.set(cacheKey, insight);
            return insight;
        } catch (error) {
            console.error('Failed to generate AI insight:', error);
            return this.getDefaultInsight(jobRoleName, keywords);
        }
    }
    
    /**
     * Fetch insight from AI
     * @private
     */
    async fetchInsightFromAI(prompt) {
        if (this.provider === 'openai') {
            return await this.fetchInsightFromOpenAI(prompt);
        }
        
        // Default fallback
        return null;
    }
    
    /**
     * Fetch insight from OpenAI
     * @private
     */
    async fetchInsightFromOpenAI(prompt) {
        const payload = {
            model: 'gpt-3.5-turbo',
            messages: [ { role: 'user', content: prompt } ],
            temperature: 0.7,
            max_tokens: 200
        };

        let data;
        if (typeof AI_CONFIG !== 'undefined' && AI_CONFIG.USE_PROXY) {
            data = await this.proxyFetch('/v1/chat/completions', payload);
        } else {
            const response = await fetch(`${this.baseURL}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`OpenAI API error: ${response.statusText}`);
            }

            data = await response.json();
        }

        return data.choices[0].message.content;
    }
    
    /**
     * Default fallback insight
     * @private
     */
    getDefaultInsight(jobRoleName, keywords) {
        const topKeywords = keywords.slice(0, 3).join(', ');
        return `For ${jobRoleName} roles, focus on highlighting ${topKeywords}. Your resume shows good structure but could benefit from more quantifiable achievements. Consider adding specific metrics and technical examples.`;
    }
    
    /**
     * Analyze a resume text for a specific job role. Returns an object that
     * mirrors the structure expected by the view/controller.
     * @param {string} resumeText - Plain-text content of the resume
     * @param {string} jobRoleName - Readable job role name (e.g. "Software Engineer")
     * @returns {Promise<Object>}
     */
    async analyzeResume(resumeText, jobRoleName) {
        const prompt = `You are a resume analysis assistant. A candidate has submitted the
following resume text:\n\n${resumeText}\n\nPlease evaluate this resume for a ${jobRoleName} position.
Return a JSON object with the following fields (use numbers 0-10 where
appropriate):\n1. overallScore\n2. keywordScore\n3. contentScore\n4. structureScore\n5. scoreText (a short sentence describing the overall score)\n6. presentKeywords (array of at least 5 keywords found in the resume)\n7. missingKeywords (array of at least 5 keywords relevant to the role but not
   found)\n8. suggestions (array of 3-5 actionable suggestions to improve the resume)\n9. aiInsight (one or two sentences of personal insight/advice)\n
Only output the JSON object, no explanatory text.`;

        if (this.provider === 'openai') {
            const raw = await this.fetchResumeAnalysisFromOpenAI(prompt);
            try {
                const jsonMatch = raw.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    return JSON.parse(jsonMatch[0]);
                }
            } catch (e) {
                console.warn('Failed to parse resume analysis response:', raw);
            }
        }
        // If we reach here or provider not supported, return fallback result
        return this.getFallbackAnalysis(jobRoleName);
    }

    /**
     * Internal helper for calling OpenAI resume analysis
     * @private
     */
    async fetchResumeAnalysisFromOpenAI(prompt) {
        const payload = {
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
            max_tokens: 600
        };

        let data;
        if (typeof AI_CONFIG !== 'undefined' && AI_CONFIG.USE_PROXY) {
            data = await this.proxyFetch('/v1/chat/completions', payload);
        } else {
            const response = await fetch(`${this.baseURL}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`OpenAI API error: ${response.statusText}`);
            }

            data = await response.json();
        }

        return data.choices[0].message.content;
    }

    /**
     * Helper for sending a request to the server-side proxy.
     * Proxy will attach the provider API key from server env vars.
     */
    async proxyFetch(endpoint, body) {
        const proxyEndpoint = (typeof AI_CONFIG !== 'undefined' && AI_CONFIG.PROXY_ENDPOINT) ? AI_CONFIG.PROXY_ENDPOINT : '/api/ai-proxy';
        const resp = await fetch(proxyEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ provider: this.provider, endpoint, body })
        });

        if (!resp.ok) {
            const text = await resp.text();
            throw new Error(`Proxy error: ${resp.status} ${text}`);
        }

        return await resp.json();
    }

    /**
     * Fallback analysis data when AI cannot be used
     * @private
     */
    getFallbackAnalysis(jobRoleName) {
        // simple generic blob; controller will still display something
        return {
            overallScore: 6,
            keywordScore: 6,
            contentScore: 6,
            structureScore: 6,
            scoreText: `This is a placeholder analysis for ${jobRoleName}.`,
            presentKeywords: [],
            missingKeywords: [],
            suggestions: [
                "Provide a clear summary.",
                "Use bullet points with accomplishments.",
                "Include relevant keywords for the role."
            ],
            aiInsight: "AI service unavailable; here is a generic suggestion."
        };
    }

    /**
     * Clear the cache
     */
    clearCache() {
        this.cache.clear();
    }
}
