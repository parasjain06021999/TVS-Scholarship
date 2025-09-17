"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateStudentDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class UpdateStudentDto {
}
exports.UpdateStudentDto = UpdateStudentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student first name',
        example: 'John',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateStudentDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student last name',
        example: 'Doe',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateStudentDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student date of birth',
        example: '2000-01-01',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateStudentDto.prototype, "dateOfBirth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student gender',
        enum: client_1.Gender,
        example: client_1.Gender.MALE,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.Gender),
    __metadata("design:type", String)
], UpdateStudentDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student phone number',
        example: '+91-9876543210',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsPhoneNumber)('IN'),
    __metadata("design:type", String)
], UpdateStudentDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student address',
        example: '123 Main Street, Area Name',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateStudentDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student city',
        example: 'Mumbai',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateStudentDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student state',
        example: 'Maharashtra',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateStudentDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student pincode',
        example: '400001',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateStudentDto.prototype, "pincode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student country',
        example: 'India',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateStudentDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Aadhar number',
        example: '123456789012',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateStudentDto.prototype, "aadharNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'PAN number',
        example: 'ABCDE1234F',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateStudentDto.prototype, "panNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Father name',
        example: 'Robert Doe',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateStudentDto.prototype, "fatherName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Father occupation',
        example: 'Engineer',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateStudentDto.prototype, "fatherOccupation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Mother name',
        example: 'Jane Doe',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateStudentDto.prototype, "motherName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Mother occupation',
        example: 'Teacher',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateStudentDto.prototype, "motherOccupation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Family income',
        example: 500000,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateStudentDto.prototype, "familyIncome", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Emergency contact',
        example: '+91-9876543210',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateStudentDto.prototype, "emergencyContact", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Profile image URL',
        example: 'https://example.com/profile.jpg',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateStudentDto.prototype, "profileImage", void 0);
//# sourceMappingURL=update-student.dto.js.map