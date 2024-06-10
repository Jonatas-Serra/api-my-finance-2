import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import {
  Notification,
  NotificationDocument,
} from './entities/notification.entity'

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,
  ) {}

  async create(
    userId: string,
    message: string,
    accountId: string,
  ): Promise<Notification> {
    try {
      const notification = new this.notificationModel({
        userId,
        message,
        accountId,
        read: false,
      })
      return await notification.save()
    } catch (error) {
      throw error
    }
  }

  async findByAccountId(
    accountId: string,
  ): Promise<Notification | null> {
    try {
      return await this.notificationModel
        .findOne({ accountId })
        .exec()
    } catch (error) {
      throw error
    }
  }

  async markAsRead(_id: string): Promise<Notification> {
    try {
      const notification = await this.notificationModel
        .findById(_id)
        .exec()
      if (!notification) {
        throw new Error('Notification not found')
      }
      notification.read = true
      return await notification.save()
    } catch (error) {
      throw error
    }
  }

  async markAllAsRead(userId: string): Promise<Notification[]> {
    try {
      const notifications = await this.notificationModel
        .find({ userId })
        .exec()
      notifications.forEach((notification) => {
        notification.read = true
      })
      return await Promise.all(
        notifications.map((notification) => notification.save()),
      )
    } catch (error) {
      throw error
    }
  }

  async findAllByUserId(userId: string): Promise<Notification[]> {
    try {
      return await this.notificationModel.find({ userId }).exec()
    } catch (error) {
      console.error(
        `Error finding notifications for user ${userId}:`,
        error,
      )
      throw error
    }
  }
}
