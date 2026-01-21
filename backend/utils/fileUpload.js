// File Upload Utility for DhulBeeg Firm
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const createUploadDirectories = () => {
    const directories = [
        './uploads',
        './uploads/properties',
        './uploads/documents',
        './uploads/clients',
        './uploads/temp'
    ];

    directories.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });
};

createUploadDirectories();

// File filter function
const fileFilter = (req, file, cb) => {
    // Allowed file types
    const allowedMimes = {
        'image/jpeg': 'jpg',
        'image/jpg': 'jpg',
        'image/png': 'png',
        'image/gif': 'gif',
        'image/webp': 'webp',
        'application/pdf': 'pdf',
        'application/msword': 'doc',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx'
    };

    if (allowedMimes[file.mimetype]) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only images and PDFs are allowed.'), false);
    }
};

// Storage configuration for property images
const propertyStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/properties');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, 'property-' + uniqueSuffix + ext);
    }
});

// Storage configuration for documents
const documentStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/documents');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, 'document-' + uniqueSuffix + ext);
    }
});

// Storage configuration for client files
const clientStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/clients');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, 'client-' + uniqueSuffix + ext);
    }
});

// Create multer instances
const uploadPropertyImages = multer({
    storage: propertyStorage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 10 // Maximum 10 files
    }
});

const uploadDocuments = multer({
    storage: documentStorage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit for documents
        files: 5 // Maximum 5 files
    }
});

const uploadClientFiles = multer({
    storage: clientStorage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 5 // Maximum 5 files
    }
});

// Single file upload
const uploadSingleImage = multer({
    storage: propertyStorage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
}).single('image');

// Utility functions
const deleteFile = (filePath) => {
    const fullPath = path.join(__dirname, '..', filePath);

    if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        return true;
    }
    return false;
};

const getFileUrl = (filename, type = 'properties') => {
    return `/uploads/${type}/${filename}`;
};

const validateImageDimensions = (filePath, minWidth = 300, minHeight = 300) => {
    return new Promise((resolve) => {
        // This would require an image processing library like sharp or jimp
        // For now, we'll just return true
        resolve(true);
    });
};

module.exports = {
    uploadPropertyImages,
    uploadDocuments,
    uploadClientFiles,
    uploadSingleImage,
    deleteFile,
    getFileUrl,
    validateImageDimensions
};