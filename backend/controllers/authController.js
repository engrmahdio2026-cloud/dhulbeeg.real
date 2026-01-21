const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');

const authController = {
    // Register new user
    register: async(req, res) => {
        try {
            const { email, password, name, role = 'user', department = 'general' } = req.body;

            // Check if user exists
            const [existingUsers] = await pool.execute(
                'SELECT id FROM users WHERE email = ?', [email]
            );

            if (existingUsers.length > 0) {
                return res.status(400).json({
                    status: 'error',
                    message: 'User already exists'
                });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert user
            const [result] = await pool.execute(
                `INSERT INTO users (email, password, name, role, department) 
                 VALUES (?, ?, ?, ?, ?)`, [email, hashedPassword, name, role, department]
            );

            // Generate JWT token
            const token = jwt.sign({ id: result.insertId, email, role, name },
                process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE }
            );

            res.status(201).json({
                status: 'success',
                message: 'User registered successfully',
                token,
                user: {
                    id: result.insertId,
                    email,
                    name,
                    role,
                    department
                }
            });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    },

    // Login user
    login: async(req, res) => {
        try {
            const { email, password } = req.body;

            // Find user
            const [users] = await pool.execute(
                'SELECT * FROM users WHERE email = ?', [email]
            );

            if (users.length === 0) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Invalid credentials'
                });
            }

            const user = users[0];

            // Verify password
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Invalid credentials'
                });
            }

            // Generate JWT token
            const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name },
                process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE }
            );

            // Remove password from response
            const { password: _, ...userWithoutPassword } = user;

            res.status(200).json({
                status: 'success',
                message: 'Login successful',
                token,
                user: userWithoutPassword
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    },

    // Get current user
    getCurrentUser: async(req, res) => {
        try {
            const [users] = await pool.execute(
                'SELECT id, email, name, role, department, created_at FROM users WHERE id = ?', [req.user.id]
            );

            if (users.length === 0) {
                return res.status(404).json({
                    status: 'error',
                    message: 'User not found'
                });
            }

            res.status(200).json({
                status: 'success',
                user: users[0]
            });
        } catch (error) {
            console.error('Get user error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    },

    // Update profile
    updateProfile: async(req, res) => {
        try {
            const { name, department } = req.body;
            const userId = req.user.id;

            await pool.execute(
                'UPDATE users SET name = ?, department = ? WHERE id = ?', [name, department, userId]
            );

            res.status(200).json({
                status: 'success',
                message: 'Profile updated successfully'
            });
        } catch (error) {
            console.error('Update profile error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    },

    // Change password
    changePassword: async(req, res) => {
        try {
            const { currentPassword, newPassword } = req.body;
            const userId = req.user.id;

            // Get current user
            const [users] = await pool.execute(
                'SELECT password FROM users WHERE id = ?', [userId]
            );

            if (users.length === 0) {
                return res.status(404).json({
                    status: 'error',
                    message: 'User not found'
                });
            }

            const user = users[0];

            // Verify current password
            const isValidPassword = await bcrypt.compare(currentPassword, user.password);
            if (!isValidPassword) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Current password is incorrect'
                });
            }

            // Hash new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // Update password
            await pool.execute(
                'UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]
            );

            res.status(200).json({
                status: 'success',
                message: 'Password changed successfully'
            });
        } catch (error) {
            console.error('Change password error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    },

    // Logout
    logout: (req, res) => {
        res.status(200).json({
            status: 'success',
            message: 'Logged out successfully'
        });
    },

    // Forgot password
    forgotPassword: (req, res) => {
        res.status(200).json({
            status: 'success',
            message: 'Password reset email sent (implementation required)'
        });
    },

    // Reset password
    resetPassword: (req, res) => {
        res.status(200).json({
            status: 'success',
            message: 'Password reset successful (implementation required)'
        });
    },

    // Verify email
    verifyEmail: (req, res) => {
        res.status(200).json({
            status: 'success',
            message: 'Email verified (implementation required)'
        });
    },

    // Social login
    socialLogin: (req, res) => {
        res.status(200).json({
            status: 'success',
            message: 'Social login (implementation required)'
        });
    },

    // Get auth providers
    getAuthProviders: (req, res) => {
        res.status(200).json({
            status: 'success',
            providers: ['google', 'facebook']
        });
    }
};

module.exports = authController;