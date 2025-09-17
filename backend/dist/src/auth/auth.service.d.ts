import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    private configService;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService);
    register(registerDto: RegisterDto): Promise<{
        user: {
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.UserRole;
            student: {
                id: string;
                email: string | null;
                createdAt: Date;
                updatedAt: Date;
                firstName: string;
                lastName: string;
                dateOfBirth: Date;
                gender: import(".prisma/client").$Enums.Gender;
                phone: string | null;
                address: string;
                city: string;
                state: string;
                pincode: string;
                country: string;
                aadharNumber: string | null;
                panNumber: string | null;
                fatherName: string;
                fatherOccupation: string | null;
                motherName: string;
                motherOccupation: string | null;
                familyIncome: number | null;
                emergencyContact: string | null;
                profileImage: string | null;
                isVerified: boolean;
                userId: string;
            };
        };
        token: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: {
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.UserRole;
            student: {
                id: string;
                email: string | null;
                createdAt: Date;
                updatedAt: Date;
                firstName: string;
                lastName: string;
                dateOfBirth: Date;
                gender: import(".prisma/client").$Enums.Gender;
                phone: string | null;
                address: string;
                city: string;
                state: string;
                pincode: string;
                country: string;
                aadharNumber: string | null;
                panNumber: string | null;
                fatherName: string;
                fatherOccupation: string | null;
                motherName: string;
                motherOccupation: string | null;
                familyIncome: number | null;
                emergencyContact: string | null;
                profileImage: string | null;
                isVerified: boolean;
                userId: string;
            };
            adminProfile: {
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                firstName: string;
                lastName: string;
                phone: string | null;
                userId: string;
                department: string | null;
            };
        };
        token: string;
    }>;
    validateUser(email: string, password: string): Promise<{
        student: {
            id: string;
            email: string | null;
            createdAt: Date;
            updatedAt: Date;
            firstName: string;
            lastName: string;
            dateOfBirth: Date;
            gender: import(".prisma/client").$Enums.Gender;
            phone: string | null;
            address: string;
            city: string;
            state: string;
            pincode: string;
            country: string;
            aadharNumber: string | null;
            panNumber: string | null;
            fatherName: string;
            fatherOccupation: string | null;
            motherName: string;
            motherOccupation: string | null;
            familyIncome: number | null;
            emergencyContact: string | null;
            profileImage: string | null;
            isVerified: boolean;
            userId: string;
        };
        adminProfile: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            firstName: string;
            lastName: string;
            phone: string | null;
            userId: string;
            department: string | null;
        };
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.UserRole;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    refreshToken(userId: string): Promise<{
        user: {
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.UserRole;
            student: {
                id: string;
                email: string | null;
                createdAt: Date;
                updatedAt: Date;
                firstName: string;
                lastName: string;
                dateOfBirth: Date;
                gender: import(".prisma/client").$Enums.Gender;
                phone: string | null;
                address: string;
                city: string;
                state: string;
                pincode: string;
                country: string;
                aadharNumber: string | null;
                panNumber: string | null;
                fatherName: string;
                fatherOccupation: string | null;
                motherName: string;
                motherOccupation: string | null;
                familyIncome: number | null;
                emergencyContact: string | null;
                profileImage: string | null;
                isVerified: boolean;
                userId: string;
            };
            adminProfile: {
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                firstName: string;
                lastName: string;
                phone: string | null;
                userId: string;
                department: string | null;
            };
        };
        token: string;
    }>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<{
        message: string;
    }>;
    logout(userId: string): Promise<{
        message: string;
    }>;
    forgotPassword(forgotPasswordDto: any): Promise<{
        message: string;
    }>;
    resetPassword(resetPasswordDto: any): Promise<{
        message: string;
    }>;
    getProfile(userId: string): Promise<{
        student: {
            id: string;
            email: string | null;
            createdAt: Date;
            updatedAt: Date;
            firstName: string;
            lastName: string;
            dateOfBirth: Date;
            gender: import(".prisma/client").$Enums.Gender;
            phone: string | null;
            address: string;
            city: string;
            state: string;
            pincode: string;
            country: string;
            aadharNumber: string | null;
            panNumber: string | null;
            fatherName: string;
            fatherOccupation: string | null;
            motherName: string;
            motherOccupation: string | null;
            familyIncome: number | null;
            emergencyContact: string | null;
            profileImage: string | null;
            isVerified: boolean;
            userId: string;
        };
        adminProfile: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            firstName: string;
            lastName: string;
            phone: string | null;
            userId: string;
            department: string | null;
        };
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.UserRole;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    enable2FA(userId: string): Promise<{
        message: string;
    }>;
    verify2FA(userId: string, token: string): Promise<{
        message: string;
    }>;
    disable2FA(userId: string): Promise<{
        message: string;
    }>;
}
