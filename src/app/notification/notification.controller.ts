import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Patch,
} from '@nestjs/common'
import { NotificationsService } from './notification.service'

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
  ) {}

  @Post()
  create(@Body() body: { userId: string; message: string }) {
    return this.notificationsService.create(body.userId, body.message)
  }

  @Get(':userId')
  findAll(@Param('userId') userId: string) {
    return this.notificationsService.findAll(userId)
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id)
  }
}
