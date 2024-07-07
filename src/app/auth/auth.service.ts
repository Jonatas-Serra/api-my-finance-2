import { Injectable } from '@nestjs/common'
import { UsersService } from '../users/users.service'
import { MailService } from '../mail/mail.service'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import AppError from 'src/shared/errors/AppError'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User, UserDocument } from '../users/entities/user.entity'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async login(user: any) {
    const payload = { email: user.email, sub: user._id }
    const userLogged = {
      email: user.email,
      name: user.name,
      _id: user._id,
    }
    return {
      user: userLogged,
      token: this.jwtService.sign(payload),
    }
  }

  async validate(email: string, password: string) {
    let user: User

    try {
      user = await this.usersService.findOne(email)
    } catch (error) {
      return null
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password,
    )

    if (!isPasswordValid) {
      return null
    }
    return user
  }

  async checkToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      })

      return payload
    } catch (error) {
      throw new AppError('Expired or invalid token')
    }
  }

  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.usersService.findOne(email)
    if (!user) {
      throw new Error('User not found')
    }

    const payload = { email: user.email.toString() }
    const token = this.jwtService.sign(payload, { expiresIn: '15m' })

    await this.userModel.findByIdAndUpdate(user._id, {
      resetPasswordToken: token,
      resetPasswordExpires: new Date(Date.now() + 15 * 60 * 1000),
    })

    await this.mailService.sendPasswordResetToken(user.email, token)
  }

  async validatePasswordResetToken(token: string): Promise<boolean> {
    try {
      const decoded = this.jwtService.verify(token)
      const user = await this.usersService.findOne(decoded.email)

      if (!user || user.resetPasswordToken !== token) {
        throw new AppError('Invalid token', 400)
      }

      if (user.resetPasswordExpires < new Date()) {
        throw new AppError('Expired token', 401)
      }

      return true
    } catch (e) {
      if (e.message === 'Expired token') {
        throw new AppError('Expired token', 401)
      } else {
        throw new AppError('Invalid token', 400)
      }
    }
  }

  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<void> {
    let decoded
    try {
      decoded = this.jwtService.verify(token)
    } catch (e) {
      throw new AppError('Invalid or expired token', 400)
    }

    const user = await this.usersService.findOne(decoded.email)

    if (!user) {
      throw new Error('User not found')
    }

    if (user.resetPasswordToken !== token) {
      throw new AppError('Token already used', 400)
    }

    if (user.resetPasswordExpires < new Date()) {
      throw new AppError('Expired token', 401)
    }

    await this.usersService.updatePassword(user._id, newPassword)
    await this.userModel.findByIdAndUpdate(user._id, {
      resetPasswordToken: null,
      resetPasswordExpires: null,
    })
  }
}
