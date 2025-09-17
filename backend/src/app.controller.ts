import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';
import { StudentsService } from './students/students.service';
import { ScholarshipsService } from './scholarships/scholarships.service';

@Controller()
export class AppController {
  constructor(
    private readonly authService: AuthService,
    private readonly studentsService: StudentsService,
    private readonly scholarshipsService: ScholarshipsService,
  ) {}

  @Get()
  getHello(): string {
    return 'TVS Scholarship API is running!';
  }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  @Post('auth/login')
  async login(@Body() loginDto: { email: string; password: string }) {
    return this.authService.login(loginDto);
  }

  @Post('auth/register')
  async register(@Body() registerDto: any) {
    return this.authService.register(registerDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('auth/profile')
  async getProfile(@Request() req) {
    return { user: req.user };
  }

  @Get('scholarships')
  async getScholarships() {
    return this.scholarshipsService.findAll({
      page: 1,
      limit: 10,
      search: '',
      category: '',
      minAmount: undefined,
      maxAmount: undefined
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('students/profile')
  async getStudentProfile(@Request() req) {
    return this.studentsService.findOne(req.user.id, req.user.id, req.user.role);
  }
}
