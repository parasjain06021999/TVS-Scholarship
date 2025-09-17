import { PrismaClient, UserRole, Gender, ScholarshipCategory, ApplicationStatus, DocumentType, PaymentStatus, NotificationType, CommunicationType, CommunicationPriority, CommunicationStatus, WorkflowStatus, TaskType, TaskPriority, TaskStatus, IntegrationType, TestType, TestStatus, TestResult, MigrationStatus, ConsentStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Sample data based on the provided JSON
const sampleData = {
  scholarships: [
    {
      id: "SCH_MERIT_2024",
      title: "TVS Merit Scholarship 2024",
      description: "For academically excellent students from economically weaker sections",
      category: "MERIT_BASED" as ScholarshipCategory,
      amount: 50000,
      maxRecipients: 1000,
      currentRecipients: 678,
      eligibilityCriteria: {
        minPercentage: 80,
        maxFamilyIncome: 500000,
        educationLevels: ["undergraduate", "postgraduate"],
        categories: ["general", "obc", "sc", "st"],
        states: ["tamil_nadu", "karnataka", "andhra_pradesh", "telangana"]
      },
      applicationDeadline: new Date("2024-03-31T23:59:59Z"),
      isActive: true,
      totalBudget: 50000000
    },
    {
      id: "SCH_NEED_2024",
      title: "TVS Need-based Scholarship 2024",
      description: "For students from financially disadvantaged backgrounds",
      category: "NEED_BASED" as ScholarshipCategory,
      amount: 40000,
      maxRecipients: 750,
      currentRecipients: 423,
      eligibilityCriteria: {
        minPercentage: 60,
        maxFamilyIncome: 300000,
        educationLevels: ["school", "undergraduate"],
        categories: ["all"],
        states: ["all"],
        specialConditions: ["single_parent", "differently_abled", "orphan"]
      },
      applicationDeadline: new Date("2024-04-15T23:59:59Z"),
      isActive: true,
      totalBudget: 30000000
    },
    {
      id: "SCH_MINORITY_2024",
      title: "TVS Minority Scholarship 2024",
      description: "For students from minority communities",
      category: "MINORITY" as ScholarshipCategory,
      amount: 45000,
      maxRecipients: 500,
      currentRecipients: 267,
      eligibilityCriteria: {
        minPercentage: 70,
        maxFamilyIncome: 400000,
        educationLevels: ["undergraduate", "postgraduate"],
        categories: ["minority"],
        states: ["all"]
      },
      applicationDeadline: new Date("2024-04-30T23:59:59Z"),
      isActive: true,
      totalBudget: 20000000
    }
  ],
  students: [
    {
      personalInfo: {
        firstName: "Rajesh",
        lastName: "Kumar",
        dateOfBirth: new Date("2005-03-15"),
        gender: "MALE" as Gender,
        category: "OBC",
        aadhaarNumber: "****-****-1234",
        profileImage: "/uploads/students/STU001/photo.jpg"
      },
      contactInfo: {
        phone: "+91-9876543210",
        email: "rajesh.kumar@email.com",
        address: "123 Main Street, Gandhi Nagar",
        city: "Chennai",
        state: "Tamil Nadu",
        pincode: "600001"
      },
      educationInfo: {
        educationLevel: "undergraduate",
        currentInstitution: "IIT Madras",
        currentCourse: "B.Tech Computer Science",
        currentYear: 2,
        cgpa: 8.2,
        previousEducation: [
          {
            level: "class_12",
            board: "CBSE",
            year: 2023,
            percentage: 89.5
          }
        ]
      },
      familyInfo: {
        fatherName: "Suresh Kumar",
        fatherOccupation: "Auto Driver",
        fatherIncome: 180000,
        motherName: "Lakshmi Kumar",
        motherOccupation: "Homemaker",
        motherIncome: 0,
        familyIncome: 180000,
        familySize: 4
      },
      bankDetails: {
        accountNumber: "****-****-****-3456",
        ifscCode: "SBIN0001234",
        bankName: "State Bank of India",
        branchName: "Chennai Main Branch",
        accountHolderName: "Rajesh Kumar"
      }
    },
    {
      personalInfo: {
        firstName: "Priya",
        lastName: "Singh",
        dateOfBirth: new Date("2004-07-22"),
        gender: "FEMALE" as Gender,
        category: "GENERAL",
        aadhaarNumber: "****-****-5678",
        profileImage: "/uploads/students/STU002/photo.jpg"
      },
      contactInfo: {
        phone: "+91-8765432109",
        email: "priya.singh@email.com",
        address: "456 Park Road, Anna Nagar",
        city: "Bangalore",
        state: "Karnataka",
        pincode: "560001"
      },
      educationInfo: {
        educationLevel: "undergraduate",
        currentInstitution: "Christ University",
        currentCourse: "B.Sc Mathematics",
        currentYear: 3,
        cgpa: 8.7,
        previousEducation: [
          {
            level: "class_12",
            board: "Karnataka State Board",
            year: 2022,
            percentage: 94.2
          }
        ]
      },
      familyInfo: {
        fatherName: "Vikram Singh",
        fatherOccupation: "Factory Worker",
        fatherIncome: 240000,
        motherName: "Sunita Singh",
        motherOccupation: "Tailor",
        motherIncome: 60000,
        familyIncome: 300000,
        familySize: 5
      },
      bankDetails: {
        accountNumber: "****-****-****-7890",
        ifscCode: "HDFC0001234",
        bankName: "HDFC Bank",
        branchName: "Bangalore MG Road",
        accountHolderName: "Priya Singh"
      }
    }
  ],
  adminUsers: [
    {
      username: "admin.sharma",
      email: "admin.sharma@tvscsf.org",
      firstName: "Raj",
      lastName: "Sharma",
      role: "SUPER_ADMIN" as UserRole,
      department: "IT Administration",
      permissions: [
        "view_all_applications",
        "approve_applications",
        "manage_payments",
        "generate_reports",
        "manage_users",
        "system_settings"
      ]
    },
    {
      username: "reviewer.patel",
      email: "reviewer.patel@tvscsf.org",
      firstName: "Meera",
      lastName: "Patel",
      role: "REVIEWER" as UserRole,
      department: "Application Review",
      permissions: [
        "view_assigned_applications",
        "review_applications",
        "add_comments",
        "request_documents"
      ]
    },
    {
      username: "finance.manager",
      email: "finance.manager@tvscsf.org",
      firstName: "Suresh",
      lastName: "Kumar",
      role: "ADMIN" as UserRole,
      department: "Finance",
      permissions: [
        "view_approved_applications",
        "process_payments",
        "generate_payment_reports",
        "manage_payment_batches"
      ]
    }
  ]
};

async function main() {
  console.log('🌱 Starting comprehensive database seeding...');

  // Clear existing data
  await clearDatabase();

  // Create users and admin profiles
  const users = await createUsers();
  const students = await createStudents(users);
  const scholarships = await createScholarships();
  const applications = await createApplications(students, scholarships);
  const payments = await createPayments(applications);
  const notifications = await createNotifications(users, applications);
  const communications = await createCommunications();
  const workflows = await createWorkflows();
  const systemConfigs = await createSystemConfigs();

  console.log('✅ Database seeding completed successfully!');
  console.log(`📊 Created:`);
  console.log(`   - ${users.length} users`);
  console.log(`   - ${students.length} students`);
  console.log(`   - ${scholarships.length} scholarships`);
  console.log(`   - ${applications.length} applications`);
  console.log(`   - ${payments.length} payments`);
  console.log(`   - ${notifications.length} notifications`);
  console.log(`   - ${communications.length} communications`);
  console.log(`   - ${workflows.length} workflows`);
  console.log(`   - ${systemConfigs.length} system configurations`);
}

async function clearDatabase() {
  console.log('🧹 Clearing existing data...');
  
  // Clear in reverse dependency order
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.document.deleteMany();
  await prisma.application.deleteMany();
  await prisma.scholarship.deleteMany();
  await prisma.student.deleteMany();
  await prisma.adminProfile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.systemConfig.deleteMany();
  
  // Clear new entities
  await prisma.communication.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.emailTemplate.deleteMany();
  await prisma.workflow.deleteMany();
  await prisma.workflowInstance.deleteMany();
  await prisma.task.deleteMany();
  await prisma.documentVersion.deleteMany();
  await prisma.documentTemplate.deleteMany();
  await prisma.mobileDevice.deleteMany();
  await prisma.pushNotification.deleteMany();
  await prisma.integration.deleteMany();
  await prisma.webhook.deleteMany();
  await prisma.webhookLog.deleteMany();
  await prisma.testCase.deleteMany();
  await prisma.testSuite.deleteMany();
  await prisma.performanceMetric.deleteMany();
  await prisma.migrationLog.deleteMany();
  await prisma.consentRecord.deleteMany();
}

async function createUsers() {
  console.log('👥 Creating users...');
  
  const hashedPassword = await bcrypt.hash('Password@123', 10);
  const users = [];

  // Create admin users
  for (const adminData of sampleData.adminUsers) {
    const user = await prisma.user.create({
      data: {
        email: adminData.email,
        password: hashedPassword,
        role: adminData.role,
        isActive: true,
        adminProfile: {
          create: {
            firstName: adminData.firstName,
            lastName: adminData.lastName,
            phone: '+91-9876543210',
            department: adminData.department,
          }
        }
      }
    });
    users.push(user);
  }

  // Create student users
  for (const studentData of sampleData.students) {
    const user = await prisma.user.create({
      data: {
        email: studentData.contactInfo.email,
        password: hashedPassword,
        role: 'STUDENT',
        isActive: true,
      }
    });
    users.push(user);
  }

  return users;
}

async function createStudents(users: any[]) {
  console.log('🎓 Creating students...');
  
  const students = [];
  const studentUsers = users.filter(user => user.role === 'STUDENT');

  for (let i = 0; i < studentUsers.length; i++) {
    const user = studentUsers[i];
    const studentData = sampleData.students[i];

    const student = await prisma.student.create({
      data: {
        userId: user.id,
        firstName: studentData.personalInfo.firstName,
        lastName: studentData.personalInfo.lastName,
        dateOfBirth: studentData.personalInfo.dateOfBirth,
        gender: studentData.personalInfo.gender,
        phone: studentData.contactInfo.phone,
        address: studentData.contactInfo.address,
        city: studentData.contactInfo.city,
        state: studentData.contactInfo.state,
        pincode: studentData.contactInfo.pincode,
        aadharNumber: studentData.personalInfo.aadhaarNumber,
        panNumber: `PAN${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        fatherName: studentData.familyInfo.fatherName,
        motherName: studentData.familyInfo.motherName,
        familyIncome: studentData.familyInfo.familyIncome,
        profileImage: studentData.personalInfo.profileImage,
        isVerified: true,
      }
    });
    students.push(student);
  }

  return students;
}

async function createScholarships() {
  console.log('🎓 Creating scholarships...');
  
  const scholarships = [];

  for (const scholarshipData of sampleData.scholarships) {
    const scholarship = await prisma.scholarship.create({
      data: {
        title: scholarshipData.title,
        description: scholarshipData.description,
        category: scholarshipData.category,
        amount: scholarshipData.amount,
        maxAmount: scholarshipData.amount * 1.2, // 20% more than base amount
        eligibilityCriteria: JSON.stringify(scholarshipData.eligibilityCriteria),
        applicationStartDate: new Date("2024-01-01"),
        applicationEndDate: scholarshipData.applicationDeadline,
        academicYear: "2024-25",
        isActive: scholarshipData.isActive,
        maxApplications: scholarshipData.maxRecipients,
        currentApplications: scholarshipData.currentRecipients,
        documentsRequired: ["AADHAR_CARD", "INCOME_CERTIFICATE", "MARK_SHEET_12TH"],
        createdBy: "system",
      }
    });
    scholarships.push(scholarship);
  }

  return scholarships;
}

async function createApplications(students: any[], scholarships: any[]) {
  console.log('📝 Creating applications...');
  
  const applications = [];

  // Create applications for each student
  for (let i = 0; i < students.length; i++) {
    const student = students[i];
    const scholarship = scholarships[i % scholarships.length];

    const application = await prisma.application.create({
      data: {
        studentId: student.id,
        scholarshipId: scholarship.id,
        status: i === 0 ? 'UNDER_REVIEW' : 'APPROVED',
        applicationData: {
          personalInfo: sampleData.students[i].personalInfo,
          educationInfo: sampleData.students[i].educationInfo,
          familyInfo: sampleData.students[i].familyInfo,
          bankDetails: sampleData.students[i].bankDetails,
        },
        submittedAt: new Date(),
        reviewedAt: i === 0 ? null : new Date(),
        // reviewerId: i === 0 ? null : 'REV001', // This field doesn't exist in schema
      }
    });
    applications.push(application);
  }

  return applications;
}

async function createPayments(applications: any[]) {
  console.log('💰 Creating payments...');
  
  const payments = [];

  for (let i = 0; i < applications.length; i++) {
    const application = applications[i];
    
    if (application.status === 'APPROVED') {
      const payment = await prisma.payment.create({
        data: {
          applicationId: application.id,
          amount: 40000 + (i * 5000), // Varying amounts
          status: i === 0 ? 'COMPLETED' : 'PENDING',
          paymentMethod: 'NEFT',
          transactionId: `TXN2024${String(i + 1).padStart(3, '0')}`,
          paymentDate: i === 0 ? new Date() : null,
        }
      });
      payments.push(payment);
    }
  }

  return payments;
}

async function createNotifications(users: any[], applications: any[]) {
  console.log('🔔 Creating notifications...');
  
  const notifications = [];

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const application = applications[i];

    // Only create notifications for users with applications
    if (user && application) {
      const notification = await prisma.notification.create({
        data: {
          userId: user.id,
          title: i === 0 ? 'Application Under Review' : 'Application Approved',
          message: i === 0 
            ? 'Your scholarship application is now under review. We will notify you of any updates.'
            : 'Congratulations! Your scholarship application has been approved.',
          type: i === 0 ? 'APPLICATION_SUBMITTED' : 'APPLICATION_APPROVED',
          isRead: i === 0 ? false : true,
          data: {
            applicationId: application.id,
            priority: i === 0 ? 'MEDIUM' : 'HIGH'
          },
        }
      });
      notifications.push(notification);
    }
  }

  return notifications;
}

async function createCommunications() {
  console.log('📢 Creating communications...');
  
  const communications = [];

  // Create email templates
  const emailTemplates = [
    {
      name: 'Application Submitted',
      subject: 'Scholarship Application Submitted Successfully',
      content: 'Dear {{studentName}}, your scholarship application has been submitted successfully. Application ID: {{applicationId}}',
      variables: ['studentName', 'applicationId'],
      category: 'application',
    },
    {
      name: 'Application Approved',
      subject: 'Congratulations! Your Scholarship Application is Approved',
      content: 'Dear {{studentName}}, congratulations! Your scholarship application has been approved. Amount: ₹{{amount}}',
      variables: ['studentName', 'amount'],
      category: 'approval',
    },
    {
      name: 'Payment Disbursed',
      subject: 'Scholarship Amount Disbursed',
      content: 'Dear {{studentName}}, your scholarship amount of ₹{{amount}} has been successfully transferred to your account.',
      variables: ['studentName', 'amount'],
      category: 'payment',
    }
  ];

  for (const template of emailTemplates) {
    const emailTemplate = await prisma.emailTemplate.create({
      data: template
    });
  }

  // Create communications
  const communicationData = [
    {
      title: 'Scholarship Application Deadline Reminder',
      content: 'The deadline for scholarship applications is approaching. Please submit your applications before the deadline.',
      type: 'EMAIL' as CommunicationType,
      priority: 'HIGH' as CommunicationPriority,
      targetAudience: {
        type: 'STUDENTS',
        filters: {}
      },
      status: 'SENT' as CommunicationStatus,
    },
    {
      title: 'New Scholarship Program Launch',
      content: 'We are excited to announce the launch of our new scholarship program for minority students.',
      type: 'ANNOUNCEMENT' as CommunicationType,
      priority: 'MEDIUM' as CommunicationPriority,
      targetAudience: {
        type: 'ALL',
        filters: {}
      },
      status: 'SENT' as CommunicationStatus,
    }
  ];

  for (const commData of communicationData) {
    const communication = await prisma.communication.create({
      data: commData
    });
    communications.push(communication);
  }

  return communications;
}

async function createWorkflows() {
  console.log('🔄 Creating workflows...');
  
  const workflows = [];

  const workflowData = {
    name: 'Scholarship Application Review Workflow',
    description: 'Standard workflow for reviewing scholarship applications',
    steps: [
      {
        id: 'step1',
        name: 'Document Verification',
        type: 'verification',
        config: {
          requiredDocuments: ['aadhaar_card', 'income_certificate', 'mark_sheets'],
          autoApprove: false
        }
      },
      {
        id: 'step2',
        name: 'Academic Review',
        type: 'review',
        config: {
          reviewerRole: 'REVIEWER',
          criteria: ['academic_merit', 'financial_need']
        }
      },
      {
        id: 'step3',
        name: 'Final Approval',
        type: 'approval',
        config: {
          approverRole: 'ADMIN',
          minScore: 70
        }
      }
    ],
    isActive: true
  };

  const workflow = await prisma.workflow.create({
    data: workflowData
  });
  workflows.push(workflow);

  return workflows;
}

async function createSystemConfigs() {
  console.log('⚙️ Creating system configurations...');
  
  const configs = [
    {
      key: 'max_file_upload_size',
      value: '5242880',
      type: 'number'
    },
    {
      key: 'allowed_file_types',
      value: 'pdf,jpg,jpeg,png',
      type: 'string'
    },
    {
      key: 'auto_save_interval',
      value: '30000',
      type: 'number'
    },
    {
      key: 'session_timeout',
      value: '1800000',
      type: 'number'
    },
    {
      key: 'max_applications_per_student',
      value: '3',
      type: 'number'
    },
    {
      key: 'payment_batch_processing_time',
      value: '10:00 AM',
      type: 'string'
    },
    {
      key: 'notification_retention_days',
      value: '90',
      type: 'number'
    }
  ];

  const systemConfigs = [];
  for (const config of configs) {
    const systemConfig = await prisma.systemConfig.create({
      data: config
    });
    systemConfigs.push(systemConfig);
  }

  return systemConfigs;
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
