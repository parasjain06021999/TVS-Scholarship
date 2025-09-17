import { Gender } from '@prisma/client';
export declare class CreateStudentDto {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: Gender;
    phone?: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    aadharNumber?: string;
    panNumber?: string;
    fatherName?: string;
    motherName?: string;
    familyIncome?: number;
    profileImage?: string;
    educationLevel?: string;
    currentInstitution?: string;
    currentCourse?: string;
    cgpa?: number;
}
