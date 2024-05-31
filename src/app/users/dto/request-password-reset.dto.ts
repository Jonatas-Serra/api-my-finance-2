import { IsEmail, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class RequestPasswordResetDto {
  @ApiProperty({
    example: 'user@email.com',
    description: 'Email address of the user',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string
}
