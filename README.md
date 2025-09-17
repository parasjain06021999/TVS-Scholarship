# TVS Scholarship Ecosystem

A comprehensive scholarship management system built with Next.js, NestJS, and PostgreSQL.

## 🚀 Features

### Student Portal
- **Registration & Login** - Secure user authentication
- **Scholarship Browsing** - View available scholarships with detailed information
- **Application Form** - Multi-step application process with document upload
- **Dashboard** - Track application status and progress
- **Profile Management** - Update personal and academic information

### Admin Portal
- **Admin Login** - Separate admin authentication
- **Dashboard** - Overview of applications, statistics, and quick actions
- **Application Management** - Review and process student applications
- **Scholarship Management** - Create and manage scholarship programs
- **Analytics** - View reports and insights

### Public Pages
- **Homepage** - Landing page with eligibility checker and success stories
- **About** - Information about the scholarship program
- **Contact** - Contact form and office information
- **FAQ** - Frequently asked questions with search functionality

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn UI** - Modern UI components
- **React Hook Form** - Form handling and validation

### Backend
- **NestJS** - Node.js framework
- **Prisma** - Database ORM
- **PostgreSQL** - Primary database
- **JWT** - Authentication
- **Swagger** - API documentation

## 📁 Project Structure

```
tvs-scholarship/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   │   ├── admin/       # Admin portal pages
│   │   │   ├── api/         # API routes
│   │   │   └── ...          # Other pages
│   │   ├── components/      # Reusable components
│   │   ├── contexts/        # React contexts
│   │   ├── hooks/           # Custom hooks
│   │   └── lib/             # Utilities
│   └── package.json
├── backend/                 # NestJS backend application
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── students/       # Student management
│   │   ├── scholarships/   # Scholarship management
│   │   ├── applications/   # Application processing
│   │   └── ...            # Other modules
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL 13+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tvs-scholarship
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   cd frontend
   npm install
   
   # Backend
   cd ../backend
   npm install
   ```

3. **Setup Database**
   ```bash
   # Create PostgreSQL database
   createdb tvs_scholarship
   
   # Run migrations
   cd backend
   npx prisma migrate dev
   
   # Seed database
   npx prisma db seed
   ```

4. **Environment Variables**
   
   Create `.env` files in both frontend and backend directories:
   
   **Backend (.env)**
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/tvs_scholarship"
   JWT_SECRET="your-jwt-secret"
   SMTP_HOST="your-smtp-host"
   SMTP_PORT=587
   SMTP_USER="your-email"
   SMTP_PASS="your-password"
   ```
   
   **Frontend (.env.local)**
   ```env
   NEXT_PUBLIC_API_URL="http://localhost:3001"
   ```

5. **Start Development Servers**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run start:dev
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - API Documentation: http://localhost:3001/api

## 👥 User Roles

### Student
- Register and login
- Browse available scholarships
- Submit applications
- Track application status
- Update profile information

### Admin
- Access admin dashboard
- Review applications
- Manage scholarships
- View analytics and reports
- Process payments

## 🔐 Authentication

The system uses JWT-based authentication with role-based access control:

- **Students** - Access to student portal and application features
- **Admins** - Access to admin dashboard and management features
- **Reviewers** - Access to application review features

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🧪 Testing

### Test Credentials

**Student Login:**
- Email: student1@example.com
- Password: password123

**Admin Login:**
- Email: admin@tvsscholarship.com
- Password: admin123

## 📊 Features Implemented

### ✅ Completed
- [x] User authentication and authorization
- [x] Student registration and login
- [x] Admin dashboard and login
- [x] Scholarship browsing and application
- [x] Multi-step application form
- [x] Document upload functionality
- [x] Responsive design
- [x] API integration
- [x] Database schema and migrations
- [x] Error handling and validation

### 🚧 In Progress
- [ ] Email notifications
- [ ] Payment processing
- [ ] Advanced analytics
- [ ] Mobile app integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions:
- Email: support@tvsscholarship.com
- Phone: +91 44 1234 5678
- Documentation: http://localhost:3001/api

## 🎯 Roadmap

### Phase 1 (Current)
- Basic scholarship management
- Student application process
- Admin dashboard

### Phase 2 (Next)
- Advanced analytics
- Payment integration
- Mobile app

### Phase 3 (Future)
- AI-powered matching
- Blockchain integration
- Multi-language support