import {
  IsOptional,
  IsString,
  IsEmail,
  IsPhoneNumber,
} from 'class-validator'

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsEmail()
  email?: string

  @IsOptional()
  @IsString()
  password?: string

  @IsOptional()
  @IsPhoneNumber('BR', { message: 'Invalid phone number' })
  phone?: string

  @IsOptional()
  @IsString()
  photo?: string
}
