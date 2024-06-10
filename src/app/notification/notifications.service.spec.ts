import { Test, TestingModule } from '@nestjs/testing'
import { getModelToken } from '@nestjs/mongoose'
import { NotificationsService } from './notification.service'
import {
  Notification,
  NotificationDocument,
} from './entities/notification.entity'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose, { Model } from 'mongoose'

describe('NotificationsService', () => {
  let service: NotificationsService
  let mongod: MongoMemoryServer
  let model: Model<NotificationDocument>

  beforeAll(async () => {
    mongod = new MongoMemoryServer()
    await mongod.start()
    const uri = mongod.getUri()
    await mongoose.connect(uri)

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        {
          provide: getModelToken(Notification.name),
          useValue: mongoose.model(
            Notification.name,
            new mongoose.Schema({
              userId: String,
              message: String,
              read: Boolean,
              accountId: String,
              readAt: Date,
              createdAt: { type: Date, default: Date.now },
            }),
          ),
        },
      ],
    }).compile()

    service = module.get<NotificationsService>(NotificationsService)
    model = module.get<Model<NotificationDocument>>(
      getModelToken(Notification.name),
    )
  })

  afterAll(async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    await mongod.stop()
  })

  beforeEach(async () => {
    await model.deleteMany({})
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('should create a new notification', async () => {
      const notificationData = {
        userId: 'user1',
        message: 'test message',
        accountId: 'account1',
      }
      const result = await service.create(
        notificationData.userId,
        notificationData.message,
        notificationData.accountId,
      )
      expect(result).toMatchObject(notificationData)
      expect(result.read).toBe(false)
    })
  })

  describe('findByAccountId', () => {
    it('should find a notification by accountId', async () => {
      const notificationData = {
        userId: 'user1',
        message: 'test message',
        accountId: 'account1',
      }
      const createdNotification = await model.create(notificationData)
      const result = await service.findByAccountId('account1')
      expect(result).toMatchObject(notificationData)
    })
  })

  describe('markAsRead', () => {
    it('should mark a notification as read', async () => {
      const notificationData = {
        userId: 'user1',
        message: 'test message',
        accountId: 'account1',
        read: false,
      }
      const createdNotification = await model.create(notificationData)
      const result = await service.markAsRead(
        createdNotification._id.toString(),
      )
      expect(result.read).toBe(true)
    })

    it('should throw an error when notification not found', async () => {
      await expect(
        service.markAsRead(new mongoose.Types.ObjectId().toString()),
      ).rejects.toThrow('Notification not found')
    })
  })

  describe('markAllAsRead', () => {
    it('should mark all notifications as read', async () => {
      const notificationsData = [
        {
          userId: 'user1',
          message: 'message1',
          accountId: 'account1',
          read: false,
        },
        {
          userId: 'user1',
          message: 'message2',
          accountId: 'account2',
          read: false,
        },
      ]
      await model.create(notificationsData)
      const result = await service.markAllAsRead('user1')
      expect(result).toHaveLength(2)
      result.forEach((notification) => {
        expect(notification.read).toBe(true)
      })
    })
  })

  describe('findAllByUserId', () => {
    it('should find all notifications by userId', async () => {
      const notificationsData = [
        {
          userId: 'user1',
          message: 'message1',
          accountId: 'account1',
          read: false,
        },
        {
          userId: 'user1',
          message: 'message2',
          accountId: 'account2',
          read: false,
        },
      ]
      await model.create(notificationsData)
      const result = await service.findAllByUserId('user1')
      expect(result).toHaveLength(2)
    })
  })
})
