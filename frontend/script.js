/* ==========================================================================
   DHULBEEG REAL ESTATE & LEGAL PLATFORM - MAIN SCRIPT
   Version: 3.0.0 | Total Lines: 4125
   ==========================================================================
   
   TABLE OF CONTENTS:
   
   1.  GLOBAL CONFIGURATION & CONSTANTS
   2.  APPLICATION INITIALIZATION
   3.  CORE UTILITIES
   4.  DOM ELEMENT CACHE & SELECTORS
   5.  THEME MANAGEMENT SYSTEM
   6.  LANGUAGE MANAGEMENT SYSTEM
   7.  NAVIGATION & SMOOTH SCROLL
   8.  LOADING SYSTEM & PROGRESS MANAGER
   9.  DATA MANAGEMENT & API INTEGRATION
   10. PROPERTY MANAGEMENT SYSTEM
   11. LEGAL SERVICES SYSTEM
   12. PORTFOLIO MANAGEMENT
   13. VIDEO GALLERY SYSTEM
   14. TEAM MANAGEMENT
   15. TESTIMONIALS SYSTEM
   16. CONTACT FORM & VALIDATION
   17. MAPS INTEGRATION (Leaflet)
   18. MODAL MANAGEMENT SYSTEM
   19. TOAST NOTIFICATION SYSTEM
   20. AUTHENTICATION SYSTEM
   21. SEARCH & FILTER SYSTEM
   22. REGIONS & LOCATIONS SYSTEM
   23. STATISTICS & ANALYTICS
   24. IMAGE GALLERY & LIGHTBOX
   25. FORM VALIDATION UTILITIES
   26. ANIMATIONS & TRANSITIONS
   27. RESPONSIVE BEHAVIORS
   28. PERFORMANCE OPTIMIZATIONS
   29. ERROR HANDLING & LOGGING
   30. EXPORTABLE MODULES
   
   ========================================================================== */

'use strict';

/* ==========================================================================
   1. GLOBAL CONFIGURATION & CONSTANTS
   ========================================================================== */

const DhulBeegConfig = {
    // API Configuration
    API_BASE_URL: 'https://api.dhulbeeg.com/v1',
    API_TIMEOUT: 30000,
    API_RETRY_ATTEMPTS: 3,

    // Local Storage Keys
    STORAGE_KEYS: {
        THEME: 'dhulbeeg_theme',
        LANGUAGE: 'dhulbeeg_language',
        USER_TOKEN: 'dhulbeeg_auth_token',
        USER_DATA: 'dhulbeeg_user_data',
        CART_ITEMS: 'dhulbeeg_cart_items',
        RECENT_VIEWS: 'dhulbeeg_recent_views',
        SEARCH_HISTORY: 'dhulbeeg_search_history',
        FORM_DATA: 'dhulbeeg_form_data',
        NOTIFICATIONS: 'dhulbeeg_notifications',
        SETTINGS: 'dhulbeeg_settings',
        SESSION_ID: 'dhulbeeg_session_id'
    },

    // Theme Configuration
    THEMES: {
        LIGHT: 'light',
        DARK: 'dark',
        AUTO: 'auto'
    },

    // Language Configuration
    LANGUAGES: {
        EN: { code: 'en', name: 'English', dir: 'ltr' },
        SO: { code: 'so', name: 'Somali', dir: 'ltr' },
        AR: { code: 'ar', name: 'Arabic', dir: 'rtl' }
    },

    // Currency Configuration
    CURRENCY: {
        SYMBOL: '$',
        CODE: 'USD',
        FORMAT: 'en-US',
        DECIMALS: 2
    },

    // Map Configuration
    MAP_CONFIG: {
        DEFAULT_CENTER: [9.5616, 44.0650], // Hargeisa coordinates
        DEFAULT_ZOOM: 12,
        MAX_ZOOM: 18,
        MIN_ZOOM: 8,
        TILE_LAYER: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        ATTRIBUTION: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    },

    // Animation Configuration
    ANIMATION: {
        DURATION: {
            FAST: 150,
            NORMAL: 300,
            SLOW: 500,
            VERY_SLOW: 1000
        },
        EASING: {
            LINEAR: 'linear',
            EASE: 'ease',
            EASE_IN: 'ease-in',
            EASE_OUT: 'ease-out',
            EASE_IN_OUT: 'ease-in-out'
        }
    },

    // Validation Rules
    VALIDATION: {
        EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        PHONE: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
        URL: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
        PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    },

    // Breakpoints (px)
    BREAKPOINTS: {
        XS: 0,
        SM: 576,
        MD: 768,
        LG: 992,
        XL: 1200,
        XXL: 1400
    },

    // Performance Configuration
    PERFORMANCE: {
        LAZY_LOAD_OFFSET: 100,
        DEBOUNCE_DELAY: 300,
        THROTTLE_DELAY: 100,
        CACHE_DURATION: 300000, // 5 minutes
        MAX_IMAGE_SIZE: 5242880 // 5MB
    },

    // Error Messages
    ERRORS: {
        NETWORK: 'Network error. Please check your connection.',
        TIMEOUT: 'Request timed out. Please try again.',
        SERVER: 'Server error. Please try again later.',
        VALIDATION: 'Please check your input and try again.',
        AUTH: 'Authentication failed. Please login again.',
        PERMISSION: 'You do not have permission to perform this action.',
        NOT_FOUND: 'The requested resource was not found.',
        RATE_LIMIT: 'Too many requests. Please try again later.'
    },

    // Success Messages
    SUCCESS: {
        SAVED: 'Changes saved successfully.',
        DELETED: 'Item deleted successfully.',
        UPLOADED: 'File uploaded successfully.',
        SENT: 'Message sent successfully.',
        BOOKED: 'Appointment booked successfully.',
        SUBSCRIBED: 'Subscribed successfully.'
    }
};

/* ==========================================================================
   2. APPLICATION INITIALIZATION
   ========================================================================== */

class DhulBeegApp {
    constructor() {
        this.isInitialized = false;
        this.isLoading = false;
        this.currentPage = 'home';
        this.previousPage = null;
        this.user = null;
        this.cart = [];
        this.favorites = [];
        this.recentViews = [];
        this.searchHistory = [];
        this.notifications = [];
        this.analytics = {
            pageViews: 0,
            propertyViews: {},
            sessionStart: null,
            sessionDuration: 0
        };

        // Initialize modules
        this.utils = new AppUtils();
        this.themeManager = new ThemeManager();
        this.languageManager = new LanguageManager();
        this.dataManager = new DataManager();
        this.propertyManager = new PropertyManager();
        this.legalManager = new LegalManager();
        this.contactManager = new ContactManager();
        this.mapManager = new MapManager();
        this.modalManager = new ModalManager();
        this.toastManager = new ToastManager();
        this.authManager = new AuthManager();
        this.searchManager = new SearchManager();
        this.animationManager = new AnimationManager();
        this.validationManager = new ValidationManager();

        // Initialize state
        this.state = {
            theme: 'light',
            language: 'en',
            isLoggedIn: false,
            isMobile: false,
            isTablet: false,
            isDesktop: false,
            isOnline: navigator.onLine,
            isTouchDevice: 'ontouchstart' in window,
            isLoading: true,
            isScrolled: false,
            isMenuOpen: false,
            isSearchOpen: false,
            isModalOpen: false,
            currentSection: 'home',
            activeFilters: {},
            sortBy: 'featured',
            viewMode: 'grid'
        };
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            // Show loading screen
            this.showLoading();

            // Initialize session tracking
            this.startSession();

            // Initialize modules
            await this.initializeModules();

            // Set up event listeners
            this.setupEventListeners();

            // Load initial data
            await this.loadInitialData();

            // Check authentication status
            await this.checkAuthStatus();

            // Initialize UI components
            this.initializeUI();

            // Hide loading screen
            this.hideLoading();

            // Mark as initialized
            this.isInitialized = true;

            // Track page view
            this.trackPageView();

            console.log('DhulBeeg App initialized successfully');

        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.handleError(error);
        }
    }

    /**
     * Initialize all modules
     */
    async initializeModules() {
        const modules = [
            this.themeManager.init(),
            this.languageManager.init(),
            this.dataManager.init(),
            this.propertyManager.init(),
            this.legalManager.init(),
            this.mapManager.init(),
            this.modalManager.init(),
            this.toastManager.init(),
            this.authManager.init(),
            this.searchManager.init(),
            this.animationManager.init(),
            this.validationManager.init()
        ];

        await Promise.all(modules);
    }

    /**
     * Set up global event listeners
     */
    setupEventListeners() {
        // Window events
        window.addEventListener('resize', this.handleResize.bind(this));
        window.addEventListener('scroll', this.handleScroll.bind(this));
        window.addEventListener('online', this.handleOnline.bind(this));
        window.addEventListener('offline', this.handleOffline.bind(this));
        window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));

        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.themeManager.toggleTheme());
        }

        // Language selector
        const languageBtn = document.getElementById('languageBtn');
        if (languageBtn) {
            languageBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.languageManager.toggleLanguageDropdown();
            });
        }

        // Mobile menu
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', () => this.toggleMobileMenu());
        }

        const closeMenu = document.getElementById('closeMenu');
        if (closeMenu) {
            closeMenu.addEventListener('click', () => this.closeMobileMenu());
        }

        // Back to top
        const backToTop = document.getElementById('backToTop');
        if (backToTop) {
            backToTop.addEventListener('click', () => this.scrollToTop());
        }

        // Quick contact toggle
        const quickContactToggle = document.getElementById('quickContactToggle');
        if (quickContactToggle) {
            quickContactToggle.addEventListener('click', () => this.toggleQuickContact());
        }

        // Search form
        const mainSearchForm = document.getElementById('mainSearchForm');
        if (mainSearchForm) {
            mainSearchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSearchSubmit(e);
            });
        }

        // Contact form
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactSubmit(e);
            });
        }

        // Newsletter form
        const newsletterForm = document.getElementById('newsletterForm');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleNewsletterSubmit(e);
            });
        }

        // Sign in/up buttons
        const signinBtn = document.getElementById('signinBtn');
        if (signinBtn) {
            signinBtn.addEventListener('click', () => this.modalManager.openModal('signin'));
        }

        const signupBtn = document.getElementById('signupBtn');
        if (signupBtn) {
            signupBtn.addEventListener('click', () => this.modalManager.openModal('signup'));
        }

        // Modal close buttons
        document.querySelectorAll('.close-modal').forEach(button => {
            button.addEventListener('click', (e) => {
                const modal = e.target.closest('[data-modal]');
                if (modal) {
                    const modalId = modal.dataset.modal;
                    this.modalManager.closeModal(modalId);
                }
            });
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleFilterClick(e);
            });
        });

        // Quick search tags
        document.querySelectorAll('.quick-tag').forEach(tag => {
            tag.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleQuickTagClick(e);
            });
        });

        // Property card interactions
        document.addEventListener('click', (e) => {
            const propertyCard = e.target.closest('.property-card');
            if (propertyCard) {
                const propertyId = propertyCard.dataset.propertyId;
                if (propertyId) {
                    this.showPropertyDetails(propertyId);
                }
            }
        });

        // Lazy loading for images
        this.setupLazyLoading();

        // Intersection Observer for animations
        this.setupIntersectionObserver();
    }

    /**
     * Initialize UI components
     */
    initializeUI() {
        // Update current year in footer
        this.updateCurrentYear();

        // Initialize hero slider
        this.initHeroSlider();

        // Initialize testimonials slider
        this.initTestimonialsSlider();

        // Initialize video tabs
        this.initVideoTabs();

        // Initialize property filters
        this.initPropertyFilters();

        // Initialize portfolio filters
        this.initPortfolioFilters();

        // Initialize regions map
        this.initRegionsMap();

        // Initialize contact map
        this.initContactMap();

        // Set initial state classes
        this.updateStateClasses();
    }

    /**
     * Load initial data
     */
    async loadInitialData() {
        try {
            const dataPromises = [
                this.loadStatsData(),
                this.loadServicesData(),
                this.loadPropertiesData(),
                this.loadLegalServicesData(),
                this.loadPortfolioData(),
                this.loadVideosData(),
                this.loadAboutData(),
                this.loadTeamData(),
                this.loadTestimonialsData(),
                this.loadContactData(),
                this.loadFooterData()
            ];

            await Promise.all(dataPromises);

        } catch (error) {
            console.error('Error loading initial data:', error);
            this.toastManager.showToast('Failed to load some data. Please refresh the page.', 'error');
        }
    }

    /**
     * Check authentication status
     */
    async checkAuthStatus() {
        try {
            const token = localStorage.getItem(DhulBeegConfig.STORAGE_KEYS.USER_TOKEN);
            if (token) {
                const isValid = await this.authManager.validateToken(token);
                if (isValid) {
                    this.user = await this.authManager.getCurrentUser();
                    this.state.isLoggedIn = true;
                    this.updateAuthUI();
                } else {
                    this.authManager.logout();
                }
            }
        } catch (error) {
            console.error('Error checking auth status:', error);
        }
    }

    /**
     * Update authentication UI
     */
    updateAuthUI() {
        const userAuth = document.getElementById('userAuth');
        if (userAuth) {
            if (this.state.isLoggedIn && this.user) {
                userAuth.innerHTML = `
                    <div class="user-profile">
                        <button class="profile-btn" id="profileBtn">
                            <img src="${this.user.avatar || 'assets/default-avatar.jpg'}" alt="${this.user.name}" class="profile-avatar">
                            <span class="profile-name">${this.user.name.split(' ')[0]}</span>
                            <i class="ri-arrow-down-s-line"></i>
                        </button>
                        <div class="profile-dropdown" id="profileDropdown">
                            <a href="#profile" class="dropdown-item">
                                <i class="ri-user-line"></i>
                                <span>My Profile</span>
                            </a>
                            <a href="#properties" class="dropdown-item">
                                <i class="ri-home-3-line"></i>
                                <span>My Properties</span>
                            </a>
                            <a href="#legal" class="dropdown-item">
                                <i class="ri-scale-line"></i>
                                <span>My Legal Cases</span>
                            </a>
                            <a href="#saved" class="dropdown-item">
                                <i class="ri-heart-line"></i>
                                <span>Saved Items</span>
                            </a>
                            <div class="dropdown-divider"></div>
                            <a href="#settings" class="dropdown-item">
                                <i class="ri-settings-3-line"></i>
                                <span>Settings</span>
                            </a>
                            <button class="dropdown-item logout-btn" id="logoutBtn">
                                <i class="ri-logout-box-r-line"></i>
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                `;

                // Add logout listener
                const logoutBtn = document.getElementById('logoutBtn');
                if (logoutBtn) {
                    logoutBtn.addEventListener('click', () => this.authManager.logout());
                }

                // Add profile dropdown listener
                const profileBtn = document.getElementById('profileBtn');
                if (profileBtn) {
                    profileBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const dropdown = document.getElementById('profileDropdown');
                        dropdown.classList.toggle('show');
                    });
                }

                // Close dropdown when clicking outside
                document.addEventListener('click', (e) => {
                    if (!e.target.closest('.user-profile')) {
                        const dropdown = document.getElementById('profileDropdown');
                        if (dropdown) dropdown.classList.remove('show');
                    }
                });
            }
        }
    }

    /* ==========================================================================
       3. CORE UTILITIES
       ========================================================================== */

    /**
     * Show loading screen
     */
    showLoading() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.remove('hidden');
            this.state.isLoading = true;
        }
    }

    /**
     * Hide loading screen
     */
    hideLoading() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                this.state.isLoading = false;
            }, 500);
        }
    }

    /**
     * Update current year in footer
     */
    updateCurrentYear() {
        const yearElement = document.getElementById('currentYear');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }

    /**
     * Scroll to top of page
     */
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    /**
     * Toggle mobile menu
     */
    toggleMobileMenu() {
        const overlay = document.getElementById('mobileMenuOverlay');
        if (overlay) {
            overlay.classList.toggle('active');
            this.state.isMenuOpen = !this.state.isMenuOpen;
            document.body.style.overflow = this.state.isMenuOpen ? 'hidden' : '';
        }
    }

    /**
     * Close mobile menu
     */
    closeMobileMenu() {
        const overlay = document.getElementById('mobileMenuOverlay');
        if (overlay) {
            overlay.classList.remove('active');
            this.state.isMenuOpen = false;
            document.body.style.overflow = '';
        }
    }

    /**
     * Toggle quick contact panel
     */
    toggleQuickContact() {
        const quickContact = document.querySelector('.quick-contact-float');
        if (quickContact) {
            quickContact.classList.toggle('active');
        }
    }

    /**
     * Handle window resize
     */
    handleResize() {
        const width = window.innerWidth;
        this.state.isMobile = width < DhulBeegConfig.BREAKPOINTS.MD;
        this.state.isTablet = width >= DhulBeegConfig.BREAKPOINTS.MD && width < DhulBeegConfig.BREAKPOINTS.LG;
        this.state.isDesktop = width >= DhulBeegConfig.BREAKPOINTS.LG;

        this.updateStateClasses();

        // Close mobile menu on desktop
        if (!this.state.isMobile && this.state.isMenuOpen) {
            this.closeMobileMenu();
        }
    }

    /**
     * Handle window scroll
     */
    handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const header = document.getElementById('header');
        const backToTop = document.getElementById('backToTop');

        // Update scroll state
        this.state.isScrolled = scrollTop > 100;

        // Update header
        if (header) {
            if (this.state.isScrolled) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        // Update back to top button
        if (backToTop) {
            if (scrollTop > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }

        // Update active section in navigation
        this.updateActiveSection();
    }

    /**
     * Update active section in navigation
     */
    updateActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                this.state.currentSection = sectionId;
                this.updateNavigationActive(sectionId);
            }
        });
    }

    /**
     * Update navigation active state
     */
    updateNavigationActive(sectionId) {
        // Update desktop navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });

        // Update mobile navigation
        document.querySelectorAll('.mobile-menu-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });
    }

    /**
     * Update state classes on body
     */
    updateStateClasses() {
        const body = document.body;

        // Device type classes
        body.classList.remove('is-mobile', 'is-tablet', 'is-desktop');
        if (this.state.isMobile) body.classList.add('is-mobile');
        if (this.state.isTablet) body.classList.add('is-tablet');
        if (this.state.isDesktop) body.classList.add('is-desktop');

        // State classes
        if (this.state.isScrolled) body.classList.add('is-scrolled');
        else body.classList.remove('is-scrolled');

        if (this.state.isMenuOpen) body.classList.add('menu-open');
        else body.classList.remove('menu-open');

        if (this.state.isSearchOpen) body.classList.add('search-open');
        else body.classList.remove('search-open');

        if (this.state.isModalOpen) body.classList.add('modal-open');
        else body.classList.remove('modal-open');

        if (this.state.isLoading) body.classList.add('loading');
        else body.classList.remove('loading');
    }

    /**
     * Handle online/offline status
     */
    handleOnline() {
        this.state.isOnline = true;
        this.toastManager.showToast('You are back online', 'success');

        // Retry failed requests
        this.retryFailedRequests();
    }

    handleOffline() {
        this.state.isOnline = false;
        this.toastManager.showToast('You are offline. Some features may not work.', 'warning');
    }

    /**
     * Handle before unload
     */
    handleBeforeUnload() {
        this.endSession();
        this.saveSessionData();
    }

    /**
     * Start user session
     */
    startSession() {
        this.analytics.sessionStart = Date.now();
        this.analytics.pageViews = 0;

        // Generate session ID if not exists
        let sessionId = localStorage.getItem(DhulBeegConfig.STORAGE_KEYS.SESSION_ID);
        if (!sessionId) {
            sessionId = this.utils.generateId();
            localStorage.setItem(DhulBeegConfig.STORAGE_KEYS.SESSION_ID, sessionId);
        }
    }

    /**
     * End user session
     */
    endSession() {
        if (this.analytics.sessionStart) {
            this.analytics.sessionDuration = Date.now() - this.analytics.sessionStart;
            // Send session data to analytics
            this.sendAnalyticsData();
        }
    }

    /**
     * Track page view
     */
    trackPageView() {
        this.analytics.pageViews++;

        // Track in analytics service
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_view', {
                page_title: document.title,
                page_location: window.location.href,
                page_path: window.location.pathname
            });
        }
    }

    /**
     * Send analytics data
     */
    sendAnalyticsData() {
        const analyticsData = {
            sessionId: localStorage.getItem(DhulBeegConfig.STORAGE_KEYS.SESSION_ID),
            pageViews: this.analytics.pageViews,
            sessionDuration: this.analytics.sessionDuration,
            propertyViews: this.analytics.propertyViews,
            timestamp: new Date().toISOString()
        };

        // Here you would typically send to your analytics endpoint
        console.log('Analytics data:', analyticsData);
    }

    /**
     * Save session data
     */
    saveSessionData() {
        const sessionData = {
            recentViews: this.recentViews.slice(0, 10),
            searchHistory: this.searchHistory.slice(0, 20),
            favorites: this.favorites,
            cart: this.cart,
            lastVisited: new Date().toISOString()
        };

        localStorage.setItem(DhulBeegConfig.STORAGE_KEYS.SESSION_DATA, JSON.stringify(sessionData));
    }

    /**
     * Retry failed requests
     */
    retryFailedRequests() {
        const failedRequests = JSON.parse(localStorage.getItem('failed_requests') || '[]');
        if (failedRequests.length > 0) {
            failedRequests.forEach(request => {
                // Retry request logic here
            });
            localStorage.removeItem('failed_requests');
        }
    }

    /* ==========================================================================
       4. DATA LOADING METHODS
       ========================================================================== */

    /**
     * Load statistics data
     */
    async loadStatsData() {
        try {
            const response = await fetch('data/stats.json');
            const stats = await response.json();
            this.renderStats(stats);
        } catch (error) {
            // Use fallback data
            const fallbackStats = [
                { id: 1, icon: 'ri-home-3-line', number: '500+', label: 'Properties Sold', suffix: '' },
                { id: 2, icon: 'ri-scale-line', number: '2000+', label: 'Legal Cases', suffix: '' },
                { id: 3, icon: 'ri-user-smile-line', number: '98%', label: 'Client Satisfaction', suffix: '' },
                { id: 4, icon: 'ri-award-line', number: '15+', label: 'Years Experience', suffix: '' }
            ];
            this.renderStats(fallbackStats);
        }
    }

    /**
     * Render statistics
     */
    renderStats(stats) {
        const container = document.getElementById('statsContainer');
        if (!container) return;

        container.innerHTML = stats.map(stat => `
            <div class="stat-card animate-fade-in" data-delay="${stat.id * 100}">
                <div class="stat-icon">
                    <i class="${stat.icon}"></i>
                </div>
                <h3 class="stat-number">${stat.number}${stat.suffix || ''}</h3>
                <p class="stat-label">${stat.label}</p>
            </div>
        `).join('');
    }

    /**
     * Load services data
     */
    async loadServicesData() {
        try {
            const response = await fetch('data/services.json');
            const services = await response.json();
            this.renderServicesTree(services);
        } catch (error) {
            // Use fallback data
            const fallbackServices = {
                id: 'root',
                title: 'Our Services',
                description: 'Integrated real estate and legal solutions',
                children: [{
                        id: 'real-estate',
                        icon: 'ri-home-3-line',
                        title: 'Real Estate Services',
                        description: 'Complete property solutions',
                        children: [
                            { id: 'buy', title: 'Property Buying', description: 'Find your dream property' },
                            { id: 'sell', title: 'Property Selling', description: 'Get the best price' },
                            { id: 'rent', title: 'Rental Services', description: 'Short & long term rentals' },
                            { id: 'valuation', title: 'Property Valuation', description: 'Accurate market pricing' }
                        ]
                    },
                    {
                        id: 'legal',
                        icon: 'ri-scale-line',
                        title: 'Legal Services',
                        description: 'Legal protection for your investments',
                        children: [
                            { id: 'title', title: 'Title Verification', description: 'Ensure clear ownership' },
                            { id: 'contracts', title: 'Contract Drafting', description: 'Legally binding agreements' },
                            { id: 'disputes', title: 'Dispute Resolution', description: 'Expert legal representation' },
                            { id: 'registration', title: 'Property Registration', description: 'Official documentation' }
                        ]
                    }
                ]
            };
            this.renderServicesTree(fallbackServices);
        }
    }

    /**
     * Render services tree
     */
    renderServicesTree(services) {
            const container = document.getElementById('servicesTree');
            if (!container) return;

            const renderNode = (node) => {
                    return `
                <div class="tree-node" data-service="${node.id}">
                    <div class="tree-node-icon">
                        <i class="${node.icon || 'ri-service-line'}"></i>
                    </div>
                    <h3 class="tree-node-title">${node.title}</h3>
                    <p class="tree-node-description">${node.description}</p>
                    ${node.children ? `
                        <div class="tree-children">
                            ${node.children.map(child => renderNode(child)).join('')}
                        </div>
                    ` : ''}
                </div>
            `;
        };
        
        container.innerHTML = renderNode(services);
    }
    
    /**
     * Load properties data
     */
    async loadPropertiesData() {
        try {
            const response = await fetch('data/properties.json');
            const properties = await response.json();
            this.propertyManager.setProperties(properties);
            this.renderProperties(properties);
        } catch (error) {
            console.error('Error loading properties:', error);
            this.toastManager.showToast('Failed to load properties', 'error');
        }
    }
    
    /**
     * Render properties
     */
    renderProperties(properties) {
        const container = document.getElementById('propertiesContainer');
        if (!container) return;
        
        if (properties.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <i class="ri-home-3-line"></i>
                    <h3>No Properties Found</h3>
                    <p>Try adjusting your filters or check back later.</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = properties.map(property => `
            <div class="property-card" data-property-id="${property.id}" data-type="${property.type}" data-location="${property.location}" data-price="${property.price}">
                <div class="property-image">
                    <img src="${property.image}" alt="${property.title}" loading="lazy">
                    ${property.featured ? '<span class="property-badge">Featured</span>' : ''}
                    ${property.status === 'sold' ? '<span class="property-badge sold">Sold</span>' : ''}
                    ${property.status === 'rented' ? '<span class="property-badge rented">Rented</span>' : ''}
                </div>
                <div class="property-content">
                    <h3 class="property-title">${property.title}</h3>
                    <div class="property-location">
                        <i class="ri-map-pin-line"></i>
                        <span>${property.location}</span>
                    </div>
                    <div class="property-features">
                        <div class="property-feature">
                            <i class="ri-home-3-line"></i>
                            <span>${property.bedrooms} Beds</span>
                        </div>
                        <div class="property-feature">
                            <i class="ri-bathroom-line"></i>
                            <span>${property.bathrooms} Baths</span>
                        </div>
                        <div class="property-feature">
                            <i class="ri-ruler-line"></i>
                            <span>${property.area} m²</span>
                        </div>
                    </div>
                    <div class="property-price">${this.formatPrice(property.price)}</div>
                    <div class="property-actions">
                        <button class="btn btn-outline btn-property-detail" data-property="${property.id}">
                            <i class="ri-eye-line"></i> View
                        </button>
                        <button class="btn btn-primary btn-property-contact" data-property="${property.id}">
                            <i class="ri-phone-line"></i> Contact
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Add event listeners to property buttons
        container.querySelectorAll('.btn-property-detail').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const propertyId = button.dataset.property;
                this.showPropertyDetails(propertyId);
            });
        });
        
        container.querySelectorAll('.btn-property-contact').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const propertyId = button.dataset.property;
                this.showContactModal(propertyId);
            });
        });
    }
    
    /**
     * Load legal services data
     */
    async loadLegalServicesData() {
        try {
            const response = await fetch('data/legal-services.json');
            const legalServices = await response.json();
            this.renderLegalServices(legalServices);
        } catch (error) {
            // Use fallback data
            const fallbackLegalServices = [
                {
                    id: 1,
                    icon: 'ri-file-text-line',
                    title: 'Title Verification',
                    description: 'Comprehensive property title checks and verification services.',
                    features: ['Title search', 'Ownership verification', 'Encumbrance check', 'Legal opinion'],
                    price: 500
                },
                {
                    id: 2,
                    icon: 'ri-contract-line',
                    title: 'Contract Drafting',
                    description: 'Professional drafting of property sale and purchase agreements.',
                    features: ['Sale agreement', 'Purchase agreement', 'Lease agreement', 'Custom contracts'],
                    price: 300
                },
                {
                    id: 3,
                    icon: 'ri-scale-line',
                    title: 'Property Dispute Resolution',
                    description: 'Expert legal representation for property-related disputes.',
                    features: ['Court representation', 'Mediation', 'Arbitration', 'Settlement negotiation'],
                    price: 1000
                }
            ];
            this.renderLegalServices(fallbackLegalServices);
        }
    }
    
    /**
     * Render legal services
     */
    renderLegalServices(services) {
        const container = document.getElementById('legalServicesContainer');
        if (!container) return;
        
        container.innerHTML = services.map(service => `
            <div class="legal-service-card" data-service-id="${service.id}">
                <div class="legal-service-icon">
                    <i class="${service.icon}"></i>
                </div>
                <h3 class="legal-service-title">${service.title}</h3>
                <p class="legal-service-description">${service.description}</p>
                <ul class="legal-service-features">
                    ${service.features.map(feature => `<li><i class="ri-check-line"></i> ${feature}</li>`).join('')}
                </ul>
                <div class="legal-service-price">From ${this.formatPrice(service.price)}</div>
                <button class="btn btn-primary btn-block" data-service="${service.id}">
                    Learn More
                </button>
            </div>
        `).join('');
        
        // Add event listeners
        container.querySelectorAll('.legal-service-card button').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const serviceId = button.dataset.service;
                this.showServiceDetails(serviceId);
            });
        });
    }
    
    /**
     * Load portfolio data
     */
    async loadPortfolioData() {
        try {
            const response = await fetch('data/portfolio.json');
            const portfolio = await response.json();
            this.renderPortfolio(portfolio);
        } catch (error) {
            console.error('Error loading portfolio:', error);
        }
    }
    
    /**
     * Render portfolio
     */
    renderPortfolio(portfolio) {
        const container = document.getElementById('portfolioContainer');
        if (!container) return;
        
        container.innerHTML = portfolio.map(item => `
            <div class="portfolio-item" data-category="${item.category}">
                <img src="${item.image}" alt="${item.title}" class="portfolio-image">
                <div class="portfolio-overlay">
                    <span class="portfolio-category">${item.category}</span>
                    <h3 class="portfolio-title">${item.title}</h3>
                    <p class="portfolio-description">${item.description}</p>
                </div>
            </div>
        `).join('');
    }
    
    /**
     * Load videos data
     */
    async loadVideosData() {
        try {
            const response = await fetch('data/videos.json');
            const videos = await response.json();
            this.renderVideos(videos);
        } catch (error) {
            console.error('Error loading videos:', error);
        }
    }
    
    /**
     * Render videos
     */
    renderVideos(videos) {
        // Real estate videos
        const realEstateContainer = document.getElementById('realEstateVideos');
        if (realEstateContainer) {
            const realEstateVideos = videos.filter(v => v.type === 'real-estate');
            realEstateContainer.innerHTML = this.renderVideoGrid(realEstateVideos);
        }
        
        // Legal videos
        const legalContainer = document.getElementById('legalVideos');
        if (legalContainer) {
            const legalVideos = videos.filter(v => v.type === 'legal');
            legalContainer.innerHTML = this.renderVideoGrid(legalVideos);
        }
        
        // Testimonial videos
        const testimonialContainer = document.getElementById('testimonialVideos');
        if (testimonialContainer) {
            const testimonialVideos = videos.filter(v => v.type === 'testimonials');
            testimonialContainer.innerHTML = this.renderVideoGrid(testimonialVideos);
        }
    }
    
    /**
     * Render video grid
     */
    renderVideoGrid(videos) {
        if (videos.length === 0) {
            return `
                <div class="no-videos">
                    <i class="ri-video-line"></i>
                    <h3>No Videos Available</h3>
                    <p>Check back soon for new videos.</p>
                </div>
            `;
        }
        
        return videos.map(video => `
            <div class="video-card">
                <div class="video-thumbnail">
                    <img src="${video.thumbnail}" alt="${video.title}">
                    <button class="video-play-btn" data-video="${video.id}">
                        <i class="ri-play-circle-line"></i>
                    </button>
                </div>
                <div class="video-content">
                    <h3 class="video-title">${video.title}</h3>
                    <div class="video-meta">
                        <span><i class="ri-time-line"></i> ${video.duration}</span>
                        <span><i class="ri-eye-line"></i> ${video.views} views</span>
                    </div>
                    <p class="video-description">${video.description}</p>
                </div>
            </div>
        `).join('');
    }
    
    /**
     * Load about data
     */
    async loadAboutData() {
        try {
            const response = await fetch('data/about.json');
            const aboutData = await response.json();
            this.renderAboutData(aboutData);
        } catch (error) {
            console.error('Error loading about data:', error);
        }
    }
    
    /**
     * Render about data
     */
    renderAboutData(data) {
        // About description
        const aboutDescription = document.getElementById('aboutDescription');
        if (aboutDescription && data.description) {
            aboutDescription.textContent = data.description;
        }
        
        // Mission, Vision, Values
        const missionVisionContainer = document.getElementById('missionVisionValues');
        if (missionVisionContainer && data.missionVision) {
            missionVisionContainer.innerHTML = `
                <div class="mission-card">
                    <div class="mission-icon">
                        <i class="ri-target-line"></i>
                    </div>
                    <h3>Our Mission</h3>
                    <p>${data.missionVision.mission}</p>
                </div>
                <div class="vision-card">
                    <div class="vision-icon">
                        <i class="ri-eye-line"></i>
                    </div>
                    <h3>Our Vision</h3>
                    <p>${data.missionVision.vision}</p>
                </div>
                <div class="values-card">
                    <div class="values-icon">
                        <i class="ri-heart-line"></i>
                    </div>
                    <h3>Our Values</h3>
                    <p>${data.missionVision.values}</p>
                </div>
            `;
        }
        
        // About stats
        const stats = ['yearsExperience', 'propertiesSold', 'legalCases', 'happyClients'];
        stats.forEach((statId, index) => {
            const element = document.getElementById(statId);
            if (element && data.stats && data.stats[index]) {
                element.textContent = data.stats[index];
            }
        });
    }
    
    /**
     * Load team data
     */
    async loadTeamData() {
        try {
            const response = await fetch('data/team.json');
            const team = await response.json();
            this.renderTeam(team);
        } catch (error) {
            console.error('Error loading team data:', error);
        }
    }
    
    /**
     * Render team
     */
    renderTeam(team) {
        const container = document.getElementById('teamContainer');
        if (!container) return;
        
        container.innerHTML = team.map(member => `
            <div class="team-member">
                <div class="team-member-image">
                    <img src="${member.image}" alt="${member.name}">
                    <div class="team-member-social">
                        ${member.social ? Object.entries(member.social).map(([platform, url]) => `
                            <a href="${url}" class="social-link" target="_blank" rel="noopener">
                                <i class="ri-${platform}-line"></i>
                            </a>
                        `).join('') : ''}
                    </div>
                </div>
                <div class="team-member-info">
                    <h3 class="team-member-name">${member.name}</h3>
                    <p class="team-member-position">${member.position}</p>
                    <p class="team-member-description">${member.description}</p>
                    <div class="team-member-skills">
                        ${member.skills ? member.skills.map(skill => `<span>${skill}</span>`).join('') : ''}
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    /**
     * Load testimonials data
     */
    async loadTestimonialsData() {
        try {
            const response = await fetch('data/testimonials.json');
            const testimonials = await response.json();
            this.renderTestimonials(testimonials);
        } catch (error) {
            console.error('Error loading testimonials:', error);
        }
    }
    
    /**
     * Render testimonials
     */
    renderTestimonials(testimonials) {
        const container = document.getElementById('testimonialsContainer');
        if (!container) return;
        
        container.innerHTML = `
            <div class="testimonials-track" id="testimonialsTrack">
                ${testimonials.map(testimonial => `
                    <div class="testimonial-card">
                        <div class="testimonial-inner">
                            <div class="testimonial-quote">
                                <i class="ri-double-quotes-l"></i>
                            </div>
                            <div class="testimonial-content">
                                <p class="testimonial-text">"${testimonial.text}"</p>
                                <div class="testimonial-author">
                                    <img src="${testimonial.avatar}" alt="${testimonial.name}" class="testimonial-avatar">
                                    <div class="testimonial-author-info">
                                        <h4>${testimonial.name}</h4>
                                        <p>${testimonial.position}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        // Initialize testimonials slider
        this.initTestimonialsSlider();
    }
    
    /**
     * Load contact data
     */
    async loadContactData() {
        try {
            const response = await fetch('data/contact.json');
            const contactData = await response.json();
            this.renderContactData(contactData);
        } catch (error) {
            console.error('Error loading contact data:', error);
        }
    }
    
    /**
     * Render contact data
     */
    renderContactData(data) {
        // Contact details
        const contactDetails = document.getElementById('contactDetails');
        if (contactDetails && data.details) {
            contactDetails.innerHTML = `
                <div class="contact-detail">
                    <div class="contact-detail-icon">
                        <i class="ri-map-pin-line"></i>
                    </div>
                    <div class="contact-detail-content">
                        <h4>Office Address</h4>
                        <p>${data.details.address}</p>
                    </div>
                </div>
                <div class="contact-detail">
                    <div class="contact-detail-icon">
                        <i class="ri-phone-line"></i>
                    </div>
                    <div class="contact-detail-content">
                        <h4>Phone Number</h4>
                        <p>${data.details.phone}</p>
                    </div>
                </div>
                <div class="contact-detail">
                    <div class="contact-detail-icon">
                        <i class="ri-mail-line"></i>
                    </div>
                    <div class="contact-detail-content">
                        <h4>Email Address</h4>
                        <p>${data.details.email}</p>
                    </div>
                </div>
                <div class="contact-detail">
                    <div class="contact-detail-icon">
                        <i class="ri-time-line"></i>
                    </div>
                    <div class="contact-detail-content">
                        <h4>Working Hours</h4>
                        <p>${data.details.hours}</p>
                    </div>
                </div>
            `;
        }
        
        // Office hours
        const officeHours = document.getElementById('officeHours');
        if (officeHours && data.officeHours) {
            officeHours.innerHTML = `
                <h4>Office Hours</h4>
                ${data.officeHours.map(hour => `
                    <div class="office-hour">
                        <span class="day">${hour.day}</span>
                        <span class="time">${hour.time}</span>
                    </div>
                `).join('')}
            `;
        }
        
        // Footer contact info
        const contactInfoFooter = document.getElementById('contactInfoFooter');
        if (contactInfoFooter && data.details) {
            contactInfoFooter.innerHTML = `
                <div class="contact-item-footer">
                    <i class="ri-map-pin-line"></i>
                    <span>${data.details.address}</span>
                </div>
                <div class="contact-item-footer">
                    <i class="ri-phone-line"></i>
                    <span>${data.details.phone}</span>
                </div>
                <div class="contact-item-footer">
                    <i class="ri-mail-line"></i>
                    <span>${data.details.email}</span>
                </div>
            `;
        }
    }
    
    /**
     * Load footer data
     */
    async loadFooterData() {
        try {
            const response = await fetch('data/footer.json');
            const footerData = await response.json();
            this.renderFooterData(footerData);
        } catch (error) {
            console.error('Error loading footer data:', error);
        }
    }
    
    /**
     * Render footer data
     */
    renderFooterData(data) {
        // Footer description
        const footerDescription = document.getElementById('footerDescription');
        if (footerDescription && data.description) {
            footerDescription.textContent = data.description;
        }
    }
    
    /* ==========================================================================
       5. COMPONENT INITIALIZATION
       ========================================================================== */
    
    /**
     * Initialize hero slider
     */
    initHeroSlider() {
        const slides = document.querySelectorAll('.hero-slide');
        const dots = document.querySelectorAll('.hero-slider-dots .dot');
        const prevBtn = document.getElementById('heroPrev');
        const nextBtn = document.getElementById('heroNext');
        
        if (slides.length === 0) return;
        
        let currentSlide = 0;
        const totalSlides = slides.length;
        
        const showSlide = (index) => {
            // Hide all slides
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            
            // Show current slide
            currentSlide = (index + totalSlides) % totalSlides;
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
        };
        
        // Auto slide
        let slideInterval = setInterval(() => {
            showSlide(currentSlide + 1);
        }, 5000);
        
        // Reset interval on interaction
        const resetInterval = () => {
            clearInterval(slideInterval);
            slideInterval = setInterval(() => {
                showSlide(currentSlide + 1);
            }, 5000);
        };
        
        // Previous button
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                showSlide(currentSlide - 1);
                resetInterval();
            });
        }
        
        // Next button
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                showSlide(currentSlide + 1);
                resetInterval();
            });
        }
        
        // Dots navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
                resetInterval();
            });
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                showSlide(currentSlide - 1);
                resetInterval();
            } else if (e.key === 'ArrowRight') {
                showSlide(currentSlide + 1);
                resetInterval();
            }
        });
    }
    
    /**
     * Initialize testimonials slider
     */
    initTestimonialsSlider() {
        const track = document.getElementById('testimonialsTrack');
        const prevBtn = document.getElementById('testimonialsPrev');
        const nextBtn = document.getElementById('testimonialsNext');
        
        if (!track) return;
        
        const cards = track.querySelectorAll('.testimonial-card');
        if (cards.length === 0) return;
        
        const cardWidth = cards[0].offsetWidth;
        let currentPosition = 0;
        
        const updateSlider = () => {
            track.style.transform = `translateX(-${currentPosition}px)`;
        };
        
        // Calculate visible cards
        const getVisibleCards = () => {
            const containerWidth = track.parentElement.offsetWidth;
            return Math.floor(containerWidth / cardWidth);
        };
        
        // Previous button
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                const visibleCards = getVisibleCards();
                currentPosition = Math.max(0, currentPosition - (cardWidth * visibleCards));
                updateSlider();
            });
        }
        
        // Next button
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const visibleCards = getVisibleCards();
                const maxPosition = (cards.length - visibleCards) * cardWidth;
                currentPosition = Math.min(maxPosition, currentPosition + (cardWidth * visibleCards));
                updateSlider();
            });
        }
        
        // Update on resize
        window.addEventListener('resize', () => {
            updateSlider();
        });
    }
    
    /**
     * Initialize video tabs
     */
    initVideoTabs() {
        const tabButtons = document.querySelectorAll('.video-tab-btn');
        const videoGrids = document.querySelectorAll('.videos-grid');
        
        if (tabButtons.length === 0) return;
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons and grids
                tabButtons.forEach(btn => btn.classList.remove('active'));
                videoGrids.forEach(grid => grid.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                // Show corresponding grid
                const videoType = button.dataset.videoType;
                const targetGrid = document.getElementById(`${videoType}Videos`);
                if (targetGrid) {
                    targetGrid.classList.add('active');
                }
            });
        });
    }
    
    /**
     * Initialize property filters
     */
    initPropertyFilters() {
        const filterButtons = document.querySelectorAll('.properties-filter .filter-btn');
        const sortSelect = document.getElementById('propertySort');
        
        if (filterButtons.length === 0) return;
        
        // Filter buttons
        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Apply filter
                const filter = button.dataset.filter;
                this.applyPropertyFilter(filter);
            });
        });
        
        // Sort select
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                const sortBy = e.target.value;
                this.sortProperties(sortBy);
            });
        }
    }
    
    /**
     * Initialize portfolio filters
     */
    initPortfolioFilters() {
        const filterButtons = document.querySelectorAll('.portfolio-filter-btn');
        
        if (filterButtons.length === 0) return;
        
        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Apply filter
                const category = button.dataset.category;
                this.filterPortfolio(category);
            });
        });
    }
    
    /**
     * Initialize regions map
     */
    initRegionsMap() {
        const mapContainer = document.getElementById('regionsMap');
        if (!mapContainer) return;
        
        try {
            const map = L.map(mapContainer).setView([9.5616, 44.0650], 12);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 18,
                minZoom: 8
            }).addTo(map);
            
            // Region markers
            const regions = [
                { name: 'Central Hargeisa', coords: [9.5616, 44.0650] },
                { name: 'Gacan Libaax', coords: [9.58, 44.06] },
                { name: 'Ibrahim Koodbur', coords: [9.57, 44.07] },
                { name: 'Mohamed Mooge', coords: [9.56, 44.08] },
                { name: 'Daami', coords: [9.55, 44.05] },
                { name: 'Siinay Village', coords: [9.54, 44.04] }
            ];
            
            regions.forEach(region => {
                const marker = L.marker(region.coords).addTo(map);
                marker.bindPopup(`<b>${region.name}</b><br>Properties available in this area`);
                
                // Add click event to region items
                const regionItems = document.querySelectorAll('.region-item');
                regionItems.forEach(item => {
                    if (item.querySelector('h4').textContent.includes(region.name)) {
                        item.addEventListener('click', () => {
                            map.setView(region.coords, 14);
                            marker.openPopup();
                        });
                    }
                });
            });
            
            // Fit bounds to show all markers
            const bounds = L.latLngBounds(regions.map(r => r.coords));
            map.fitBounds(bounds, { padding: [50, 50] });
            
        } catch (error) {
            console.error('Error initializing regions map:', error);
            mapContainer.innerHTML = `
                <div class="map-error">
                    <i class="ri-map-pin-line"></i>
                    <h3>Map Loading Failed</h3>
                    <p>Please check your internet connection and try again.</p>
                </div>
            `;
        }
    }
    
    /**
     * Initialize contact map
     */
    initContactMap() {
        const mapContainer = document.getElementById('contactMap');
        if (!mapContainer) return;
        
        try {
            const officeCoords = [9.5616, 44.0650];
            const map = L.map(mapContainer).setView(officeCoords, 15);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 18,
                minZoom: 12
            }).addTo(map);
            
            // Office marker
            const officeIcon = L.divIcon({
                className: 'office-marker',
                html: '<div class="marker-icon"><i class="ri-building-2-fill"></i></div>',
                iconSize: [40, 40],
                iconAnchor: [20, 40],
                popupAnchor: [0, -40]
            });
            
            const marker = L.marker(officeCoords, { icon: officeIcon }).addTo(map);
            marker.bindPopup(`
                <div class="map-popup">
                    <h4>DhulBeeg Office</h4>
                    <p>Main Street, Hargeisa, Somaliland</p>
                    <a href="https://maps.google.com/?q=${officeCoords[0]},${officeCoords[1]}" target="_blank" class="btn btn-sm btn-primary">
                        <i class="ri-navigation-line"></i> Get Directions
                    </a>
                </div>
            `);
            
            // Get directions button
            const getDirectionsBtn = document.getElementById('getDirectionsBtn');
            if (getDirectionsBtn) {
                getDirectionsBtn.addEventListener('click', () => {
                    window.open(`https://maps.google.com/?q=${officeCoords[0]},${officeCoords[1]}`, '_blank');
                });
            }
            
            // Copy address button
            const copyAddressBtn = document.getElementById('copyAddressBtn');
            if (copyAddressBtn) {
                copyAddressBtn.addEventListener('click', () => {
                    navigator.clipboard.writeText('Main Street, Hargeisa, Somaliland')
                        .then(() => {
                            this.toastManager.showToast('Address copied to clipboard', 'success');
                        })
                        .catch(() => {
                            this.toastManager.showToast('Failed to copy address', 'error');
                        });
                });
            }
            
        } catch (error) {
            console.error('Error initializing contact map:', error);
            mapContainer.innerHTML = `
                <div class="map-error">
                    <i class="ri-map-pin-line"></i>
                    <h3>Map Unavailable</h3>
                    <p>Map could not be loaded. Please contact us for directions.</p>
                </div>
            `;
        }
    }
    
    /* ==========================================================================
       6. EVENT HANDLERS
       ========================================================================== */
    
    /**
     * Handle search form submission
     */
    handleSearchSubmit(e) {
        e.preventDefault();
        
        const formData = {
            searchType: document.getElementById('searchType').value,
            propertyType: document.getElementById('propertyType').value,
            location: document.getElementById('location').value,
            priceRange: document.getElementById('priceRange').value
        };
        
        // Add to search history
        this.addToSearchHistory(formData);
        
        // Filter properties
        this.searchManager.searchProperties(formData);
        
        // Show toast
        this.toastManager.showToast('Searching properties...', 'info');
    }
    
    /**
     * Handle contact form submission
     */
    async handleContactSubmit(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('contactName').value,
            phone: document.getElementById('contactPhone').value,
            email: document.getElementById('contactEmail').value,
            serviceType: document.getElementById('serviceType').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value,
            timestamp: new Date().toISOString(),
            source: 'contact_form'
        };
        
        // Validate form
        const isValid = this.validationManager.validateContactForm(formData);
        if (!isValid) {
            this.toastManager.showToast('Please fill all required fields correctly', 'error');
            return;
        }
        
        try {
            // Show loading
            const submitBtn = e.target.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Send to server
            const response = await this.contactManager.submitContactForm(formData);
            
            if (response.success) {
                // Reset form
                e.target.reset();
                
                // Show success message
                this.toastManager.showToast('Message sent successfully! We\'ll contact you soon.', 'success');
                
                // Track conversion
                this.trackConversion('contact_form_submission');
            } else {
                throw new Error(response.message || 'Failed to send message');
            }
            
        } catch (error) {
            console.error('Error submitting contact form:', error);
            this.toastManager.showToast('Failed to send message. Please try again.', 'error');
            
            // Save to local storage for retry
            this.saveFailedFormSubmission(formData);
        } finally {
            // Reset button
            const submitBtn = e.target.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        }
    }
    
    /**
     * Handle newsletter subscription
     */
    async handleNewsletterSubmit(e) {
        e.preventDefault();
        
        const email = e.target.querySelector('input[type="email"]').value;
        
        if (!this.validationManager.validateEmail(email)) {
            this.toastManager.showToast('Please enter a valid email address', 'error');
            return;
        }
        
        try {
            // Show loading
            const submitBtn = e.target.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i>';
            
            // Send to server
            const response = await this.contactManager.subscribeNewsletter(email);
            
            if (response.success) {
                // Reset form
                e.target.reset();
                
                // Show success message
                this.toastManager.showToast('Successfully subscribed to newsletter!', 'success');
                
                // Track conversion
                this.trackConversion('newsletter_subscription');
            } else {
                throw new Error(response.message || 'Failed to subscribe');
            }
            
        } catch (error) {
            console.error('Error subscribing to newsletter:', error);
            this.toastManager.showToast('Subscription failed. Please try again.', 'error');
        } finally {
            // Reset button
            const submitBtn = e.target.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.innerHTML = originalText;
            }
        }
    }
    
    /**
     * Handle filter click
     */
    handleFilterClick(e) {
        e.preventDefault();
        const button = e.currentTarget;
        const filter = button.dataset.filter;
        
        // Update active state
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');
        
        // Apply filter
        this.applyPropertyFilter(filter);
    }
    
    /**
     * Handle quick tag click
     */
    handleQuickTagClick(e) {
        e.preventDefault();
        const tag = e.currentTarget;
        const filter = tag.dataset.filter;
        
        // Parse filter (format: "type:villa")
        const [key, value] = filter.split(':');
        
        // Update search form
        if (key === 'type') {
            document.getElementById('propertyType').value = value;
        } else if (key === 'location') {
            document.getElementById('location').value = value;
        } else if (key === 'price') {
            document.getElementById('priceRange').value = value;
        }
        
        // Trigger search
        document.getElementById('mainSearchForm').dispatchEvent(new Event('submit'));
    }
    
    /* ==========================================================================
       7. PROPERTY MANAGEMENT
       ========================================================================== */
    
    /**
     * Apply property filter
     */
    applyPropertyFilter(filter) {
        const properties = this.propertyManager.getProperties();
        let filteredProperties = properties;
        
        if (filter !== 'all') {
            filteredProperties = properties.filter(property => {
                if (filter === 'featured') {
                    return property.featured === true;
                }
                return property.type === filter;
            });
        }
        
        // Apply current sort
        const sortBy = document.getElementById('propertySort')?.value || 'featured';
        filteredProperties = this.sortPropertiesBy(filteredProperties, sortBy);
        
        // Render filtered properties
        this.renderProperties(filteredProperties);
        
        // Update results count
        this.updateResultsCount(filteredProperties.length, properties.length);
    }
    
    /**
     * Sort properties
     */
    sortProperties(sortBy) {
        const properties = this.propertyManager.getProperties();
        const filteredProperties = this.sortPropertiesBy(properties, sortBy);
        this.renderProperties(filteredProperties);
    }
    
    /**
     * Sort properties by criteria
     */
    sortPropertiesBy(properties, sortBy) {
        return [...properties].sort((a, b) => {
            switch (sortBy) {
                case 'price-low':
                    return a.price - b.price;
                case 'price-high':
                    return b.price - a.price;
                case 'newest':
                    return new Date(b.date) - new Date(a.date);
                case 'area':
                    return b.area - a.area;
                case 'featured':
                default:
                    if (a.featured && !b.featured) return -1;
                    if (!a.featured && b.featured) return 1;
                    return 0;
            }
        });
    }
    
    /**
     * Update results count
     */
    updateResultsCount(filteredCount, totalCount) {
        const resultsInfo = document.createElement('div');
        resultsInfo.className = 'results-info';
        resultsInfo.innerHTML = `
            <p>Showing <strong>${filteredCount}</strong> of <strong>${totalCount}</strong> properties</p>
        `;
        
        const existingInfo = document.querySelector('.results-info');
        if (existingInfo) {
            existingInfo.remove();
        }
        
        const propertiesGrid = document.getElementById('propertiesContainer');
        if (propertiesGrid) {
            propertiesGrid.parentNode.insertBefore(resultsInfo, propertiesGrid);
        }
    }
    
    /**
     * Show property details
     */
    async showPropertyDetails(propertyId) {
        try {
            const property = await this.propertyManager.getPropertyById(propertyId);
            if (!property) {
                throw new Error('Property not found');
            }
            
            // Track property view
            this.trackPropertyView(propertyId);
            
            // Show modal with property details
            this.modalManager.showPropertyModal(property);
            
            // Add to recent views
            this.addToRecentViews(property);
            
        } catch (error) {
            console.error('Error showing property details:', error);
            this.toastManager.showToast('Failed to load property details', 'error');
        }
    }
    
    /**
     * Show service details
     */
    async showServiceDetails(serviceId) {
        try {
            const service = await this.legalManager.getServiceById(serviceId);
            if (!service) {
                throw new Error('Service not found');
            }
            
            // Show modal with service details
            this.modalManager.showServiceModal(service);
            
        } catch (error) {
            console.error('Error showing service details:', error);
            this.toastManager.showToast('Failed to load service details', 'error');
        }
    }
    
    /**
     * Show contact modal
     */
    showContactModal(context = 'general') {
        this.modalManager.openModal('consultation');
        
        // Set context if provided
        if (context && context !== 'general') {
            const consultationType = document.getElementById('consultationType');
            if (consultationType) {
                if (context.includes('property')) {
                    consultationType.value = 'real-estate';
                } else if (context.includes('legal')) {
                    consultationType.value = 'legal';
                }
            }
        }
    }
    
    /**
     * Filter portfolio
     */
    filterPortfolio(category) {
        const items = document.querySelectorAll('.portfolio-item');
        
        items.forEach(item => {
            if (category === 'all' || item.dataset.category === category) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 10);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    }
    
    /* ==========================================================================
       8. UTILITY METHODS
       ========================================================================== */
    
    /**
     * Format price
     */
    formatPrice(price) {
        if (typeof price !== 'number') {
            price = parseFloat(price) || 0;
        }
        
        return new Intl.NumberFormat(DhulBeegConfig.CURRENCY.FORMAT, {
            style: 'currency',
            currency: DhulBeegConfig.CURRENCY.CODE,
            minimumFractionDigits: DhulBeegConfig.CURRENCY.DECIMALS,
            maximumFractionDigits: DhulBeegConfig.CURRENCY.DECIMALS
        }).format(price);
    }
    
    /**
     * Track property view
     */
    trackPropertyView(propertyId) {
        if (!this.analytics.propertyViews[propertyId]) {
            this.analytics.propertyViews[propertyId] = 0;
        }
        this.analytics.propertyViews[propertyId]++;
        
        // Track in analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'view_item', {
                item_id: propertyId,
                value: this.analytics.propertyViews[propertyId]
            });
        }
    }
    
    /**
     * Track conversion
     */
    trackConversion(conversionType) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'conversion', {
                send_to: `AW-${conversionType}`,
                value: 1.0,
                currency: 'USD'
            });
        }
    }
    
    /**
     * Add to search history
     */
    addToSearchHistory(searchData) {
        this.searchHistory.unshift({
            ...searchData,
            timestamp: new Date().toISOString()
        });
        
        // Keep only last 20 searches
        if (this.searchHistory.length > 20) {
            this.searchHistory.pop();
        }
        
        // Save to localStorage
        localStorage.setItem(
            DhulBeegConfig.STORAGE_KEYS.SEARCH_HISTORY,
            JSON.stringify(this.searchHistory)
        );
    }
    
    /**
     * Add to recent views
     */
    addToRecentViews(property) {
        // Check if already in recent views
        const existingIndex = this.recentViews.findIndex(p => p.id === property.id);
        if (existingIndex > -1) {
            this.recentViews.splice(existingIndex, 1);
        }
        
        // Add to beginning
        this.recentViews.unshift({
            id: property.id,
            title: property.title,
            image: property.image,
            price: property.price,
            viewedAt: new Date().toISOString()
        });
        
        // Keep only last 10
        if (this.recentViews.length > 10) {
            this.recentViews.pop();
        }
        
        // Save to localStorage
        localStorage.setItem(
            DhulBeegConfig.STORAGE_KEYS.RECENT_VIEWS,
            JSON.stringify(this.recentViews)
        );
    }
    
    /**
     * Save failed form submission
     */
    saveFailedFormSubmission(formData) {
        const failedSubmissions = JSON.parse(localStorage.getItem('failed_form_submissions') || '[]');
        failedSubmissions.push({
            ...formData,
            retryCount: 0,
            lastAttempt: new Date().toISOString()
        });
        
        localStorage.setItem('failed_form_submissions', JSON.stringify(failedSubmissions));
    }
    
    /**
     * Set up lazy loading
     */
    setupLazyLoading() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.1
            });
            
            lazyImages.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            lazyImages.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        }
    }
    
    /**
     * Set up intersection observer for animations
     */
    setupIntersectionObserver() {
        if (!('IntersectionObserver' in window)) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // Observe elements with animation classes
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }
    
    /**
     * Handle errors
     */
    handleError(error) {
        console.error('Application error:', error);
        
        // Show user-friendly error message
        const errorMessage = this.utils.getErrorMessage(error);
        this.toastManager.showToast(errorMessage, 'error');
        
        // Log to error tracking service
        this.logError(error);
    }
    
    /**
     * Log error to service
     */
    logError(error) {
        const errorData = {
            message: error.message,
            stack: error.stack,
            url: window.location.href,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
        };
        
        // Here you would typically send to error tracking service
        console.log('Error logged:', errorData);
    }
}

/* ==========================================================================
   9. SUPPORTING CLASSES
   ========================================================================== */

/**
 * Core Utilities Class
 */
class AppUtils {
    constructor() {
        this.cache = new Map();
        this.debounceTimers = new Map();
        this.throttleFlags = new Map();
    }
    
    /**
     * Generate unique ID
     */
    generateId(length = 16) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const crypto = window.crypto || window.msCrypto;
        
        if (crypto && crypto.getRandomValues) {
            const values = new Uint32Array(length);
            crypto.getRandomValues(values);
            for (let i = 0; i < length; i++) {
                result += chars[values[i] % chars.length];
            }
        } else {
            for (let i = 0; i < length; i++) {
                result += chars[Math.floor(Math.random() * chars.length)];
            }
        }
        
        return result;
    }
    
    /**
     * Format date
     */
    formatDate(date, format = 'medium') {
        const dateObj = new Date(date);
        const options = {
            short: { year: 'numeric', month: 'short', day: 'numeric' },
            medium: { year: 'numeric', month: 'long', day: 'numeric' },
            long: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
        };
        
        return dateObj.toLocaleDateString(undefined, options[format] || options.medium);
    }
    
    /**
     * Truncate text
     */
    truncateText(text, maxLength = 100) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength).trim() + '...';
    }
    
    /**
     * Debounce function
     */
    debounce(func, delay = DhulBeegConfig.PERFORMANCE.DEBOUNCE_DELAY) {
        return (...args) => {
            clearTimeout(this.debounceTimers.get(func));
            const timer = setTimeout(() => func.apply(this, args), delay);
            this.debounceTimers.set(func, timer);
        };
    }
    
    /**
     * Throttle function
     */
    throttle(func, delay = DhulBeegConfig.PERFORMANCE.THROTTLE_DELAY) {
        return (...args) => {
            if (this.throttleFlags.get(func)) return;
            
            func.apply(this, args);
            this.throttleFlags.set(func, true);
            
            setTimeout(() => {
                this.throttleFlags.set(func, false);
            }, delay);
        };
    }
    
    /**
     * Get error message
     */
    getErrorMessage(error) {
        if (error.message && error.message !== 'Error') {
            return error.message;
        }
        
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            return DhulBeegConfig.ERRORS.NETWORK;
        }
        
        if (error.name === 'TimeoutError') {
            return DhulBeegConfig.ERRORS.TIMEOUT;
        }
        
        return DhulBeegConfig.ERRORS.SERVER;
    }
    
    /**
     * Check if element is in viewport
     */
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    /**
     * Copy to clipboard
     */
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (error) {
            // Fallback method
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            try {
                document.execCommand('copy');
                document.body.removeChild(textArea);
                return true;
            } catch (err) {
                document.body.removeChild(textArea);
                return false;
            }
        }
    }
    
    /**
     * Download file
     */
    downloadFile(content, fileName, contentType = 'text/plain') {
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    /**
     * Get query parameters
     */
    getQueryParams() {
        const params = new URLSearchParams(window.location.search);
        const result = {};
        
        for (const [key, value] of params.entries()) {
            result[key] = value;
        }
        
        return result;
    }
    
    /**
     * Set query parameters
     */
    setQueryParams(params) {
        const url = new URL(window.location);
        Object.keys(params).forEach(key => {
            if (params[key] !== null && params[key] !== undefined) {
                url.searchParams.set(key, params[key]);
            } else {
                url.searchParams.delete(key);
            }
        });
        window.history.pushState({}, '', url.toString());
    }
}

/**
 * Theme Manager Class
 */
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem(DhulBeegConfig.STORAGE_KEYS.THEME) || 
                    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    }
    
    async init() {
        this.applyTheme(this.theme);
        this.setupThemeToggle();
        this.setupSystemThemeListener();
    }
    
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(DhulBeegConfig.STORAGE_KEYS.THEME, theme);
        this.theme = theme;
        
        // Update theme toggle button
        this.updateThemeToggleUI();
    }
    
    toggleTheme() {
        const newTheme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
    }
    
    setupThemeToggle() {
        const toggleBtn = document.getElementById('themeToggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggleTheme());
        }
    }
    
    setupSystemThemeListener() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', (e) => {
            if (!localStorage.getItem(DhulBeegConfig.STORAGE_KEYS.THEME)) {
                this.applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
    
    updateThemeToggleUI() {
        const toggleBtn = document.getElementById('themeToggle');
        if (toggleBtn) {
            const sunIcon = toggleBtn.querySelector('.sun-icon');
            const moonIcon = toggleBtn.querySelector('.moon-icon');
            
            if (this.theme === 'dark') {
                sunIcon.style.opacity = '0';
                sunIcon.style.transform = 'scale(0.5)';
                moonIcon.style.opacity = '1';
                moonIcon.style.transform = 'scale(1)';
            } else {
                sunIcon.style.opacity = '1';
                sunIcon.style.transform = 'scale(1)';
                moonIcon.style.opacity = '0';
                moonIcon.style.transform = 'scale(0.5)';
            }
        }
    }
}

/**
 * Language Manager Class
 */
class LanguageManager {
    constructor() {
        this.currentLanguage = localStorage.getItem(DhulBeegConfig.STORAGE_KEYS.LANGUAGE) || 'en';
        this.translations = {};
    }
    
    async init() {
        await this.loadTranslations();
        this.applyLanguage(this.currentLanguage);
        this.setupLanguageSelector();
    }
    
    async loadTranslations() {
        try {
            const response = await fetch(`translations/${this.currentLanguage}.json`);
            this.translations = await response.json();
        } catch (error) {
            console.error('Error loading translations:', error);
            this.translations = {};
        }
    }
    
    applyLanguage(lang) {
        this.currentLanguage = lang;
        localStorage.setItem(DhulBeegConfig.STORAGE_KEYS.LANGUAGE, lang);
        
        // Update document direction
        const languageConfig = DhulBeegConfig.LANGUAGES[lang.toUpperCase()];
        if (languageConfig) {
            document.documentElement.dir = languageConfig.dir;
            document.documentElement.lang = lang;
        }
        
        // Update UI text
        this.updateUIText();
        
        // Update language selector
        this.updateLanguageSelectorUI();
    }
    
    updateUIText() {
        // This would update all text elements with translations
        // For now, we'll just update a few key elements
        
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.dataset.i18n;
            if (this.translations[key]) {
                element.textContent = this.translations[key];
            }
        });
    }
    
    setupLanguageSelector() {
        const languageBtn = document.getElementById('languageBtn');
        const languageDropdown = document.getElementById('languageDropdown');
        
        if (languageBtn && languageDropdown) {
            // Toggle dropdown
            languageBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                languageDropdown.classList.toggle('show');
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.language-selector')) {
                    languageDropdown.classList.remove('show');
                }
            });
            
            // Language selection
            languageDropdown.querySelectorAll('.language-option').forEach(option => {
                option.addEventListener('click', (e) => {
                    e.preventDefault();
                    const lang = option.dataset.lang;
                    this.applyLanguage(lang);
                    languageDropdown.classList.remove('show');
                });
            });
        }
    }
    
    updateLanguageSelectorUI() {
        const languageBtn = document.getElementById('languageBtn');
        if (languageBtn) {
            const langSpan = languageBtn.querySelector('span');
            if (langSpan) {
                langSpan.textContent = this.currentLanguage.toUpperCase();
            }
        }
        
        // Update active language in dropdown
        document.querySelectorAll('.language-option').forEach(option => {
            option.classList.remove('active');
            if (option.dataset.lang === this.currentLanguage) {
                option.classList.add('active');
            }
        });
    }
    
    toggleLanguageDropdown() {
        const dropdown = document.getElementById('languageDropdown');
        if (dropdown) {
            dropdown.classList.toggle('show');
        }
    }
}

/**
 * Data Manager Class
 */
class DataManager {
    constructor() {
        this.cache = new Map();
        this.cacheExpiry = new Map();
    }
    
    async init() {
        // Initialize data cache
        this.setupCacheCleanup();
    }
    
    async fetchData(endpoint, options = {}) {
        const cacheKey = `${endpoint}_${JSON.stringify(options)}`;
        const now = Date.now();
        
        // Check cache
        if (this.cache.has(cacheKey) && this.cacheExpiry.has(cacheKey)) {
            const expiry = this.cacheExpiry.get(cacheKey);
            if (now < expiry) {
                return this.cache.get(cacheKey);
            } else {
                // Cache expired
                this.cache.delete(cacheKey);
                this.cacheExpiry.delete(cacheKey);
            }
        }
        
        try {
            const response = await fetch(`${DhulBeegConfig.API_BASE_URL}${endpoint}`, {
                timeout: DhulBeegConfig.API_TIMEOUT,
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            // Cache the data
            this.cache.set(cacheKey, data);
            this.cacheExpiry.set(cacheKey, now + DhulBeegConfig.PERFORMANCE.CACHE_DURATION);
            
            return data;
            
        } catch (error) {
            console.error(`Error fetching data from ${endpoint}:`, error);
            throw error;
        }
    }
    
    async postData(endpoint, data, options = {}) {
        try {
            const response = await fetch(`${DhulBeegConfig.API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                body: JSON.stringify(data),
                timeout: DhulBeegConfig.API_TIMEOUT,
                ...options
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return await response.json();
            
        } catch (error) {
            console.error(`Error posting data to ${endpoint}:`, error);
            throw error;
        }
    }
    
    setupCacheCleanup() {
        // Cleanup expired cache every minute
        setInterval(() => {
            const now = Date.now();
            this.cacheExpiry.forEach((expiry, key) => {
                if (now >= expiry) {
                    this.cache.delete(key);
                    this.cacheExpiry.delete(key);
                }
            });
        }, 60000);
    }
    
    clearCache() {
        this.cache.clear();
        this.cacheExpiry.clear();
    }
}

/**
 * Property Manager Class
 */
class PropertyManager {
    constructor() {
        this.properties = [];
        this.filteredProperties = [];
    }
    
    async init() {
        // Load properties if not already loaded
        if (this.properties.length === 0) {
            await this.loadProperties();
        }
    }
    
    async loadProperties() {
        try {
            const response = await fetch('data/properties.json');
            this.properties = await response.json();
            this.filteredProperties = [...this.properties];
            return this.properties;
        } catch (error) {
            console.error('Error loading properties:', error);
            this.properties = [];
            this.filteredProperties = [];
            throw error;
        }
    }
    
    setProperties(properties) {
        this.properties = properties;
        this.filteredProperties = [...properties];
    }
    
    getProperties() {
        return this.filteredProperties.length > 0 ? this.filteredProperties : this.properties;
    }
    
    async getPropertyById(id) {
        // Check if properties are loaded
        if (this.properties.length === 0) {
            await this.loadProperties();
        }
        
        return this.properties.find(property => property.id == id);
    }
    
    filterProperties(filters) {
        this.filteredProperties = this.properties.filter(property => {
            // Apply each filter
            for (const [key, value] of Object.entries(filters)) {
                if (value && value !== 'all') {
                    if (key === 'priceRange') {
                        const [min, max] = value.split('-').map(Number);
                        if (max && property.price > max) return false;
                        if (min && property.price < min) return false;
                    } else if (key === 'searchType') {
                        // Handle search type filters
                        if (value === 'rent' && property.type !== 'rental') return false;
                        if (value === 'buy' && property.type !== 'sale') return false;
                    } else if (property[key] !== value) {
                        return false;
                    }
                }
            }
            return true;
        });
        
        return this.filteredProperties;
    }
    
    searchProperties(query) {
        const searchTerm = query.toLowerCase().trim();
        
        if (!searchTerm) {
            this.filteredProperties = [...this.properties];
            return this.filteredProperties;
        }
        
        this.filteredProperties = this.properties.filter(property => {
            const searchableFields = [
                property.title,
                property.description,
                property.location,
                property.type,
                property.features?.join(' ') || ''
            ].join(' ').toLowerCase();
            
            return searchableFields.includes(searchTerm);
        });
        
        return this.filteredProperties;
    }
    
    getFeaturedProperties(limit = 8) {
        const featured = this.properties.filter(p => p.featured);
        return featured.slice(0, limit);
    }
    
    getRecentProperties(limit = 6) {
        // Sort by date (assuming properties have a date field)
        const sorted = [...this.properties].sort((a, b) => {
            return new Date(b.date || 0) - new Date(a.date || 0);
        });
        
        return sorted.slice(0, limit);
    }
    
    getPropertiesByType(type, limit = null) {
        const filtered = this.properties.filter(p => p.type === type);
        return limit ? filtered.slice(0, limit) : filtered;
    }
    
    getPropertiesByLocation(location, limit = null) {
        const filtered = this.properties.filter(p => p.location === location);
        return limit ? filtered.slice(0, limit) : filtered;
    }
}

/**
 * Legal Manager Class
 */
class LegalManager {
    constructor() {
        this.services = [];
        this.cases = [];
    }
    
    async init() {
        await this.loadServices();
        await this.loadCases();
    }
    
    async loadServices() {
        try {
            const response = await fetch('data/legal-services.json');
            this.services = await response.json();
        } catch (error) {
            console.error('Error loading legal services:', error);
        }
    }
    
    async loadCases() {
        try {
            const response = await fetch('data/legal-cases.json');
            this.cases = await response.json();
        } catch (error) {
            console.error('Error loading legal cases:', error);
        }
    }
    
    async getServiceById(id) {
        if (this.services.length === 0) {
            await this.loadServices();
        }
        
        return this.services.find(service => service.id == id);
    }
    
    getServicesByCategory(category) {
        return this.services.filter(service => service.category === category);
    }
    
    getPopularServices(limit = 6) {
        // Sort by popularity or featured status
        const sorted = [...this.services].sort((a, b) => {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return 0;
        });
        
        return sorted.slice(0, limit);
    }
    
    async submitLegalRequest(formData) {
        try {
            // Here you would typically send to your API
            const response = await fetch(`${DhulBeegConfig.API_BASE_URL}/legal-requests`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem(DhulBeegConfig.STORAGE_KEYS.USER_TOKEN)}`
                },
                body: JSON.stringify(formData)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            return await response.json();
            
        } catch (error) {
            console.error('Error submitting legal request:', error);
            throw error;
        }
    }
}

/**
 * Contact Manager Class
 */
class ContactManager {
    constructor() {
        this.contactFormSubmissions = [];
        this.newsletterSubscribers = [];
    }
    
    async init() {
        // Load saved submissions
        this.loadSavedSubmissions();
    }
    
    async submitContactForm(formData) {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Save to local storage for demo purposes
            this.contactFormSubmissions.push({
                ...formData,
                id: Date.now().toString(),
                status: 'pending'
            });
            
            this.saveSubmissions();
            
            return {
                success: true,
                message: 'Message sent successfully',
                submissionId: Date.now().toString()
            };
            
        } catch (error) {
            console.error('Error submitting contact form:', error);
            throw error;
        }
    }
    
    async subscribeNewsletter(email) {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Check if already subscribed
            const existingIndex = this.newsletterSubscribers.findIndex(sub => sub.email === email);
            
            if (existingIndex > -1) {
                // Update existing subscription
                this.newsletterSubscribers[existingIndex].subscribedAt = new Date().toISOString();
                this.newsletterSubscribers[existingIndex].status = 'active';
            } else {
                // Add new subscription
                this.newsletterSubscribers.push({
                    email,
                    subscribedAt: new Date().toISOString(),
                    status: 'active'
                });
            }
            
            this.saveSubscribers();
            
            return {
                success: true,
                message: 'Successfully subscribed to newsletter'
            };
            
        } catch (error) {
            console.error('Error subscribing to newsletter:', error);
            throw error;
        }
    }
    
    async bookConsultation(formData) {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            return {
                success: true,
                message: 'Consultation booked successfully',
                bookingId: Date.now().toString(),
                date: formData.consultationDate,
                time: formData.consultationTime
            };
            
        } catch (error) {
            console.error('Error booking consultation:', error);
            throw error;
        }
    }
    
    loadSavedSubmissions() {
        try {
            const savedSubmissions = localStorage.getItem('contact_form_submissions');
            if (savedSubmissions) {
                this.contactFormSubmissions = JSON.parse(savedSubmissions);
            }
            
            const savedSubscribers = localStorage.getItem('newsletter_subscribers');
            if (savedSubscribers) {
                this.newsletterSubscribers = JSON.parse(savedSubscribers);
            }
        } catch (error) {
            console.error('Error loading saved submissions:', error);
        }
    }
    
    saveSubmissions() {
        try {
            localStorage.setItem('contact_form_submissions', JSON.stringify(this.contactFormSubmissions));
            localStorage.setItem('newsletter_subscribers', JSON.stringify(this.newsletterSubscribers));
        } catch (error) {
            console.error('Error saving submissions:', error);
        }
    }
    
    saveSubscribers() {
        try {
            localStorage.setItem('newsletter_subscribers', JSON.stringify(this.newsletterSubscribers));
        } catch (error) {
            console.error('Error saving subscribers:', error);
        }
    }
}

/**
 * Map Manager Class
 */
class MapManager {
    constructor() {
        this.maps = new Map();
        this.markers = new Map();
    }
    
    async init() {
        // Initialize any maps that are already in the DOM
        this.initializeAllMaps();
    }
    
    initializeAllMaps() {
        // Initialize any map containers found
        const mapContainers = document.querySelectorAll('[data-map]');
        mapContainers.forEach(container => {
            const mapId = container.id;
            const config = container.dataset;
            
            if (mapId && !this.maps.has(mapId)) {
                this.initializeMap(mapId, config);
            }
        });
    }
    
    initializeMap(mapId, config = {}) {
        try {
            const container = document.getElementById(mapId);
            if (!container) return null;
            
            const center = config.center ? 
                config.center.split(',').map(Number) : 
                DhulBeegConfig.MAP_CONFIG.DEFAULT_CENTER;
            
            const zoom = config.zoom ? parseInt(config.zoom) : DhulBeegConfig.MAP_CONFIG.DEFAULT_ZOOM;
            
            const map = L.map(mapId).setView(center, zoom);
            
            L.tileLayer(DhulBeegConfig.MAP_CONFIG.TILE_LAYER, {
                attribution: DhulBeegConfig.MAP_CONFIG.ATTRIBUTION,
                maxZoom: DhulBeegConfig.MAP_CONFIG.MAX_ZOOM,
                minZoom: DhulBeegConfig.MAP_CONFIG.MIN_ZOOM
            }).addTo(map);
            
            this.maps.set(mapId, map);
            
            // Add markers if specified
            if (config.markers) {
                this.addMarkers(mapId, JSON.parse(config.markers));
            }
            
            return map;
            
        } catch (error) {
            console.error(`Error initializing map ${mapId}:`, error);
            return null;
        }
    }
    
    addMarkers(mapId, markers) {
        const map = this.maps.get(mapId);
        if (!map) return;
        
        const mapMarkers = [];
        
        markers.forEach(markerData => {
            const marker = L.marker(markerData.coords).addTo(map);
            
            if (markerData.popup) {
                marker.bindPopup(markerData.popup);
            }
            
            if (markerData.icon) {
                const icon = L.icon({
                    iconUrl: markerData.icon,
                    iconSize: markerData.iconSize || [25, 41],
                    iconAnchor: markerData.iconAnchor || [12, 41],
                    popupAnchor: markerData.popupAnchor || [0, -41]
                });
                marker.setIcon(icon);
            }
            
            mapMarkers.push(marker);
        });
        
        this.markers.set(mapId, mapMarkers);
        
        // Fit bounds if multiple markers
        if (markers.length > 1) {
            const bounds = L.latLngBounds(markers.map(m => m.coords));
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }
    
    addMarker(mapId, markerData) {
        const map = this.maps.get(mapId);
        if (!map) return null;
        
        const marker = L.marker(markerData.coords).addTo(map);
        
        if (markerData.popup) {
            marker.bindPopup(markerData.popup);
        }
        
        const markers = this.markers.get(mapId) || [];
        markers.push(marker);
        this.markers.set(mapId, markers);
        
        return marker;
    }
    
    removeMap(mapId) {
        const map = this.maps.get(mapId);
        if (map) {
            map.remove();
            this.maps.delete(mapId);
            this.markers.delete(mapId);
        }
    }
    
    getMap(mapId) {
        return this.maps.get(mapId);
    }
    
    setView(mapId, coords, zoom) {
        const map = this.maps.get(mapId);
        if (map) {
            map.setView(coords, zoom);
        }
    }
    
    flyTo(mapId, coords, zoom) {
        const map = this.maps.get(mapId);
        if (map) {
            map.flyTo(coords, zoom);
        }
    }
}

/**
 * Modal Manager Class
 */
class ModalManager {
    constructor() {
        this.modals = new Map();
        this.activeModal = null;
        this.modalStack = [];
    }
    
    async init() {
        this.cacheModals();
        this.setupEventListeners();
    }
    
    cacheModals() {
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            const modalId = modal.id.replace('Modal', '');
            this.modals.set(modalId, modal);
        });
    }
    
    setupEventListeners() {
        // Close modals on overlay click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                this.closeActiveModal();
            }
        });
        
        // Close modals on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeModal) {
                this.closeActiveModal();
            }
        });
        
        // Close modal buttons
        document.querySelectorAll('.close-modal').forEach(button => {
            button.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal-overlay');
                if (modal) {
                    const modalId = modal.id.replace('Modal', '');
                    this.closeModal(modalId);
                }
            });
        });
    }
    
    openModal(modalId, options = {}) {
        const modal = this.modals.get(modalId);
        if (!modal) {
            console.error(`Modal ${modalId} not found`);
            return;
        }
        
        // Close current modal if exists
        if (this.activeModal && this.activeModal !== modal) {
            this.closeModal(this.activeModal.id.replace('Modal', ''));
        }
        
        // Add to stack
        this.modalStack.push(modalId);
        this.activeModal = modal;
        
        // Show modal
        modal.classList.add('active');
        document.body.classList.add('modal-open');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Call onOpen callback if provided
        if (options.onOpen && typeof options.onOpen === 'function') {
            options.onOpen();
        }
        
        // Dispatch event
        this.dispatchModalEvent('modalOpen', { modalId });
    }
    
    closeModal(modalId) {
        const modal = this.modals.get(modalId);
        if (!modal) return;
        
        // Remove from stack
        const index = this.modalStack.indexOf(modalId);
        if (index > -1) {
            this.modalStack.splice(index, 1);
        }
        
        // Hide modal
        modal.classList.remove('active');
        
        // Update active modal
        if (this.activeModal === modal) {
            this.activeModal = this.modalStack.length > 0 ? 
                this.modals.get(this.modalStack[this.modalStack.length - 1]) : null;
        }
        
        // If no more modals, restore body scroll
        if (this.modalStack.length === 0) {
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
        }
        
        // Dispatch event
        this.dispatchModalEvent('modalClose', { modalId });
    }
    
    closeActiveModal() {
        if (this.activeModal) {
            const modalId = this.activeModal.id.replace('Modal', '');
            this.closeModal(modalId);
        }
    }
    
    showPropertyModal(property) {
        this.openModal('property', {
            onOpen: () => {
                this.updatePropertyModalContent(property);
            }
        });
    }
    
    updatePropertyModalContent(property) {
        const title = document.getElementById('propertyModalTitle');
        const body = document.getElementById('propertyModalBody');
        
        if (title) title.textContent = property.title;
        
        if (body) {
            body.innerHTML = `
                <div class="property-modal-content">
                    <div class="property-modal-gallery">
                        <div class="property-modal-main-image">
                            <img src="${property.image}" alt="${property.title}">
                        </div>
                        ${property.images && property.images.length > 0 ? 
                            property.images.slice(0, 4).map(img => `
                                <div class="property-modal-thumbnail">
                                    <img src="${img}" alt="${property.title}">
                                </div>
                            `).join('') : ''
                        }
                    </div>
                    
                    <div class="property-modal-details">
                        <div class="property-modal-features">
                            <div class="property-modal-feature">
                                <i class="ri-home-3-line"></i>
                                <span>${property.bedrooms || 'N/A'} Bedrooms</span>
                            </div>
                            <div class="property-modal-feature">
                                <i class="ri-bathroom-line"></i>
                                <span>${property.bathrooms || 'N/A'} Bathrooms</span>
                            </div>
                            <div class="property-modal-feature">
                                <i class="ri-ruler-line"></i>
                                <span>${property.area || 'N/A'} m² Area</span>
                            </div>
                            <div class="property-modal-feature">
                                <i class="ri-building-line"></i>
                                <span>${property.type || 'N/A'}</span>
                            </div>
                        </div>
                        
                        <div class="property-modal-price">
                            <h3>${this.formatPrice(property.price)}</h3>
                            <p>${property.priceType || 'For Sale'}</p>
                        </div>
                    </div>
                    
                    <div class="property-modal-description">
                        <h4>Description</h4>
                        <p>${property.description || 'No description available.'}</p>
                    </div>
                    
                    <div class="property-modal-actions">
                        <button class="btn btn-primary" id="modalContactBtn">
                            <i class="ri-phone-line"></i> Contact Agent
                        </button>
                        <button class="btn btn-outline" id="modalScheduleBtn">
                            <i class="ri-calendar-line"></i> Schedule Viewing
                        </button>
                    </div>
                </div>
            `;
            
            // Add event listeners to modal buttons
            const contactBtn = document.getElementById('modalContactBtn');
            if (contactBtn) {
                contactBtn.addEventListener('click', () => {
                    this.closeModal('property');
                    this.showContactModal(`property-${property.id}`);
                });
            }
            
            const scheduleBtn = document.getElementById('modalScheduleBtn');
            if (scheduleBtn) {
                scheduleBtn.addEventListener('click', () => {
                    this.closeModal('property');
                    this.openModal('consultation');
                });
            }
        }
    }
    
    showServiceModal(service) {
        this.openModal('service', {
            onOpen: () => {
                this.updateServiceModalContent(service);
            }
        });
    }
    
    updateServiceModalContent(service) {
        const title = document.getElementById('serviceModalTitle');
        const body = document.getElementById('serviceModalBody');
        
        if (title) title.textContent = service.title;
        
        if (body) {
            body.innerHTML = `
                <div class="service-modal-content">
                    <div class="service-modal-icon">
                        <i class="${service.icon}"></i>
                    </div>
                    
                    <div class="service-modal-details">
                        <p class="service-modal-description">${service.description}</p>
                        <div class="service-modal-price">
                            Starting from ${this.formatPrice(service.price)}
                        </div>
                    </div>
                    
                    <div class="service-modal-features">
                        <h4>What's Included:</h4>
                        <ul>
                            ${service.features.map(feature => `
                                <li><i class="ri-check-line"></i> ${feature}</li>
                            `).join('')}
                        </ul>
                    </div>
                    
                    <div class="service-modal-process">
                        <h4>Process:</h4>
                        <div class="process-steps">
                            ${service.process ? service.process.map((step, index) => `
                                <div class="process-step">
                                    <h5>Step ${index + 1}: ${step.title}</h5>
                                    <p>${step.description}</p>
                                </div>
                            `).join('') : `
                                <p>Contact us to learn about our process for this service.</p>
                            `}
                        </div>
                    </div>
                    
                    <div class="service-modal-actions">
                        <button class="btn btn-primary btn-block" id="modalBookServiceBtn">
                            <i class="ri-calendar-line"></i> Book This Service
                        </button>
                    </div>
                </div>
            `;
            
            // Add event listener to book button
            const bookBtn = document.getElementById('modalBookServiceBtn');
            if (bookBtn) {
                bookBtn.addEventListener('click', () => {
                    this.closeModal('service');
                    this.openModal('consultation');
                });
            }
        }
    }
    
    formatPrice(price) {
        // Simple price formatting
        if (typeof price === 'number') {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(price);
        }
        return price;
    }
    
    dispatchModalEvent(eventName, detail) {
        const event = new CustomEvent(eventName, { detail });
        document.dispatchEvent(event);
    }
}

/**
 * Toast Manager Class
 */
class ToastManager {
    constructor() {
        this.toastContainer = document.getElementById('toastContainer');
        this.toastQueue = [];
        this.isShowing = false;
        this.defaultOptions = {
            duration: 5000,
            position: 'bottom-right',
            type: 'info'
        };
    }
    
    async init() {
        if (!this.toastContainer) {
            this.createToastContainer();
        }
    }
    
    createToastContainer() {
        this.toastContainer = document.createElement('div');
        this.toastContainer.id = 'toastContainer';
        this.toastContainer.className = 'toast-container';
        document.body.appendChild(this.toastContainer);
    }
    
    showToast(message, type = 'info', options = {}) {
        const toastOptions = { ...this.defaultOptions, ...options, type };
        
        // Add to queue
        this.toastQueue.push({ message, options: toastOptions });
        
        // Show next toast if not already showing
        if (!this.isShowing) {
            this.showNextToast();
        }
    }
    
    showNextToast() {
        if (this.toastQueue.length === 0) {
            this.isShowing = false;
            return;
        }
        
        this.isShowing = true;
        const { message, options } = this.toastQueue.shift();
        
        // Create toast element
        const toast = this.createToastElement(message, options);
        
        // Add to container
        this.toastContainer.appendChild(toast);
        
        // Trigger animation
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });
        
        // Auto remove after duration
        const removeToast = () => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode === this.toastContainer) {
                    this.toastContainer.removeChild(toast);
                }
                this.showNextToast();
            }, 300);
        };
        
        // Set up close button
        const closeBtn = toast.querySelector('.toast-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', removeToast);
        }
        
        // Auto remove
        if (options.duration !== 0) {
            setTimeout(removeToast, options.duration);
        }
    }
    
    createToastElement(message, options) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${options.type}`;
        
        const icons = {
            success: 'ri-checkbox-circle-line',
            error: 'ri-close-circle-line',
            warning: 'ri-error-warning-line',
            info: 'ri-information-line'
        };
        
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="${icons[options.type] || icons.info}"></i>
            </div>
            <div class="toast-content">
                <p class="toast-message">${message}</p>
            </div>
            <button class="toast-close">
                <i class="ri-close-line"></i>
            </button>
        `;
        
        return toast;
    }
    
    success(message, options = {}) {
        this.showToast(message, 'success', options);
    }
    
    error(message, options = {}) {
        this.showToast(message, 'error', options);
    }
    
    warning(message, options = {}) {
        this.showToast(message, 'warning', options);
    }
    
    info(message, options = {}) {
        this.showToast(message, 'info', options);
    }
    
    clearAll() {
        this.toastQueue = [];
        while (this.toastContainer.firstChild) {
            this.toastContainer.removeChild(this.toastContainer.firstChild);
        }
        this.isShowing = false;
    }
}

/**
 * Authentication Manager Class
 */
class AuthManager {
    constructor() {
        this.user = null;
        this.token = null;
    }
    
    async init() {
        this.token = localStorage.getItem(DhulBeegConfig.STORAGE_KEYS.USER_TOKEN);
        this.user = JSON.parse(localStorage.getItem(DhulBeegConfig.STORAGE_KEYS.USER_DATA) || 'null');
        
        // Validate token if exists
        if (this.token) {
            const isValid = await this.validateToken(this.token);
            if (!isValid) {
                this.logout();
            }
        }
    }
    
    async login(email, password) {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // For demo purposes, accept any non-empty credentials
            if (!email || !password) {
                throw new Error('Email and password are required');
            }
            
            // Generate mock user data
            const mockUser = {
                id: Date.now().toString(),
                email,
                name: email.split('@')[0],
                avatar: 'assets/default-avatar.jpg',
                role: 'user',
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            };
            
            const mockToken = this.generateMockToken();
            
            // Save to localStorage
            this.setAuthData(mockUser, mockToken);
            
            return {
                success: true,
                user: mockUser,
                token: mockToken
            };
            
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }
    
    async register(userData) {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Validate required fields
            const required = ['firstName', 'lastName', 'email', 'password', 'userType'];
            for (const field of required) {
                if (!userData[field]) {
                    throw new Error(`${field} is required`);
                }
            }
            
            // Check password confirmation
            if (userData.password !== userData.confirmPassword) {
                throw new Error('Passwords do not match');
            }
            
            // Check terms agreement
            if (!userData.agreeTerms) {
                throw new Error('You must agree to the terms and conditions');
            }
            
            // Generate mock user data
            const mockUser = {
                id: Date.now().toString(),
                email: userData.email,
                name: `${userData.firstName} ${userData.lastName}`,
                phone: userData.phone || '',
                userType: userData.userType,
                avatar: 'assets/default-avatar.jpg',
                role: 'user',
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            };
            
            const mockToken = this.generateMockToken();
            
            // Save to localStorage
            this.setAuthData(mockUser, mockToken);
            
            return {
                success: true,
                user: mockUser,
                token: mockToken
            };
            
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }
    
    async logout() {
        // Clear auth data
        localStorage.removeItem(DhulBeegConfig.STORAGE_KEYS.USER_TOKEN);
        localStorage.removeItem(DhulBeegConfig.STORAGE_KEYS.USER_DATA);
        
        this.user = null;
        this.token = null;
        
        // Redirect to home
        window.location.href = '/';
    }
    
    async validateToken(token) {
        // Simulate token validation
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // For demo, check if token exists and has valid format
        if (!token) return false;
        
        // Check if token is expired (mock)
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) return false;
        
        try {
            const payload = JSON.parse(atob(tokenParts[1]));
            const expiry = payload.exp * 1000; // Convert to milliseconds
            return Date.now() < expiry;
        } catch {
            return false;
        }
    }
    
    async getCurrentUser() {
        if (!this.token) return null;
        
        const isValid = await this.validateToken(this.token);
        if (!isValid) {
            this.logout();
            return null;
        }
        
        return this.user;
    }
    
    setAuthData(user, token) {
        this.user = user;
        this.token = token;
        
        localStorage.setItem(DhulBeegConfig.STORAGE_KEYS.USER_TOKEN, token);
        localStorage.setItem(DhulBeegConfig.STORAGE_KEYS.USER_DATA, JSON.stringify(user));
    }
    
    generateMockToken() {
        const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
        const payload = btoa(JSON.stringify({
            sub: this.user?.id || Date.now().toString(),
            name: this.user?.name || 'User',
            email: this.user?.email || '',
            role: this.user?.role || 'user',
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
        }));
        const signature = 'mock_signature';
        
        return `${header}.${payload}.${signature}`;
    }
    
    isAuthenticated() {
        return !!this.token && !!this.user;
    }
    
    hasRole(role) {
        return this.user?.role === role;
    }
    
    updateUserProfile(updates) {
        if (!this.user) return false;
        
        this.user = { ...this.user, ...updates };
        localStorage.setItem(DhulBeegConfig.STORAGE_KEYS.USER_DATA, JSON.stringify(this.user));
        
        return true;
    }
}

/**
 * Search Manager Class
 */
class SearchManager {
    constructor() {
        this.searchHistory = [];
        this.savedSearches = [];
    }
    
    async init() {
        this.loadSearchHistory();
        this.loadSavedSearches();
    }
    
    async searchProperties(filters) {
        try {
            // Get properties from property manager
            const propertyManager = new PropertyManager();
            const properties = await propertyManager.filterProperties(filters);
            
            // Add to search history
            this.addToHistory(filters);
            
            return properties;
            
        } catch (error) {
            console.error('Search error:', error);
            throw error;
        }
    }
    
    async advancedSearch(criteria) {
        // Implement advanced search logic
        console.log('Advanced search:', criteria);
        return [];
    }
    
    addToHistory(searchData) {
        this.searchHistory.unshift({
            ...searchData,
            timestamp: new Date().toISOString(),
            id: Date.now().toString()
        });
        
        // Keep only last 50 searches
        if (this.searchHistory.length > 50) {
            this.searchHistory.pop();
        }
        
        this.saveSearchHistory();
    }
    
    saveSearch(searchData, name) {
        this.savedSearches.push({
            ...searchData,
            name,
            id: Date.now().toString(),
            savedAt: new Date().toISOString()
        });
        
        this.saveSavedSearches();
    }
    
    deleteSavedSearch(searchId) {
        const index = this.savedSearches.findIndex(search => search.id === searchId);
        if (index > -1) {
            this.savedSearches.splice(index, 1);
            this.saveSavedSearches();
            return true;
        }
        return false;
    }
    
    loadSearchHistory() {
        try {
            const history = localStorage.getItem('search_history');
            if (history) {
                this.searchHistory = JSON.parse(history);
            }
        } catch (error) {
            console.error('Error loading search history:', error);
        }
    }
    
    loadSavedSearches() {
        try {
            const saved = localStorage.getItem('saved_searches');
            if (saved) {
                this.savedSearches = JSON.parse(saved);
            }
        } catch (error) {
            console.error('Error loading saved searches:', error);
        }
    }
    
    saveSearchHistory() {
        try {
            localStorage.setItem('search_history', JSON.stringify(this.searchHistory));
        } catch (error) {
            console.error('Error saving search history:', error);
        }
    }
    
    saveSavedSearches() {
        try {
            localStorage.setItem('saved_searches', JSON.stringify(this.savedSearches));
        } catch (error) {
            console.error('Error saving searches:', error);
        }
    }
    
    clearSearchHistory() {
        this.searchHistory = [];
        localStorage.removeItem('search_history');
    }
}

/**
 * Animation Manager Class
 */
class AnimationManager {
    constructor() {
        this.animations = new Map();
        this.intersectionObservers = new Map();
    }
    
    async init() {
        this.setupScrollAnimations();
        this.setupHoverAnimations();
        this.setupPageTransitions();
    }
    
    setupScrollAnimations() {
        if (!('IntersectionObserver' in window)) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateOnScroll(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // Observe elements with animation classes
        document.querySelectorAll('[data-animate]').forEach(el => {
            observer.observe(el);
        });
    }
    
    animateOnScroll(element) {
        const animation = element.dataset.animate;
        const delay = element.dataset.delay || 0;
        
        setTimeout(() => {
            element.classList.add('animate-in', `animate-${animation}`);
        }, parseInt(delay));
    }
    
    setupHoverAnimations() {
        // Add hover effects to interactive elements
        document.querySelectorAll('[data-hover]').forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                this.animateOnHover(e.target, 'enter');
            });
            
            element.addEventListener('mouseleave', (e) => {
                this.animateOnHover(e.target, 'leave');
            });
        });
    }
    
    animateOnHover(element, type) {
        const animation = element.dataset.hover;
        
        if (type === 'enter') {
            element.classList.add(`hover-${animation}`);
        } else {
            element.classList.remove(`hover-${animation}`);
        }
    }
    
    setupPageTransitions() {
        // Add page transition animations
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]:not([href="#"])');
            if (link) {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    this.animateScrollTo(target);
                }
            }
        });
    }
    
    animateScrollTo(element) {
        const offset = 100; // Account for header
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
    
    animateElement(element, animation, options = {}) {
        return new Promise((resolve) => {
            const duration = options.duration || DhulBeegConfig.ANIMATION.DURATION.NORMAL;
            
            element.style.animation = `${animation} ${duration}ms ${options.easing || 'ease'}`;
            
            setTimeout(() => {
                element.style.animation = '';
                resolve();
            }, duration);
        });
    }
    
    staggerAnimation(elements, animation, options = {}) {
        const delay = options.delay || 100;
        
        elements.forEach((element, index) => {
            setTimeout(() => {
                this.animateElement(element, animation, options);
            }, index * delay);
        });
    }
    
    createParticles(element, count = 20) {
        const particles = [];
        
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: var(--color-secondary);
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
            `;
            
            const rect = element.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            
            document.body.appendChild(particle);
            particles.push(particle);
        }
        
        // Animate particles
        particles.forEach((particle, index) => {
            const angle = (Math.PI * 2 * index) / count;
            const distance = 50 + Math.random() * 50;
            const duration = 500 + Math.random() * 500;
            
            particle.animate([
                {
                    transform: `translate(0, 0) scale(1)`,
                    opacity: 1
                },
                {
                    transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`,
                    opacity: 0
                }
            ], {
                duration: duration,
                easing: 'ease-out'
            }).onfinish = () => {
                particle.remove();
            };
        });
    }
}

/**
 * Validation Manager Class
 */
class ValidationManager {
    constructor() {
        this.rules = new Map();
        this.messages = new Map();
    }
    
    async init() {
        this.setupDefaultRules();
        this.setupFormValidation();
    }
    
    setupDefaultRules() {
        // Email validation
        this.addRule('email', (value) => {
            return DhulBeegConfig.VALIDATION.EMAIL.test(value);
        }, 'Please enter a valid email address');
        
        // Phone validation
        this.addRule('phone', (value) => {
            return DhulBeegConfig.VALIDATION.PHONE.test(value);
        }, 'Please enter a valid phone number');
        
        // Required field
        this.addRule('required', (value) => {
            return value !== null && value !== undefined && value.toString().trim() !== '';
        }, 'This field is required');
        
        // Minimum length
        this.addRule('minLength', (value, length) => {
            return value.length >= length;
        }, (length) => `Minimum ${length} characters required`);
        
        // Maximum length
        this.addRule('maxLength', (value, length) => {
            return value.length <= length;
        }, (length) => `Maximum ${length} characters allowed`);
        
        // Password strength
        this.addRule('password', (value) => {
            return DhulBeegConfig.VALIDATION.PASSWORD.test(value);
        }, 'Password must contain at least 8 characters, including uppercase, lowercase, number and special character');
        
        // URL validation
        this.addRule('url', (value) => {
            return DhulBeegConfig.VALIDATION.URL.test(value);
        }, 'Please enter a valid URL');
        
        // Number validation
        this.addRule('number', (value) => {
            return !isNaN(parseFloat(value)) && isFinite(value);
        }, 'Please enter a valid number');
        
        // Date validation
        this.addRule('date', (value) => {
            return !isNaN(Date.parse(value));
        }, 'Please enter a valid date');
    }
    
    addRule(name, validator, message) {
        this.rules.set(name, validator);
        this.messages.set(name, message);
    }
    
    validateField(value, rules) {
        const errors = [];
        
        for (const rule of rules) {
            const [ruleName, ...params] = Array.isArray(rule) ? rule : [rule];
            const validator = this.rules.get(ruleName);
            
            if (validator) {
                const isValid = validator(value, ...params);
                
                if (!isValid) {
                    const message = this.messages.get(ruleName);
                    errors.push(typeof message === 'function' ? message(...params) : message);
                }
            }
        }
        
        return errors;
    }
    
    validateForm(formData, formRules) {
        const errors = {};
        let isValid = true;
        
        for (const [field, rules] of Object.entries(formRules)) {
            const value = formData[field];
            const fieldErrors = this.validateField(value, rules);
            
            if (fieldErrors.length > 0) {
                errors[field] = fieldErrors;
                isValid = false;
            }
        }
        
        return { isValid, errors };
    }
    
    setupFormValidation() {
        // Add validation to forms
        document.querySelectorAll('[data-validate]').forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!this.validateFormElement(form)) {
                    e.preventDefault();
                }
            });
            
            // Add real-time validation
            form.querySelectorAll('input, select, textarea').forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateInput(input);
                });
                
                input.addEventListener('input', () => {
                    this.clearValidation(input);
                });
            });
        });
    }
    
    validateFormElement(form) {
        const inputs = form.querySelectorAll('input, select, textarea');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateInput(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    validateInput(input) {
        const rules = input.dataset.validate ? input.dataset.validate.split('|') : [];
        const value = input.value.trim();
        const errors = this.validateField(value, rules);
        
        this.showValidationFeedback(input, errors);
        
        return errors.length === 0;
    }
    
    showValidationFeedback(input, errors) {
        // Clear previous feedback
        this.clearValidation(input);
        
        if (errors.length > 0) {
            input.classList.add('invalid');
            
            // Create error message element
            const errorElement = document.createElement('div');
            errorElement.className = 'validation-error';
            errorElement.innerHTML = errors.map(error => `
                <p><i class="ri-close-circle-line"></i> ${error}</p>
            `).join('');
            
            // Insert after input
            input.parentNode.insertBefore(errorElement, input.nextSibling);
        } else {
            input.classList.add('valid');
        }
    }
    
    clearValidation(input) {
        input.classList.remove('invalid', 'valid');
        
        const errorElement = input.parentNode.querySelector('.validation-error');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    validateEmail(email) {
        return this.rules.get('email')(email);
    }
    
    validatePhone(phone) {
        return this.rules.get('phone')(phone);
    }
    
    validatePassword(password) {
        return this.rules.get('password')(password);
    }
    
    validateRequired(value) {
        return this.rules.get('required')(value);
    }
    
    validateContactForm(formData) {
        const rules = {
            name: ['required'],
            email: ['required', 'email'],
            phone: ['required', 'phone'],
            serviceType: ['required'],
            subject: ['required'],
            message: ['required', ['minLength', 10]]
        };
        
        return this.validateForm(formData, rules).isValid;
    }
}

/* ==========================================================================
   10. MAIN APPLICATION INSTANCE
   ========================================================================== */

// Create global application instance
const DhulBeegAppInstance = new DhulBeegApp();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    DhulBeegAppInstance.init();
});

// Make app available globally
window.DhulBeegApp = DhulBeegAppInstance;

// Export modules for testing and extension
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        DhulBeegApp: DhulBeegAppInstance,
        AppUtils,
        ThemeManager,
        LanguageManager,
        DataManager,
        PropertyManager,
        LegalManager,
        ContactManager,
        MapManager,
        ModalManager,
        ToastManager,
        AuthManager,
        SearchManager,
        AnimationManager,
        ValidationManager
    };
}

/* ==========================================================================
   END OF SCRIPT - Total Lines: 4125
   ========================================================================== */