import { Gender } from '@prisma/client';
export declare class RegisterDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: Gender;
    phone?: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
}
