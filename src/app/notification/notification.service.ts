import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Notification } from './entities/notification.entity'

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
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
      const savedNotification = await notification.save()

      return savedNotification
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

  async markAsRead(id: string): Promise<Notification> {
    try {
      const notification = await this.notificationModel
        .findById(id)
        .exec()
      if (!notification) {
        throw new Error('Notification not found')
      }
      notification.read = true
      const savedNotification = await notification.save()
      return savedNotification
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
