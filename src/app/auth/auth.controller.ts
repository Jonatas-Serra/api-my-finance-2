import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport/dist'
import { AuthService } from './auth.service'
import { IsPublic } from './decorators/is-public.decorator'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() req: any) {
    const user = req.user
    return this.authService.login(user)
  }

  @IsPublic()
  @Post('check')
  async checkToken(@Body('token') token: string) {
    return this.authService.checkToken(token)
  }
}
