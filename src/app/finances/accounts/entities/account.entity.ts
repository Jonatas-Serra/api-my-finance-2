import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type AccountDocument = Account & Document

@Schema({
  autoIndex: true,
  toJSON: { virtuals: true },
  versionKey: false,
})
export class Account {
  [x: string]: any
  @Prop({ required: true, enum: ['receivable', 'payable'] })
  type: string

  @Prop({ required: true })
  value: number

  @Prop({ required: true })
  dueDate: Date

  @Prop({ required: true })
  issueDate: Date

  @Prop()
  documentNumber: string

  @Prop()
  category: string

  @Prop()
  documentType: string

  @Prop()
  description: string

  @Prop({ required: true })
  payeeOrPayer: string

  @Prop()
  repeat: number

  @Prop()
  repeatInterval: number

  @Prop({ default: false })
  isPaid: boolean

  @Prop({ required: true, enum: ['Paid', 'Pending', 'Late'] })
  status: string

  @Prop()
  discount: number

  @Prop()
  createdBy: string

  @Prop()
  createdAt: Date

  @Prop()
  payday: Date

  @Prop()
  updatedAt: Date

  @Prop()
  walletId: string
}

export const AccountSchema = SchemaFactory.createForClass(Account)

AccountSchema.pre<AccountDocument>('save', function (next) {
  const now = new Date()
  this.updatedAt = now
  if (!this.createdAt) {
    this.createdAt = now
  }
  next()
})
