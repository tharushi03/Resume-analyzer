/**
 * Controller - Handles event coordination between Model and View
 */
class ResumeController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        
        this.initEventListeners();
        this.initializeDemoState();
    }
    
    initEventListeners() {
        // Upload area events
        this.view.onUploadAreaClick(() => this.view.openFileDialog());
        this.view.onBrowseClick(() => this.view.openFileDialog());
        
        // File selection
        this.view.onFileSelect((e) => this.handleFileSelect(e));
        
        // Drag and drop
        this.view.onUploadAreaDragOver((e) => this.handleDragOver(e));
        this.view.onUploadAreaDragLeave(() => this.handleDragLeave());
        this.view.onUploadAreaDrop((e) => this.handleDrop(e));
        
        // Analyze button
        this.view.onAnalyzeClick(() => this.handleAnalyze());
        
        // Job role change
        this.view.onJobRoleChange((e) => this.handleJobRoleChange(e));
    }
    
    handleFileSelect(e) {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            this.model.setFile(file);
            this.updateFileDisplay();
        }
    }
    
    handleDragOver(e) {
        e.preventDefault();
        this.view.highlightUploadArea();
    }
    
    handleDragLeave() {
        this.view.resetUploadAreaStyle();
    }
    
    handleDrop(e) {
        e.preventDefault();
        this.view.resetUploadAreaStyle();
        
        if (e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            this.model.setFile(file);
            this.view.setFileInput(e.dataTransfer.files);
            this.updateFileDisplay();
        }
    }
    
    updateFileDisplay() {
        const file = this.model.getFile();
        if (file) {
            const formattedSize = this.model.formatFileSize(file.size);
            this.view.showFileInfo(file.name, formattedSize);
            this.view.enableAnalyzeButton();
        }
    }
    
    handleJobRoleChange(e) {
        this.model.setJobRole(e.target.value);
    }
    
    /**
     * Read the selected file as text. This uses FileReader and resolves with a
     * string; for non-text files the output might be gibberish but the AI prompt
     * will still receive something to work with.
     */
    readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error);
            reader.readAsText(file);
        });
    }

    async handleAnalyze() {
        if (!this.model.getFile()) {
            alert('Please select a resume file first.');
            return;
        }

        // Clear previous results
        this.model.clearResults();
        this.view.clearResults();
        this.view.showLoading();

        const file = this.model.getFile();
        let contentPromise;
        if (file && file.isDemo && this.demoText) {
            // use our sample text for demo files
            contentPromise = Promise.resolve(this.demoText);
        } else {
            contentPromise = this.readFileAsText(file);
        }

        try {
            const content = await contentPromise;
            // simulate a short delay for UX
            setTimeout(async () => {
                try {
                    const results = await this.model.generateAnalysisResults(content);
                    this.view.hideLoading();
                    this.view.displayResults(results);
                    // Scroll to results
                    this.scrollToResults();
                } catch (innerError) {
                    console.error('Analysis error:', innerError);
                    this.view.hideLoading();
                    alert('Error analyzing resume. Please try again.');
                }
            }, 500);
        } catch (readError) {
            console.error('File read error:', readError);
            this.view.hideLoading();
            alert('Unable to read the resume file. Please try a different file.');
        }
    }
    
    scrollToResults() {
        const resultsSection = document.querySelector('.results-section');
        if (resultsSection) {
            setTimeout(() => {
                resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    }
    
    initializeDemoState() {
        // Demo sample text used when no real file is selected
        this.demoText = `John Doe\nSoftware Engineer\nExperienced in JavaScript, Node.js, and React.\n- Developed multiple web applications\n- Collaborated with cross-functional teams\nWorked on AWS and Docker deployments.`;

        // Auto-select a fake file for demo after 1 second
        setTimeout(() => {
            const demoFile = { name: "sample_resume.txt", size: this.demoText.length, isDemo: true };
            this.model.setFile(demoFile);
            const formattedSize = this.model.formatFileSize(demoFile.size);
            this.view.showFileInfo(demoFile.name, formattedSize);
            this.view.enableAnalyzeButton();

            // Show a hint
            this.view.showResultsIntro("Click <strong>Analyze with AI</strong> to see how the AI evaluates resumes. Try changing the target job role for different insights.");
        }, 1000);
    }
}
