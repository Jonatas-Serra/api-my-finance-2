import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

export type WalletDocument = Wallet & Document

@Schema({
  autoIndex: true,
  toJSON: { virtuals: true },
  versionKey: false,
})
export class Wallet {
  _id: Types.ObjectId

  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  balance: number

  @Prop({ type: [Types.ObjectId], ref: 'Transaction' })
  transactions: Types.ObjectId[]

  @Prop({ required: true })
  createdBy: string

  @Prop({ default: 0 })
  initialBalance: number
}

export const WalletSchema = SchemaFactory.createForClass(Wallet)
