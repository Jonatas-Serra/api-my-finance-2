import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { Transaction } from '../../transactions/entities/transaction.entity'

export type WalletDocument = Wallet & Document

@Schema({ autoIndex: true })
export class Wallet {
  @Prop({ required: true })
  createdBy: string

  @Prop({ required: true, unique: true })
  name: string

  @Prop({ required: true })
  balance: number

  @Prop()
  currency: string

  @Prop({ default: [] })
  transactions: Transaction[]

  @Prop({ default: Date.now })
  createdAt: Date

  @Prop()
  updatedAt: Date
}

export const WalletSchema = SchemaFactory.createForClass(Wallet)

WalletSchema.pre<WalletDocument>('save', function (next) {
  const now = new Date()
  this.updatedAt = now
  if (!this.createdAt) {
    this.createdAt = now
  }
  next()
})
