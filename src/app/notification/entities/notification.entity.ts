import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { ApiProperty } from '@nestjs/swagger'

export type NotificationDocument = Notification & Document

@Schema()
export class Notification {
  @ApiProperty({ example: 'userId123', description: 'User ID' })
  @Prop({ required: true })
  userId: string

  @ApiProperty({
    example: 'Notification message',
    description: 'Notification message',
  })
  @Prop({ required: true })
  message: string

  @ApiProperty({ example: false, description: 'Reading status' })
  @Prop({ required: true })
  read: boolean

  @ApiProperty({
    example: 'accountId123',
    description: 'Account ID',
    nullable: true,
  })
  @Prop({ default: null })
  accountId: string

  @ApiProperty({
    example: new Date(),
    description: 'Reading date',
    nullable: true,
  })
  @Prop({ default: null })
  readAt: Date

  @ApiProperty({
    example: new Date(),
    description: 'Creation date',
  })
  @Prop({ default: Date.now })
  createdAt: Date

  constructor(notification?: Partial<Notification>) {
    this.userId = notification?.userId
    this.message = notification?.message
    this.read = notification?.read
    this.accountId = notification?.accountId
    this.readAt = notification?.readAt
    this.createdAt = notification?.createdAt
  }
}

export const NotificationSchema =
  SchemaFactory.createForClass(Notification)
