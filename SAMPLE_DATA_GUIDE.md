# TVS Scholarship Ecosystem - Sample Data Guide

## Overview
This guide provides comprehensive sample data for the TVS Scholarship Ecosystem, including realistic student profiles, scholarship programs, applications, payments, and administrative data.

## Sample Data Structure

### 📊 Data Statistics
- **Students**: 25+ realistic profiles
- **Scholarships**: 8 different programs
- **Applications**: 30+ with various statuses
- **Payments**: 20+ transactions
- **Admin Users**: 10+ with different roles
- **Notifications**: 15+ system notifications

### 🎓 Scholarship Programs

#### 1. TVS Merit Scholarship 2024
- **Type**: Merit-based
- **Amount**: ₹50,000
- **Eligibility**: 80%+ marks, family income < ₹5,00,000
- **Target**: Undergraduate & Postgraduate students
- **Available Slots**: 1,000 (678 filled)

#### 2. TVS Need-based Scholarship 2024
- **Type**: Need-based
- **Amount**: ₹40,000
- **Eligibility**: 60%+ marks, family income < ₹3,00,000
- **Target**: School & Undergraduate students
- **Available Slots**: 750 (423 filled)

#### 3. TVS Minority Scholarship 2024
- **Type**: Minority
- **Amount**: ₹45,000
- **Eligibility**: 70%+ marks, family income < ₹4,00,000
- **Target**: Undergraduate & Postgraduate students
- **Available Slots**: 500 (267 filled)

### 👥 Student Profiles

#### Sample Student 1: Rajesh Kumar
- **Personal**: Male, OBC, Chennai, Tamil Nadu
- **Education**: B.Tech Computer Science, IIT Madras (CGPA: 8.2)
- **Family**: Father (Auto Driver), Mother (Homemaker), Income: ₹1,80,000
- **Bank**: SBI, Account ending 3456
- **Status**: Application under review

#### Sample Student 2: Priya Singh
- **Personal**: Female, General, Bangalore, Karnataka
- **Education**: B.Sc Mathematics, Christ University (CGPA: 8.7)
- **Family**: Father (Factory Worker), Mother (Tailor), Income: ₹3,00,000
- **Bank**: HDFC, Account ending 7890
- **Status**: Application approved, payment disbursed

### 📝 Application Statuses

1. **Submitted** - Application received
2. **Under Review** - Being evaluated by reviewer
3. **Approved** - Approved for scholarship
4. **Rejected** - Not eligible
5. **On Hold** - Pending additional documents

### 💰 Payment Statuses

1. **Pending** - Awaiting processing
2. **Processing** - Being processed by bank
3. **Completed** - Successfully transferred
4. **Failed** - Transaction failed (retry required)

### 🔔 Notification Types

1. **Application Status Updates** - Status changes
2. **Payment Notifications** - Payment success/failure
3. **Document Requests** - Additional documents needed
4. **Deadline Reminders** - Application deadlines
5. **System Announcements** - General notifications

## Database Seeding

### Quick Start
```bash
# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed with comprehensive sample data
npm run seed:comprehensive
```

### Available Seed Scripts

1. **Basic Seed** (`npm run seed`)
   - Creates minimal data for testing
   - 5 users, 3 scholarships, 10 applications

2. **Comprehensive Seed** (`npm run seed:comprehensive`)
   - Creates full sample dataset
   - 25+ students, 8 scholarships, 30+ applications
   - Includes payments, notifications, communications
   - Realistic data based on provided JSON

### Sample Data Features

#### 🎯 Realistic Scenarios
- **Geographic Distribution**: Tamil Nadu, Karnataka, Andhra Pradesh, Telangana
- **Demographic Diversity**: Different genders, categories, income levels
- **Academic Performance**: Varying CGPA scores and educational backgrounds
- **Family Profiles**: Different occupations and income levels

#### 📈 Analytics Data
- **Application Metrics**: Total, monthly, growth rates
- **Geographic Distribution**: State-wise breakdown
- **Demographic Data**: Gender, category distribution
- **Financial Metrics**: Budget utilization, disbursements
- **Performance Metrics**: Processing times, approval rates

#### 🔄 Workflow Examples
- **Application Review Process**: Document verification → Academic review → Final approval
- **Payment Processing**: Batch processing, retry mechanisms
- **Notification Flow**: Status updates, deadline reminders

## Testing Scenarios

### 1. Student Application Flow
```bash
# Test student registration
POST /api/auth/register
{
  "email": "new.student@email.com",
  "password": "Password@123"
}

# Test application submission
POST /api/applications
{
  "scholarshipId": "SCH_MERIT_2024",
  "applicationData": { ... }
}
```

### 2. Admin Review Process
```bash
# Test application review
PATCH /api/applications/APP001
{
  "status": "APPROVED",
  "reviewerComments": "Excellent candidate"
}
```

### 3. Payment Processing
```bash
# Test payment creation
POST /api/payments
{
  "applicationId": "APP002",
  "amount": 40000,
  "paymentMethod": "NEFT"
}
```

## Data Validation

### Required Documents
- Aadhaar Card (Verified)
- Income Certificate (Verified)
- Mark Sheets/Transcripts (Verified)
- Bank Passbook (Pending verification)

### Eligibility Criteria
- **Academic**: Minimum percentage requirements
- **Financial**: Family income thresholds
- **Geographic**: State-wise eligibility
- **Category**: General, OBC, SC, ST, Minority

## Performance Metrics

### Application Processing
- **Average Processing Time**: 12.5 days
- **Approval Rate**: 68.2%
- **Completion Rate**: 89.5%

### Financial Performance
- **Total Budget**: ₹100 crores
- **Budget Utilized**: 45.2%
- **Average Award**: ₹42,000

### System Performance
- **Scholar Retention**: 94.2%
- **Success Rate**: 91.8%
- **System Uptime**: 99.9%

## Security Features

### Data Protection
- **Encryption**: AES-256 for sensitive data
- **PII Masking**: Aadhaar numbers, bank details
- **Access Control**: Role-based permissions
- **Audit Logging**: Complete action tracking

### Compliance
- **GDPR**: Consent management, data portability
- **WCAG 2.1 AA**: Accessibility compliance
- **SOC 2**: Security controls implementation

## API Endpoints

### Authentication
- `POST /api/auth/register` - Student registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password reset

### Applications
- `GET /api/applications` - List applications
- `POST /api/applications` - Submit application
- `PATCH /api/applications/:id` - Update application

### Scholarships
- `GET /api/scholarships` - List scholarships
- `GET /api/scholarships/active` - Active scholarships
- `POST /api/scholarships/check-eligibility` - Check eligibility

### Payments
- `GET /api/payments` - List payments
- `POST /api/payments` - Create payment
- `PATCH /api/payments/:id` - Update payment status

### Notifications
- `GET /api/notifications` - User notifications
- `PATCH /api/notifications/:id/read` - Mark as read
- `POST /api/notifications/bulk` - Send bulk notifications

### Reports
- `GET /api/reports/dashboard` - Dashboard data
- `POST /api/reports/export` - Export reports
- `GET /api/reports/analytics` - Analytics data

## Troubleshooting

### Common Issues

1. **Database Connection**
   ```bash
   # Check database URL
   echo $DATABASE_URL
   
   # Test connection
   npm run prisma:studio
   ```

2. **Seed Data Issues**
   ```bash
   # Clear database
   npx prisma migrate reset
   
   # Re-seed
   npm run seed:comprehensive
   ```

3. **Permission Errors**
   ```bash
   # Check file permissions
   chmod +x prisma/seed-comprehensive.ts
   ```

### Support

For technical support or questions about the sample data:
- **Documentation**: Check API documentation at `/api/docs`
- **Issues**: Create GitHub issue with detailed description
- **Email**: support@tvsscholarship.com

## Next Steps

1. **Explore the Data**: Use Prisma Studio to browse the seeded data
2. **Test APIs**: Use the provided API endpoints to test functionality
3. **Customize**: Modify the seed script to add your own test data
4. **Deploy**: Follow deployment guide for production setup

---

**Note**: This sample data is for development and testing purposes only. Do not use in production without proper data sanitization and security review.

