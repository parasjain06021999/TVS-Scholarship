import { Controller, Post, Body, UseGuards, Get, Request, HttpStatus, HttpException, ConflictException, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
// import { LocalAuthGuard } from './strategies/local.strategy';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ 
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
  })
  @ApiResponse({ 
    status: 409, 
    description: 'User already exists',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ 
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
  })
  async register(@Body() registerDto: RegisterDto) {
    try {
      const result = await this.authService.register(registerDto);
      return {
        success: true,
        message: 'User registered successfully',
        data: result,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new HttpException(
          {
            success: false,
            message: error.message,
          },
          HttpStatus.CONFLICT,
        );
      }
      throw new HttpException(
        {
          success: false,
          message: 'Registration failed',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({
    description: 'Login credentials',
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        password: { type: 'string', example: 'password123' },
      },
      required: ['email', 'password'],
    },
  })
  @ApiResponse({ 
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
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Invalid credentials',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
      },
    },
  })
  async login(@Body() loginDto: LoginDto) {
    try {
      const result = await this.authService.login(loginDto);
      return result;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new HttpException(
          {
            success: false,
            message: error.message,
          },
          HttpStatus.UNAUTHORIZED,
        );
      }
      throw new HttpException(
        {
          success: false,
          message: 'Login failed',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh JWT token' })
  @ApiBody({
    description: 'Refresh token',
    schema: {
      type: 'object',
      properties: {
        refresh_token: { type: 'string' },
      },
      required: ['refresh_token'],
    },
  })
  @ApiResponse({ 
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
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Invalid refresh token',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
      },
    },
  })
  async refreshToken(@Body('refresh_token') refreshToken: string) {
    try {
      const result = await this.authService.refreshToken(refreshToken);
      return result;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new HttpException(
          {
            success: false,
            message: error.message,
          },
          HttpStatus.UNAUTHORIZED,
        );
      }
      throw new HttpException(
        {
          success: false,
          message: 'Token refresh failed',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ 
    status: 200, 
    description: 'Logout successful',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
      },
    },
  })
  async logout(@Request() req) {
    try {
      const result = await this.authService.logout(req.user.id);
      return result;
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Logout failed',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Request password reset' })
  @ApiBody({
    description: 'Email for password reset',
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
      },
      required: ['email'],
    },
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Password reset email sent',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
      },
    },
  })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    try {
      const result = await this.authService.forgotPassword(forgotPasswordDto);
      return result;
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Password reset request failed',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password with token' })
  @ApiBody({
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
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Password reset successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Invalid reset token',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
      },
    },
  })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    try {
      const result = await this.authService.resetPassword(resetPasswordDto);
      return result;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw new HttpException(
          {
            success: false,
            message: error.message,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        {
          success: false,
          message: 'Password reset failed',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ 
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
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
      },
    },
  })
  async getProfile(@Request() req) {
    try {
      const result = await this.authService.getProfile(req.user.id);
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(
          {
            success: false,
            message: error.message,
          },
          HttpStatus.NOT_FOUND,
        );
      }
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve profile',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change user password' })
  @ApiBody({
    description: 'Password change data',
    schema: {
      type: 'object',
      properties: {
        currentPassword: { type: 'string', example: 'currentPassword123' },
        newPassword: { type: 'string', example: 'newPassword123' },
      },
      required: ['currentPassword', 'newPassword'],
    },
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Password changed successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Invalid current password',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
      },
    },
  })
  async changePassword(@Request() req, @Body() changePasswordDto: ChangePasswordDto) {
    try {
      const result = await this.authService.changePassword(
        req.user.id,
        changePasswordDto.currentPassword,
        changePasswordDto.newPassword,
      );
      return {
        success: true,
        message: 'Password changed successfully',
        data: result,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new HttpException(
          {
            success: false,
            message: error.message,
          },
          HttpStatus.UNAUTHORIZED,
        );
      }
      throw new HttpException(
        {
          success: false,
          message: 'Password change failed',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('enable-2fa')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Enable 2FA for user' })
  @ApiResponse({ 
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
  })
  async enable2FA(@Request() req) {
    try {
      const result = await this.authService.enable2FA(req.user.id);
      return result;
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: '2FA setup failed',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify-2fa')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify 2FA token' })
  @ApiBody({
    description: '2FA verification data',
    schema: {
      type: 'object',
      properties: {
        token: { type: 'string', example: '123456' },
      },
      required: ['token'],
    },
  })
  @ApiResponse({ 
    status: 200, 
    description: '2FA verified successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Invalid 2FA token',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
      },
    },
  })
  async verify2FA(@Request() req, @Body('token') token: string) {
    try {
      const result = await this.authService.verify2FA(req.user.id, token);
      return result;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new HttpException(
          {
            success: false,
            message: error.message,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        {
          success: false,
          message: '2FA verification failed',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('disable-2fa')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Disable 2FA for user' })
  @ApiResponse({ 
    status: 200, 
    description: '2FA disabled successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
      },
    },
  })
  async disable2FA(@Request() req) {
    try {
      const result = await this.authService.disable2FA(req.user.id);
      return result;
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: '2FA disable failed',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}