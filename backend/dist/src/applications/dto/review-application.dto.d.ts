import { ApplicationStatus } from '@prisma/client';
export declare class ReviewApplicationDto {
    status: ApplicationStatus;
    remarks?: string;
    reviewerNotes?: string;
}
