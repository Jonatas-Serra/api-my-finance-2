import { User } from '../users/entities/user.entity'
import { Injectable } from '@nestjs/common'
import { UsersService } from '../users/users.service'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import AppError from 'src/shared/errors/AppError'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
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
}
