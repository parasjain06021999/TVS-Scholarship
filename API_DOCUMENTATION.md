# TVS Scholarship Ecosystem - API Documentation

## 🚀 Overview

The TVS Scholarship Ecosystem API provides comprehensive endpoints for managing scholarship applications, student profiles, document verification, and administrative functions. This RESTful API follows industry best practices with proper error handling, authentication, and documentation.

## 📋 Base Information

- **Base URL**: `http://localhost:3001/api`
- **API Version**: `1.0.0`
- **Documentation**: `http://localhost:3001/api/docs`
- **Health Check**: `http://localhost:3001/health`
- **Status**: `http://localhost:3001/api/status`

## 🔐 Authentication

All API endpoints require JWT authentication except for public endpoints. Include the JWT token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/auth/login` | User login | Public |
| POST | `/auth/register` | User registration | Public |
| POST | `/auth/logout` | User logout | Authenticated |
| POST | `/auth/refresh` | Refresh JWT token | Authenticated |
| POST | `/auth/forgot-password` | Request password reset | Public |
| POST | `/auth/reset-password` | Reset password | Public |

## 📊 Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    "Detailed error message 1",
    "Detailed error message 2"
  ]
}
```

## 🎯 API Endpoints

### Students Management

#### Get All Students
```http
GET /students?page=1&limit=10&search=john&state=Maharashtra&isVerified=true
```

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10, max: 100)
- `search` (string, optional): Search term for name, email, or phone
- `state` (string, optional): Filter by state
- `isVerified` (boolean, optional): Filter by verification status

**Response:**
```json
{
  "success": true,
  "message": "Students retrieved successfully",
  "data": {
    "students": [
      {
        "id": "student_123",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@example.com",
        "phone": "+91-9876543210",
        "city": "Mumbai",
        "state": "Maharashtra",
        "isVerified": true,
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 150,
      "totalPages": 15,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

#### Get Student by ID
```http
GET /students/{id}
```

**Response:**
```json
{
  "success": true,
  "message": "Student retrieved successfully",
  "data": {
    "id": "student_123",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+91-9876543210",
    "dateOfBirth": "2000-05-15",
    "gender": "MALE",
    "address": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "aadharNumber": "123456789012",
    "panNumber": "ABCDE1234F",
    "fatherName": "Rajesh Doe",
    "fatherOccupation": "Engineer",
    "motherName": "Sunita Doe",
    "motherOccupation": "Teacher",
    "familyIncome": 450000,
    "emergencyContact": "+91-9876543211",
    "isVerified": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

#### Create Student
```http
POST /students
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+91-9876543210",
  "dateOfBirth": "2000-05-15",
  "gender": "MALE",
  "address": "123 Main Street",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "aadharNumber": "123456789012",
  "panNumber": "ABCDE1234F",
  "fatherName": "Rajesh Doe",
  "fatherOccupation": "Engineer",
  "motherName": "Sunita Doe",
  "motherOccupation": "Teacher",
  "familyIncome": 450000,
  "emergencyContact": "+91-9876543211"
}
```

#### Update Student
```http
PATCH /students/{id}
Content-Type: application/json

{
  "phone": "+91-9876543212",
  "address": "456 New Street",
  "city": "Pune"
}
```

#### Delete Student
```http
DELETE /students/{id}
```
*Requires Admin role*

### Scholarships Management

#### Get All Scholarships
```http
GET /scholarships?page=1&limit=10&category=MERIT_BASED&isActive=true&search=engineering&minAmount=50000&maxAmount=100000
```

**Query Parameters:**
- `page` (number, optional): Page number
- `limit` (number, optional): Items per page
- `category` (string, optional): Filter by category
- `isActive` (boolean, optional): Filter by active status
- `search` (string, optional): Search term
- `minAmount` (number, optional): Minimum amount filter
- `maxAmount` (number, optional): Maximum amount filter

**Response:**
```json
{
  "success": true,
  "message": "Scholarships retrieved successfully",
  "data": {
    "scholarships": [
      {
        "id": "scholarship_123",
        "title": "TVS Merit Scholarship 2024",
        "description": "Scholarship for students with excellent academic performance",
        "amount": 50000,
        "maxAmount": 75000,
        "category": "MERIT_BASED",
        "subCategory": "Academic Excellence",
        "applicationStartDate": "2024-01-01T00:00:00Z",
        "applicationEndDate": "2024-12-31T23:59:59Z",
        "academicYear": "2024-25",
        "isActive": true,
        "maxApplications": 100,
        "currentApplications": 45,
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

#### Get Active Scholarships
```http
GET /scholarships/active
```

#### Get Scholarship by ID
```http
GET /scholarships/{id}
```

#### Create Scholarship
```http
POST /scholarships
Content-Type: application/json

{
  "title": "TVS Engineering Scholarship 2024",
  "description": "Scholarship for engineering students",
  "eligibilityCriteria": "Minimum 80% marks in 12th standard",
  "amount": 60000,
  "maxAmount": 80000,
  "category": "MERIT_BASED",
  "subCategory": "Engineering",
  "applicationStartDate": "2024-01-01T00:00:00Z",
  "applicationEndDate": "2024-12-31T23:59:59Z",
  "academicYear": "2024-25",
  "maxApplications": 50,
  "documentsRequired": ["MARK_SHEET_10TH", "MARK_SHEET_12TH", "PHOTOGRAPH"],
  "requirements": {
    "minPercentage": 80,
    "maxFamilyIncome": 1000000,
    "eligibleCourses": ["Engineering"],
    "eligibleStates": ["All"]
  }
}
```
*Requires Admin role*

#### Check Eligibility
```http
POST /scholarships/check-eligibility
Content-Type: application/json

{
  "percentage": 85,
  "course": "Engineering",
  "familyIncome": 450000,
  "category": "General",
  "state": "Maharashtra"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Eligibility checked successfully",
  "data": {
    "eligibleScholarships": [
      {
        "id": "scholarship_123",
        "title": "TVS Merit Scholarship 2024",
        "amount": 50000,
        "eligibilityScore": 95,
        "reasons": ["Meets academic criteria", "Within income limit"]
      }
    ],
    "ineligibleScholarships": [
      {
        "id": "scholarship_456",
        "title": "TVS Need-Based Scholarship 2024",
        "reasons": ["Income exceeds limit"]
      }
    ]
  }
}
```

### Applications Management

#### Get All Applications
```http
GET /applications?page=1&limit=10&status=APPROVED&scholarshipId=scholarship_123&studentId=student_123&search=john
```

**Query Parameters:**
- `page` (number, optional): Page number
- `limit` (number, optional): Items per page
- `status` (string, optional): Filter by status
- `scholarshipId` (string, optional): Filter by scholarship
- `studentId` (string, optional): Filter by student
- `search` (string, optional): Search term

**Response:**
```json
{
  "success": true,
  "message": "Applications retrieved successfully",
  "data": {
    "applications": [
      {
        "id": "app_123",
        "status": "APPROVED",
        "student": {
          "id": "student_123",
          "firstName": "John",
          "lastName": "Doe",
          "email": "john.doe@example.com"
        },
        "scholarship": {
          "id": "scholarship_123",
          "title": "TVS Merit Scholarship 2024",
          "amount": 50000
        },
        "submittedAt": "2024-02-15T10:30:00Z",
        "reviewedAt": "2024-02-20T14:30:00Z",
        "approvedAt": "2024-02-25T16:45:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 75,
      "totalPages": 8,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

#### Get Application by ID
```http
GET /applications/{id}
```

**Response:**
```json
{
  "success": true,
  "message": "Application retrieved successfully",
  "data": {
    "id": "app_123",
    "status": "APPROVED",
    "applicationData": {
      "personalInfo": {
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@example.com",
        "phone": "+91-9876543210"
      },
      "academicInfo": {
        "percentage": 85,
        "course": "Engineering",
        "year": "2nd",
        "university": "IIT Mumbai"
      },
      "familyInfo": {
        "fatherName": "Rajesh Doe",
        "fatherOccupation": "Engineer",
        "motherName": "Sunita Doe",
        "motherOccupation": "Teacher",
        "familyIncome": 450000
      }
    },
    "academicInfo": {
      "percentage": 85,
      "course": "Engineering",
      "year": "2nd",
      "university": "IIT Mumbai",
      "achievements": ["First in class", "Science Olympiad winner"]
    },
    "familyInfo": {
      "fatherName": "Rajesh Doe",
      "fatherOccupation": "Engineer",
      "motherName": "Sunita Doe",
      "motherOccupation": "Teacher",
      "familyIncome": 450000,
      "familySize": 4
    },
    "financialInfo": {
      "familyIncome": 450000,
      "expenses": 300000,
      "savings": 150000,
      "otherScholarships": 0
    },
    "additionalInfo": {
      "essay": "I am passionate about technology...",
      "extraCurriculars": ["Debate team", "Science club"],
      "futureGoals": "To become a software engineer"
    },
    "reviewerNotes": "Excellent academic record and strong motivation",
    "adminNotes": "Approved based on merit and need",
    "score": 92.5,
    "rank": 1,
    "awardedAmount": 50000,
    "submittedAt": "2024-02-15T10:30:00Z",
    "reviewedAt": "2024-02-20T14:30:00Z",
    "approvedAt": "2024-02-25T16:45:00Z",
    "student": {
      "id": "student_123",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "phone": "+91-9876543210"
    },
    "scholarship": {
      "id": "scholarship_123",
      "title": "TVS Merit Scholarship 2024",
      "description": "Scholarship for students with excellent academic performance",
      "amount": 50000,
      "category": "MERIT_BASED"
    },
    "documents": [
      {
        "id": "doc_123",
        "type": "MARK_SHEET_12TH",
        "fileName": "marksheet_12th_john.pdf",
        "originalName": "12th_Marksheet_John_Doe.pdf",
        "isVerified": true,
        "uploadedAt": "2024-02-15T10:30:00Z"
      }
    ]
  }
}
```

#### Create Application
```http
POST /applications
Content-Type: application/json

{
  "studentId": "student_123",
  "scholarshipId": "scholarship_123",
  "applicationData": {
    "personalInfo": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "phone": "+91-9876543210"
    },
    "academicInfo": {
      "percentage": 85,
      "course": "Engineering",
      "year": "2nd",
      "university": "IIT Mumbai"
    },
    "familyInfo": {
      "fatherName": "Rajesh Doe",
      "fatherOccupation": "Engineer",
      "motherName": "Sunita Doe",
      "motherOccupation": "Teacher",
      "familyIncome": 450000
    }
  },
  "academicInfo": {
    "percentage": 85,
    "course": "Engineering",
    "year": "2nd",
    "university": "IIT Mumbai",
    "achievements": ["First in class", "Science Olympiad winner"]
  },
  "familyInfo": {
    "fatherName": "Rajesh Doe",
    "fatherOccupation": "Engineer",
    "motherName": "Sunita Doe",
    "motherOccupation": "Teacher",
    "familyIncome": 450000,
    "familySize": 4
  },
  "financialInfo": {
    "familyIncome": 450000,
    "expenses": 300000,
    "savings": 150000,
    "otherScholarships": 0
  },
  "additionalInfo": {
    "essay": "I am passionate about technology and want to contribute to society through innovation.",
    "extraCurriculars": ["Debate team", "Science club", "Volunteer work"],
    "futureGoals": "To become a software engineer and work on social impact projects"
  }
}
```

#### Review Application
```http
PATCH /applications/{id}/review
Content-Type: application/json

{
  "status": "UNDER_REVIEW",
  "reviewerNotes": "Good academic record, needs document verification",
  "score": 85.5
}
```
*Requires Admin or Reviewer role*

#### Approve Application
```http
PATCH /applications/{id}/approve
Content-Type: application/json

{
  "adminNotes": "Approved based on merit and need"
}
```
*Requires Admin role*

#### Reject Application
```http
PATCH /applications/{id}/reject
Content-Type: application/json

{
  "rejectionReason": "Incomplete documentation",
  "adminNotes": "Please resubmit with all required documents"
}
```
*Requires Admin role*

### Documents Management

#### Upload Document
```http
POST /documents/upload
Content-Type: multipart/form-data

file: [binary data]
type: "MARK_SHEET_12TH"
studentId: "student_123"
applicationId: "app_123"
```

**Response:**
```json
{
  "success": true,
  "message": "Document uploaded successfully",
  "data": {
    "id": "doc_123",
    "fileName": "marksheet_12th_john.pdf",
    "originalName": "12th_Marksheet_John_Doe.pdf",
    "filePath": "/uploads/documents/marksheet_12th_john.pdf",
    "fileSize": 1024000,
    "mimeType": "application/pdf",
    "status": "UPLOADED",
    "uploadedAt": "2024-02-15T10:30:00Z"
  }
}
```

#### Get Student Documents
```http
GET /students/{id}/documents
```

#### Verify Document
```http
PATCH /documents/{id}/verify
Content-Type: application/json

{
  "status": "VERIFIED",
  "verificationNotes": "Document verified successfully"
}
```
*Requires Admin or Reviewer role*

### Analytics & Statistics

#### Get Application Statistics
```http
GET /applications/stats/overview
```

**Response:**
```json
{
  "success": true,
  "message": "Statistics retrieved successfully",
  "data": {
    "total": 150,
    "submitted": 120,
    "underReview": 25,
    "approved": 80,
    "rejected": 15,
    "draft": 30,
    "approvalRate": 66.67,
    "rejectionRate": 12.5,
    "averageProcessingTime": 7.5
  }
}
```

#### Get Scholarship Statistics
```http
GET /scholarships/stats/overview
```

**Response:**
```json
{
  "success": true,
  "message": "Statistics retrieved successfully",
  "data": {
    "total": 25,
    "active": 20,
    "inactive": 5,
    "totalApplications": 150,
    "totalAmount": 5000000,
    "averageAmount": 200000,
    "categoryBreakdown": {
      "MERIT_BASED": 10,
      "NEED_BASED": 8,
      "WOMEN_EMPOWERMENT": 4,
      "SPORTS": 3
    }
  }
}
```

## 🔒 Error Handling

### HTTP Status Codes

| Code | Description | When Used |
|------|-------------|-----------|
| 200 | OK | Successful GET, PATCH requests |
| 201 | Created | Successful POST requests |
| 400 | Bad Request | Validation errors, malformed requests |
| 401 | Unauthorized | Missing or invalid JWT token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists |
| 422 | Unprocessable Entity | Business logic validation errors |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server errors |

### Error Response Examples

#### Validation Error (400)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Email is required",
    "Phone number must be 10 digits",
    "Date of birth must be a valid date"
  ]
}
```

#### Unauthorized (401)
```json
{
  "success": false,
  "message": "Authentication required",
  "error": "Invalid or missing JWT token"
}
```

#### Forbidden (403)
```json
{
  "success": false,
  "message": "Access denied",
  "error": "Insufficient permissions for this operation"
}
```

#### Not Found (404)
```json
{
  "success": false,
  "message": "Resource not found",
  "error": "Student with ID 'student_123' not found"
}
```

#### Conflict (409)
```json
{
  "success": false,
  "message": "Resource already exists",
  "error": "Student with email 'john.doe@example.com' already exists"
}
```

## 📈 Rate Limiting

The API implements rate limiting to prevent abuse:

- **General API**: 100 requests per minute per IP
- **Authenticated Users**: 1000 requests per hour per user
- **File Upload**: 10 uploads per hour per user
- **Password Reset**: 5 attempts per hour per IP

Rate limit headers are included in responses:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## 🔍 Filtering & Search

### Common Query Parameters

Most list endpoints support these parameters:

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)
- `search`: Text search across relevant fields
- `sort`: Sort field (e.g., `createdAt`, `-createdAt` for descending)
- `order`: Sort order (`asc` or `desc`)

### Date Range Filtering

For endpoints with date fields:
- `startDate`: Start date (ISO 8601 format)
- `endDate`: End date (ISO 8601 format)

### Status Filtering

For endpoints with status fields:
- `status`: Filter by specific status
- `status[]`: Filter by multiple statuses

## 📝 Pagination

All list endpoints return paginated results:

```json
{
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 150,
      "totalPages": 15,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

## 🚀 Getting Started

### 1. Authentication

First, obtain a JWT token by logging in:

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "password123"
  }'
```

### 2. Using the Token

Include the token in all subsequent requests:

```bash
curl -X GET http://localhost:3001/api/students \
  -H "Authorization: Bearer <your-jwt-token>"
```

### 3. Error Handling

Always check the response status and handle errors appropriately:

```javascript
const response = await fetch('/api/students', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

if (!response.ok) {
  const error = await response.json();
  console.error('API Error:', error.message);
  // Handle error
}

const data = await response.json();
console.log('Success:', data.data);
```

## 📚 Additional Resources

- **Swagger UI**: `http://localhost:3001/api/docs`
- **Health Check**: `http://localhost:3001/health`
- **API Status**: `http://localhost:3001/api/status`
- **Postman Collection**: Available in `/docs` folder
- **OpenAPI Spec**: `http://localhost:3001/api/docs-json`

## 🤝 Support

For API support and questions:
- Email: support@tvsscholarship.com
- Documentation: https://docs.tvsscholarship.com
- Issues: https://github.com/tvs-scholarship/api/issues

---

**Built with ❤️ for the TVS Scholarship Ecosystem**