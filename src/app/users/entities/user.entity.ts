import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { CategoriesUtil } from 'src/config/categories.util'

export type UserDocument = User & Document

@Schema({ autoIndex: true, timestamps: true })
export class User {
  _id: string

  @Prop({ required: true })
  name: string

  @Prop({ required: true, unique: true })
  email: string

  @Prop({ required: true })
  password: string

  @Prop()
  resetPasswordToken?: string

  @Prop()
  resetPasswordExpires?: Date

  @Prop({ required: true })
  phone: string

  @Prop()
  photo: string

  @Prop({ default: true })
  isActive: boolean

  @Prop()
  lastLogin: Date

  @Prop({ default: 0 })
  loginAttempts: number

  @Prop()
  createdAt: Date

  @Prop()
  updatedAt: Date

  @Prop({
    type: [String],
    default: CategoriesUtil.getDefaultCategories(),
  })
  categories: string[]
}

export const UserSchema = SchemaFactory.createForClass(User)

UserSchema.pre<UserDocument>('save', function (next) {
  const now = new Date()
  this.updatedAt = now
  if (!this.createdAt) {
    this.createdAt = now
  }
  next()
})

UserSchema.methods.incLoginAttempts = function () {
  this.loginAttempts += 1
  return this.save()
}

UserSchema.methods.resetLoginAttempts = function () {
  this.loginAttempts = 0
  return this.save()
}

UserSchema.methods.lockAccount = function () {
  this.lockUntil = new Date(Date.now() + 15 * 60 * 1000)
  return this.save()
}

UserSchema.methods.isAccountLocked = function () {
  return this.lockUntil && this.lockUntil > new Date()
}
