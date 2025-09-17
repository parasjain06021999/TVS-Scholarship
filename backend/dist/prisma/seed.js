"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Starting database seeding...');
    const adminPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@tvsscholarship.com' },
        update: {},
        create: {
            email: 'admin@tvsscholarship.com',
            password: adminPassword,
            role: 'ADMIN',
            isActive: true,
        },
    });
    await prisma.adminProfile.upsert({
        where: { userId: adminUser.id },
        update: {},
        create: {
            userId: adminUser.id,
            firstName: 'Admin',
            lastName: 'User',
            phone: '+91-9876543210',
            department: 'Administration',
        },
    });
    const reviewerPassword = await bcrypt.hash('reviewer123', 10);
    const reviewerUser = await prisma.user.upsert({
        where: { email: 'reviewer@tvsscholarship.com' },
        update: {},
        create: {
            email: 'reviewer@tvsscholarship.com',
            password: reviewerPassword,
            role: 'REVIEWER',
            isActive: true,
        },
    });
    const students = [
        {
            userId: '',
            firstName: 'Priya',
            lastName: 'Sharma',
            dateOfBirth: new Date('2000-05-15'),
            gender: 'FEMALE',
            phone: '+91-9876543211',
            address: '123 Main Street, Sector 5',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001',
            aadharNumber: '123456789012',
            panNumber: 'ABCDE1234F',
            fatherName: 'Rajesh Sharma',
            fatherOccupation: 'Engineer',
            motherName: 'Sunita Sharma',
            motherOccupation: 'Teacher',
            familyIncome: 450000,
            emergencyContact: '+91-9876543212',
            isVerified: true,
        },
        {
            userId: '',
            firstName: 'Rahul',
            lastName: 'Verma',
            dateOfBirth: new Date('1999-08-22'),
            gender: 'MALE',
            phone: '+91-9876543213',
            address: '456 Park Avenue, Block A',
            city: 'Delhi',
            state: 'Delhi',
            pincode: '110001',
            aadharNumber: '123456789013',
            panNumber: 'FGHIJ5678K',
            fatherName: 'Amit Verma',
            fatherOccupation: 'Businessman',
            motherName: 'Rekha Verma',
            motherOccupation: 'Housewife',
            familyIncome: 250000,
            emergencyContact: '+91-9876543214',
            isVerified: true,
        },
        {
            userId: '',
            firstName: 'Anjali',
            lastName: 'Singh',
            dateOfBirth: new Date('2001-03-10'),
            gender: 'FEMALE',
            phone: '+91-9876543215',
            address: '789 Garden Road, Phase 2',
            city: 'Bangalore',
            state: 'Karnataka',
            pincode: '560001',
            aadharNumber: '123456789014',
            panNumber: 'KLMNO9012P',
            fatherName: 'Vikram Singh',
            fatherOccupation: 'Doctor',
            motherName: 'Pooja Singh',
            motherOccupation: 'Nurse',
            familyIncome: 600000,
            emergencyContact: '+91-9876543216',
            isVerified: false,
        },
    ];
    const createdStudents = [];
    for (const studentData of students) {
        const studentPassword = await bcrypt.hash('student123', 10);
        const studentUser = await prisma.user.create({
            data: {
                email: `${studentData.firstName.toLowerCase()}.${studentData.lastName.toLowerCase()}@example.com`,
                password: studentPassword,
                role: 'STUDENT',
                isActive: true,
            },
        });
        const student = await prisma.student.create({
            data: {
                userId: studentUser.id,
                firstName: studentData.firstName,
                lastName: studentData.lastName,
                dateOfBirth: studentData.dateOfBirth,
                gender: studentData.gender,
                phone: studentData.phone,
                address: studentData.address,
                city: studentData.city,
                state: studentData.state,
                pincode: studentData.pincode,
                aadharNumber: studentData.aadharNumber,
                fatherName: studentData.fatherName,
                motherName: studentData.motherName,
                isVerified: studentData.isVerified,
            },
        });
        createdStudents.push(student);
    }
    const scholarships = [
        {
            title: 'TVS Merit Scholarship 2024',
            description: 'Scholarship for students with excellent academic performance and leadership qualities',
            eligibilityCriteria: 'Minimum 80% marks in 12th standard, active participation in extracurricular activities',
            amount: 50000,
            maxAmount: 75000,
            category: 'MERIT_BASED',
            subCategory: 'Academic Excellence',
            applicationStartDate: new Date('2024-01-01'),
            applicationEndDate: new Date('2024-12-31'),
            academicYear: '2024-25',
            maxApplications: 100,
            documentsRequired: ['MARK_SHEET_10TH', 'MARK_SHEET_12TH', 'PHOTOGRAPH', 'ACHIEVEMENT_CERTIFICATES'],
            createdBy: adminUser.id,
            requirements: {
                minPercentage: 80,
                maxFamilyIncome: 1000000,
                eligibleCourses: ['Engineering', 'Medicine', 'Commerce', 'Arts'],
                eligibleStates: ['Maharashtra', 'Karnataka', 'Tamil Nadu', 'Delhi'],
            },
        },
        {
            title: 'TVS Need-Based Scholarship 2024',
            description: 'Scholarship for students from economically weaker sections',
            eligibilityCriteria: 'Family income less than 3 Lakhs per annum, minimum 60% marks',
            amount: 75000,
            maxAmount: 100000,
            category: 'NEED_BASED',
            subCategory: 'Financial Support',
            applicationStartDate: new Date('2024-01-01'),
            applicationEndDate: new Date('2024-12-31'),
            academicYear: '2024-25',
            maxApplications: 200,
            documentsRequired: ['INCOME_CERTIFICATE', 'MARK_SHEET_10TH', 'MARK_SHEET_12TH', 'CASTE_CERTIFICATE'],
            createdBy: adminUser.id,
            requirements: {
                minPercentage: 60,
                maxFamilyIncome: 300000,
                eligibleCourses: ['Engineering', 'Medicine', 'Commerce', 'Arts', 'Science'],
                eligibleStates: ['All'],
            },
        },
        {
            title: 'TVS Women Empowerment Scholarship 2024',
            description: 'Scholarship specifically for female students pursuing STEM fields',
            eligibilityCriteria: 'Female students pursuing Engineering or Medicine, minimum 75% marks',
            amount: 60000,
            maxAmount: 80000,
            category: 'WOMEN_EMPOWERMENT',
            subCategory: 'STEM Education',
            applicationStartDate: new Date('2024-01-01'),
            applicationEndDate: new Date('2024-12-31'),
            academicYear: '2024-25',
            maxApplications: 50,
            documentsRequired: ['MARK_SHEET_10TH', 'MARK_SHEET_12TH', 'PHOTOGRAPH', 'GENDER_CERTIFICATE'],
            createdBy: adminUser.id,
            requirements: {
                minPercentage: 75,
                maxFamilyIncome: 500000,
                eligibleCourses: ['Engineering', 'Medicine'],
                eligibleStates: ['All'],
                gender: 'FEMALE',
            },
        },
    ];
    const createdScholarships = [];
    for (const scholarship of scholarships) {
        const created = await prisma.scholarship.create({
            data: {
                title: scholarship.title,
                description: scholarship.description,
                eligibilityCriteria: scholarship.eligibilityCriteria,
                amount: scholarship.amount,
                maxAmount: scholarship.maxAmount,
                category: scholarship.category,
                subCategory: scholarship.subCategory,
                applicationStartDate: scholarship.applicationStartDate,
                applicationEndDate: scholarship.applicationEndDate,
                academicYear: scholarship.academicYear,
                maxApplications: scholarship.maxApplications,
                documentsRequired: scholarship.documentsRequired,
                createdBy: scholarship.createdBy,
                requirements: scholarship.requirements,
            },
        });
        createdScholarships.push(created);
    }
    const applications = [
        {
            studentId: createdStudents[0].id,
            scholarshipId: createdScholarships[0].id,
            status: 'APPROVED',
            applicationData: {
                personalInfo: {
                    firstName: 'Priya',
                    lastName: 'Sharma',
                    email: 'priya.sharma@example.com',
                    phone: '+91-9876543211',
                },
                academicInfo: {
                    percentage: 85,
                    course: 'Engineering',
                    year: '2nd',
                    university: 'IIT Mumbai',
                },
                familyInfo: {
                    fatherName: 'Rajesh Sharma',
                    fatherOccupation: 'Engineer',
                    motherName: 'Sunita Sharma',
                    motherOccupation: 'Teacher',
                    familyIncome: 450000,
                },
            },
            academicInfo: {
                percentage: 85,
                course: 'Engineering',
                year: '2nd',
                university: 'IIT Mumbai',
                achievements: ['First in class', 'Science Olympiad winner'],
            },
            familyInfo: {
                fatherName: 'Rajesh Sharma',
                fatherOccupation: 'Engineer',
                motherName: 'Sunita Sharma',
                motherOccupation: 'Teacher',
                familyIncome: 450000,
                familySize: 4,
            },
            financialInfo: {
                familyIncome: 450000,
                expenses: 300000,
                savings: 150000,
                otherScholarships: 0,
            },
            additionalInfo: {
                essay: 'I am passionate about technology and want to contribute to society through innovation.',
                extraCurriculars: ['Debate team', 'Science club', 'Volunteer work'],
                futureGoals: 'To become a software engineer and work on social impact projects',
            },
            reviewerNotes: 'Excellent academic record and strong motivation',
            adminNotes: 'Approved based on merit and need',
            score: 92.5,
            rank: 1,
            awardedAmount: 50000,
            submittedAt: new Date('2024-02-15'),
            reviewedAt: new Date('2024-02-20'),
            approvedAt: new Date('2024-02-25'),
        },
        {
            studentId: createdStudents[1].id,
            scholarshipId: createdScholarships[1].id,
            status: 'UNDER_REVIEW',
            applicationData: {
                personalInfo: {
                    firstName: 'Rahul',
                    lastName: 'Verma',
                    email: 'rahul.verma@example.com',
                    phone: '+91-9876543213',
                },
                academicInfo: {
                    percentage: 78,
                    course: 'Commerce',
                    year: '1st',
                    university: 'Delhi University',
                },
                familyInfo: {
                    fatherName: 'Amit Verma',
                    fatherOccupation: 'Businessman',
                    motherName: 'Rekha Verma',
                    motherOccupation: 'Housewife',
                    familyIncome: 250000,
                },
            },
            academicInfo: {
                percentage: 78,
                course: 'Commerce',
                year: '1st',
                university: 'Delhi University',
                achievements: ['School topper', 'Sports champion'],
            },
            familyInfo: {
                fatherName: 'Amit Verma',
                fatherOccupation: 'Businessman',
                motherName: 'Rekha Verma',
                motherOccupation: 'Housewife',
                familyIncome: 250000,
                familySize: 5,
            },
            financialInfo: {
                familyIncome: 250000,
                expenses: 200000,
                savings: 50000,
                otherScholarships: 0,
            },
            additionalInfo: {
                essay: 'I want to pursue commerce to help my family business grow and create employment opportunities.',
                extraCurriculars: ['Cricket team', 'Debate society', 'Community service'],
                futureGoals: 'To expand family business and support other students',
            },
            submittedAt: new Date('2024-03-01'),
        },
        {
            studentId: createdStudents[2].id,
            scholarshipId: createdScholarships[2].id,
            status: 'DRAFT',
            applicationData: {
                personalInfo: {
                    firstName: 'Anjali',
                    lastName: 'Singh',
                    email: 'anjali.singh@example.com',
                    phone: '+91-9876543215',
                },
                academicInfo: {
                    percentage: 88,
                    course: 'Medicine',
                    year: '1st',
                    university: 'AIIMS Bangalore',
                },
                familyInfo: {
                    fatherName: 'Vikram Singh',
                    fatherOccupation: 'Doctor',
                    motherName: 'Pooja Singh',
                    motherOccupation: 'Nurse',
                    familyIncome: 600000,
                },
            },
            academicInfo: {
                percentage: 88,
                course: 'Medicine',
                year: '1st',
                university: 'AIIMS Bangalore',
                achievements: ['NEET rank 150', 'Biology Olympiad winner'],
            },
            familyInfo: {
                fatherName: 'Vikram Singh',
                fatherOccupation: 'Doctor',
                motherName: 'Pooja Singh',
                motherOccupation: 'Nurse',
                familyIncome: 600000,
                familySize: 4,
            },
            financialInfo: {
                familyIncome: 600000,
                expenses: 400000,
                savings: 200000,
                otherScholarships: 0,
            },
            additionalInfo: {
                essay: 'I want to become a doctor to serve the community and provide healthcare to the underprivileged.',
                extraCurriculars: ['Medical society', 'Volunteer at hospital', 'Research projects'],
                futureGoals: 'To specialize in cardiology and work in rural areas',
            },
        },
    ];
    const createdApplications = [];
    for (const application of applications) {
        const created = await prisma.application.create({
            data: {
                studentId: application.studentId,
                scholarshipId: application.scholarshipId,
                status: application.status,
                applicationData: application.applicationData,
                submittedAt: application.submittedAt,
                reviewedAt: application.reviewedAt,
                approvedAt: application.approvedAt,
            },
        });
        createdApplications.push(created);
    }
    const documents = [
        {
            studentId: createdStudents[0].id,
            applicationId: createdApplications[0].id,
            type: 'MARK_SHEET_12TH',
            fileName: 'marksheet_12th_priya.pdf',
            originalName: '12th_Marksheet_Priya_Sharma.pdf',
            filePath: '/uploads/documents/marksheet_12th_priya.pdf',
            fileSize: 1024000,
            mimeType: 'application/pdf',
            isVerified: true,
            verifiedBy: adminUser.id,
            verifiedAt: new Date('2024-02-20'),
        },
        {
            studentId: createdStudents[0].id,
            applicationId: createdApplications[0].id,
            type: 'PHOTOGRAPH',
            fileName: 'photo_priya.jpg',
            originalName: 'Passport_Photo_Priya_Sharma.jpg',
            filePath: '/uploads/documents/photo_priya.jpg',
            fileSize: 512000,
            mimeType: 'image/jpeg',
            isVerified: true,
            verifiedBy: adminUser.id,
            verifiedAt: new Date('2024-02-20'),
        },
        {
            studentId: createdStudents[1].id,
            applicationId: createdApplications[1].id,
            type: 'INCOME_CERTIFICATE',
            fileName: 'income_cert_rahul.pdf',
            originalName: 'Income_Certificate_Rahul_Verma.pdf',
            filePath: '/uploads/documents/income_cert_rahul.pdf',
            fileSize: 768000,
            mimeType: 'application/pdf',
            isVerified: false,
        },
    ];
    for (const document of documents) {
        await prisma.document.create({
            data: {
                studentId: document.studentId,
                applicationId: document.applicationId,
                type: document.type,
                fileName: document.fileName,
                originalName: document.originalName,
                filePath: document.filePath,
                fileSize: document.fileSize,
                mimeType: document.mimeType,
                isVerified: document.isVerified,
                verifiedBy: document.verifiedBy,
                verifiedAt: document.verifiedAt,
            },
        });
    }
    const payments = [
        {
            applicationId: createdApplications[0].id,
            amount: 50000,
            status: 'COMPLETED',
            paymentMethod: 'NEFT',
            transactionId: 'TXN123456789',
            paymentDate: new Date('2024-03-01'),
            remarks: 'First installment disbursed',
        },
    ];
    for (const payment of payments) {
        await prisma.payment.create({
            data: {
                applicationId: payment.applicationId,
                amount: payment.amount,
                status: payment.status,
                paymentMethod: payment.paymentMethod,
                transactionId: payment.transactionId,
                paymentDate: payment.paymentDate,
                remarks: payment.remarks,
            },
        });
    }
    const notifications = [
        {
            userId: createdStudents[0].user.id,
            title: 'Application Approved',
            message: 'Congratulations! Your scholarship application has been approved.',
            type: 'APPLICATION_APPROVED',
            data: {
                applicationId: createdApplications[0].id,
                scholarshipName: 'TVS Merit Scholarship 2024',
                amount: 50000,
            },
        },
        {
            userId: createdStudents[1].user.id,
            title: 'Application Under Review',
            message: 'Your scholarship application is currently under review.',
            type: 'APPLICATION_SUBMITTED',
            data: {
                applicationId: createdApplications[1].id,
                scholarshipName: 'TVS Need-Based Scholarship 2024',
            },
        },
    ];
    for (const notification of notifications) {
        await prisma.notification.create({
            data: {
                userId: notification.userId,
                title: notification.title,
                message: notification.message,
                type: notification.type,
                data: notification.data,
            },
        });
    }
    const systemConfigs = [
        {
            key: 'MAX_FILE_SIZE',
            value: '10485760',
            type: 'number',
        },
        {
            key: 'ALLOWED_FILE_TYPES',
            value: 'pdf,jpg,jpeg,png,doc,docx',
            type: 'string',
        },
        {
            key: 'APPLICATION_DEADLINE_EXTENSION',
            value: '7',
            type: 'number',
        },
        {
            key: 'AUTO_SAVE_INTERVAL',
            value: '30000',
            type: 'number',
        },
        {
            key: 'MAX_APPLICATIONS_PER_STUDENT',
            value: '5',
            type: 'number',
        },
    ];
    for (const config of systemConfigs) {
        await prisma.systemConfig.create({
            data: config,
        });
    }
    console.log('✅ Database seeded successfully!');
    console.log(`📊 Created:`);
    console.log(`   - ${createdStudents.length} students`);
    console.log(`   - ${createdScholarships.length} scholarships`);
    console.log(`   - ${createdApplications.length} applications`);
    console.log(`   - ${documents.length} documents`);
    console.log(`   - ${payments.length} payments`);
    console.log(`   - ${notifications.length} notifications`);
    console.log(`   - ${systemConfigs.length} system configurations`);
}
main()
    .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map