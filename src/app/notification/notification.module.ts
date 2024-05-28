import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { NotificationsController } from './notification.controller'
import { NotificationsService } from './notification.service'
import {
  Notification,
  NotificationSchema,
} from './entities/notification.entity'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationModule {}
