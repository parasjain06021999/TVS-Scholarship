# TVS Scholarship Ecosystem - Deployment Guide

## 🚀 Production Deployment

### Prerequisites

- Node.js 18+ installed
- PostgreSQL 14+ database
- MongoDB 6+ database
- Domain name (optional)
- SSL certificate (for production)

### Backend Deployment (Railway/Render)

#### Option 1: Railway

1. **Connect Repository**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login to Railway
   railway login
   
   # Initialize project
   railway init
   ```

2. **Configure Environment Variables**
   ```env
   DATABASE_URL=postgresql://username:password@host:port/database
   MONGODB_URI=mongodb://username:password@host:port/database
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=7d
   JWT_REFRESH_SECRET=your-refresh-secret
   JWT_REFRESH_EXPIRES_IN=30d
   AWS_ACCESS_KEY_ID=your-aws-key
   AWS_SECRET_ACCESS_KEY=your-aws-secret
   AWS_S3_BUCKET=your-bucket-name
   AWS_REGION=ap-south-1
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   FROM_EMAIL=noreply@tvsscholarship.com
   FROM_NAME=TVS Scholarship System
   PORT=3001
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-domain.com
   API_PREFIX=api/v1
   MAX_FILE_SIZE=10485760
   ALLOWED_FILE_TYPES=pdf,doc,docx,jpg,jpeg,png
   RATE_LIMIT_TTL=60
   RATE_LIMIT_LIMIT=100
   BCRYPT_ROUNDS=12
   CORS_ORIGIN=https://your-frontend-domain.com
   ```

3. **Deploy**
   ```bash
   railway up
   ```

#### Option 2: Render

1. **Create New Web Service**
   - Connect GitHub repository
   - Select `backend` folder as root directory

2. **Configure Build Settings**
   ```bash
   Build Command: npm install && npm run build
   Start Command: npm run start:prod
   ```

3. **Add Environment Variables**
   - Add all environment variables from above

4. **Deploy**
   - Render will automatically deploy on git push

### Frontend Deployment (Vercel)

1. **Connect Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Project**
   - Root Directory: `frontend`
   - Framework Preset: `Next.js`
   - Build Command: `npm run build`
   - Output Directory: `.next`

3. **Environment Variables**
   ```env
   NEXT_PUBLIC_API_URL=https://your-backend-domain.com
   NEXT_PUBLIC_APP_URL=https://your-frontend-domain.com
   NODE_ENV=production
   ```

4. **Deploy**
   - Vercel will automatically deploy on git push

### Database Setup

#### PostgreSQL (Primary Database)

1. **Create Database**
   ```sql
   CREATE DATABASE tvs_scholarship;
   CREATE USER tvs_user WITH PASSWORD 'secure_password';
   GRANT ALL PRIVILEGES ON DATABASE tvs_scholarship TO tvs_user;
   ```

2. **Run Migrations**
   ```bash
   cd backend
   npm run prisma:migrate
   npm run prisma:seed
   ```

#### MongoDB (Document Storage)

1. **Create Database**
   ```javascript
   use tvs_scholarship_docs
   db.createUser({
     user: "tvs_mongo_user",
     pwd: "secure_password",
     roles: ["readWrite"]
   })
   ```

### File Storage Setup (AWS S3)

1. **Create S3 Bucket**
   ```bash
   aws s3 mb s3://tvs-scholarship-documents
   ```

2. **Configure CORS**
   ```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
       "AllowedOrigins": ["https://your-frontend-domain.com"],
       "ExposeHeaders": []
     }
   ]
   ```

3. **Set Bucket Policy**
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::tvs-scholarship-documents/*"
       }
     ]
   }
   ```

### Email Configuration

1. **Gmail SMTP Setup**
   - Enable 2-Factor Authentication
   - Generate App Password
   - Use App Password in SMTP_PASS

2. **Alternative: SendGrid**
   ```env
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASS=your-sendgrid-api-key
   ```

### SSL Certificate

1. **Let's Encrypt (Free)**
   ```bash
   # Install certbot
   sudo apt install certbot
   
   # Generate certificate
   sudo certbot certonly --standalone -d your-domain.com
   ```

2. **Cloudflare (Recommended)**
   - Add domain to Cloudflare
   - Enable SSL/TLS encryption
   - Set SSL mode to "Full (strict)"

### Monitoring & Logging

1. **Application Monitoring**
   - Sentry for error tracking
   - LogRocket for session replay
   - New Relic for performance monitoring

2. **Database Monitoring**
   - PostgreSQL: pgAdmin or DataDog
   - MongoDB: MongoDB Atlas monitoring

3. **Uptime Monitoring**
   - UptimeRobot
   - Pingdom
   - StatusCake

### Security Checklist

- [ ] Environment variables secured
- [ ] Database credentials rotated
- [ ] JWT secrets are strong and unique
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] File upload validation
- [ ] SQL injection prevention
- [ ] XSS protection enabled
- [ ] CSRF protection enabled
- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] Regular security updates

### Performance Optimization

1. **Backend**
   - Enable gzip compression
   - Implement Redis caching
   - Database query optimization
   - Connection pooling

2. **Frontend**
   - Image optimization
   - Code splitting
   - Lazy loading
   - CDN for static assets

3. **Database**
   - Proper indexing
   - Query optimization
   - Connection pooling
   - Read replicas

### Backup Strategy

1. **Database Backups**
   ```bash
   # PostgreSQL daily backup
   pg_dump tvs_scholarship > backup_$(date +%Y%m%d).sql
   
   # MongoDB backup
   mongodump --db tvs_scholarship_docs --out backup_$(date +%Y%m%d)
   ```

2. **File Storage Backups**
   - S3 versioning enabled
   - Cross-region replication
   - Lifecycle policies

3. **Code Backups**
   - GitHub repository
   - Regular tags for releases
   - Branch protection rules

### Scaling Considerations

1. **Horizontal Scaling**
   - Load balancer (AWS ALB/Cloudflare)
   - Multiple backend instances
   - Database read replicas

2. **Vertical Scaling**
   - Increase server resources
   - Optimize database queries
   - Implement caching layers

3. **CDN Setup**
   - Cloudflare or AWS CloudFront
   - Static asset optimization
   - Global content delivery

### Troubleshooting

1. **Common Issues**
   - Database connection errors
   - File upload failures
   - Email delivery issues
   - CORS errors

2. **Debugging Tools**
   - Application logs
   - Database query logs
   - Network monitoring
   - Error tracking

3. **Recovery Procedures**
   - Database restore
   - Application rollback
   - File recovery
   - Service restart

### Maintenance

1. **Regular Tasks**
   - Security updates
   - Database maintenance
   - Log rotation
   - Performance monitoring

2. **Monitoring Alerts**
   - High error rates
   - Slow response times
   - Database connection issues
   - Disk space warnings

3. **Backup Verification**
   - Test restore procedures
   - Verify backup integrity
   - Document recovery steps

## 📞 Support

For deployment issues or questions:
- Technical Support: tech-support@tvsscholarship.com
- Documentation: [GitHub Wiki](https://github.com/your-repo/wiki)
- Issues: [GitHub Issues](https://github.com/your-repo/issues)
