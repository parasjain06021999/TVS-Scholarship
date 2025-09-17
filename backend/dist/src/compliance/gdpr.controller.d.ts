import { GdprService } from './gdpr.service';
export declare class GdprController {
    private readonly gdprService;
    constructor(gdprService: GdprService);
    recordConsent(consentData: {
        dataTypes: string[];
        purpose: string;
        reason?: string;
    }, ipAddress: string, userAgent: string): Promise<{
        success: boolean;
        message: string;
        data: {
            dataTypes: string[];
            purpose: string;
            recordedAt: Date;
        };
    }>;
    withdrawConsent(withdrawalData: {
        dataTypes: string[];
        reason?: string;
    }): Promise<{
        success: boolean;
        message: string;
        data: {
            dataTypes: string[];
            reason: string;
            withdrawnAt: Date;
        };
    }>;
    exportUserData(): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    deleteUserData(deletionData: {
        reason: string;
        confirmDeletion: boolean;
    }): Promise<{
        success: boolean;
        message: string;
        data: {
            reason: string;
            deletedAt: Date;
        };
    }>;
    rectifyUserData(rectificationData: {
        dataType: string;
        newValue: any;
        reason: string;
    }): Promise<{
        success: boolean;
        message: string;
        data: {
            dataType: string;
            newValue: any;
            reason: string;
            rectifiedAt: Date;
        };
    }>;
    getDataProcessingActivities(): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    checkRetentionCompliance(): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    getPrivacyPolicy(): Promise<{
        success: boolean;
        message: string;
        data: {
            version: string;
            lastUpdated: string;
            dataController: string;
            contactEmail: string;
            dataProcessingPurposes: string[];
            dataCategories: string[];
            legalBasis: string[];
            dataRetention: string;
            userRights: string[];
            dataTransfers: string[];
            securityMeasures: string[];
        };
    }>;
}
