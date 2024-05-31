import { IsNotEmpty, IsString, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class ResetPasswordDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    description: 'JWT token',
  })
  @IsNotEmpty()
  @IsString()
  token: string

  @ApiProperty({
    example: 'newpassword',
    description: 'New password',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  newPassword: string
}
