import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema()
export class Notification extends Document {
  @Prop({ required: true })
  userId: string

  @Prop({ required: true })
  message: string

  @Prop({ required: true })
  read: boolean

  @Prop({ default: Date.now })
  createdAt: Date
}

export const NotificationSchema =
  SchemaFactory.createForClass(Notification)
