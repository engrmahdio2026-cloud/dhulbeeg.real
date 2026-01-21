// Contact Controller for DhulBeeg Firm
const Contact = require('../models/Contact');
const emailService = require('../utils/emailService');
const { validationResult } = require('express-validator');

class ContactController {
    // Create new contact inquiry
    static async createContact(req, res, next) {
        try {
            // Check validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const contactData = req.body;
            const contact = await Contact.create(contactData);

            // Send confirmation email to the contact
            try {
                await emailService.sendContactConfirmation({
                    to: contact.email,
                    name: contact.name,
                    subject: contact.subject,
                    message: contact.message,
                    department: contact.department
                });
            } catch (emailError) {
                console.error('Failed to send confirmation email:', emailError);
                // Don't fail the request if email fails
            }

            // Send notification to admin/team
            try {
                await emailService.sendContactNotification({
                    contactId: contact.id,
                    name: contact.name,
                    email: contact.email,
                    subject: contact.subject,
                    message: contact.message,
                    department: contact.department
                });
            } catch (emailError) {
                console.error('Failed to send notification email:', emailError);
            }

            res.status(201).json({
                success: true,
                message: 'Contact inquiry submitted successfully',
                data: contact
            });
        } catch (error) {
            next(error);
        }
    }

    // Get all contacts
    static async getAllContacts(req, res, next) {
        try {
            const filters = {
                status: req.query.status,
                department: req.query.department,
                assigned_to: req.query.assigned_to,
                start_date: req.query.start_date,
                end_date: req.query.end_date,
                search: req.query.search,
                limit: req.query.limit || 50,
                offset: req.query.offset || 0
            };

            const contacts = await Contact.findAll(filters);

            res.status(200).json({
                success: true,
                count: contacts.length,
                data: contacts
            });
        } catch (error) {
            next(error);
        }
    }

    // Get single contact
    static async getContactById(req, res, next) {
        try {
            const contact = await Contact.findById(req.params.id);

            if (!contact) {
                return res.status(404).json({
                    success: false,
                    message: 'Contact not found'
                });
            }

            res.status(200).json({
                success: true,
                data: contact
            });
        } catch (error) {
            next(error);
        }
    }

    // Update contact status
    static async updateContactStatus(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const contact = await Contact.updateStatus(req.params.id, req.body);

            if (!contact) {
                return res.status(404).json({
                    success: false,
                    message: 'Contact not found'
                });
            }

            // Send status update email to contact
            if (req.body.status === 'contacted' || req.body.status === 'resolved') {
                try {
                    await emailService.sendStatusUpdate({
                        to: contact.email,
                        name: contact.name,
                        status: req.body.status,
                        notes: req.body.notes || ''
                    });
                } catch (emailError) {
                    console.error('Failed to send status update email:', emailError);
                }
            }

            res.status(200).json({
                success: true,
                message: 'Contact status updated successfully',
                data: contact
            });
        } catch (error) {
            next(error);
        }
    }

    // Get contact statistics
    static async getContactStatistics(req, res, next) {
        try {
            const statistics = await Contact.getStatistics();

            res.status(200).json({
                success: true,
                data: statistics
            });
        } catch (error) {
            next(error);
        }
    }

    // Get contacts by department
    static async getContactsByDepartment(req, res, next) {
        try {
            const { department } = req.params;
            const limit = parseInt(req.query.limit) || 50;

            const validDepartments = ['real_estate', 'legal', 'management', 'sales', 'general'];
            if (!validDepartments.includes(department)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid department'
                });
            }

            const contacts = await Contact.getByDepartment(department, limit);

            res.status(200).json({
                success: true,
                count: contacts.length,
                data: contacts
            });
        } catch (error) {
            next(error);
        }
    }

    // Mark contact as spam
    static async markAsSpam(req, res, next) {
        try {
            const contact = await Contact.markAsSpam(req.params.id);

            if (!contact) {
                return res.status(404).json({
                    success: false,
                    message: 'Contact not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Contact marked as spam',
                data: contact
            });
        } catch (error) {
            next(error);
        }
    }

    // Delete contact
    static async deleteContact(req, res, next) {
        try {
            const deleted = await Contact.delete(req.params.id);

            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Contact not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Contact deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = ContactController;