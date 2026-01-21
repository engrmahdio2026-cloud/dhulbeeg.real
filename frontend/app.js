// Main Application Controller
class AppController {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadInitialPage();
        this.checkBackendHealth();
    }

    setupEventListeners() {
        // Navigation clicks
        document.addEventListener('click', (e) => {
            // Handle navigation links
            if (e.target.matches('[data-page]')) {
                e.preventDefault();
                const page = e.target.getAttribute('data-page');
                authManager.loadPage(page);
            }

            // Handle buttons with data-page attribute
            if (e.target.closest('[data-page]')) {
                const btn = e.target.closest('[data-page]');
                e.preventDefault();
                const page = btn.getAttribute('data-page');
                authManager.loadPage(page);
            }

            // Mobile menu toggle
            if (e.target.closest('#menuToggle')) {
                const navLinks = document.getElementById('navLinks');
                navLinks.classList.toggle('active');
            }
        });

        // Handle Escape key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                authManager.closeAllModals();
            }
        });
    }

    loadInitialPage() {
        // Check URL hash for page
        const hash = window.location.hash.substring(1) || 'home';
        authManager.loadPage(hash);

        // Update URL hash on page change
        window.addEventListener('hashchange', () => {
            const newHash = window.location.hash.substring(1) || 'home';
            if (newHash !== window.currentPage) {
                authManager.loadPage(newHash);
            }
        });
    }

    async checkBackendHealth() {
        try {
            const health = await api.healthCheck();
            if (health) {
                console.log('✅ Backend is running:', health.message);
            } else {
                console.warn('⚠️ Backend health check failed');
                authManager.showNotification(
                    'Unable to connect to server. Please check if backend is running.',
                    'error'
                );
            }
        } catch (error) {
            console.error('Backend connection error:', error);
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new AppController();
});