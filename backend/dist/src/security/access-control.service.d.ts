import { PrismaService } from '../prisma/prisma.service';
export declare class AccessControlService {
    private prisma;
    constructor(prisma: PrismaService);
    getUserPermissions(userId: string): Promise<{
        success: boolean;
        data: {
            userId: string;
            role: import(".prisma/client").$Enums.UserRole;
            isActive: boolean;
            permissions: any;
        };
    }>;
    private getRolePermissions;
    checkPermission(userId: string, permission: string): Promise<boolean>;
    canAccessResource(userId: string, resourceType: string, resourceId?: string): Promise<boolean>;
}
