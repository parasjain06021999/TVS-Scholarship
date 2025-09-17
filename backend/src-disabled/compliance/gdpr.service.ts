import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface PersonalData {
  category: 'basic' | 'sensitive' | 'financial';
  retention_period: number; // in days
  legal_basis: string;
  processing_purpose: string;
}

// MANDATORY: Data classification for GDPR compliance
const DataClassification = {
  firstName: { 
    category: 'basic', 
    retention_period: 2555, 
    legal_basis: 'contract', 
    processing_purpose: 'scholarship_processing' 
  },
  lastName: { 
    category: 'basic', 
    retention_period: 2555, 
    legal_basis: 'contract', 
    processing_purpose: 'scholarship_processing' 
  },
  email: { 
    category: 'basic', 
    retention_period: 2555, 
    legal_basis: 'contract', 
    processing_purpose: 'communication' 
  },
  mobile: { 
    category: 'basic', 
    retention_period: 2555, 
    legal_basis: 'contract', 
    processing_purpose: 'communication' 
  },
  aadhaarNumber: { 
    category: 'sensitive', 
    retention_period: 2555, 
    legal_basis: 'legal_obligation', 
    processing_purpose: 'identity_verification' 
  },
  bankDetails: { 
    category: 'financial', 
    retention_period: 2555, 
    legal_basis: 'contract', 
    processing_purpose: 'payment_processing' 
  },
  photograph: { 
    category: 'sensitive', 
    retention_period: 2555, 
    legal_basis: 'consent', 
    processing_purpose: 'identification' 
  },
  dateOfBirth: { 
    category: 'sensitive', 
    retention_period: 2555, 
    legal_basis: 'legal_obligation', 
    processing_purpose: 'age_verification' 
  },
  address: { 
    category: 'basic', 
    retention_period: 2555, 
    legal_basis: 'contract', 
    processing_purpose: 'scholarship_processing' 
  },
  familyIncome: { 
    category: 'financial', 
    retention_period: 2555, 
    legal_basis: 'contract', 
    processing_purpose: 'eligibility_assessment' 
  },
};

@Injectable()
export class GdprService {
  constructor(private prisma: PrismaService) {}

  /**
   * Record user consent for data processing
   */
  async recordConsent(
    userId: string,
    dataTypes: string[],
    purpose: string,
    ipAddress: string,
    userAgent: string
  ): Promise<void> {
    await this.prisma.consentRecord.create({
      data: {
        userId,
        dataTypes,
        purpose,
        grantedAt: new Date(),
        ipAddress,
        userAgent,
        consentVersion: '1.0',
        status: 'active',
      },
    });

    // Log consent recording
    await this.logGdprEvent('consent.recorded', userId, {
      dataTypes,
      purpose,
      consentVersion: '1.0',
    });
  }

  /**
   * Withdraw user consent
   */
  async withdrawConsent(
    userId: string,
    dataTypes: string[],
    reason?: string
  ): Promise<void> {
    // Update consent records
    await this.prisma.consentRecord.updateMany({
      where: {
        userId,
        dataTypes: {
          hasSome: dataTypes,
        },
        status: 'active',
      },
      data: {
        withdrawnAt: new Date(),
        status: 'withdrawn',
        withdrawalReason: reason,
      },
    });

    // Trigger data anonymization for withdrawn consent
    await this.anonymizeData(userId, dataTypes);

    // Log consent withdrawal
    await this.logGdprEvent('consent.withdrawn', userId, {
      dataTypes,
      reason,
    });
  }

  /**
   * Anonymize user data
   */
  async anonymizeData(userId: string, dataTypes: string[]): Promise<void> {
    const anonymizationMap = {
      firstName: 'REDACTED',
      lastName: 'REDACTED',
      email: `anonymized_${Date.now()}@redacted.com`,
      mobile: 'XXXXXXXXXX',
      photograph: null,
      address: 'REDACTED',
      aadhaarNumber: 'XXXXXXXXXXXX',
      bankDetails: 'REDACTED',
    };

    const updateData = {};
    dataTypes.forEach(field => {
      if (anonymizationMap[field]) {
        updateData[field] = anonymizationMap[field];
      }
    });

    if (Object.keys(updateData).length > 0) {
      // Update student record
      await this.prisma.student.update({
        where: { userId },
        data: updateData,
      });

      // Update user record
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          email: updateData.email || undefined,
          isActive: false,
        },
      });

      // Log anonymization
      await this.logGdprEvent('data.anonymized', userId, {
        anonymizedFields: dataTypes,
        anonymizationMap: updateData,
      });
    }
  }

  /**
   * Export user data (Right to Access)
   */
  async exportUserData(userId: string): Promise<any> {
    // Get all user data
    const userData = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        student: true,
        applications: {
          include: {
            scholarship: true,
            documents: true,
          },
        },
        payments: true,
        notifications: true,
      },
    });

    if (!userData) {
      throw new Error('User not found');
    }

    // Prepare export data
    const exportData = {
      personal_information: this.extractPersonalData(userData),
      applications: this.extractApplicationData(userData.applications),
      documents: this.extractDocumentData(userData.student?.documents || []),
      payments: this.extractPaymentData(userData.payments),
      notifications: this.extractNotificationData(userData.notifications),
      consent_records: await this.getConsentRecords(userId),
      export_metadata: {
        export_date: new Date().toISOString(),
        export_format: 'JSON',
        data_categories: this.getDataCategories(userData),
        retention_policies: this.getRetentionPolicies(),
      },
    };

    // Log data export
    await this.logGdprEvent('data.exported', userId, {
      exportDate: new Date(),
      dataCategories: Object.keys(exportData),
    });

    return exportData;
  }

  /**
   * Delete user data (Right to Erasure)
   */
  async deleteUserData(userId: string, reason: string): Promise<void> {
    // Check if user has active applications or payments
    const activeApplications = await this.prisma.application.count({
      where: {
        student: { userId },
        status: { in: ['PENDING', 'UNDER_REVIEW', 'APPROVED'] },
      },
    });

    if (activeApplications > 0) {
      throw new Error('Cannot delete user data while active applications exist');
    }

    // Delete user data
    await this.prisma.$transaction(async (tx) => {
      // Delete related records
      await tx.document.deleteMany({ where: { student: { userId } } });
      await tx.application.deleteMany({ where: { student: { userId } } });
      await tx.payment.deleteMany({ where: { application: { student: { userId } } } });
      await tx.notification.deleteMany({ where: { userId } });
      await tx.consentRecord.deleteMany({ where: { userId } });
      await tx.auditLog.deleteMany({ where: { userId } });
      
      // Delete student record
      await tx.student.deleteMany({ where: { userId } });
      
      // Delete user record
      await tx.user.delete({ where: { id: userId } });
    });

    // Log data deletion
    await this.logGdprEvent('data.deleted', userId, {
      reason,
      deletionDate: new Date(),
    });
  }

  /**
   * Rectify user data (Right to Rectification)
   */
  async rectifyUserData(
    userId: string,
    dataType: string,
    newValue: any,
    reason: string
  ): Promise<void> {
    // Validate data type
    if (!DataClassification[dataType]) {
      throw new Error(`Invalid data type: ${dataType}`);
    }

    // Update data
    if (dataType === 'email') {
      await this.prisma.user.update({
        where: { id: userId },
        data: { email: newValue },
      });
    } else {
      await this.prisma.student.update({
        where: { userId },
        data: { [dataType]: newValue },
      });
    }

    // Log rectification
    await this.logGdprEvent('data.rectified', userId, {
      dataType,
      newValue,
      reason,
      rectificationDate: new Date(),
    });
  }

  /**
   * Get data processing activities
   */
  async getDataProcessingActivities(): Promise<any> {
    return {
      activities: [
        {
          purpose: 'Scholarship Processing',
          legal_basis: 'Contract',
          data_categories: ['basic', 'sensitive'],
          retention_period: '7 years',
          recipients: ['TVS Group', 'Educational Institutions'],
        },
        {
          purpose: 'Payment Processing',
          legal_basis: 'Contract',
          data_categories: ['financial'],
          retention_period: '7 years',
          recipients: ['Banking Partners'],
        },
        {
          purpose: 'Communication',
          legal_basis: 'Consent',
          data_categories: ['basic'],
          retention_period: 'Until withdrawn',
          recipients: ['TVS Group'],
        },
      ],
      data_categories: DataClassification,
      retention_policies: this.getRetentionPolicies(),
    };
  }

  /**
   * Check data retention compliance
   */
  async checkRetentionCompliance(): Promise<any> {
    const now = new Date();
    const violations = [];

    // Check for expired data
    for (const [field, classification] of Object.entries(DataClassification)) {
      const retentionDate = new Date(now.getTime() - (classification.retention_period * 24 * 60 * 60 * 1000));
      
      // This would check for data older than retention period
      // Implementation depends on your data structure
    }

    return {
      compliance_status: violations.length === 0 ? 'compliant' : 'non_compliant',
      violations,
      last_check: now,
    };
  }

  /**
   * Log GDPR events
   */
  private async logGdprEvent(event: string, userId: string, details: any): Promise<void> {
    await this.prisma.auditLog.create({
      data: {
        userId,
        action: `gdpr.${event}`,
        entity: 'gdpr',
        newValues: details,
        ipAddress: '127.0.0.1',
        userAgent: 'TVS-GDPR-Service',
        riskLevel: 'high',
        outcome: 'success',
      },
    });
  }

  /**
   * Extract personal data for export
   */
  private extractPersonalData(userData: any): any {
    return {
      id: userData.id,
      email: userData.email,
      role: userData.role,
      createdAt: userData.createdAt,
      lastLogin: userData.lastLogin,
      student: userData.student ? {
        firstName: userData.student.firstName,
        lastName: userData.student.lastName,
        dateOfBirth: userData.student.dateOfBirth,
        gender: userData.student.gender,
        phone: userData.student.phone,
        address: userData.student.address,
        city: userData.student.city,
        state: userData.student.state,
        pincode: userData.student.pincode,
        aadhaarNumber: userData.student.aadhaarNumber,
        panNumber: userData.student.panNumber,
        fatherName: userData.student.fatherName,
        motherName: userData.student.motherName,
        familyIncome: userData.student.familyIncome,
        profileImage: userData.student.profileImage,
      } : null,
    };
  }

  /**
   * Extract application data for export
   */
  private extractApplicationData(applications: any[]): any[] {
    return applications.map(app => ({
      id: app.id,
      status: app.status,
      submittedAt: app.submittedAt,
      scholarship: app.scholarship ? {
        title: app.scholarship.title,
        amount: app.scholarship.amount,
        category: app.scholarship.category,
      } : null,
      applicationData: app.applicationData,
    }));
  }

  /**
   * Extract document data for export
   */
  private extractDocumentData(documents: any[]): any[] {
    return documents.map(doc => ({
      id: doc.id,
      type: doc.type,
      fileName: doc.fileName,
      originalName: doc.originalName,
      fileSize: doc.fileSize,
      mimeType: doc.mimeType,
      uploadedAt: doc.uploadedAt,
      isVerified: doc.isVerified,
    }));
  }

  /**
   * Extract payment data for export
   */
  private extractPaymentData(payments: any[]): any[] {
    return payments.map(payment => ({
      id: payment.id,
      amount: payment.amount,
      status: payment.status,
      paymentMethod: payment.paymentMethod,
      transactionId: payment.transactionId,
      paymentDate: payment.paymentDate,
      createdAt: payment.createdAt,
    }));
  }

  /**
   * Extract notification data for export
   */
  private extractNotificationData(notifications: any[]): any[] {
    return notifications.map(notification => ({
      id: notification.id,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      read: notification.read,
      createdAt: notification.createdAt,
    }));
  }

  /**
   * Get consent records for user
   */
  private async getConsentRecords(userId: string): Promise<any[]> {
    return await this.prisma.consentRecord.findMany({
      where: { userId },
      orderBy: { grantedAt: 'desc' },
    });
  }

  /**
   * Get data categories from user data
   */
  private getDataCategories(userData: any): string[] {
    const categories = ['basic'];
    
    if (userData.student?.aadhaarNumber || userData.student?.photograph) {
      categories.push('sensitive');
    }
    
    if (userData.student?.familyIncome || userData.payments?.length > 0) {
      categories.push('financial');
    }
    
    return categories;
  }

  /**
   * Get retention policies
   */
  private getRetentionPolicies(): any {
    return {
      basic_data: '7 years from last interaction',
      sensitive_data: '7 years from last interaction',
      financial_data: '7 years from last transaction',
      consent_records: '7 years from withdrawal or expiry',
      audit_logs: '7 years from creation',
    };
  }
}
