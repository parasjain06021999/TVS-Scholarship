import { IsString, IsOptional, IsNumber, IsObject, IsArray, IsEmail, IsDateString } from 'class-validator';

export class CreateApplicationDto {
  @IsString()
  scholarshipId: string;

  @IsString()
  @IsOptional()
  studentId?: string;

  @IsObject()
  @IsOptional()
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

  @IsObject()
  @IsOptional()
  academicInfo?: {
    courseOfStudy: string;
    currentYear: string;
    universityName: string;
    collegeName: string;
    academicPercentage: number;
    achievements: string;
    extraCurriculars: string;
  };

  @IsObject()
  @IsOptional()
  familyInfo?: {
    fatherName: string;
    fatherOccupation: string;
    motherName: string;
    motherOccupation: string;
    familyIncome: number;
    familySize: number;
    emergencyContact: string;
  };

  @IsObject()
  @IsOptional()
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

  @IsObject()
  @IsOptional()
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

  @IsObject()
  @IsOptional()
  additionalInfo?: {
    category: string;
    essay: string;
    futureGoals: string;
    whyScholarship: string;
  };

  @IsArray()
  @IsOptional()
  documents?: any[];

  @IsString()
  @IsOptional()
  status?: string;
}
