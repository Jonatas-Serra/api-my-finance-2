import {
  IsEnum,
  IsNumber,
  IsPositive,
  IsString,
  IsOptional,
  IsNotEmpty,
} from 'class-validator'

export class UpdateAccountDto {
  @IsNotEmpty()
  @IsEnum(['receivable', 'payable'])
  type: string

  @IsNotEmpty()
  @IsString()
  walletId: string

  @IsOptional()
  @IsNumber()
  @IsPositive()
  value: number

  @IsOptional()
  @IsString()
  dueDate: Date

  @IsOptional()
  @IsString()
  issueDate: Date

  @IsOptional()
  @IsString()
  documentNumber: string

  @IsOptional()
  @IsString()
  category: string

  @IsOptional()
  @IsString()
  documentType: string

  @IsOptional()
  @IsString()
  description: string

  @IsOptional()
  @IsString()
  payeeOrPayer: string

  @IsOptional()
  @IsNumber()
  repeat: number

  @IsOptional()
  @IsString()
  status: string

  @IsNotEmpty()
  @IsNumber()
  repeatInterval: number
}
