# Quick Start: Deploy to GitHub Pages

## 5-Minute Setup

### 1️⃣ Create GitHub Repository
- Go to https://github.com/new
- Name: `resume-analyzer`
- Make it **Public**
- Click "Create repository"

### 2️⃣ Upload Your Files

```bash
cd "c:\Users\HP\OneDrive\Desktop\web\resume analyser"

git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/resume-analyzer.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

### 3️⃣ Enable GitHub Pages
- Go to your repository
- Click **Settings** → **Pages**
- Source: **main** branch
- Click **Save**
- Wait 1-2 minutes

### 4️⃣ Visit Your App
```
https://YOUR_USERNAME.github.io/resume-analyzer/
```

---

## ✅ You're Done!

Your resume analyzer is now live! 🎉

### What users can do:
- ✅ Upload resumes
- ✅ Get AI analysis
- ✅ See detailed feedback
- ✅ Works on mobile

### What's disabled for security:
- ❌ AI API features (uses fallback keywords instead)

---

## Features Available

| Feature | Status |
|---------|--------|
| Upload Resume | ✅ Works |
| Analyze Resume | ✅ Works |
| Keyword Matching | ✅ Works (fallback) |
| Score Display | ✅ Works |
| Suggestions | ✅ Works |
| AI Integration | ⚠️ Disabled (for security) |

---

## Want to Enable AI Features?

See **GITHUB_PAGES_GUIDE.md** for secure solutions:
1. Backend proxy (recommended)
2. Private backend server
3. GitHub Actions secrets

---

## Update Your App

Make changes and push to update:

```bash
git add .
git commit -m "Your changes"
git push
```

GitHub Pages updates automatically in 1-2 minutes.

---

## Sharing Your App

Share this link:
```
https://YOUR_USERNAME.github.io/resume-analyzer/
```

Perfect for:
- Portfolio projects
- Interviews
- Resumes
- Demo purposes

---

## FAQ

**Q: Can I use my own domain?**
A: Yes! Settings → Pages → Custom domain

**Q: Is it really free?**
A: Yes! GitHub Pages is completely free for public repos.

**Q: Can others see my code?**
A: Yes, it's public. That's why we don't store API keys there!

**Q: How do I keep my API key secret?**
A: Use a backend server or keep AI disabled. See GITHUB_PAGES_GUIDE.md

**Q: Can I make the repo private?**
A: Yes, but GitHub Pages is only free for public repos (need pro account for private)

---

## Files in This Project

```
📁 resume-analyzer/
├── 📄 index.html              Main page
├── 🎨 styles.css              Styling
├── ⚙️ config.js                Configuration
├── 🤖 ai-service.js            AI integration
├── 📊 model.js                 Data logic
├── 👁️ view.js                  UI display
├── 🎮 controller.js            Event handling
├── 📝 script.js                App init
├── 📖 README.md                Full guide
├── 📖 GITHUB_PAGES_GUIDE.md    Hosting guide
├── 📋 .gitignore               Git ignore rules
└── ⚡ (This file)              Quick start
```

---

## Support

1. Check **README.md** for details
2. Check **GITHUB_PAGES_GUIDE.md** for advanced options
3. Visit https://pages.github.com for GitHub Pages help

---

**Congratulations! Your app is now online!** 🚀

