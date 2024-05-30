import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { UserLoginDto } from '../users/dto/user-login.dto'
import {
  ApiTags,
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport/dist'
import { AuthService } from './auth.service'
import { IsPublic } from './decorators/is-public.decorator'

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('user'))
  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiBearerAuth()
  @ApiBody({
    description: 'User email and password',
    type: UserLoginDto,
  })
  @ApiResponse({ status: 200, description: 'Login successful' })
  async login(@Req() req: any) {
    const user = req.user
    return this.authService.login(user)
  }

  @IsPublic()
  @Post('check')
  @ApiOperation({ summary: 'Check token validity' })
  @ApiBody({ description: 'Token', required: true })
  @ApiResponse({ status: 200, description: 'Token is valid' })
  async checkToken(@Body('token') token: string) {
    return this.authService.checkToken(token)
  }
}
