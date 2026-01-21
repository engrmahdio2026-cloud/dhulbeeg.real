// Email Service for DhulBeeg Firm
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: process.env.EMAIL_PORT === '465',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        });
    }

    // Send contact confirmation email
    async sendContactConfirmation({ to, name, subject, message, department }) {
        const departmentMap = {
            'real_estate': 'Real Estate Department',
            'legal': 'Legal Department',
            'management': 'Property Management Department',
            'sales': 'Sales Department',
            'general': 'General Inquiries'
        };

        const deptName = departmentMap[department] || 'DhulBeeg Firm';
        const deptEmail = this.getDepartmentEmail(department);

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to,
            subject: `Thank you for contacting DhulBeeg ${deptName}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #0d1b3e, #1e293b); color: white; padding: 30px; text-align: center;">
                        <h1 style="margin: 0; font-size: 28px;">DhulBeeg Real State & Law Firm</h1>
                        <p style="margin: 10px 0 0; opacity: 0.9;">${deptName}</p>
                    </div>
                    
                    <div style="padding: 30px; background: #f8fafc;">
                        <h2 style="color: #0d1b3e; margin-bottom: 20px;">Thank you for contacting us!</h2>
                        
                        <p>Dear ${name},</p>
                        
                        <p>We have received your inquiry and our team will get back to you within 24-48 hours.</p>
                        
                        <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #d4af37;">
                            <p style="margin: 0; color: #666;"><strong>Subject:</strong> ${subject || 'General Inquiry'}</p>
                            <p style="margin: 10px 0 0; color: #666;"><strong>Message:</strong> ${message}</p>
                        </div>
                        
                        <p><strong>Department:</strong> ${deptName}</p>
                        <p><strong>Contact Email:</strong> ${deptEmail}</p>
                        
                        <p>If you need immediate assistance, please call us at:</p>
                        <p style="font-size: 18px; color: #0d1b3e; font-weight: bold;">
                            <i class="fas fa-phone" style="color: #d4af37;"></i> +1 (234) 567-8900
                        </p>
                    </div>
                    
                    <div style="background: #0d1b3e; color: white; padding: 20px; text-align: center; font-size: 14px;">
                        <p style="margin: 0; opacity: 0.8;">
                            © 2024 DhulBeeg Real State & Law Firm. All rights reserved.<br>
                            123 Business Avenue, Suite 456, City, State 12345
                        </p>
                        <p style="margin: 10px 0 0; opacity: 0.8;">
                            <a href="mailto:DhulBeeg.Reals@gmail.com" style="color: #d4af37; text-decoration: none;">DhulBeeg.Reals@gmail.com</a> | 
                            <a href="https://dhulbeeg.com" style="color: #d4af37; text-decoration: none;">dhulbeeg.com</a>
                        </p>
                    </div>
                </div>
            `
        };

        return await this.sendMail(mailOptions);
    }

    // Send contact notification to team
    async sendContactNotification({ contactId, name, email, subject, message, department }) {
        const deptEmail = this.getDepartmentEmail(department);
        const deptName = this.getDepartmentName(department);

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: deptEmail,
            cc: process.env.EMAIL_USER, // Send copy to main email
            subject: `New Contact Inquiry: ${subject || 'No Subject'} - DhulBeeg ${deptName}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #0d1b3e, #1e293b); color: white; padding: 30px; text-align: center;">
                        <h1 style="margin: 0; font-size: 24px;">NEW CONTACT INQUIRY</h1>
                        <p style="margin: 10px 0 0; opacity: 0.9;">${deptName}</p>
                    </div>
                    
                    <div style="padding: 30px; background: #f8fafc;">
                        <h2 style="color: #0d1b3e; margin-bottom: 20px;">Contact Details</h2>
                        
                        <div style="background: white; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                            <p style="margin: 0 0 10px;"><strong>Contact ID:</strong> #${contactId}</p>
                            <p style="margin: 0 0 10px;"><strong>Name:</strong> ${name}</p>
                            <p style="margin: 0 0 10px;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                            <p style="margin: 0 0 10px;"><strong>Subject:</strong> ${subject || 'General Inquiry'}</p>
                            <p style="margin: 0;"><strong>Department:</strong> ${deptName}</p>
                        </div>
                        
                        <div style="background: white; border-radius: 8px; padding: 20px; margin-bottom: 20px; border-left: 4px solid #d4af37;">
                            <h3 style="color: #0d1b3e; margin-top: 0;">Message:</h3>
                            <p style="white-space: pre-wrap; margin: 0;">${message}</p>
                        </div>
                        
                        <div style="text-align: center; margin-top: 30px;">
                            <a href="${process.env.BASE_URL}/admin/contacts/${contactId}" 
                               style="background: #d4af37; color: #0d1b3e; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                                View Contact in Dashboard
                            </a>
                        </div>
                        
                        <p style="margin-top: 30px; font-size: 14px; color: #666; text-align: center;">
                            Please respond to this inquiry within 24 hours.
                        </p>
                    </div>
                </div>
            `
        };

        return await this.sendMail(mailOptions);
    }

    // Send status update email
    async sendStatusUpdate({ to, name, status, notes = '' }) {
            const statusMessages = {
                'contacted': 'has been contacted by our team',
                'resolved': 'has been resolved',
                'in_progress': 'is currently being processed'
            };

            const message = statusMessages[status] || 'has been updated';

            const mailOptions = {
                    from: process.env.EMAIL_FROM,
                    to,
                    subject: `Update on your inquiry - DhulBeeg Firm`,
                    html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #0d1b3e, #1e293b); color: white; padding: 30px; text-align: center;">
                        <h1 style="margin: 0; font-size: 24px;">STATUS UPDATE</h1>
                        <p style="margin: 10px 0 0; opacity: 0.9;">DhulBeeg Real State & Law Firm</p>
                    </div>
                    
                    <div style="padding: 30px; background: #f8fafc;">
                        <h2 style="color: #0d1b3e; margin-bottom: 20px;">Hello ${name},</h2>
                        
                        <p>We wanted to inform you that your inquiry ${message}.</p>
                        
                        ${notes ? `
                            <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #d4af37;">
                                <p style="margin: 0; color: #666;"><strong>Update Notes:</strong></p>
                                <p style="margin: 10px 0 0; color: #666;">${notes}</p>
                            </div>
                        ` : ''}
                        
                        <p>If you have any further questions, please don't hesitate to contact us.</p>
                        
                        <div style="margin-top: 30px; padding: 20px; background: white; border-radius: 8px;">
                            <h3 style="color: #0d1b3e; margin-top: 0;">Contact Information:</h3>
                            <p style="margin: 10px 0;">
                                <i style="color: #d4af37; width: 20px;">📧</i>
                                <a href="mailto:DhulBeeg.Reals@gmail.com" style="color: #0d1b3e; text-decoration: none;">
                                    DhulBeeg.Reals@gmail.com
                                </a>
                            </p>
                            <p style="margin: 10px 0;">
                                <i style="color: #d4af37; width: 20px;">📱</i>
                                +1 (234) 567-8900
                            </p>
                        </div>
                    </div>
                </div>
            `
        };

        return await this.sendMail(mailOptions);
    }

    // Send property inquiry notification
    async sendPropertyInquiry({ propertyId, propertyTitle, clientName, clientEmail, clientPhone, message }) {
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: process.env.EMAIL_USER,
            subject: `New Property Inquiry: ${propertyTitle}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #0d1b3e, #1e293b); color: white; padding: 30px; text-align: center;">
                        <h1 style="margin: 0; font-size: 24px;">NEW PROPERTY INQUIRY</h1>
                    </div>
                    
                    <div style="padding: 30px; background: #f8fafc;">
                        <h2 style="color: #0d1b3e; margin-bottom: 20px;">Property Inquiry Details</h2>
                        
                        <div style="background: white; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                            <p style="margin: 0 0 10px;"><strong>Property:</strong> ${propertyTitle}</p>
                            <p style="margin: 0 0 10px;"><strong>Property ID:</strong> #${propertyId}</p>
                        </div>
                        
                        <div style="background: white; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                            <h3 style="color: #0d1b3e; margin-top: 0;">Client Information:</h3>
                            <p style="margin: 0 0 10px;"><strong>Name:</strong> ${clientName}</p>
                            <p style="margin: 0 0 10px;"><strong>Email:</strong> <a href="mailto:${clientEmail}">${clientEmail}</a></p>
                            <p style="margin: 0 0 10px;"><strong>Phone:</strong> ${clientPhone || 'Not provided'}</p>
                        </div>
                        
                        ${message ? `
                            <div style="background: white; border-radius: 8px; padding: 20px; margin-bottom: 20px; border-left: 4px solid #d4af37;">
                                <h3 style="color: #0d1b3e; margin-top: 0;">Client Message:</h3>
                                <p style="white-space: pre-wrap; margin: 0;">${message}</p>
                            </div>
                        ` : ''}
                        
                        <div style="text-align: center; margin-top: 30px;">
                            <a href="${process.env.BASE_URL}/admin/properties/${propertyId}" 
                               style="background: #d4af37; color: #0d1b3e; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                                View Property in Dashboard
                            </a>
                        </div>
                    </div>
                </div>
            `
        };

        return await this.sendMail(mailOptions);
    }

    // Send appointment confirmation
    async sendAppointmentConfirmation({ to, name, appointmentType, appointmentDate, location, agentName, agentPhone }) {
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to,
            subject: `Appointment Confirmation - DhulBeeg Firm`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #0d1b3e, #1e293b); color: white; padding: 30px; text-align: center;">
                        <h1 style="margin: 0; font-size: 24px;">APPOINTMENT CONFIRMED</h1>
                    </div>
                    
                    <div style="padding: 30px; background: #f8fafc;">
                        <h2 style="color: #0d1b3e; margin-bottom: 20px;">Hello ${name},</h2>
                        
                        <p>Your appointment has been confirmed. Here are the details:</p>
                        
                        <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #d4af37;">
                            <p style="margin: 0 0 10px;"><strong>Type:</strong> ${appointmentType}</p>
                            <p style="margin: 0 0 10px;"><strong>Date & Time:</strong> ${new Date(appointmentDate).toLocaleString()}</p>
                            <p style="margin: 0 0 10px;"><strong>Location:</strong> ${location}</p>
                            <p style="margin: 0 0 10px;"><strong>Assigned Agent:</strong> ${agentName}</p>
                            <p style="margin: 0;"><strong>Agent Contact:</strong> ${agentPhone}</p>
                        </div>
                        
                        <p style="color: #666; font-size: 14px;">
                            <strong>Note:</strong> Please arrive 10 minutes before your scheduled appointment. 
                            If you need to reschedule or cancel, please contact us at least 24 hours in advance.
                        </p>
                    </div>
                </div>
            `
        };

        return await this.sendMail(mailOptions);
    }

    // Get department email
    getDepartmentEmail(department) {
        const emailMap = {
            'real_estate': 'DhulBeeg.RealEstate@gmail.com',
            'legal': 'DhulBeeg.Legal@gmail.com',
            'management': 'DhulBeeg.Management@gmail.com',
            'sales': 'DhulBeeg.Sales@gmail.com',
            'general': 'DhulBeeg.Reals@gmail.com'
        };
        
        return emailMap[department] || process.env.EMAIL_USER;
    }

    // Get department name
    getDepartmentName(department) {
        const nameMap = {
            'real_estate': 'Real Estate Department',
            'legal': 'Legal Department',
            'management': 'Property Management Department',
            'sales': 'Sales Department',
            'general': 'General Inquiries'
        };
        
        return nameMap[department] || 'DhulBeeg Firm';
    }

    // Send generic email
    async sendMail(mailOptions) {
        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Email sent:', info.messageId);
            return info;
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }

    // Verify email configuration
    async verify() {
        try {
            await this.transporter.verify();
            console.log('✅ Email service is ready');
            return true;
        } catch (error) {
            console.error('❌ Email service configuration error:', error);
            return false;
        }
    }
}

module.exports = new EmailService();