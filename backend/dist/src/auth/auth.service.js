"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = __importStar(require("bcrypt"));
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let AuthService = class AuthService {
    constructor(prisma, jwtService, configService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async register(registerDto) {
        const { email, password, firstName, lastName, dateOfBirth, gender, phone, address, city, state, pincode } = registerDto;
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('User with this email already exists');
        }
        const saltRounds = parseInt(this.configService.get('BCRYPT_ROUNDS', '12'));
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = await this.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: client_1.UserRole.STUDENT,
                student: {
                    create: {
                        firstName,
                        lastName,
                        dateOfBirth: new Date(dateOfBirth),
                        gender,
                        phone,
                        address,
                        city,
                        state,
                        pincode,
                        country: 'India',
                        fatherName: '',
                        motherName: '',
                    },
                },
            },
            include: {
                student: true,
            },
        });
        const payload = { sub: user.id, email: user.email, role: user.role };
        const token = this.jwtService.sign(payload);
        return {
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                student: user.student,
            },
            token,
        };
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const normalizedEmail = (email || '').trim();
        const user = await this.prisma.user.findFirst({
            where: { email: { equals: normalizedEmail, mode: 'insensitive' } },
            include: {
                student: true,
                adminProfile: true,
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const storedHash = (user.password || '').replace(/^\$2y\$/, '$2b$');
        const isPasswordValid = await bcrypt.compare(password, storedHash);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (user.isActive === false) {
            throw new common_1.UnauthorizedException('Account is inactive');
        }
        const payload = { sub: user.id, email: user.email, role: user.role };
        const token = this.jwtService.sign(payload);
        return {
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                student: user.student,
                adminProfile: user.adminProfile,
            },
            token,
        };
    }
    async validateUser(email, password) {
        const user = await this.prisma.user.findUnique({
            where: { email },
            include: {
                student: true,
                adminProfile: true,
            },
        });
        if (user && user.isActive && await bcrypt.compare(password, (user.password || '').replace(/^\$2y\$/, '$2b$'))) {
            const { password: _, ...result } = user;
            return result;
        }
        return null;
    }
    async refreshToken(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                student: true,
                adminProfile: true,
            },
        });
        if (!user || !user.isActive) {
            throw new common_1.UnauthorizedException('User not found or inactive');
        }
        const payload = { sub: user.id, email: user.email, role: user.role };
        const token = this.jwtService.sign(payload);
        return {
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                student: user.student,
                adminProfile: user.adminProfile,
            },
            token,
        };
    }
    async changePassword(userId, currentPassword, newPassword) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            throw new common_1.UnauthorizedException('Current password is incorrect');
        }
        const saltRounds = this.configService.get('BCRYPT_ROUNDS', 12);
        const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
        await this.prisma.user.update({
            where: { id: userId },
            data: { password: hashedNewPassword },
        });
        return { message: 'Password changed successfully' };
    }
    async logout(userId) {
        return { message: 'Logged out successfully' };
    }
    async forgotPassword(forgotPasswordDto) {
        return { message: 'Password reset email sent' };
    }
    async resetPassword(resetPasswordDto) {
        return { message: 'Password reset successfully' };
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                student: true,
                adminProfile: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const { password, ...result } = user;
        return result;
    }
    async enable2FA(userId) {
        return { message: '2FA enabled successfully' };
    }
    async verify2FA(userId, token) {
        return { message: '2FA verified successfully' };
    }
    async disable2FA(userId) {
        return { message: '2FA disabled successfully' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map