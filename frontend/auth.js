// Authentication Manager
class AuthManager {
    constructor() {
        this.init();
    }

    init() {
        this.checkAuthStatus();
        this.setupEventListeners();
    }

    // Check authentication status
    checkAuthStatus() {
        const isAuthenticated = api.isAuthenticated();

        if (isAuthenticated) {
            this.showAuthenticatedUI();
        } else {
            this.showUnauthenticatedUI();
        }
    }

    // Show UI for authenticated users
    showAuthenticatedUI() {
        const user = api.getCurrentUser();

        // Update navigation
        document.getElementById('loginLink').style.display = 'none';
        document.getElementById('registerLink').style.display = 'none';
        document.getElementById('dashboardLink').style.display = 'inline-block';
        document.getElementById('logoutBtn').style.display = 'inline-block';

        // Update dashboard link with user name
        const dashboardLink = document.getElementById('dashboardLink');
        dashboardLink.textContent = `Welcome, ${user.name}`;
        dashboardLink.href = '#';
        dashboardLink.setAttribute('data-page', 'dashboard');

        // Load dashboard if on dashboard page
        if (window.currentPage === 'dashboard') {
            this.loadDashboard();
        }
    }

    // Show UI for unauthenticated users
    showUnauthenticatedUI() {
        document.getElementById('loginLink').style.display = 'inline-block';
        document.getElementById('registerLink').style.display = 'inline-block';
        document.getElementById('dashboardLink').style.display = 'none';
        document.getElementById('logoutBtn').style.display = 'none';
    }

    // Setup event listeners
    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Register form
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        // Close modal buttons
        document.querySelectorAll('.close-modal').forEach(button => {
            button.addEventListener('click', () => {
                this.closeAllModals();
            });
        });

        // Close modal when clicking outside
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeAllModals();
                }
            });
        });
    }

    // Handle login
    async handleLogin(e) {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        const loginBtn = e.target.querySelector('button[type="submit"]');
        const originalText = loginBtn.textContent;
        loginBtn.textContent = 'Logging in...';
        loginBtn.disabled = true;

        try {
            const result = await api.auth.login({ email, password });

            if (result.status === 'success') {
                // Store token and user data
                localStorage.setItem('token', result.token);
                localStorage.setItem('user', JSON.stringify(result.user));

                // Update UI
                this.showAuthenticatedUI();
                this.closeAllModals();

                // Show success message
                this.showNotification('Login successful!', 'success');

                // Clear form
                document.getElementById('loginForm').reset();

                // Load dashboard
                this.loadPage('dashboard');
            }
        } catch (error) {
            this.showNotification(error.message || 'Login failed', 'error');
        } finally {
            loginBtn.textContent = originalText;
            loginBtn.disabled = false;
        }
    }

    // Handle register
    async handleRegister(e) {
        e.preventDefault();

        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const department = document.getElementById('registerDepartment').value;

        const registerBtn = e.target.querySelector('button[type="submit"]');
        const originalText = registerBtn.textContent;
        registerBtn.textContent = 'Registering...';
        registerBtn.disabled = true;

        try {
            const result = await api.auth.register({
                name,
                email,
                password,
                department
            });

            if (result.status === 'success') {
                // Auto-login after registration
                localStorage.setItem('token', result.token);
                localStorage.setItem('user', JSON.stringify(result.user));

                // Update UI
                this.showAuthenticatedUI();
                this.closeAllModals();

                // Show success message
                this.showNotification('Registration successful!', 'success');

                // Clear form
                document.getElementById('registerForm').reset();

                // Load dashboard
                this.loadPage('dashboard');
            }
        } catch (error) {
            this.showNotification(error.message || 'Registration failed', 'error');
        } finally {
            registerBtn.textContent = originalText;
            registerBtn.disabled = false;
        }
    }

    // Handle logout
    async handleLogout() {
        try {
            await api.auth.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Clear local storage
            api.clearAuth();

            // Update UI
            this.showUnauthenticatedUI();

            // Show notification
            this.showNotification('Logged out successfully', 'success');

            // Redirect to home
            this.loadPage('home');
        }
    }

    // Load dashboard
    async loadDashboard() {
        try {
            const result = await api.auth.getCurrentUser();

            if (result.status === 'success') {
                const pageContent = document.getElementById('page-content');
                pageContent.innerHTML = `
                    <div class="dashboard">
                        <div class="dashboard-header">
                            <h2>Dashboard</h2>
                            <span class="user-role">${result.user.role}</span>
                        </div>
                        
                        <div class="user-info">
                            <div class="info-card">
                                <h3>Profile Information</h3>
                                <p><strong>Name:</strong> ${result.user.name}</p>
                                <p><strong>Email:</strong> ${result.user.email}</p>
                                <p><strong>Department:</strong> ${result.user.department}</p>
                                <p><strong>Joined:</strong> ${new Date(result.user.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                        
                        <div class="dashboard-stats">
                            <div class="stat-card">
                                <h3>12</h3>
                                <p>Properties Listed</p>
                            </div>
                            <div class="stat-card">
                                <h3>8</h3>
                                <p>Active Cases</p>
                            </div>
                            <div class="stat-card">
                                <h3>24</h3>
                                <p>Total Clients</p>
                            </div>
                            <div class="stat-card">
                                <h3>95%</h3>
                                <p>Satisfaction Rate</p>
                            </div>
                        </div>
                        
                        <div class="dashboard-actions">
                            <button class="btn-primary" onclick="authManager.loadPage('properties')">
                                View Properties
                            </button>
                            <button class="btn-secondary" onclick="authManager.loadPage('services')">
                                Our Services
                            </button>
                        </div>
                    </div>
                `;
            }
        } catch (error) {
            this.showNotification('Failed to load dashboard', 'error');
        }
    }

    // Load a page
    loadPage(pageName) {
        window.currentPage = pageName;

        // Handle auth pages
        if (pageName === 'login' || pageName === 'register') {
            this.openModal(`${pageName}Modal`);
            return;
        }

        // Handle protected pages
        if (pageName === 'dashboard' && !api.isAuthenticated()) {
            this.openModal('loginModal');
            return;
        }

        // Close all modals when navigating
        this.closeAllModals();

        // Update active nav link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === pageName) {
                link.classList.add('active');
            }
        });

        // Load page content
        switch (pageName) {
            case 'home':
                this.loadHomePage();
                break;
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'properties':
                this.loadPropertiesPage();
                break;
            case 'services':
                this.loadServicesPage();
                break;
            default:
                this.loadHomePage();
        }
    }

    // Load home page
    loadHomePage() {
        const pageContent = document.getElementById('page-content');
        pageContent.innerHTML = `
            <div class="page" id="home-page">
                <div class="hero">
                    <h2>Welcome to DhulBeeg Firm</h2>
                    <p>Your trusted partner in real estate and legal services</p>
                    <div class="hero-buttons">
                        ${!api.isAuthenticated() ? 
                            '<button class="btn-primary" data-page="register">Get Started</button>' : 
                            '<button class="btn-primary" data-page="dashboard">Go to Dashboard</button>'}
                        <button class="btn-secondary" data-page="properties">View Properties</button>
                    </div>
                </div>
                
                <div class="features">
                    <div class="feature-card">
                        <i class="fas fa-home fa-3x"></i>
                        <h3>Real Estate Services</h3>
                        <p>Buy, sell, and manage properties with expert guidance.</p>
                    </div>
                    <div class="feature-card">
                        <i class="fas fa-balance-scale fa-3x"></i>
                        <h3>Legal Consultation</h3>
                        <p>Professional legal advice for all your needs.</p>
                    </div>
                    <div class="feature-card">
                        <i class="fas fa-handshake fa-3x"></i>
                        <h3>Property Management</h3>
                        <p>Comprehensive property management solutions.</p>
                    </div>
                </div>
            </div>
        `;
    }

    // Load properties page (placeholder)
    loadPropertiesPage() {
        const pageContent = document.getElementById('page-content');
        pageContent.innerHTML = `
            <div class="page" id="properties-page">
                <h2>Properties</h2>
                <p>Property listings coming soon...</p>
                <div class="properties-grid">
                    <!-- Properties will be loaded here -->
                </div>
            </div>
        `;
    }

    // Load services page (placeholder)
    loadServicesPage() {
        const pageContent = document.getElementById('page-content');
        pageContent.innerHTML = `
            <div class="page" id="services-page">
                <h2>Our Services</h2>
                <p>Services information coming soon...</p>
            </div>
        `;
    }

    // Open modal
    openModal(modalId) {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });

        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
        }
    }

    // Close all modals
    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
    }

    // Show notification
    showNotification(message, type = 'info') {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        // Style notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            background-color: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            border-radius: 5px;
            z-index: 10000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 5000);

        // Add CSS animations
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Initialize Auth Manager
const authManager = new AuthManager();
window.authManager = authManager;