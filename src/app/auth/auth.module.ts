import { ConfigModule } from '@nestjs/config'
import { forwardRef, Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { LocalStrategy } from './strategies/local.strategy'
import { UserStrategy } from './strategies/user.strategy'
import { UsersModule } from '../users/users.module'
import { JwtStrategy } from './strategies/jwt.strategy'
import { MailModule } from '../mail/mail.module'

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    forwardRef(() => MailModule),
    forwardRef(() => UsersModule),
  ],
  providers: [AuthService, LocalStrategy, UserStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
