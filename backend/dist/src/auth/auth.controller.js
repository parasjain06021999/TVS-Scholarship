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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const login_dto_1 = require("./dto/login.dto");
const register_dto_1 = require("./dto/register.dto");
const change_password_dto_1 = require("./dto/change-password.dto");
const forgot_password_dto_1 = require("./dto/forgot-password.dto");
const reset_password_dto_1 = require("./dto/reset-password.dto");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async register(registerDto) {
        try {
            const result = await this.authService.register(registerDto);
            return {
                success: true,
                message: 'User registered successfully',
                data: result,
            };
        }
        catch (error) {
            if (error instanceof common_1.ConflictException) {
                throw new common_1.HttpException({
                    success: false,
                    message: error.message,
                }, common_1.HttpStatus.CONFLICT);
            }
            throw new common_1.HttpException({
                success: false,
                message: 'Registration failed',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async login(loginDto) {
        try {
            const result = await this.authService.login(loginDto);
            return result;
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException) {
                throw new common_1.HttpException({
                    success: false,
                    message: error.message,
                }, common_1.HttpStatus.UNAUTHORIZED);
            }
            throw new common_1.HttpException({
                success: false,
                message: 'Login failed',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async refreshToken(refreshToken) {
        try {
            const result = await this.authService.refreshToken(refreshToken);
            return result;
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException) {
                throw new common_1.HttpException({
                    success: false,
                    message: error.message,
                }, common_1.HttpStatus.UNAUTHORIZED);
            }
            throw new common_1.HttpException({
                success: false,
                message: 'Token refresh failed',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async logout(req) {
        try {
            const result = await this.authService.logout(req.user.id);
            return result;
        }
        catch (error) {
            throw new common_1.HttpException({
                success: false,
                message: 'Logout failed',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async forgotPassword(forgotPasswordDto) {
        try {
            const result = await this.authService.forgotPassword(forgotPasswordDto);
            return result;
        }
        catch (error) {
            throw new common_1.HttpException({
                success: false,
                message: 'Password reset request failed',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async resetPassword(resetPasswordDto) {
        try {
            const result = await this.authService.resetPassword(resetPasswordDto);
            return result;
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException || error instanceof common_1.NotFoundException) {
                throw new common_1.HttpException({
                    success: false,
                    message: error.message,
                }, common_1.HttpStatus.BAD_REQUEST);
            }
            throw new common_1.HttpException({
                success: false,
                message: 'Password reset failed',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getProfile(req) {
        try {
            const result = await this.authService.getProfile(req.user.id);
            return result;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw new common_1.HttpException({
                    success: false,
                    message: error.message,
                }, common_1.HttpStatus.NOT_FOUND);
            }
            throw new common_1.HttpException({
                success: false,
                message: 'Failed to retrieve profile',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async changePassword(req, changePasswordDto) {
        try {
            const result = await this.authService.changePassword(req.user.id, changePasswordDto.currentPassword, changePasswordDto.newPassword);
            return {
                success: true,
                message: 'Password changed successfully',
                data: result,
            };
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException) {
                throw new common_1.HttpException({
                    success: false,
                    message: error.message,
                }, common_1.HttpStatus.UNAUTHORIZED);
            }
            throw new common_1.HttpException({
                success: false,
                message: 'Password change failed',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async enable2FA(req) {
        try {
            const result = await this.authService.enable2FA(req.user.id);
            return result;
        }
        catch (error) {
            throw new common_1.HttpException({
                success: false,
                message: '2FA setup failed',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async verify2FA(req, token) {
        try {
            const result = await this.authService.verify2FA(req.user.id, token);
            return result;
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw new common_1.HttpException({
                    success: false,
                    message: error.message,
                }, common_1.HttpStatus.BAD_REQUEST);
            }
            throw new common_1.HttpException({
                success: false,
                message: '2FA verification failed',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async disable2FA(req) {
        try {
            const result = await this.authService.disable2FA(req.user.id);
            return result;
        }
        catch (error) {
            throw new common_1.HttpException({
                success: false,
                message: '2FA disable failed',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new user' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'User registered successfully',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
                data: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        email: { type: 'string' },
                        role: { type: 'string' },
                        student: { type: 'object' },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'User already exists',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Validation failed',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
                errors: { type: 'array', items: { type: 'string' } },
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiOperation)({ summary: 'Login user' }),
    (0, swagger_1.ApiBody)({
        description: 'Login credentials',
        schema: {
            type: 'object',
            properties: {
                email: { type: 'string', example: 'user@example.com' },
                password: { type: 'string', example: 'password123' },
            },
            required: ['email', 'password'],
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Login successful',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
                data: {
                    type: 'object',
                    properties: {
                        access_token: { type: 'string' },
                        refresh_token: { type: 'string' },
                        user: {
                            type: 'object',
                            properties: {
                                id: { type: 'string' },
                                email: { type: 'string' },
                                role: { type: 'string' },
                                isActive: { type: 'boolean' },
                                lastLogin: { type: 'string', format: 'date-time' },
                                profile: { type: 'object' },
                            },
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Invalid credentials',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, swagger_1.ApiOperation)({ summary: 'Refresh JWT token' }),
    (0, swagger_1.ApiBody)({
        description: 'Refresh token',
        schema: {
            type: 'object',
            properties: {
                refresh_token: { type: 'string' },
            },
            required: ['refresh_token'],
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Token refreshed successfully',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
                data: {
                    type: 'object',
                    properties: {
                        access_token: { type: 'string' },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Invalid refresh token',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
            },
        },
    }),
    __param(0, (0, common_1.Body)('refresh_token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('logout'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Logout user' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Logout successful',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
            },
        },
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    (0, swagger_1.ApiOperation)({ summary: 'Request password reset' }),
    (0, swagger_1.ApiBody)({
        description: 'Email for password reset',
        schema: {
            type: 'object',
            properties: {
                email: { type: 'string', example: 'user@example.com' },
            },
            required: ['email'],
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Password reset email sent',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgot_password_dto_1.ForgotPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    (0, swagger_1.ApiOperation)({ summary: 'Reset password with token' }),
    (0, swagger_1.ApiBody)({
        description: 'Password reset data',
        schema: {
            type: 'object',
            properties: {
                email: { type: 'string', example: 'user@example.com' },
                token: { type: 'string', example: 'abc123def456ghi789' },
                newPassword: { type: 'string', example: 'newPassword123' },
            },
            required: ['email', 'token', 'newPassword'],
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Password reset successfully',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid reset token',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_password_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('profile'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get user profile' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Profile retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
                data: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        email: { type: 'string' },
                        role: { type: 'string' },
                        isActive: { type: 'boolean' },
                        lastLogin: { type: 'string', format: 'date-time' },
                        student: { type: 'object' },
                        adminProfile: { type: 'object' },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
            },
        },
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('change-password'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Change user password' }),
    (0, swagger_1.ApiBody)({
        description: 'Password change data',
        schema: {
            type: 'object',
            properties: {
                currentPassword: { type: 'string', example: 'currentPassword123' },
                newPassword: { type: 'string', example: 'newPassword123' },
            },
            required: ['currentPassword', 'newPassword'],
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Password changed successfully',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid current password',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
            },
        },
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, change_password_dto_1.ChangePasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "changePassword", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('enable-2fa'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Enable 2FA for user' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '2FA setup initiated',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
                data: {
                    type: 'object',
                    properties: {
                        secret: { type: 'string' },
                        qrCode: { type: 'string' },
                    },
                },
            },
        },
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "enable2FA", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('verify-2fa'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Verify 2FA token' }),
    (0, swagger_1.ApiBody)({
        description: '2FA verification data',
        schema: {
            type: 'object',
            properties: {
                token: { type: 'string', example: '123456' },
            },
            required: ['token'],
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '2FA verified successfully',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid 2FA token',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
            },
        },
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verify2FA", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('disable-2fa'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Disable 2FA for user' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '2FA disabled successfully',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
            },
        },
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "disable2FA", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Authentication'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map