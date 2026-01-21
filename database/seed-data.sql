-- ============================================
-- DhulBeeg Database Seed Data
-- ============================================

USE dhulbeeg_db;

-- ===== INSERT SAMPLE USERS =====
INSERT INTO users (
    uuid, email, password_hash, first_name, last_name, phone, user_type,
    profile_image, date_of_birth, nationality, occupation, address, city,
    is_verified, is_active, subscription_plan, subscription_start_date,
    trial_end_date, created_at
) VALUES
-- Admin user (already inserted in schema)
(UUID(), 'jimale@dhulbeeg.com', '$2b$10$...', 'Jim''ale', 'Abdirahman Madar', '+252634428674', 'developer',
 NULL, '1980-05-15', 'Somali', 'Real Estate Manager', 'Siinay Village, Hargeisa', 'Hargeisa',
 TRUE, TRUE, 'enterprise', '2024-01-01', '2024-01-08', '2024-01-01 09:00:00'),

(UUID(), 'mahdi@dhulbeeg.com', '$2b$10$...', 'Mahdi', 'Mohumed Odowa', '+252634428674', 'developer',
 NULL, '1982-08-22', 'Somali', 'Real Estate Manager', 'Siinay Village, Hargeisa', 'Hargeisa',
 TRUE, TRUE, 'enterprise', '2024-01-01', '2024-01-08', '2024-01-01 09:00:00'),

-- Legal team
(UUID(), 'ahmed.legal@dhulbeeg.com', '$2b$10$...', 'Ahmed', 'Hassan', '+252674428674', 'developer',
 NULL, '1978-03-10', 'Somali', 'Property Lawyer', 'Siinay Village, Hargeisa', 'Hargeisa',
 TRUE, TRUE, 'enterprise', '2024-01-01', '2024-01-08', '2024-01-01 09:00:00'),

(UUID(), 'fatima.legal@dhulbeeg.com', '$2b$10$...', 'Fatima', 'Ali', '+252674428674', 'developer',
 NULL, '1985-11-30', 'Somali', 'Legal Documentation Specialist', 'Siinay Village, Hargeisa', 'Hargeisa',
 TRUE, TRUE, 'enterprise', '2024-01-01', '2024-01-08', '2024-01-01 09:00:00'),

-- Real estate agents
(UUID(), 'omar@dhulbeeg.com', '$2b$10$...', 'Omar', 'Jama', '+252634428675', 'developer',
 NULL, '1987-07-14', 'Somali', 'Senior Property Agent', 'Siinay Village, Hargeisa', 'Hargeisa',
 TRUE, TRUE, 'professional', '2024-01-01', '2024-01-08', '2024-01-01 09:00:00'),

(UUID(), 'amina@dhulbeeg.com', '$2b$10$...', 'Amina', 'Yusuf', '+252634428676', 'developer',
 NULL, '1990-12-05', 'Somali', 'Property Agent', 'Siinay Village, Hargeisa', 'Hargeisa',
 TRUE, TRUE, 'professional', '2024-01-01', '2024-01-08', '2024-01-01 09:00:00'),

-- Sample clients
(UUID(), 'ahmed.investor@example.com', '$2b$10$...', 'Ahmed', 'Mohamed Ali', '+252612345678', 'investor',
 NULL, '1975-02-20', 'Somali', 'Business Owner', 'Jigjiga Yar, Hargeisa', 'Hargeisa',
 TRUE, TRUE, 'professional', '2024-02-01', '2024-02-08', '2024-02-01 10:30:00'),

(UUID(), 'fatima.client@example.com', '$2b$10$...', 'Fatima', 'Hassan', '+252623456789', 'buyer',
 NULL, '1988-09-15', 'Somali', 'Medical Doctor', 'New Hargeisa, Hargeisa', 'Hargeisa',
 TRUE, TRUE, 'basic', '2024-02-15', '2024-02-22', '2024-02-15 14:45:00'),

(UUID(), 'omar.business@example.com', '$2b$10$...', 'Omar', 'Jama', '+252634567890', 'seller',
 NULL, '1965-04-10', 'Somali', 'Construction Company Owner', 'Downtown, Hargeisa', 'Hargeisa',
 TRUE, TRUE, 'professional', '2024-01-20', '2024-01-27', '2024-01-20 11:20:00'),

(UUID(), 'nadia.diaspora@example.com', '$2b$10$...', 'Nadia', 'Mohammed', '+441234567890', 'investor',
 NULL, '1992-08-25', 'Somali', 'Software Engineer', 'London, UK', 'London',
 TRUE, TRUE, 'enterprise', '2024-03-01', '2024-03-08', '2024-03-01 16:15:00');

-- ===== INSERT SAMPLE PROPERTIES =====
INSERT INTO properties (
    property_code, title, description, property_type, status,
    address, district, latitude, longitude,
    plot_area, built_area, bedrooms, bathrooms, year_built, condition,
    features, price, price_per_sqm, negotiable, commission_percentage,
    owner_id, owner_name, owner_phone, owner_email,
    title_status, title_deed_number, registration_date,
    is_featured, featured_expiry, assigned_agent_id, created_by,
    created_at, published_at
) VALUES
-- Luxury Villa in Siinay
('PROP-001', 'Luxury Villa in Siinay', 
 'Stunning modern villa with panoramic views of Hargeisa. Perfect for large families with premium finishes throughout.',
 'luxury', 'available',
 'Siinay Village, Main Road', 'Siinay', 9.571000, 44.071000,
 450.00, 350.00, 5, 4, 2022, 'new',
 '["Swimming Pool", "Garden", "Security System", "Parking", "Modern Kitchen", "Solar System", "Backup Generator"]',
 250000.00, 555.56, TRUE, 5.00,
 7, 'Ahmed Mohamed Ali', '+252612345678', 'ahmed.investor@example.com',
 'clear', 'TD-2022-001', '2022-05-15',
 TRUE, '2024-04-15', 5, 5,
 '2024-01-15 10:00:00', '2024-01-15 10:00:00'),

-- Commercial Plot in Jigjiga Yar
('PROP-002', 'Commercial Plot in Jigjiga Yar',
 'Prime commercial plot in bustling Jigjiga Yar market area. Perfect for shopping complex or office building.',
 'commercial', 'available',
 'Jigjiga Yar Main Market', 'Jigjiga Yar', 9.561000, 44.065000,
 600.00, NULL, NULL, NULL, NULL, NULL,
 '["High Traffic", "Commercial Zone", "Road Access", "Market Nearby", "Parking Potential"]',
 150000.00, 250.00, TRUE, 5.00,
 9, 'Omar Jama', '+252634567890', 'omar.business@example.com',
 'clear', 'TD-2018-045', '2018-08-20',
 TRUE, '2024-04-20', 6, 6,
 '2024-01-20 14:30:00', '2024-01-20 14:30:00'),

-- Residential Plot in New Hargeisa
('PROP-003', 'Residential Plot in New Hargeisa',
 'Well-planned residential plot in developing New Hargeisa area. Perfect for family home construction.',
 'residential', 'available',
 'New Hargeisa Phase 2, Block C', 'New Hargeisa', 9.551000, 44.085000,
 300.00, NULL, NULL, NULL, NULL, NULL,
 '["Planned Area", "Road Access", "Water Available", "Electricity", "Good Security", "Community Area"]',
 75000.00, 250.00, TRUE, 5.00,
 7, 'Ahmed Mohamed Ali', '+252612345678', 'ahmed.investor@example.com',
 'clear', 'TD-2020-123', '2020-11-10',
 FALSE, NULL, 5, 5,
 '2024-02-01 09:15:00', '2024-02-01 09:15:00'),

-- Apartment in Downtown Hargeisa
('PROP-004', 'Apartment in Downtown Hargeisa',
 'Modern apartment in prime downtown location. Fully furnished with premium amenities.',
 'apartment', 'available',
 'Downtown Business District, Building 5', 'Downtown', 9.560000, 44.055000,
 NULL, 180.00, 3, 2, 2021, 'excellent',
 '["Fully Furnished", "Security", "Parking", "Elevator", "Balcony", "24/7 Water", "Backup Power"]',
 120000.00, 666.67, TRUE, 5.00,
 9, 'Omar Jama', '+252634567890', 'omar.business@example.com',
 'clear', 'TD-2021-067', '2021-09-25',
 TRUE, '2024-04-10', 6, 6,
 '2024-02-10 11:45:00', '2024-02-10 11:45:00'),

-- Investment Property in Masala
('PROP-005', 'Investment Property in Masala',
 'Excellent investment property with rental income potential. Well-maintained with separate guest house.',
 'investment', 'available',
 'Masala Residential Area, Street 10', 'Masala', 9.558000, 44.060000,
 350.00, 280.00, 4, 3, 2018, 'good',
 '["Rental Income", "Guest House", "Garden", "Security", "Parking", "Separate Entrance"]',
 90000.00, 257.14, TRUE, 5.00,
 7, 'Ahmed Mohamed Ali', '+252612345678', 'ahmed.investor@example.com',
 'clear', 'TD-2018-089', '2018-12-05',
 FALSE, NULL, 5, 5,
 '2024-02-15 15:20:00', '2024-02-15 15:20:00'),

-- Land for Development in Airport Road
('PROP-006', 'Land for Development in Airport Road',
 'Large plot on Airport Road with excellent development potential for commercial or residential project.',
 'land', 'available',
 'Airport Road Extension, Plot 25', 'Airport Road', 9.545000, 44.090000,
 1000.00, NULL, NULL, NULL, NULL, NULL,
 '["Large Area", "Main Road Access", "Development Potential", "Clear Title", "Strategic Location"]',
 180000.00, 180.00, TRUE, 5.00,
 9, 'Omar Jama', '+252634567890', 'omar.business@example.com',
 'clear', 'TD-2015-234', '2015-06-30',
 TRUE, '2024-05-01', 6, 6,
 '2024-03-01 10:30:00', '2024-03-01 10:30:00'),

-- Traditional House in Sheikh Madar
('PROP-007', 'Traditional House in Sheikh Madar',
 'Charming traditional Somali house with courtyard in established Sheikh Madar neighborhood.',
 'residential', 'available',
 'Sheikh Madar Traditional Area', 'Sheikh Madar', 9.562000, 44.058000,
 250.00, 200.00, 3, 2, 1995, 'needs_renovation',
 '["Traditional Design", "Courtyard", "Garden", "Secure", "Cultural Area", "Historical Value"]',
 65000.00, 260.00, TRUE, 5.00,
 7, 'Ahmed Mohamed Ali', '+252612345678', 'ahmed.investor@example.com',
 'clear', 'TD-1995-001', '1995-03-15',
 FALSE, NULL, 5, 5,
 '2024-03-05 14:10:00', '2024-03-05 14:10:00'),

-- Commercial Building in Gacan Libaax
('PROP-008', 'Commercial Building in Gacan Libaax',
 'Modern commercial building with retail spaces on ground floor and offices above. Great investment opportunity.',
 'commercial', 'available',
 'Gacan Libaax Business Center', 'Gacan Libaax', 9.565000, 44.075000,
 500.00, 800.00, 0, 4, 2020, 'excellent',
 '["Retail Spaces", "Office Spaces", "Parking Lot", "Security", "Modern Design", "Elevator"]',
 220000.00, 275.00, TRUE, 5.00,
 9, 'Omar Jama', '+252634567890', 'omar.business@example.com',
 'clear', 'TD-2020-156', '2020-11-20',
 TRUE, '2024-04-30', 6, 6,
 '2024-03-10 09:45:00', '2024-03-10 09:45:00');

-- ===== INSERT PROPERTY IMAGES =====
INSERT INTO property_images (property_id, image_url, thumbnail_url, image_order, is_primary, caption) VALUES
-- Property 1 images
(1, 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80', 1, TRUE, 'Front view of luxury villa'),
(1, 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80', 2, FALSE, 'Living room interior'),

-- Property 2 images
(2, 'https://images.unsplash.com/photo-1487956382158-bb926046304a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
 'https://images.unsplash.com/photo-1487956382158-bb926046304a?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80', 1, TRUE, 'Commercial plot location'),

-- Property 3 images
(3, 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80', 1, TRUE, 'Residential plot area'),

-- Property 4 images
(4, 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80', 1, TRUE, 'Apartment building exterior'),

-- Property 5 images
(5, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80', 1, TRUE, 'Investment property front view'),

-- Property 6 images
(6, 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80', 1, TRUE, 'Land plot overview'),

-- Property 7 images
(7, 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80', 1, TRUE, 'Traditional house courtyard'),

-- Property 8 images
(8, 'https://images.unsplash.com/photo-1487956382158-bb926046304a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
 'https://images.unsplash.com/photo-1487956382158-bb926046304a?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80', 1, TRUE, 'Commercial building exterior');

-- ===== INSERT LEGAL SERVICES =====
INSERT INTO legal_services (
    service_code, title, description, category, service_type,
    base_price, price_type, estimated_hours, complexity_level,
    features, requirements, deliverables, process_steps, timeframe_days,
    lawyer_id, is_active, is_popular
) VALUES
('LEG-001', 'Property Documentation',
 'Complete legal documentation services for all property transactions including title deeds, sale agreements, and transfer documents.',
 'documentation', 'legal',
 500.00, 'fixed', 20, 'medium',
 '["Title deed preparation & verification", "Comprehensive sale agreements", "Lease agreements & contracts", "Power of attorney documentation", "Property transfer documents", "Legal attestation & notarization"]',
 '["Property details", "Owner identification", "Previous documents"]',
 '["Legal documents", "Verification certificate", "Notarized copies"]',
 '["Initial consultation", "Document collection", "Legal review", "Document preparation", "Verification & attestation", "Delivery & follow-up"]', 14,
 3, TRUE, TRUE),

('LEG-002', 'Contract Review',
 'Expert review of all property-related contracts to protect your interests and ensure legal compliance with Somaliland laws.',
 'contract-review', 'legal',
 300.00, 'fixed', 8, 'medium',
 '["Purchase agreement review", "Construction contract analysis", "Lease agreement examination", "Partnership agreement review", "Risk assessment & mitigation", "Legal compliance verification"]',
 '["Contract copy", "Parties information", "Property details"]',
 '["Review report", "Risk assessment", "Recommendations", "Amended contract"]',
 '["Contract submission", "Initial assessment", "Detailed analysis", "Risk identification", "Recommendations", "Final report"]', 7,
 4, TRUE, TRUE),

('LEG-003', 'Title Verification',
 'Comprehensive title search and verification to ensure clear property ownership and prevent future disputes.',
 'title-verification', 'legal',
 400.00, 'fixed', 15, 'complex',
 '["Complete title search", "Ownership verification", "Encumbrance & lien check", "Legal clearance certificate", "Boundary verification", "Historical title tracing"]',
 '["Property details", "Location information", "Owner information"]',
 '["Title verification report", "Clearance certificate", "Ownership confirmation"]',
 '["Property identification", "Registry search", "Document verification", "Field verification", "Report preparation", "Clearance certificate"]', 15,
 3, TRUE, TRUE),

('LEG-004', 'Dispute Resolution',
 'Expert legal representation for property disputes, litigation matters, and conflict resolution in Somaliland courts.',
 'dispute-resolution', 'legal',
 1000.00, 'hourly', 40, 'complex',
 '["Property dispute resolution", "Boundary conflict mediation", "Tenant-landlord disputes", "Professional legal representation", "Court litigation support", "Settlement negotiation"]',
 '["Case details", "Evidence", "Previous correspondence"]',
 '["Legal strategy", "Court representation", "Settlement agreement", "Resolution certificate"]',
 '["Case assessment", "Evidence collection", "Legal strategy", "Negotiation/mediation", "Court representation", "Settlement enforcement"]', 30,
 3, TRUE, FALSE),

('LEG-005', 'Legal Consultation',
 'Professional legal advice on all property matters in Somaliland, from purchase to inheritance.',
 'consultation', 'legal',
 150.00, 'hourly', 2, 'simple',
 '["Property purchase advice", "Inheritance planning", "Investment legalities", "Development regulations", "Tax implications", "Compliance guidance"]',
 '["Query details", "Relevant documents", "Background information"]',
 '["Legal advice report", "Recommendations", "Action plan"]',
 '["Initial meeting", "Case analysis", "Research", "Advice preparation", "Recommendations", "Follow-up support"]', 1,
 4, TRUE, TRUE),

('LEG-006', 'Court Representation',
 'Professional representation in Somaliland courts for all property-related legal matters.',
 'court-representation', 'legal',
 2000.00, 'retainer', 80, 'complex',
 '["Case preparation", "Court filings", "Hearing representation", "Evidence presentation", "Legal arguments", "Appeal representation"]',
 '["Case details", "Evidence", "Previous rulings"]',
 '["Legal representation", "Court filings", "Case management", "Judgment enforcement"]',
 '["Case evaluation", "Strategy development", "Document preparation", "Court appearances", "Proceedings management", "Judgment enforcement"]', 60,
 3, TRUE, FALSE),

('LEG-007', 'Property Buying Service',
 'Complete assistance with property purchase including search, valuation, negotiation, and legal completion.',
 'consultation', 'real-estate',
 1000.00, 'percentage', 30, 'medium',
 '["Property search & selection", "Market analysis & valuation", "Expert negotiation support", "Complete legal verification", "Financing assistance", "Post-purchase support"]',
 '["Budget range", "Property preferences", "Location requirements"]',
 '["Property options", "Market analysis", "Negotiation strategy", "Purchase completion"]',
 '["Needs assessment", "Property search", "Viewing arrangement", "Valuation & analysis", "Negotiation", "Legal completion"]', 30,
 5, TRUE, TRUE),

('LEG-008', 'Property Selling Service',
 'Professional marketing and sales service to get the best price for your property with legal protection.',
 'consultation', 'real-estate',
 1200.00, 'percentage', 25, 'medium',
 '["Professional property valuation", "Comprehensive marketing & advertising", "Qualified buyer screening", "Complete closing support", "Legal documentation", "Maximum price negotiation"]',
 '["Property details", "Expected price", "Timeline"]',
 '["Marketing plan", "Property valuation", "Buyer screening", "Sale completion"]',
 '["Property assessment", "Market valuation", "Marketing strategy", "Buyer screening", "Negotiation", "Closing management"]', 25,
 6, TRUE, TRUE);

-- ===== INSERT SERVICE REQUESTS =====
INSERT INTO service_requests (
    request_code, client_id, service_id, property_id,
    request_type, description, urgency, status,
    assigned_lawyer_id, assigned_at, started_at,
    quoted_price, final_price, payment_status,
    documents, client_rating, client_feedback,
    created_at
) VALUES
('REQ-001', 8, 1, 2,
 'documentation', 'Need title deed preparation for commercial plot purchase', 'high', 'completed',
 3, '2024-02-01 10:00:00', '2024-02-02 09:00:00',
 500.00, 500.00, 'paid',
 '["contract.pdf", "id_copy.jpg"]', 5, 'Excellent service! Documents were prepared perfectly and delivered on time.',
 '2024-02-01 09:30:00'),

('REQ-002', 9, 3, 4,
 'verification', 'Title verification for apartment purchase', 'normal', 'in_progress',
 4, '2024-02-15 14:00:00', '2024-02-16 10:00:00',
 400.00, NULL, 'partial',
 '["property_details.pdf", "seller_id.jpg"]', NULL, NULL,
 '2024-02-15 13:45:00'),

('REQ-003', 10, 2, 6,
 'review', 'Contract review for land development partnership', 'high', 'assigned',
 3, '2024-03-02 11:00:00', NULL,
 300.00, NULL, 'pending',
 '["partnership_contract.pdf"]', NULL, NULL,
 '2024-03-02 10:30:00'),

('REQ-004', 8, 5, NULL,
 'consultation', 'Legal advice on property investment in Hargeisa', 'normal', 'completed',
 4, '2024-01-25 09:00:00', '2024-01-25 10:00:00',
 150.00, 150.00, 'paid',
 '[]', 5, 'Very helpful consultation. Clear advice on investment opportunities.',
 '2024-01-25 08:45:00'),

('REQ-005', 9, 7, 1,
 'consultation', 'Assistance with luxury villa purchase', 'urgent', 'completed',
 5, '2024-02-28 16:00:00', '2024-02-29 09:00:00',
 12500.00, 12500.00, 'paid',
 '["property_details.pdf", "budget_range.pdf"]', 5, 'Outstanding service! Found the perfect property and negotiated a great price.',
 '2024-02-28 15:30:00');

-- ===== INSERT APPOINTMENTS =====
INSERT INTO appointments (
    appointment_code, client_id, staff_id, property_id,
    appointment_type, purpose, scheduled_date, start_time, end_time,
    location_type, location_details, status, reminder_sent,
    client_notes, staff_notes, outcome,
    created_at
) VALUES
('APT-001', 8, 5, 2,
 'viewing', 'Property viewing for commercial plot', '2024-02-05', '10:00:00', '11:00:00',
 'property', 'Jigjiga Yar Main Market', 'completed', TRUE,
 'Please bring all necessary documents', 'Client interested, follow up needed', 'Client very interested, proceeding with documentation',
 '2024-02-01 11:00:00'),

('APT-002', 9, 6, 4,
 'viewing', 'Apartment viewing for potential purchase', '2024-02-20', '14:00:00', '15:00:00',
 'property', 'Downtown Business District, Building 5', 'confirmed', TRUE,
 'Will bring family members', 'Family viewing, good prospects', NULL,
 '2024-02-16 09:30:00'),

('APT-003', 10, 3, 6,
 'consultation', 'Legal consultation for land development', '2024-03-05', '11:00:00', '12:00:00',
 'office', 'DhulBeeg Office, Siinay Village', 'scheduled', FALSE,
 'Need advice on partnership structure', NULL, NULL,
 '2024-03-03 16:45:00'),

('APT-004', 8, 4, NULL,
 'document-signing', 'Signing of sale agreement', '2024-02-10', '09:00:00', '10:00:00',
 'office', 'DhulBeeg Office, Siinay Village', 'completed', TRUE,
 'All parties will be present', 'Documents ready for signing', 'Agreement signed successfully',
 '2024-02-08 14:20:00'),

('APT-005', 9, 5, 1,
 'viewing', 'Luxury villa viewing', '2024-03-01', '15:00:00', '16:30:00',
 'property', 'Siinay Village, Main Road', 'completed', TRUE,
 'Virtual tour requested', 'Client overseas, arranged video tour', 'Client impressed, moving forward with offer',
 '2024-02-28 10:15:00');

-- ===== INSERT TRANSACTIONS =====
INSERT INTO transactions (
    transaction_code, property_id, buyer_id, seller_id,
    transaction_type, transaction_date, closing_date,
    agreed_price, commission_amount, taxes_amount, other_fees, total_amount,
    payment_method, payment_status, contract_url, title_deed_url,
    buyer_name, buyer_phone, buyer_email,
    seller_name, seller_phone, seller_email,
    buyer_agent_id, seller_agent_id,
    status, notes, created_by,
    created_at
) VALUES
('TXN-001', 2, 8, 9,
 'sale', '2024-02-15', '2024-02-20',
 150000.00, 7500.00, 3000.00, 500.00, 158000.00,
 'bank_transfer', 'completed', 'contracts/txn-001.pdf', 'titles/txn-001.pdf',
 'Fatima Hassan', '+252623456789', 'fatima.client@example.com',
 'Omar Jama', '+252634567890', 'omar.business@example.com',
 6, 6,
 'completed', 'Smooth transaction, all documents verified', 6,
 '2024-02-15 16:30:00'),

('TXN-002', 1, 10, 7,
 'purchase', '2024-03-10', '2024-03-15',
 250000.00, 12500.00, 5000.00, 1000.00, 257500.00,
 'international_transfer', 'pending', 'contracts/txn-002.pdf', 'titles/txn-002.pdf',
 'Nadia Mohammed', '+441234567890', 'nadia.diaspora@example.com',
 'Ahmed Mohamed Ali', '+252612345678', 'ahmed.investor@example.com',
 5, 5,
 'under_review', 'Diaspora purchase, additional verification needed', 5,
 '2024-03-10 11:45:00'),

('TXN-003', 3, 8, 7,
 'sale', '2024-02-28', NULL,
 75000.00, 3750.00, 1500.00, 300.00, 78750.00,
 'cash', 'partial', 'contracts/txn-003.pdf', NULL,
 'Fatima Hassan', '+252623456789', 'fatima.client@example.com',
 'Ahmed Mohamed Ali', '+252612345678', 'ahmed.investor@example.com',
 5, 5,
 'pending', 'Initial deposit paid, balance due at closing', 5,
 '2024-02-28 14:20:00');

-- ===== INSERT TESTIMONIALS =====
INSERT INTO testimonials (
    client_id, property_id, service_request_id,
    rating, title, content, service_type, service_details,
    client_name, client_role, client_company,
    is_approved, approved_by, approved_at,
    is_featured, featured_order,
    created_at
) VALUES
(8, 2, 1,
 5, 'Excellent Service!', 
 'DhulBeeg helped me purchase my first commercial property in Hargeisa. Their legal team ensured all documents were perfect and the real estate agents found me the perfect location. The integrated service saved me months of work!',
 'both', 'Property purchase with legal documentation',
 'Fatima Hassan', 'Medical Doctor', NULL,
 TRUE, 1, '2024-02-28 10:00:00',
 TRUE, 1,
 '2024-02-28 09:45:00'),

(9, 4, 2,
 5, 'Professional Legal Service',
 'The legal team resolved a 5-year property dispute that seemed impossible. Their knowledge of Somaliland property law is exceptional. Highly recommend their dispute resolution service!',
 'legal', 'Dispute resolution',
 'Omar Jama', 'Construction Company Owner', 'Jama Construction',
 TRUE, 1, '2024-02-10 14:30:00',
 TRUE, 2,
 '2024-02-10 14:15:00'),

(10, 1, 5,
 5, 'Outstanding Investment Advice',
 'We''ve developed 3 properties with DhulBeeg''s guidance. Their investment consulting is worth every dollar. They understand Hargeisa''s market trends better than anyone.',
 'real-estate', 'Investment consulting',
 'Nadia Mohammed', 'Software Engineer', 'Tech Solutions Ltd',
 TRUE, 1, '2024-03-15 11:20:00',
 TRUE, 3,
 '2024-03-15 11:00:00'),

(8, NULL, 4,
 5, 'Great Legal Consultation',
 'Title verification service prevented me from buying a disputed property. Their thorough investigation saved me from a costly mistake. Professional and honest!',
 'legal', 'Title verification',
 'Fatima Hassan', 'Medical Doctor', NULL,
 TRUE, 1, '2024-01-30 16:45:00',
 FALSE, 0,
 '2024-01-30 16:30:00'),

(9, 6, 3,
 4, 'Helpful Contract Review',
 'Contract review service saved our company from a bad partnership agreement. Their legal team spotted issues we missed. Essential service for any business in Somaliland.',
 'legal', 'Contract review',
 'Omar Jama', 'Construction Company Owner', 'Jama Construction',
 TRUE, 1, '2024-03-10 09:15:00',
 FALSE, 0,
 '2024-03-10 09:00:00');

-- ===== INSERT CONTACT INQUIRIES =====
INSERT INTO contact_inquiries (
    name, email, phone, subject, message,
    inquiry_type, property_id, service_id,
    status, assigned_to, priority,
    source_url, ip_address, user_agent,
    created_at
) VALUES
('Ahmed Ali', 'ahmed.ali@example.com', '+252611223344',
 'Property Inquiry', 'I''m interested in the luxury villa in Siinay. Can you send me more details?',
 'property', 1, NULL,
 'responded', 5, 'high',
 '/properties/1', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
 '2024-03-12 10:30:00'),

('Maryam Hassan', 'maryam@example.com', '+252622334455',
 'Legal Service Inquiry', 'I need help with property documentation for a house I''m buying.',
 'service', NULL, 1,
 'in_progress', 3, 'normal',
 '/legal-services', '192.168.1.101', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/537.36',
 '2024-03-13 14:45:00'),

('Dr. Abdi Mohamed', 'abdi.mohamed@example.com', '+252633445566',
 'Partnership Inquiry', 'I represent a diaspora investment group interested in Hargeisa property market.',
 'partnership', NULL, NULL,
 'new', NULL, 'high',
 '/about', '192.168.1.102', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
 '2024-03-14 09:15:00'),

('Sahra Omar', 'sahra.omar@example.com', NULL,
 'General Inquiry', 'Do you provide virtual property tours for overseas buyers?',
 'general', NULL, NULL,
 'responded', 6, 'low',
 '/contact', '192.168.1.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124',
 '2024-03-11 16:20:00'),

('Khalid Ahmed', 'khalid@example.com', '+252644556677',
 'Complaint', 'I haven''t received updates on my service request for 3 days.',
 'complaint', NULL, 2,
 'closed', 4, 'normal',
 '/dashboard', '192.168.1.104', 'Mozilla/5.0 (Android 11; Mobile) AppleWebKit/537.36',
 '2024-03-10 11:30:00');

-- ===== INSERT COMPARISON LISTS =====
INSERT INTO comparison_lists (user_id, list_name, is_default, created_at) VALUES
(8, 'My Comparison', TRUE, '2024-02-15 10:00:00'),
(9, 'Investment Properties', TRUE, '2024-02-20 14:30:00'),
(10, 'Diaspora Investments', TRUE, '2024-03-01 11:15:00');

-- ===== INSERT COMPARISON ITEMS =====
INSERT INTO comparison_items (comparison_list_id, property_id, added_at) VALUES
(1, 1, '2024-02-15 10:05:00'),
(1, 4, '2024-02-15 10:10:00'),
(2, 2, '2024-02-20 14:35:00'),
(2, 6, '2024-02-20 14:40:00'),
(3, 1, '2024-03-01 11:20:00'),
(3, 8, '2024-03-01 11:25:00');

-- ===== INSERT SUBSCRIPTIONS =====
INSERT INTO subscriptions (
    user_id, plan_code, plan_name, price, currency, billing_cycle,
    start_date, end_date, trial_start_date, trial_end_date,
    payment_method, payment_status, last_payment_date, next_payment_date,
    features, limits, status,
    created_at
) VALUES
(8, 'professional', 'Professional Plan', 99.00, 'USD', 'monthly',
 '2024-02-01', '2024-03-01', '2024-02-01', '2024-02-08',
 'credit_card', 'paid', '2024-02-01', '2024-03-01',
 '["Property Listings", "Basic Support", "Email Updates", "Priority Support", "Market Analysis", "Property Alerts"]',
 '{"max_properties": 50, "max_comparisons": 10, "support_level": "priority"}',
 'active', '2024-02-01 10:00:00'),

(9, 'enterprise', 'Enterprise Plan', 199.00, 'USD', 'monthly',
 '2024-01-20', '2024-02-20', '2024-01-20', '2024-01-27',
 'bank_transfer', 'paid', '2024-01-20', '2024-02-20',
 '["Property Listings", "Basic Support", "Email Updates", "Priority Support", "Market Analysis", "Property Alerts", "Dedicated Agent", "Legal Consultation", "Investment Advisory"]',
 '{"max_properties": 100, "max_comparisons": 20, "support_level": "dedicated"}',
 'active', '2024-01-20 09:30:00'),

(10, 'enterprise', 'Enterprise Plan', 199.00, 'USD', 'monthly',
 '2024-03-01', '2024-04-01', '2024-03-01', '2024-03-08',
 'paypal', 'paid', '2024-03-01', '2024-04-01',
 '["Property Listings", "Basic Support", "Email Updates", "Priority Support", "Market Analysis", "Property Alerts", "Dedicated Agent", "Legal Consultation", "Investment Advisory"]',
 '{"max_properties": 100, "max_comparisons": 20, "support_level": "dedicated"}',
 'active', '2024-03-01 16:15:00');

-- ===== INSERT NOTIFICATIONS =====
INSERT INTO notifications (
    user_id, title, message, notification_type, related_type, related_id,
    is_read, send_method, sent_at, expires_at, action_url, action_text,
    created_at
) VALUES
(8, 'Appointment Reminder', 'You have a property viewing tomorrow at 10:00 AM', 'reminder', 'appointment', 1,
 FALSE, 'all', '2024-02-04 18:00:00', '2024-02-05 10:00:00', '/appointments/1', 'View Details',
 '2024-02-04 18:00:00'),

(9, 'Document Ready', 'Your title verification report is ready for review', 'success', 'service', 2,
 TRUE, 'in_app', '2024-02-25 15:30:00', '2024-03-25 15:30:00', '/services/2', 'View Report',
 '2024-02-25 15:30:00'),

(10, 'Welcome to DhulBeeg!', 'Your free trial has started. Explore premium features.', 'info', 'system', NULL,
 FALSE, 'all', '2024-03-01 16:20:00', '2024-03-08 16:20:00', '/subscription', 'Upgrade Plan',
 '2024-03-01 16:20:00'),

(8, 'Payment Received', 'Your payment for service request REQ-001 has been received', 'success', 'service', 1,
 TRUE, 'in_app', '2024-02-02 11:45:00', '2024-03-02 11:45:00', '/transactions/1', 'View Receipt',
 '2024-02-02 11:45:00'),

(9, 'New Message', 'You have a new message from your assigned agent', 'info', 'system', NULL,
 FALSE, 'in_app', '2024-02-21 09:15:00', '2024-02-28 09:15:00', '/messages', 'View Messages',
 '2024-02-21 09:15:00');

-- ===== INSERT ACTIVITY LOGS =====
INSERT INTO activity_logs (
    user_id, activity_type, description, ip_address, user_agent,
    entity_type, entity_id, entity_name,
    old_values, new_values, latitude, longitude,
    created_at
) VALUES
(8, 'user_login', 'User logged in successfully', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
 'user', 8, 'Fatima Hassan',
 NULL, NULL, 9.560000, 44.055000,
 '2024-02-01 09:00:00'),

(8, 'property_view', 'Viewed property: Luxury Villa in Siinay', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
 'property', 1, 'Luxury Villa in Siinay',
 NULL, NULL, 9.560000, 44.055000,
 '2024-02-01 09:05:00'),

(9, 'service_request', 'Created service request: Title Verification', '192.168.1.101', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/537.36',
 'service_request', 2, 'Title Verification',
 NULL, '{"status": "pending", "urgency": "normal"}', 9.561000, 44.065000,
 '2024-02-15 13:45:00'),

(10, 'property_compare', 'Added property to comparison: Land for Development in Airport Road', '192.168.1.102', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
 'property', 6, 'Land for Development in Airport Road',
 NULL, NULL, NULL, NULL,
 '2024-03-01 11:25:00'),

(5, 'property_update', 'Updated property status to: under_contract', '192.168.1.50', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124',
 'property', 2, 'Commercial Plot in Jigjiga Yar',
 '{"status": "available"}', '{"status": "under_contract"}', NULL, NULL,
 '2024-02-10 14:30:00');

-- ============================================
-- UPDATE DISTRICT STATISTICS
-- ============================================

UPDATE districts d
SET total_properties = (
    SELECT COUNT(*) 
    FROM properties p 
    WHERE p.district = d.name AND p.status = 'available'
);

-- ============================================
-- VERIFY DATA INSERTION
-- ============================================

-- Count records in each table
SELECT 'users' as table_name, COUNT(*) as record_count FROM users
UNION ALL
SELECT 'properties', COUNT(*) FROM properties
UNION ALL
SELECT 'property_images', COUNT(*) FROM property_images
UNION ALL
SELECT 'legal_services', COUNT(*) FROM legal_services
UNION ALL
SELECT 'service_requests', COUNT(*) FROM service_requests
UNION ALL
SELECT 'appointments', COUNT(*) FROM appointments
UNION ALL
SELECT 'transactions', COUNT(*) FROM transactions
UNION ALL
SELECT 'testimonials', COUNT(*) FROM testimonials
UNION ALL
SELECT 'contact_inquiries', COUNT(*) FROM contact_inquiries
UNION ALL
SELECT 'comparison_lists', COUNT(*) FROM comparison_lists
UNION ALL
SELECT 'comparison_items', COUNT(*) FROM comparison_items
UNION ALL
SELECT 'subscriptions', COUNT(*) FROM subscriptions
UNION ALL
SELECT 'notifications', COUNT(*) FROM notifications
UNION ALL
SELECT 'activity_logs', COUNT(*) FROM activity_logs
ORDER BY table_name;

-- Show available properties
SELECT 
    p.property_code,
    p.title,
    p.property_type,
    p.price,
    p.district,
    p.status,
    (SELECT image_url FROM property_images WHERE property_id = p.id AND is_primary = TRUE LIMIT 1) as primary_image
FROM properties p
WHERE p.status = 'available'
ORDER BY p.is_featured DESC, p.created_at DESC;

-- Show active service requests
SELECT 
    sr.request_code,
    u.email as client_email,
    ls.title as service_name,
    sr.status,
    sr.quoted_price
FROM service_requests sr
JOIN users u ON sr.client_id = u.id
JOIN legal_services ls ON sr.service_id = ls.id
WHERE sr.status IN ('pending', 'assigned', 'in_progress')
ORDER BY sr.created_at DESC;

-- End of seed data