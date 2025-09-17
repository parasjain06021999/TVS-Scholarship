import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        success: boolean;
        message: string;
        data: {
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
        };
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
    refreshToken(refreshToken: string): Promise<{
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
    logout(req: any): Promise<{
        message: string;
    }>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    getProfile(req: any): Promise<{
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
    changePassword(req: any, changePasswordDto: ChangePasswordDto): Promise<{
        success: boolean;
        message: string;
        data: {
            message: string;
        };
    }>;
    enable2FA(req: any): Promise<{
        message: string;
    }>;
    verify2FA(req: any, token: string): Promise<{
        message: string;
    }>;
    disable2FA(req: any): Promise<{
        message: string;
    }>;
}
