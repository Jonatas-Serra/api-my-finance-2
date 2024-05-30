import {
  IsOptional,
  IsString,
  IsEmail,
  IsPhoneNumber,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateUserDto {
  @ApiProperty({ description: 'Optional name of the user' })
  @IsOptional()
  @IsString()
  name?: string

  @ApiProperty({ description: 'Optional email address of the user' })
  @IsOptional()
  @IsEmail()
  email?: string

  @ApiProperty({ description: 'Optional password for the user' })
  @IsOptional()
  @IsString()
  password?: string

  @ApiProperty({ description: 'Optional phone number of the user' })
  @IsOptional()
  @IsPhoneNumber('BR', { message: 'Invalid phone number' })
  phone?: string

  @ApiProperty({ description: 'Optional photo URL of the user' })
  @IsOptional()
  @IsString()
  photo?: string
}
