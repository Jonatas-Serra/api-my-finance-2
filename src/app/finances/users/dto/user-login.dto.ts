import { IsEmail, IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UserLoginDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: 'User email',
    example: 'user@example.com',
  })
  email: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'User password',
    example: 'Password123!',
  })
  password: string
}
