import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type TransactionDocument = Transaction & Document

@Schema({
  autoIndex: true,
  toJSON: { virtuals: true },
  versionKey: false,
})
export class Transaction {
  @Prop({ required: true, enum: ['Deposit', 'Withdrawal'] })
  type: string

  @Prop({ required: true })
  amount: number

  @Prop({ required: true })
  date: Date

  @Prop()
  description: string

  @Prop({ required: true })
  category: string

  @Prop({ required: true })
  createdBy: string

  @Prop({ required: true })
  walletId: string

  @Prop()
  createdAt: Date

  @Prop()
  updatedAt: Date
}

export const TransactionSchema =
  SchemaFactory.createForClass(Transaction)

TransactionSchema.pre<TransactionDocument>('save', function (next) {
  const now = new Date()
  this.updatedAt = now
  if (!this.createdAt) {
    this.createdAt = now
  }
  next()
})
