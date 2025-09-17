import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private prisma;
    constructor(configService: ConfigService, prisma: PrismaService);
    validate(payload: any): Promise<{
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.UserRole;
        student: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            firstName: string;
            lastName: string;
            dateOfBirth: Date;
            gender: import(".prisma/client").$Enums.Gender;
            phone: string | null;
            email: string | null;
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
        };
        adminProfile: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            firstName: string;
            lastName: string;
            phone: string | null;
            isActive: boolean;
            department: string | null;
        };
    }>;
}
export {};
