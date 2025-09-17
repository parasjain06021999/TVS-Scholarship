export declare class CreateApplicationDto {
    scholarshipId: string;
    studentId?: string;
    personalInfo?: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        dateOfBirth: string;
        gender: string;
        aadharNumber: string;
        panNumber: string;
    };
    academicInfo?: {
        courseOfStudy: string;
        currentYear: string;
        universityName: string;
        collegeName: string;
        academicPercentage: number;
        achievements: string;
        extraCurriculars: string;
    };
    familyInfo?: {
        fatherName: string;
        fatherOccupation: string;
        motherName: string;
        motherOccupation: string;
        familyIncome: number;
        familySize: number;
        emergencyContact: string;
    };
    addressInfo?: {
        currentAddress: string;
        currentCity: string;
        currentState: string;
        currentPinCode: string;
        permanentAddress: string;
        permanentCity: string;
        permanentState: string;
        permanentPinCode: string;
    };
    financialInfo?: {
        familyIncome: number;
        expenses: number;
        savings: number;
        otherScholarships: string;
        bankName: string;
        accountNumber: string;
        ifscCode: string;
        accountHolderName: string;
    };
    additionalInfo?: {
        category: string;
        essay: string;
        futureGoals: string;
        whyScholarship: string;
    };
    documents?: any[];
    status?: string;
}
