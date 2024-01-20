import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'

export class UpdateWalletDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name?: string

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  balance?: number

  @IsOptional()
  @IsString()
  currency?: string
}
