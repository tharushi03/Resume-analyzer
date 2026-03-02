/**
 * Model - Handles data and business logic
 */
class ResumeModel {
    constructor(aiService = null) {
        this.selectedFile = null;
        this.jobRole = 'software_engineer';
        this.analysisResults = null;
        this.aiService = aiService; // Optional AI service for dynamic keyword generation
        
        this.jobRoleNames = {
            software_engineer: "Software Engineer",
            data_scientist: "Data Scientist",
            product_manager: "Product Manager",
            marketing: "Marketing Specialist",
            ux_designer: "UX Designer"
        };
        
        // Fallback keywords (used when AI service is not available or for quick loading)
        this.keywordMap = {
            software_engineer: ["JavaScript", "Python", "React", "Node.js", "AWS", "Docker", "Git", "REST APIs", "Agile", "Testing"],
            data_scientist: ["Python", "Machine Learning", "SQL", "Statistics", "Pandas", "TensorFlow", "Data Visualization", "Big Data", "A/B Testing", "Deep Learning"],
            product_manager: ["Product Strategy", "User Research", "Roadmapping", "Agile", "Go-to-Market", "Stakeholder Management", "Metrics", "User Stories", "Competitive Analysis", "Prototyping"],
            marketing: ["SEO", "Content Marketing", "Social Media", "Google Analytics", "Email Campaigns", "Conversion Rate", "Brand Awareness", "PPC", "Marketing Automation", "ROI"],
            ux_designer: ["User Research", "Wireframing", "Prototyping", "Figma", "Usability Testing", "Information Architecture", "Interaction Design", "User Flows", "Design Systems", "Accessibility"]
        };
    }
    
    setFile(file) {
        this.selectedFile = file;
    }
    
    getFile() {
        return this.selectedFile;
    }
    
    setJobRole(role) {
        this.jobRole = role;
    }
    
    getJobRole() {
        return this.jobRole;
    }
    
    getJobRoleName(role = this.jobRole) {
        return this.jobRoleNames[role] || this.jobRoleNames.software_engineer;
    }
    
    /**
     * Get keywords for a job role - uses AI service if available, falls back to hardcoded keywords
     * @async
     */
    async getKeywordsForRole(role = this.jobRole) {
        // Use AI service if available
        if (this.aiService) {
            try {
                const keywords = await this.aiService.getKeywordsForRole(role, this.getJobRoleName(role));
                return keywords;
            } catch (error) {
                console.warn('AI Service failed, using fallback keywords:', error);
            }
        }
        
        // Fallback to hardcoded keywords
        return this.keywordMap[role] || this.keywordMap.software_engineer;
    }
    
    formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' bytes';
        else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        else return (bytes / 1048576).toFixed(1) + ' MB';
    }
    
    /**
     * Generate analysis results - now supports AI integration
     * @async
     */
    /**
     * Generate analysis results. If resumeText is provided and an AI service is
     * available the analysis will be performed by the AI service. Otherwise a
     * randomized fallback is used (as in the original demo).
     * @param {string|null} resumeText - Plain‑text representation of the resume
     * @returns {Promise<Object>} analysis results
     */
    async generateAnalysisResults(resumeText = null) {
        const keywords = await this.getKeywordsForRole();

        // Try using AI service for comprehensive analysis when text is available
        if (this.aiService && resumeText) {
            try {
                const aiResults = await this.aiService.analyzeResume(resumeText, this.getJobRoleName());
                // ensure required fields exist by falling back to defaults where missing
                const result = Object.assign({
                    overallScore: 0,
                    keywordScore: 0,
                    contentScore: 0,
                    structureScore: 0,
                    scoreText: this.generateScoreText(0),
                    presentKeywords: [],
                    missingKeywords: [],
                    suggestions: [],
                    aiInsight: this.getDefaultInsight(keywords)
                }, aiResults);
                this.analysisResults = result;
                return result;
            } catch (error) {
                console.warn('AI resume analysis failed:', error);
                // fall through to heuristic fallback
            }
        }

        // Heuristic analysis if we have resume text (and either no AI or it failed)
        if (resumeText) {
            const lower = resumeText.toLowerCase();
            const present = [];
            const missing = [];

            keywords.forEach(kw => {
                if (lower.includes(kw.toLowerCase())) {
                    present.push(kw);
                } else {
                    missing.push(kw);
                }
            });

            const keywordScoreValue = Math.min(10, Math.round((present.length / keywords.length) * 10));

            // content score based on length (100 words -> 5, 200 words -> 10)
            const wordCount = resumeText.trim().split(/\s+/).length;
            let contentScoreValue = Math.min(10, Math.round(wordCount / 20));
            if (contentScoreValue < 3) contentScoreValue = 3;

            // structure score based on bullet points / line breaks
            const bullets = (resumeText.match(/[-•\*]\s+/g) || []).length;
            const lines = resumeText.split(/\r?\n/).length;
            let structureScoreValue = Math.min(10, Math.round(((bullets + lines/5) / 10)));
            if (structureScoreValue < 3) structureScoreValue = 3;

            const overallScoreValue = Math.round((keywordScoreValue + contentScoreValue + structureScoreValue) / 3);

            const scoreText = this.generateScoreText(overallScoreValue);

            const suggestions = [];
            if (missing.length > 0) {
                suggestions.push(`Consider including keywords such as ${missing.slice(0,3).join(', ')}`);
            }
            if (wordCount < 150) {
                suggestions.push('Provide more details about your experience and accomplishments');
            }
            if (bullets < 3) {
                suggestions.push('Use bullet points to improve readability');
            }

            const aiInsight = this.getDefaultInsight(keywords);

            this.analysisResults = {
                overallScore: overallScoreValue,
                keywordScore: keywordScoreValue,
                contentScore: contentScoreValue,
                structureScore: structureScoreValue,
                scoreText: scoreText,
                presentKeywords: present.slice(0, keywordScoreValue),
                missingKeywords: missing,
                suggestions: suggestions,
                aiInsight: aiInsight
            };

            return this.analysisResults;
        }

        // Fallback random sample (original demo logic)
        const keywordScoreValue = Math.floor(Math.random() * 4) + 7; // 7-10
        const contentScoreValue = Math.floor(Math.random() * 5) + 5; // 5-10
        const structureScoreValue = Math.floor(Math.random() * 5) + 5; // 5-10
        const overallScoreValue = Math.round((keywordScoreValue + contentScoreValue + structureScoreValue) / 3);

        const scoreText = this.generateScoreText(overallScoreValue);

        const presentKeywords = keywords.slice(0, keywordScoreValue);
        const missingKeywords = keywords.slice(keywordScoreValue);

        const suggestions = [
            "Use more action-oriented verbs to start bullet points",
            "Quantify achievements with specific numbers and metrics",
            `Tailor your summary to highlight relevant ${this.getJobRoleName()} experience`,
            "Include more industry-specific terminology",
            "Add a projects section to showcase hands-on experience"
        ];

        // Generate AI insight if AI service is available
        let aiInsight;
        if (this.aiService) {
            try {
                aiInsight = await this.aiService.generateInsight(this.getJobRoleName(), keywords);
            } catch (error) {
                console.warn('Failed to generate AI insight:', error);
                aiInsight = this.getDefaultInsight(keywords);
            }
        } else {
            aiInsight = this.getDefaultInsight(keywords);
        }

        this.analysisResults = {
            overallScore: overallScoreValue,
            keywordScore: keywordScoreValue,
            contentScore: contentScoreValue,
            structureScore: structureScoreValue,
            scoreText: scoreText,
            presentKeywords: presentKeywords,
            missingKeywords: missingKeywords,
            suggestions: suggestions,
            aiInsight: aiInsight
        };

        return this.analysisResults;
    }
    
    generateScoreText(score) {
        const jobRoleName = this.getJobRoleName();
        
        if (score >= 9) {
            return `Excellent resume! Strong candidate for ${jobRoleName} roles.`;
        } else if (score >= 7) {
            return 'Good resume. Some improvements could make it stand out more.';
        } else if (score >= 5) {
            return `Average resume. Needs several improvements for ${jobRoleName} roles.`;
        } else {
            return `Needs significant improvement for ${jobRoleName} roles.`;
        }
    }
    
    /**
     * Default insight when AI service is not available
     * @private
     */
    getDefaultInsight(keywords) {
        const topKeywords = keywords.slice(0, 3).join(', ');
        return `For ${this.getJobRoleName()} roles, focus on highlighting ${topKeywords}. Your resume shows good structure but could benefit from more quantifiable achievements. Consider adding specific metrics and technical examples.`;
    }
    
    setAIService(aiService) {
        this.aiService = aiService;
    }
    
    clearResults() {
        this.analysisResults = null;
    }
    
    getAnalysisResults() {
        return this.analysisResults;
    }
}
