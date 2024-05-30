import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Patch,
  UseGuards,
} from '@nestjs/common'
import { NotificationsService } from './notification.service'
import { JwtAuthGuard } from 'src/app/auth/guards/jwt-auth.guard'
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger'

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new notification' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string', example: 'userId123' },
        message: {
          type: 'string',
          example: 'Mensager of the notification',
        },
        accountId: {
          type: 'string',
          example: 'accountId123',
          nullable: true,
        },
      },
    },
  })
  @Post()
  create(
    @Body()
    body: {
      userId: string
      message: string
      accountId: string
    },
  ) {
    return this.notificationsService.create(
      body.userId,
      body.message,
      body.accountId,
    )
  }

  @ApiOperation({
    summary: 'Get all notifications by user ID',
  })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @Get(':userId')
  findAll(@Param('userId') userId: string) {
    return this.notificationsService.findAllByUserId(userId)
  }

  @ApiOperation({ summary: 'Mark a notification as read' })
  @ApiParam({ name: 'id', description: 'Notification ID' })
  @Patch(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id)
  }
}
