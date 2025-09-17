import { Injectable, UnauthorizedException, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, firstName, lastName, dateOfBirth, gender, phone, address, city, state, pincode } = registerDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const saltRounds = parseInt(this.configService.get('BCRYPT_ROUNDS', '12'));
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user and student profile
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: UserRole.STUDENT,
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

    // Generate JWT token
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

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const normalizedEmail = (email || '').trim();

    // Find user
    const user = await this.prisma.user.findFirst({
      where: { email: { equals: normalizedEmail, mode: 'insensitive' } },
      include: {
        student: true,
        adminProfile: true,
      },
    });

    // Allow login if user exists; handle inactive explicitly after password check
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    // Support PHP-style bcrypt hashes ("$2y$") by normalizing to "$2b$"
    const storedHash = (user.password || '').replace(/^\$2y\$/,'$2b$');
    const isPasswordValid = await bcrypt.compare(password, storedHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Block explicitly inactive accounts
    if (user.isActive === false) {
      throw new UnauthorizedException('Account is inactive');
    }

    // Generate JWT token
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

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        student: true,
        adminProfile: true,
      },
    });

    if (user && user.isActive && await bcrypt.compare(password, (user.password || '').replace(/^\$2y\$/,'$2b$'))) {
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  async refreshToken(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        student: true,
        adminProfile: true,
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or inactive');
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

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hash new password
    const saltRounds = this.configService.get('BCRYPT_ROUNDS', 12);
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    return { message: 'Password changed successfully' };
  }

  async logout(userId: string) {
    // In a real implementation, you might want to blacklist the token
    // For now, we'll just return a success message
    return { message: 'Logged out successfully' };
  }

  async forgotPassword(forgotPasswordDto: any) {
    // Mock implementation
    return { message: 'Password reset email sent' };
  }

  async resetPassword(resetPasswordDto: any) {
    // Mock implementation
    return { message: 'Password reset successfully' };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        student: true,
        adminProfile: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, ...result } = user;
    return result;
  }

  async enable2FA(userId: string) {
    // Mock implementation
    return { message: '2FA enabled successfully' };
  }

  async verify2FA(userId: string, token: string) {
    // Mock implementation
    return { message: '2FA verified successfully' };
  }

  async disable2FA(userId: string) {
    // Mock implementation
    return { message: '2FA disabled successfully' };
  }
}
