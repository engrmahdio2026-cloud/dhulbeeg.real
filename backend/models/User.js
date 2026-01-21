// ============================================
// User Model
// ============================================

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    // Identification
    uuid: {
        type: String,
        unique: true,
        default: () => require('crypto').randomUUID()
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    passwordHash: {
        type: String,
        required: function() {
            return !this.security ? .socialProviders ? .length;
        },
        select: false
    },

    // Personal Information
    personalInfo: {
        firstName: {
            type: String,
            required: [true, 'First name is required'],
            trim: true,
            minlength: [2, 'First name must be at least 2 characters'],
            maxlength: [50, 'First name cannot exceed 50 characters']
        },
        lastName: {
            type: String,
            required: [true, 'Last name is required'],
            trim: true,
            minlength: [2, 'Last name must be at least 2 characters'],
            maxlength: [50, 'Last name cannot exceed 50 characters']
        },
        phone: {
            type: String,
            trim: true,
            validate: {
                validator: function(v) {
                    return !v || /^\+?[\d\s\-\(\)]+$/.test(v);
                },
                message: 'Please provide a valid phone number'
            }
        },
        dateOfBirth: {
            type: Date,
            validate: {
                validator: function(v) {
                    return !v || v < new Date();
                },
                message: 'Date of birth must be in the past'
            }
        },
        nationality: {
            type: String,
            default: 'Somali'
        },
        occupation: String,
        profileImage: String,
        bio: {
            type: String,
            maxlength: [500, 'Bio cannot exceed 500 characters']
        }
    },

    // Address
    address: {
        street: String,
        city: {
            type: String,
            default: 'Hargeisa'
        },
        state: String,
        country: {
            type: String,
            default: 'Somaliland'
        },
        postalCode: String,
        coordinates: {
            lat: Number,
            lng: Number
        }
    },

    // Account Type
    accountType: {
        type: String,
        enum: ['buyer', 'seller', 'investor', 'legal-client', 'both', 'developer', 'landlord', 'tenant', 'agent', 'admin'],
        default: 'buyer',
        required: true
    },

    // Role and Permissions
    role: {
        type: String,
        enum: ['user', 'agent', 'lawyer', 'admin', 'super_admin'],
        default: 'user'
    },
    permissions: [{
        type: String,
        enum: [
            'view_properties',
            'create_properties',
            'edit_properties',
            'delete_properties',
            'view_users',
            'manage_users',
            'view_transactions',
            'manage_transactions',
            'view_services',
            'manage_services',
            'view_analytics',
            'manage_settings'
        ]
    }],

    // Preferences
    preferences: {
        language: {
            type: String,
            enum: ['en', 'so', 'ar'],
            default: 'en'
        },
        currency: {
            type: String,
            enum: ['USD', 'EUR', 'GBP', 'SLS'],
            default: 'USD'
        },
        notifications: {
            email: { type: Boolean, default: true },
            sms: { type: Boolean, default: false },
            push: { type: Boolean, default: true }
        },
        marketingEmails: { type: Boolean, default: true },
        theme: {
            type: String,
            enum: ['light', 'dark', 'auto'],
            default: 'light'
        }
    },

    // Subscription
    subscription: {
        plan: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SubscriptionPlan'
        },
        planCode: {
            type: String,
            enum: ['free', 'basic', 'professional', 'enterprise'],
            default: 'free'
        },
        startDate: Date,
        endDate: Date,
        trialEndDate: Date,
        autoRenew: { type: Boolean, default: true },
        paymentMethod: String,
        billingCycle: {
            type: String,
            enum: ['monthly', 'yearly'],
            default: 'monthly'
        },
        status: {
            type: String,
            enum: ['active', 'cancelled', 'expired', 'suspended', 'pending'],
            default: 'active'
        },
        features: [String],
        limits: {
            maxProperties: { type: Number, default: 10 },
            maxComparisons: { type: Number, default: 5 },
            maxAppointments: { type: Number, default: 5 },
            storageLimit: { type: Number, default: 100 } // in MB
        }
    },

    // Security
    security: {
        isVerified: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true },
        verificationToken: String,
        verificationTokenExpiry: Date,
        resetToken: String,
        resetTokenExpiry: Date,
        passwordChangedAt: Date,
        loginAttempts: { type: Number, default: 0 },
        lockedUntil: Date,
        lastLogin: Date,
        lastPasswordChange: Date,
        twoFactorEnabled: { type: Boolean, default: false },
        twoFactorSecret: String,
        socialProviders: [{
            provider: {
                type: String,
                enum: ['google', 'facebook', 'linkedin', 'twitter']
            },
            providerId: String,
            accessToken: String,
            refreshToken: String,
            connectedAt: Date,
            lastUsed: Date
        }],
        devices: [{
            deviceId: String,
            deviceName: String,
            userAgent: String,
            ipAddress: String,
            lastActive: Date,
            isTrusted: { type: Boolean, default: false }
        }]
    },

    // Statistics
    statistics: {
        propertiesViewed: { type: Number, default: 0 },
        propertiesSaved: { type: Number, default: 0 },
        comparisonsMade: { type: Number, default: 0 },
        inquiriesSent: { type: Number, default: 0 },
        appointmentsBooked: { type: Number, default: 0 },
        transactionsCompleted: { type: Number, default: 0 },
        servicesUsed: { type: Number, default: 0 },
        totalSpent: { type: Number, default: 0 },
        lastActivity: Date
    },

    // Documents (for verification)
    documents: [{
        type: {
            type: String,
            enum: ['id_card', 'passport', 'driver_license', 'utility_bill', 'other']
        },
        documentNumber: String,
        frontImage: String,
        backImage: String,
        expiryDate: Date,
        verified: { type: Boolean, default: false },
        verifiedBy: mongoose.Schema.Types.ObjectId,
        verifiedAt: Date,
        uploadedAt: { type: Date, default: Date.now }
    }],

    // Agent/Lawyer Specific
    professionalInfo: {
        licenseNumber: String,
        specialization: [String],
        experienceYears: Number,
        bio: String,
        education: [{
            degree: String,
            institution: String,
            year: Number
        }],
        certifications: [{
            name: String,
            issuer: String,
            year: Number,
            expiryDate: Date
        }],
        languages: [String],
        officeHours: {
            monday: { start: String, end: String },
            tuesday: { start: String, end: String },
            wednesday: { start: String, end: String },
            thursday: { start: String, end: String },
            friday: { start: String, end: String },
            saturday: { start: String, end: String },
            sunday: { start: String, end: String }
        }
    },

    // Metadata
    metadata: {
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
        createdBy: mongoose.Schema.Types.ObjectId,
        updatedBy: mongoose.Schema.Types.ObjectId,
        source: {
            type: String,
            enum: ['website', 'mobile', 'referral', 'social', 'office', 'other']
        },
        referralCode: String,
        referredBy: mongoose.Schema.Types.ObjectId,
        tags: [String],
        notes: String
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtuals
userSchema.virtual('fullName').get(function() {
    return `${this.personalInfo.firstName} ${this.personalInfo.lastName}`;
});

userSchema.virtual('isPremium').get(function() {
    return this.subscription.planCode !== 'free' &&
        this.subscription.status === 'active';
});

userSchema.virtual('isAgent').get(function() {
    return this.accountType === 'agent' || this.role === 'agent';
});

userSchema.virtual('isLawyer').get(function() {
    return this.accountType === 'legal-client' || this.role === 'lawyer';
});

// Indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ 'personalInfo.phone': 1 });
userSchema.index({ accountType: 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'subscription.status': 1 });
userSchema.index({ 'metadata.createdAt': -1 });
userSchema.index({ 'security.lastLogin': -1 });
userSchema.index({ 'statistics.totalSpent': -1 });

// Pre-save middleware
userSchema.pre('save', async function(next) {
    // Update timestamps
    if (this.isModified()) {
        this.metadata.updatedAt = Date.now();
    }

    // Hash password if modified
    if (this.isModified('passwordHash') && this.passwordHash) {
        const salt = await bcrypt.genSalt(10);
        this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
        this.security.passwordChangedAt = Date.now();
    }

    // Generate UUID if not present
    if (!this.uuid) {
        this.uuid = require('crypto').randomUUID();
    }

    next();
});

// Methods
userSchema.methods.verifyPassword = async function(candidatePassword) {
    if (!this.passwordHash) return false;
    return await bcrypt.compare(candidatePassword, this.passwordHash);
};

userSchema.methods.hasPermission = function(permission) {
    if (this.role === 'super_admin') return true;
    if (this.role === 'admin' && !permission.startsWith('manage_')) return true;
    return this.permissions.includes(permission);
};

userSchema.methods.isAccountLocked = function() {
    return this.security.lockedUntil && this.security.lockedUntil > Date.now();
};

userSchema.methods.generateVerificationToken = function() {
    const token = require('crypto').randomBytes(32).toString('hex');
    this.security.verificationToken = token;
    this.security.verificationTokenExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    return token;
};

userSchema.methods.generateResetToken = function() {
    const token = require('crypto').randomBytes(32).toString('hex');
    this.security.resetToken = token;
    this.security.resetTokenExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
    return token;
};

userSchema.methods.toJSON = function() {
    const obj = this.toObject();

    // Remove sensitive information
    delete obj.passwordHash;
    delete obj.security ? .verificationToken;
    delete obj.security ? .resetToken;
    delete obj.security ? .twoFactorSecret;
    delete obj.security ? .socialProviders;

    return obj;
};

// Static methods
userSchema.statics.findByEmail = function(email) {
    return this.findOne({ email: email.toLowerCase() });
};

userSchema.statics.findActiveUsers = function() {
    return this.find({
        'security.isActive': true,
        'security.isVerified': true
    });
};

userSchema.statics.getUserStats = async function() {
    const stats = await this.aggregate([{
        $group: {
            _id: null,
            totalUsers: { $sum: 1 },
            activeUsers: {
                $sum: {
                    $cond: [{
                            $and: [
                                { $eq: ['$security.isActive', true] },
                                { $eq: ['$security.isVerified', true] }
                            ]
                        },
                        1, 0
                    ]
                }
            },
            premiumUsers: {
                $sum: {
                    $cond: [{
                            $and: [
                                { $ne: ['$subscription.planCode', 'free'] },
                                { $eq: ['$subscription.status', 'active'] }
                            ]
                        },
                        1, 0
                    ]
                }
            },
            totalRevenue: { $sum: '$statistics.totalSpent' }
        }
    }]);

    return stats[0] || { totalUsers: 0, activeUsers: 0, premiumUsers: 0, totalRevenue: 0 };
};

const User = mongoose.model('User', userSchema);

module.exports = User;