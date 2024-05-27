import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsOptional,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateUserDto {
  @ApiProperty({ description: 'Name of the user' })
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty({ description: 'Email address of the user' })
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty({ description: 'Password for the user' })
  @IsNotEmpty()
  @IsString()
  password: string

  @ApiProperty({ description: 'Phone number of the user' })
  @IsNotEmpty()
  @IsPhoneNumber('BR', { message: 'Invalid phone number' })
  phone: string

  @ApiProperty({ description: 'Optional photo URL of the user' })
  @IsOptional()
  @IsString()
  photo?: string
}
