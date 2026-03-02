/**
 * View - Handles all UI rendering and DOM manipulation
 */
class ResumeView {
    constructor() {
        // Upload section elements
        this.uploadArea = document.getElementById('uploadArea');
        this.browseBtn = document.getElementById('browseBtn');
        this.resumeFile = document.getElementById('resumeFile');
        this.analyzeBtn = document.getElementById('analyzeBtn');
        this.fileInfo = document.getElementById('fileInfo');
        this.fileName = document.getElementById('fileName');
        this.fileSize = document.getElementById('fileSize');
        this.loadingIndicator = document.getElementById('loadingIndicator');
        this.jobRoleSelect = document.getElementById('jobRole');
        
        // Results section elements
        this.aiResults = document.getElementById('aiResults');
        this.resultsIntro = document.getElementById('resultsIntro');
        this.overallScore = document.getElementById('overallScore');
        this.scoreText = document.getElementById('scoreText');
        this.scoreBar = document.getElementById('scoreBar');
        this.keywordScore = document.getElementById('keywordScore');
        this.contentScore = document.getElementById('contentScore');
        this.structureScore = document.getElementById('structureScore');
        this.keywordList = document.getElementById('keywordList');
        this.contentSuggestions = document.getElementById('contentSuggestions');
        this.aiInsightText = document.getElementById('aiInsightText');
    }
    
    // Event binding methods
    onUploadAreaClick(handler) {
        this.uploadArea.addEventListener('click', handler);
    }
    
    onBrowseClick(handler) {
        this.browseBtn.addEventListener('click', handler);
    }
    
    onFileSelect(handler) {
        this.resumeFile.addEventListener('change', handler);
    }
    
    onAnalyzeClick(handler) {
        this.analyzeBtn.addEventListener('click', handler);
    }
    
    onJobRoleChange(handler) {
        this.jobRoleSelect.addEventListener('change', handler);
    }
    
    onUploadAreaDragOver(handler) {
        this.uploadArea.addEventListener('dragover', handler);
    }
    
    onUploadAreaDragLeave(handler) {
        this.uploadArea.addEventListener('dragleave', handler);
    }
    
    onUploadAreaDrop(handler) {
        this.uploadArea.addEventListener('drop', handler);
    }
    
    // File input methods
    openFileDialog() {
        this.resumeFile.click();
    }
    
    getSelectedFile() {
        return this.resumeFile.files.length > 0 ? this.resumeFile.files[0] : null;
    }
    
    setFileInput(file) {
        this.resumeFile.files = file;
    }
    
    getJobRole() {
        return this.jobRoleSelect.value;
    }
    
    setJobRole(role) {
        this.jobRoleSelect.value = role;
    }
    
    // Upload area styling
    highlightUploadArea() {
        this.uploadArea.style.backgroundColor = '#e8f4fc';
        this.uploadArea.style.borderColor = '#2980b9';
    }
    
    resetUploadAreaStyle() {
        this.uploadArea.style.backgroundColor = '#f8fafc';
        this.uploadArea.style.borderColor = '#3498db';
    }
    
    // File info display
    showFileInfo(fileName, fileSize) {
        this.fileName.textContent = fileName;
        this.fileSize.textContent = fileSize;
        this.fileInfo.style.display = 'block';
    }
    
    hideFileInfo() {
        this.fileInfo.style.display = 'none';
    }
    
    // Loading and results display
    showLoading() {
        this.loadingIndicator.style.display = 'block';
        this.analyzeBtn.disabled = true;
        this.resultsIntro.style.display = 'none';
    }
    
    hideLoading() {
        this.loadingIndicator.style.display = 'none';
        this.analyzeBtn.disabled = false;
    }
    
    enableAnalyzeButton() {
        this.analyzeBtn.disabled = false;
    }
    
    disableAnalyzeButton() {
        this.analyzeBtn.disabled = true;
    }
    
    // Results rendering
    displayResults(results) {
        this.aiResults.style.display = 'block';
        this.resultsIntro.style.display = 'none';
        
        // Update overall score
        this.overallScore.textContent = results.overallScore + '/10';
        this.scoreText.textContent = results.scoreText;
        
        // Animate score bar
        setTimeout(() => {
            this.scoreBar.style.width = results.overallScore * 10 + '%';
        }, 100);
        
        // Update individual scores
        this.keywordScore.textContent = results.keywordScore + '/10';
        this.contentScore.textContent = results.contentScore + '/10';
        this.structureScore.textContent = results.structureScore + '/10';
        
        // Update keywords
        this.renderKeywords(results.presentKeywords, results.missingKeywords);
        
        // Update suggestions
        this.renderSuggestions(results.suggestions);
        
        // Update AI insight
        this.aiInsightText.textContent = results.aiInsight;
    }
    
    renderKeywords(presentKeywords, missingKeywords) {
        this.keywordList.innerHTML = '';
        
        presentKeywords.forEach(keyword => {
            const keywordEl = document.createElement('div');
            keywordEl.className = 'keyword';
            keywordEl.textContent = keyword;
            this.keywordList.appendChild(keywordEl);
        });
        
        missingKeywords.forEach(keyword => {
            const keywordEl = document.createElement('div');
            keywordEl.className = 'keyword missing';
            keywordEl.textContent = keyword;
            this.keywordList.appendChild(keywordEl);
        });
    }
    
    renderSuggestions(suggestions) {
        this.contentSuggestions.innerHTML = '';
        
        suggestions.forEach(suggestion => {
            const li = document.createElement('li');
            li.textContent = suggestion;
            this.contentSuggestions.appendChild(li);
        });
    }
    
    showResultsIntro(message) {
        this.aiResults.style.display = 'none';
        this.resultsIntro.style.display = 'block';
        this.resultsIntro.innerHTML = message;
    }
    
    clearResults() {
        // Reset all result displays
        this.aiResults.style.display = 'none';
        this.overallScore.textContent = '0';
        this.scoreText.textContent = 'Analyzing...';
        this.scoreBar.style.width = '0%';
        this.keywordScore.textContent = '0/10';
        this.contentScore.textContent = '0/10';
        this.structureScore.textContent = '0/10';
        this.keywordList.innerHTML = '';
        this.contentSuggestions.innerHTML = '';
        this.aiInsightText.textContent = '';
    }
}
