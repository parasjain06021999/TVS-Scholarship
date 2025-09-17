import { Gender } from '@prisma/client';
export declare class UpdateStudentDto {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    gender?: Gender;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
    aadharNumber?: string;
    panNumber?: string;
    fatherName?: string;
    fatherOccupation?: string;
    motherName?: string;
    motherOccupation?: string;
    familyIncome?: number;
    emergencyContact?: string;
    profileImage?: string;
}
