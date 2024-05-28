import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Notification } from './entities/notification.entity'

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<Notification>,
  ) {}

  async create(
    userId: string,
    message: string,
  ): Promise<Notification> {
    const notification = new this.notificationModel({
      userId,
      message,
      read: false,
    })
    return notification.save()
  }

  async findAll(userId: string): Promise<Notification[]> {
    return this.notificationModel.find({ userId })
  }

  async markAsRead(notificationId: string): Promise<Notification> {
    return this.notificationModel.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true },
    )
  }
}
