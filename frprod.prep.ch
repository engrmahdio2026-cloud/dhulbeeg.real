// 1. Environment variables
- Create .env.production
- Remove hardcoded secrets
- Set NODE_ENV=production

// 2. Security
- Add CORS configuration for production domain
- Enable HTTPS
- Add rate limiting
- Set secure headers

// 3. Database
- Switch to production database
- Create backups strategy
- Optimize database indexes

// 4. Performance
- Enable compression
- Add caching (Redis if needed)
- Optimize database queries