import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common'
import { UserLoginDto } from '../users/dto/user-login.dto'
import { RequestPasswordResetDto } from '../users/dto/request-password-reset.dto'
import { ResetPasswordDto } from '../users/dto/reset-password.dto'
import {
  ApiTags,
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiQuery,
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

  @IsPublic()
  @Post('request-password-reset')
  @ApiOperation({ summary: 'Request password reset' })
  @ApiBody({ description: 'User email', required: true })
  @ApiResponse({
    status: 200,
    description: 'Password reset requested',
  })
  async requestPasswordReset(
    @Body() requestPasswordResetDto: RequestPasswordResetDto,
  ): Promise<void> {
    return this.authService.requestPasswordReset(
      requestPasswordResetDto.email,
    )
  }

  @IsPublic()
  @Get('validate-password-reset-token')
  @ApiOperation({ summary: 'Validate password reset token' })
  @ApiQuery({ name: 'token', required: true, type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Token is valid',
  })
  async validatePasswordResetToken(
    @Query('token') token: string,
  ): Promise<boolean> {
    return this.authService.validatePasswordResetToken(token)
  }

  @IsPublic()
  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password' })
  @ApiBody({
    description: 'Token and new password',
    type: ResetPasswordDto,
  })
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<void> {
    return this.authService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.newPassword,
    )
  }
}
