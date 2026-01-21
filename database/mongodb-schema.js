// ============================================
// DhulBeeg MongoDB Schema
// NoSQL database design for scalability
// ============================================

// Users Collection
const UserSchema = {
    _id: ObjectId,
    uuid: String, // Public identifier
    email: { type: String, unique: true, required: true },
    passwordHash: String,
    personalInfo: {
        firstName: String,
        lastName: String,
        phone: String,
        dateOfBirth: Date,
        nationality: String,
        occupation: String,
        profileImage: String
    },
    address: {
        street: String,
        city: { type: String, default: 'Hargeisa' },
        country: { type: String, default: 'Somaliland' },
        coordinates: {
            lat: Number,
            lng: Number
        }
    },
    accountType: {
        type: String,
        enum: ['buyer', 'seller', 'investor', 'legal-client', 'both', 'developer', 'landlord', 'tenant'],
        required: true
    },
    preferences: {
        language: { type: String, enum: ['en', 'so', 'ar'], default: 'en' },
        notifications: { type: Boolean, default: true },
        marketingEmails: { type: Boolean, default: true },
        theme: { type: String, default: 'light' }
    },
    subscription: {
        plan: { type: String, enum: ['free', 'basic', 'professional', 'enterprise'], default: 'free' },
        startDate: Date,
        endDate: Date,
        trialEndDate: Date,
        features: [String],
        paymentMethod: String,
        status: { type: String, enum: ['active', 'cancelled', 'expired', 'suspended'], default: 'active' }
    },
    security: {
        isVerified: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true },
        verificationToken: String,
        resetToken: String,
        resetTokenExpiry: Date,
        lastLogin: Date,
        loginAttempts: { type: Number, default: 0 },
        lockedUntil: Date
    },
    stats: {
        propertiesViewed: { type: Number, default: 0 },
        comparisonsMade: { type: Number, default: 0 },
        inquiriesSent: { type: Number, default: 0 },
        appointmentsBooked: { type: Number, default: 0 }
    },
    metadata: {
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
        createdBy: ObjectId, // Reference to admin user
        lastActivity: Date
    },
    // Indexes
    indexes: [
        { email: 1 },
        { 'accountType': 1 },
        { 'subscription.plan': 1, 'subscription.status': 1 },
        { 'metadata.createdAt': -1 },
        { 'security.lastLogin': -1 }
    ]
};

// Properties Collection
const PropertySchema = {
    _id: ObjectId,
    propertyCode: { type: String, unique: true, required: true },
    basicInfo: {
        title: { type: String, required: true },
        description: String,
        type: {
            type: String,
            enum: ['luxury', 'residential', 'commercial', 'investment', 'apartment', 'land'],
            required: true
        },
        status: {
            type: String,
            enum: ['available', 'sold', 'rented', 'reserved', 'under_contract', 'off_market'],
            default: 'available'
        }
    },
    location: {
        address: { type: String, required: true },
        district: { type: String, required: true },
        city: { type: String, default: 'Hargeisa' },
        country: { type: String, default: 'Somaliland' },
        coordinates: {
            lat: { type: Number, required: true },
            lng: { type: Number, required: true }
        },
        googlePlaceId: String
    },
    specifications: {
        plotArea: Number, // in square meters
        builtArea: Number, // in square meters
        bedrooms: Number,
        bathrooms: Number,
        yearBuilt: Number,
        condition: {
            type: String,
            enum: ['new', 'excellent', 'good', 'needs_renovation', 'under_construction']
        },
        features: [String], // Array of features
        amenities: [String] // Nearby amenities
    },
    pricing: {
        price: { type: Number, required: true }, // in USD
        pricePerSqm: Number,
        negotiable: { type: Boolean, default: true },
        commissionPercentage: { type: Number, default: 5.0 },
        previousPrice: Number,
        priceHistory: [{
            price: Number,
            date: Date,
            reason: String
        }]
    },
    ownership: {
        ownerId: ObjectId, // Reference to User
        ownerName: String,
        ownerPhone: String,
        ownerEmail: String,
        ownershipType: {
            type: String,
            enum: ['freehold', 'leasehold', 'joint', 'inherited']
        }
    },
    legal: {
        titleStatus: {
            type: String,
            enum: ['clear', 'disputed', 'encumbered', 'under_verification'],
            default: 'under_verification'
        },
        titleDeedNumber: String,
        registrationDate: Date,
        legalNotes: String,
        documents: [{
            name: String,
            url: String,
            type: String,
            uploadedAt: Date
        }]
    },
    media: {
        images: [{
            url: { type: String, required: true },
            thumbnailUrl: String,
            caption: String,
            isPrimary: { type: Boolean, default: false },
            order: { type: Number, default: 0 }
        }],
        videos: [{
            url: String,
            thumbnailUrl: String,
            duration: Number,
            description: String
        }],
        virtualTour: {
            url: String,
            type: { type: String, enum: ['video', '3d', 'photos'] }
        }
    },
    marketing: {
        isFeatured: { type: Boolean, default: false },
        featuredExpiry: Date,
        tags: [String],
        seo: {
            title: String,
            description: String,
            keywords: [String]
        }
    },
    statistics: {
        views: { type: Number, default: 0 },
        inquiries: { type: Number, default: 0 },
        favorites: { type: Number, default: 0 },
        comparisons: { type: Number, default: 0 },
        lastViewed: Date
    },
    agents: {
        assignedAgentId: ObjectId, // Reference to User
        coAgents: [ObjectId]
    },
    metadata: {
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
        publishedAt: Date,
        createdBy: ObjectId,
        updatedBy: ObjectId
    },
    // Indexes for efficient querying
    indexes: [
        { 'basicInfo.type': 1, 'basicInfo.status': 1 },
        { 'location.district': 1 },
        { 'pricing.price': 1 },
        { 'marketing.isFeatured': 1, 'marketing.featuredExpiry': 1 },
        { 'location.coordinates': '2dsphere' }, // Geospatial index
        { 'basicInfo.title': 'text', 'basicInfo.description': 'text' }, // Full-text search
        { 'metadata.createdAt': -1 },
        { 'statistics.views': -1 }
    ]
};

// Legal Services Collection
const LegalServiceSchema = {
    _id: ObjectId,
    serviceCode: { type: String, unique: true, required: true },
    basicInfo: {
        title: { type: String, required: true },
        description: String,
        category: {
            type: String,
            enum: ['documentation', 'contract-review', 'title-verification', 'dispute-resolution', 'consultation', 'court-representation'],
            required: true
        },
        serviceType: {
            type: String,
            enum: ['real-estate', 'legal', 'integrated'],
            required: true
        }
    },
    pricing: {
        basePrice: { type: Number, required: true },
        priceType: {
            type: String,
            enum: ['fixed', 'hourly', 'percentage', 'custom'],
            default: 'fixed'
        },
        estimatedHours: Number,
        complexityLevel: {
            type: String,
            enum: ['simple', 'medium', 'complex'],
            default: 'medium'
        }
    },
    details: {
        features: [String],
        requirements: [String],
        deliverables: [String],
        processSteps: [{
            step: Number,
            title: String,
            description: String,
            duration: String
        }],
        timeframeDays: Number
    },
    legalTeam: {
        leadLawyerId: ObjectId,
        supportingLawyers: [ObjectId],
        expertiseAreas: [String]
    },
    marketing: {
        isPopular: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true },
        displayOrder: Number,
        testimonials: [ObjectId] // References to testimonials
    },
    statistics: {
        totalRequests: { type: Number, default: 0 },
        averageRating: Number,
        completionRate: Number,
        avgCompletionTime: Number // in days
    },
    metadata: {
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
        createdBy: ObjectId
    },
    indexes: [
        { 'basicInfo.category': 1 },
        { 'basicInfo.serviceType': 1 },
        { 'pricing.basePrice': 1 },
        { 'marketing.isPopular': 1 },
        { 'statistics.averageRating': -1 }
    ]
};

// Service Requests Collection
const ServiceRequestSchema = {
    _id: ObjectId,
    requestCode: { type: String, unique: true, required: true },
    clientInfo: {
        clientId: { type: ObjectId, required: true },
        clientName: String,
        clientEmail: String,
        clientPhone: String
    },
    serviceInfo: {
        serviceId: { type: ObjectId, required: true },
        serviceName: String,
        category: String,
        requestType: {
            type: String,
            enum: ['consultation', 'documentation', 'review', 'verification', 'dispute', 'other'],
            required: true
        }
    },
    propertyInfo: {
        propertyId: ObjectId,
        propertyTitle: String,
        propertyAddress: String
    },
    requestDetails: {
        description: String,
        urgency: {
            type: String,
            enum: ['low', 'normal', 'high', 'urgent'],
            default: 'normal'
        },
        documents: [{
            name: String,
            url: String,
            uploadedAt: Date
        }]
    },
    workflow: {
        status: {
            type: String,
            enum: ['pending', 'assigned', 'in_progress', 'review', 'completed', 'cancelled'],
            default: 'pending'
        },
        assignedTo: ObjectId, // Lawyer/Agent ID
        assignedAt: Date,
        startedAt: Date,
        completedAt: Date,
        timeline: [{
            stage: String,
            date: Date,
            notes: String,
            performedBy: ObjectId
        }]
    },
    financials: {
        quotedPrice: Number,
        finalPrice: Number,
        paymentStatus: {
            type: String,
            enum: ['pending', 'partial', 'paid', 'refunded'],
            default: 'pending'
        },
        payments: [{
            amount: Number,
            method: String,
            date: Date,
            transactionId: String
        }]
    },
    feedback: {
        clientRating: { type: Number, min: 1, max: 5 },
        clientFeedback: String,
        lawyerNotes: String,
        improvements: [String]
    },
    metadata: {
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
        source: {
            type: String,
            enum: ['website', 'mobile', 'email', 'phone', 'office']
        }
    },
    indexes: [
        { 'clientInfo.clientId': 1 },
        { 'workflow.status': 1 },
        { 'serviceInfo.serviceId': 1 },
        { 'metadata.createdAt': -1 },
        { 'workflow.assignedTo': 1, 'workflow.status': 1 }
    ]
};

// Transactions Collection
const TransactionSchema = {
    _id: ObjectId,
    transactionCode: { type: String, unique: true, required: true },
    propertyInfo: {
        propertyId: { type: ObjectId, required: true },
        propertyTitle: String,
        propertyCode: String
    },
    parties: {
        buyerId: ObjectId,
        buyerName: String,
        buyerEmail: String,
        buyerPhone: String,
        sellerId: ObjectId,
        sellerName: String,
        sellerEmail: String,
        sellerPhone: String
    },
    transactionDetails: {
        type: {
            type: String,
            enum: ['sale', 'purchase', 'rental', 'lease', 'transfer'],
            required: true
        },
        transactionDate: { type: Date, required: true },
        closingDate: Date,
        description: String
    },
    financials: {
        agreedPrice: { type: Number, required: true },
        commission: {
            amount: Number,
            percentage: Number,
            split: {
                buyerAgent: Number,
                sellerAgent: Number
            }
        },
        taxes: Number,
        otherFees: Number,
        totalAmount: Number,
        paymentSchedule: [{
            amount: Number,
            dueDate: Date,
            status: {
                type: String,
                enum: ['pending', 'paid', 'overdue']
            },
            paymentMethod: String
        }]
    },
    agents: {
        buyerAgentId: ObjectId,
        sellerAgentId: ObjectId,
        transactionCoordinator: ObjectId
    },
    legal: {
        contractUrl: String,
        titleDeedUrl: String,
        otherDocuments: [{
            name: String,
            url: String,
            type: String
        }],
        legalNotes: String
    },
    status: {
        current: {
            type: String,
            enum: ['pending', 'under_review', 'approved', 'completed', 'cancelled'],
            default: 'pending'
        },
        history: [{
            status: String,
            date: Date,
            changedBy: ObjectId,
            notes: String
        }]
    },
    metadata: {
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
        createdBy: ObjectId,
        documentsSigned: Boolean,
        notes: String
    },
    indexes: [
        { 'propertyInfo.propertyId': 1 },
        { 'parties.buyerId': 1 },
        { 'parties.sellerId': 1 },
        { 'transactionDetails.transactionDate': -1 },
        { 'status.current': 1 },
        { 'agents.buyerAgentId': 1, 'agents.sellerAgentId': 1 }
    ]
};

// Testimonials Collection
const TestimonialSchema = {
    _id: ObjectId,
    clientInfo: {
        clientId: { type: ObjectId, required: true },
        clientName: { type: String, required: true },
        clientRole: String,
        clientCompany: String,
        clientImage: String
    },
    content: {
        rating: { type: Number, min: 1, max: 5, required: true },
        title: String,
        testimonial: { type: String, required: true },
        serviceType: {
            type: String,
            enum: ['real-estate', 'legal', 'both'],
            required: true
        },
        serviceDetails: String,
        propertyId: ObjectId,
        serviceRequestId: ObjectId
    },
    media: {
        images: [String],
        videoUrl: String
    },
    approval: {
        isApproved: { type: Boolean, default: false },
        approvedBy: ObjectId,
        approvedAt: Date,
        rejectionReason: String
    },
    display: {
        isFeatured: { type: Boolean, default: false },
        featuredOrder: Number,
        displayLocations: [{
            type: String,
            enum: ['homepage', 'services', 'about', 'property']
        }]
    },
    metadata: {
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
        ipAddress: String,
        userAgent: String
    },
    indexes: [
        { 'content.rating': -1 },
        { 'display.isFeatured': 1, 'display.featuredOrder': 1 },
        { 'content.serviceType': 1 },
        { 'metadata.createdAt': -1 },
        { 'clientInfo.clientId': 1 }
    ]
};

// Districts Collection
const DistrictSchema = {
    _id: ObjectId,
    name: { type: String, unique: true, required: true },
    slug: { type: String, unique: true, required: true },
    pricing: {
        averagePrice: { type: Number, required: true },
        minPrice: Number,
        maxPrice: Number,
        priceHistory: [{
            price: Number,
            date: Date,
            source: String
        }]
    },
    description: {
        overview: String,
        history: String,
        development: String
    },
    classification: {
        popularity: {
            type: String,
            enum: ['low', 'medium', 'high', 'very_high'],
            default: 'medium'
        },
        developmentLevel: {
            type: String,
            enum: ['developing', 'established', 'mature', 'luxury'],
            default: 'established'
        },
        investmentGrade: {
            type: String,
            enum: ['A+', 'A', 'B+', 'B', 'C+', 'C'],
            default: 'B'
        }
    },
    features: {
        infrastructure: [String],
        amenities: [String],
        security: [String],
        transportation: [String]
    },
    location: {
        coordinates: {
            center: {
                lat: Number,
                lng: Number
            },
            boundary: [{
                lat: Number,
                lng: Number
            }]
        },
        area: Number, // in square kilometers
        elevation: Number
    },
    statistics: {
        totalProperties: { type: Number, default: 0 },
        averagePropertySize: Number,
        population: Number,
        growthRate: Number,
        propertyTurnover: Number
    },
    images: [{
        url: String,
        caption: String,
        category: {
            type: String,
            enum: ['aerial', 'street', 'landmark', 'development']
        }
    }],
    metadata: {
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
        isActive: { type: Boolean, default: true },
        displayOrder: Number
    },
    indexes: [
        { slug: 1 },
        { 'pricing.averagePrice': 1 },
        { 'classification.popularity': -1 },
        { 'classification.investmentGrade': 1 },
        { 'location.coordinates.center': '2dsphere' }
    ]
};

// Comparison Lists Collection
const ComparisonListSchema = {
    _id: ObjectId,
    userId: { type: ObjectId, required: true },
    name: { type: String, default: 'My Comparison' },
    isDefault: { type: Boolean, default: false },
    properties: [{
        propertyId: { type: ObjectId, required: true },
        addedAt: { type: Date, default: Date.now },
        notes: String,
        comparisonData: {
            price: Number,
            area: Number,
            bedrooms: Number,
            bathrooms: Number,
            features: [String],
            score: Number // Calculated comparison score
        }
    }],
    comparisonResults: {
        summary: String,
        bestValue: ObjectId,
        bestFeatures: ObjectId,
        recommendations: [{
            propertyId: ObjectId,
            reason: String,
            score: Number
        }]
    },
    sharing: {
        isShared: { type: Boolean, default: false },
        shareToken: String,
        sharedWith: [ObjectId],
        permissions: {
            type: String,
            enum: ['view', 'edit', 'comment']
        }
    },
    metadata: {
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
        lastCompared: Date
    },
    indexes: [
        { userId: 1 },
        { 'properties.propertyId': 1 },
        { 'sharing.shareToken': 1 },
        { 'metadata.createdAt': -1 }
    ]
};

// Activity Logs Collection
const ActivityLogSchema = {
    _id: ObjectId,
    userId: ObjectId,
    activityType: { type: String, required: true },
    description: String,
    entity: {
        type: { type: String, enum: ['user', 'property', 'service', 'transaction', 'appointment'] },
        id: ObjectId,
        name: String
    },
    changes: {
        before: Object,
        after: Object
    },
    location: {
        ipAddress: String,
        userAgent: String,
        coordinates: {
            lat: Number,
            lng: Number
        },
        city: String,
        country: String
    },
    metadata: {
        timestamp: { type: Date, default: Date.now },
        sessionId: String,
        deviceId: String
    },
    indexes: [
        { userId: 1 },
        { 'metadata.timestamp': -1 },
        { activityType: 1 },
        { 'entity.type': 1, 'entity.id': 1 }
    ]
};

// Notifications Collection
const NotificationSchema = {
    _id: ObjectId,
    userId: { type: ObjectId, required: true },
    type: {
        type: String,
        enum: ['info', 'success', 'warning', 'error', 'reminder', 'alert'],
        default: 'info'
    },
    category: {
        type: String,
        enum: ['property', 'appointment', 'service', 'transaction', 'system', 'marketing']
    },
    content: {
        title: { type: String, required: true },
        message: { type: String, required: true },
        data: Object // Additional data for the notification
    },
    delivery: {
        methods: [{
            type: String,
            enum: ['in_app', 'email', 'sms', 'push']
        }],
        sentAt: Date,
        readAt: Date,
        clickedAt: Date,
        expiresAt: Date
    },
    action: {
        url: String,
        buttonText: String,
        parameters: Object
    },
    metadata: {
        createdAt: { type: Date, default: Date.now },
        priority: {
            type: String,
            enum: ['low', 'normal', 'high', 'urgent'],
            default: 'normal'
        },
        source: String
    },
    indexes: [
        { userId: 1, 'delivery.readAt': 1 },
        { 'metadata.createdAt': -1 },
        { 'metadata.priority': -1 },
        { 'delivery.expiresAt': 1, 'delivery.readAt': 1 }
    ]
};

// Settings Collection
const SettingSchema = {
    _id: ObjectId,
    key: { type: String, unique: true, required: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
    type: {
        type: String,
        enum: ['string', 'number', 'boolean', 'array', 'object'],
        required: true
    },
    category: {
        type: String,
        enum: ['general', 'pricing', 'subscription', 'features', 'email', 'seo', 'security'],
        default: 'general'
    },
    description: String,
    constraints: {
        min: Number,
        max: Number,
        options: [String],
        pattern: String
    },
    metadata: {
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
        updatedBy: ObjectId,
        isPublic: { type: Boolean, default: false }
    },
    indexes: [
        { key: 1 },
        { category: 1 },
        { 'metadata.isPublic': 1 }
    ]
};

// Analytics Collection
const AnalyticsSchema = {
    _id: ObjectId,
    date: { type: Date, required: true },
    metrics: {
        // User metrics
        newUsers: Number,
        activeUsers: Number,
        returningUsers: Number,

        // Property metrics
        propertyViews: Number,
        propertyInquiries: Number,
        propertiesAdded: Number,
        propertiesSold: Number,

        // Service metrics
        serviceRequests: Number,
        serviceCompletions: Number,
        serviceRevenue: Number,

        // Financial metrics
        totalRevenue: Number,
        averageTransactionValue: Number,
        commissionEarned: Number,

        // Engagement metrics
        pageViews: Number,
        sessionDuration: Number,
        bounceRate: Number,

        // Conversion metrics
        inquiryToAppointment: Number,
        appointmentToTransaction: Number,
        freeToPaidConversion: Number
    },
    sources: {
        trafficSources: {
            direct: Number,
            organic: Number,
            referral: Number,
            social: Number,
            email: Number,
            paid: Number
        },
        deviceTypes: {
            desktop: Number,
            mobile: Number,
            tablet: Number
        },
        locations: [{
            city: String,
            country: String,
            users: Number
        }]
    },
    topPerformers: {
        properties: [{
            propertyId: ObjectId,
            title: String,
            views: Number,
            inquiries: Number
        }],
        services: [{
            serviceId: ObjectId,
            name: String,
            requests: Number,
            revenue: Number
        }],
        agents: [{
            agentId: ObjectId,
            name: String,
            transactions: Number,
            revenue: Number
        }]
    },
    metadata: {
        calculatedAt: { type: Date, default: Date.now },
        period: {
            type: String,
            enum: ['hourly', 'daily', 'weekly', 'monthly', 'yearly'],
            default: 'daily'
        }
    },
    indexes: [
        { date: -1 },
        { 'metadata.period': 1 },
        { 'metrics.totalRevenue': -1 }
    ]
};

// ============================================
// COMPOUND INDEXES FOR PERFORMANCE
// ============================================

// Property search optimization
db.properties.createIndex({
    'basicInfo.type': 1,
    'location.district': 1,
    'pricing.price': 1,
    'basicInfo.status': 1,
    'metadata.createdAt': -1
}, { name: 'property_search' });

// User activity tracking
db.activityLogs.createIndex({
    userId: 1,
    'metadata.timestamp': -1,
    activityType: 1
}, { name: 'user_activity' });

// Transaction reporting
db.transactions.createIndex({
    'transactionDetails.transactionDate': -1,
    'status.current': 1,
    'financials.totalAmount': -1
}, { name: 'transaction_reports' });

// Service performance
db.serviceRequests.createIndex({
    'workflow.status': 1,
    'metadata.createdAt': -1,
    'financials.paymentStatus': 1
}, { name: 'service_performance' });

// ============================================
// DATA VALIDATION RULES
// ============================================

db.runCommand({
    collMod: "properties",
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["propertyCode", "basicInfo", "location", "pricing"],
            properties: {
                propertyCode: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                "basicInfo.title": {
                    bsonType: "string",
                    minLength: 10,
                    description: "must be a string with minimum 10 characters"
                },
                "pricing.price": {
                    bsonType: "number",
                    minimum: 0,
                    description: "must be a positive number"
                },
                "location.coordinates.lat": {
                    bsonType: "number",
                    minimum: -90,
                    maximum: 90,
                    description: "must be a valid latitude"
                },
                "location.coordinates.lng": {
                    bsonType: "number",
                    minimum: -180,
                    maximum: 180,
                    description: "must be a valid longitude"
                }
            }
        }
    }
});

// ============================================
// SAMPLE DATA INSERTION FUNCTIONS
// ============================================

// Function to insert sample user
function createSampleUser() {
    return {
        uuid: '550e8400-e29b-41d4-a716-446655440000',
        email: 'sample@dhulbeeg.com',
        passwordHash: '$2b$10$samplehash',
        personalInfo: {
            firstName: 'Sample',
            lastName: 'User',
            phone: '+252612345678',
            dateOfBirth: new Date('1990-01-01'),
            nationality: 'Somali',
            occupation: 'Business Owner'
        },
        address: {
            street: 'Siinay Village',
            city: 'Hargeisa',
            country: 'Somaliland',
            coordinates: {
                lat: 9.560,
                lng: 44.065
            }
        },
        accountType: 'investor',
        preferences: {
            language: 'en',
            notifications: true,
            marketingEmails: true,
            theme: 'light'
        },
        subscription: {
            plan: 'professional',
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            trialEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            features: ['Property Listings', 'Market Analysis', 'Priority Support'],
            paymentMethod: 'credit_card',
            status: 'active'
        },
        security: {
            isVerified: true,
            isActive: true,
            lastLogin: new Date()
        },
        stats: {
            propertiesViewed: 15,
            comparisonsMade: 3,
            inquiriesSent: 2,
            appointmentsBooked: 1
        },
        metadata: {
            createdAt: new Date(),
            updatedAt: new Date(),
            lastActivity: new Date()
        }
    };
}

// Function to insert sample property
function createSampleProperty() {
    return {
        propertyCode: 'SAMPLE-001',
        basicInfo: {
            title: 'Sample Luxury Villa in Siinay',
            description: 'Beautiful modern villa with premium finishes',
            type: 'luxury',
            status: 'available'
        },
        location: {
            address: 'Siinay Village, Main Road',
            district: 'Siinay',
            city: 'Hargeisa',
            country: 'Somaliland',
            coordinates: {
                lat: 9.571000,
                lng: 44.071000
            }
        },
        specifications: {
            plotArea: 450,
            builtArea: 350,
            bedrooms: 5,
            bathrooms: 4,
            yearBuilt: 2022,
            condition: 'new',
            features: ['Swimming Pool', 'Garden', 'Security System', 'Modern Kitchen'],
            amenities: ['Shopping Center', 'Restaurants', 'Schools']
        },
        pricing: {
            price: 250000,
            pricePerSqm: 555.56,
            negotiable: true,
            commissionPercentage: 5.0
        },
        ownership: {
            ownerName: 'Sample Owner',
            ownerPhone: '+252612345678',
            ownerEmail: 'owner@example.com',
            ownershipType: 'freehold'
        },
        legal: {
            titleStatus: 'clear',
            titleDeedNumber: 'TD-2022-001',
            registrationDate: new Date('2022-05-15')
        },
        media: {
            images: [{
                url: 'https://example.com/sample-image.jpg',
                thumbnailUrl: 'https://example.com/sample-thumb.jpg',
                caption: 'Front view',
                isPrimary: true,
                order: 1
            }]
        },
        marketing: {
            isFeatured: true,
            featuredExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            tags: ['luxury', 'villa', 'siinay', 'modern']
        },
        statistics: {
            views: 150,
            inquiries: 25,
            favorites: 12,
            comparisons: 8
        },
        metadata: {
            createdAt: new Date(),
            updatedAt: new Date(),
            publishedAt: new Date()
        }
    };
}

// ============================================
// AGGREGATION PIPELINES FOR COMMON QUERIES
// ============================================

// Get properties with district information
const propertyWithDistrictPipeline = [{
        $lookup: {
            from: 'districts',
            localField: 'location.district',
            foreignField: 'name',
            as: 'districtInfo'
        }
    },
    {
        $unwind: {
            path: '$districtInfo',
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $project: {
            propertyCode: 1,
            title: '$basicInfo.title',
            type: '$basicInfo.type',
            price: '$pricing.price',
            district: '$location.district',
            districtAveragePrice: '$districtInfo.pricing.averagePrice',
            districtPopularity: '$districtInfo.classification.popularity',
            bedrooms: '$specifications.bedrooms',
            bathrooms: '$specifications.bathrooms',
            area: '$specifications.plotArea',
            primaryImage: {
                $arrayElemAt: [{
                        $filter: {
                            input: '$media.images',
                            as: 'image',
                            cond: { $eq: ['$$image.isPrimary', true] }
                        }
                    },
                    0
                ]
            }
        }
    }
];

// Get user dashboard statistics
const userDashboardStatsPipeline = (userId) => [{
        $match: { _id: ObjectId(userId) }
    },
    {
        $lookup: {
            from: 'properties',
            localField: '_id',
            foreignField: 'ownership.ownerId',
            as: 'ownedProperties'
        }
    },
    {
        $lookup: {
            from: 'transactions',
            let: { userId: '$_id' },
            pipeline: [{
                $match: {
                    $expr: {
                        $or: [
                            { $eq: ['$parties.buyerId', '$$userId'] },
                            { $eq: ['$parties.sellerId', '$$userId'] }
                        ]
                    }
                }
            }],
            as: 'transactions'
        }
    },
    {
        $lookup: {
            from: 'serviceRequests',
            localField: '_id',
            foreignField: 'clientInfo.clientId',
            as: 'serviceRequests'
        }
    },
    {
        $project: {
            name: { $concat: ['$personalInfo.firstName', ' ', '$personalInfo.lastName'] },
            stats: {
                ownedProperties: { $size: '$ownedProperties' },
                activeTransactions: {
                    $size: {
                        $filter: {
                            input: '$transactions',
                            as: 'txn',
                            cond: { $ne: ['$$txn.status.current', 'completed'] }
                        }
                    }
                },
                activeServices: {
                    $size: {
                        $filter: {
                            input: '$serviceRequests',
                            as: 'sr',
                            cond: { $ne: ['$$sr.workflow.status', 'completed'] }
                        }
                    }
                },
                totalInvestment: {
                    $sum: {
                        $map: {
                            input: '$ownedProperties',
                            as: 'prop',
                            in: '$$prop.pricing.price'
                        }
                    }
                }
            },
            subscription: '$subscription.plan',
            lastActivity: '$metadata.lastActivity'
        }
    }
];

// Get market insights
const marketInsightsPipeline = [{
    $facet: {
        priceByDistrict: [{
                $group: {
                    _id: '$location.district',
                    averagePrice: { $avg: '$pricing.price' },
                    minPrice: { $min: '$pricing.price' },
                    maxPrice: { $max: '$pricing.price' },
                    propertyCount: { $sum: 1 }
                }
            },
            { $sort: { averagePrice: -1 } }
        ],
        propertyTypes: [{
            $group: {
                _id: '$basicInfo.type',
                count: { $sum: 1 },
                averagePrice: { $avg: '$pricing.price' }
            }
        }],
        recentActivity: [
            { $match: { 'basicInfo.status': 'available' } },
            { $sort: { 'metadata.createdAt': -1 } },
            { $limit: 10 },
            {
                $project: {
                    title: '$basicInfo.title',
                    type: '$basicInfo.type',
                    price: '$pricing.price',
                    district: '$location.district',
                    daysListed: {
                        $divide: [
                            { $subtract: [new Date(), '$metadata.createdAt'] },
                            1000 * 60 * 60 * 24
                        ]
                    }
                }
            }
        ]
    }
}];

// Export all schemas and functions
module.exports = {
    UserSchema,
    PropertySchema,
    LegalServiceSchema,
    ServiceRequestSchema,
    TransactionSchema,
    TestimonialSchema,
    DistrictSchema,
    ComparisonListSchema,
    ActivityLogSchema,
    NotificationSchema,
    SettingSchema,
    AnalyticsSchema,
    createSampleUser,
    createSampleProperty,
    propertyWithDistrictPipeline,
    userDashboardStatsPipeline,
    marketInsightsPipeline
};