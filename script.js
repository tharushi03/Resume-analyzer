/**
 * Application Entry Point - Initialize MVC Architecture with optional AI integration
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AI Service from configuration
    const aiService = initializeAIService();
    
    // Instantiate MVC components
    const model = new ResumeModel(aiService);
    const view = new ResumeView();
    const controller = new ResumeController(model, view);

    // --- Botpress Webchat integration (floating iframe + toggle) ---
    (function addBotpressWebchat() {
        const bpUrl = 'https://cdn.botpress.cloud/webchat/v3.6/shareable.html?configUrl=https://files.bpcontent.cloud/2026/02/27/03/20260227035302-7NY7L8RJ.json';

        // Create chat container
        const chatContainer = document.createElement('div');
        chatContainer.className = 'bp-chat-container';
        chatContainer.id = 'bpChatContainer';

        const iframe = document.createElement('iframe');
        iframe.className = 'bp-chat-iframe';
        iframe.id = 'bpChatIframe';
        iframe.src = bpUrl;
        iframe.title = 'Botpress Chat';

        chatContainer.appendChild(iframe);
        document.body.appendChild(chatContainer);

        // Create toggle button
        const toggle = document.createElement('button');
        toggle.className = 'bp-chat-toggle';
        toggle.id = 'bpChatToggle';
        toggle.setAttribute('aria-expanded', 'false');
        toggle.innerHTML = '<i class="fas fa-comment-dots"></i>';
        document.body.appendChild(toggle);

        // Toggle logic
        function openChat() {
            chatContainer.style.display = 'block';
            toggle.setAttribute('aria-expanded', 'true');
            document.body.classList.add('bp-chat-open');
        }

        function closeChat() {
            chatContainer.style.display = 'none';
            toggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('bp-chat-open');
        }

        let isOpen = false;
        toggle.addEventListener('click', function() {
            isOpen = !isOpen;
            if (isOpen) openChat(); else closeChat();
        });

        // Close chat when user presses Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && isOpen) {
                isOpen = false;
                closeChat();
            }
        });
    })();
});
