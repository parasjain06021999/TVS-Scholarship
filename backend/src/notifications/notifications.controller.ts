import { Controller, Get, Post, Body, UseGuards, Request, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@Request() req, @Query() query: any) {
    const { page = 1, limit = 10, unreadOnly = false } = query;
    return this.notificationsService.getUserNotifications(req.user.id, page, limit, unreadOnly);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() createNotificationDto: CreateNotificationDto, @Request() req) {
    return this.notificationsService.create(createNotificationDto, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('unread-count')
  async getUnreadCount(@Request() req) {
    const unread = await this.notificationsService.getNotificationStats(req.user.id);
    return { unread: unread.unread };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/mark-read')
  async markAsRead(@Query('id') id: string, @Request() req) {
    return this.notificationsService.markAsRead(id, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('mark-all-read')
  async markAllAsRead(@Request() req) {
    return this.notificationsService.markAllAsRead(req.user.id);
  }
}