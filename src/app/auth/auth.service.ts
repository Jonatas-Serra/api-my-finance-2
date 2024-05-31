import { User } from '../users/entities/user.entity'
import { Injectable } from '@nestjs/common'
import { UsersService } from '../users/users.service'
import { MailService } from '../mail/mail.service'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import AppError from 'src/shared/errors/AppError'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
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
    const token = this.jwtService.sign(payload, { expiresIn: '1h' })

    await this.mailService.sendPasswordResetToken(user.email, token)
  }

  async validatePasswordResetToken(token: string): Promise<boolean> {
    try {
      const decoded = this.jwtService.verify(token)
      return !!decoded
    } catch (e) {
      return false
    }
  }

  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<void> {
    const decoded = this.jwtService.verify(token)
    const user = await this.usersService.findOne(decoded.email)

    console.log('newPassword', newPassword)
    if (!user) {
      throw new Error('User not found')
    }

    await this.usersService.updatePassword(user._id, newPassword)
  }
}
