// create-user.dto.ts
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsOptional,
} from 'class-validator'

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @IsString()
  password: string

  @IsNotEmpty()
  @IsPhoneNumber('BR', { message: 'Invalid phone number' })
  phone: string

  @IsOptional()
  @IsString()
  photo?: string
}
