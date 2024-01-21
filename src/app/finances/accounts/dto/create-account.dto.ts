import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsOptional,
  IsDate,
} from 'class-validator'

export class CreateAccountDto {
  @IsNotEmpty()
  @IsEnum(['receivable', 'payable'])
  type: string

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  value: number

  @IsNotEmpty()
  @IsDate()
  dueDate: Date

  @IsNotEmpty()
  @IsDate()
  issueDate: Date

  @IsOptional()
  @IsString()
  documentNumber: string

  @IsNotEmpty()
  @IsString()
  category: string

  @IsNotEmpty()
  @IsString()
  documentType: string

  @IsOptional()
  @IsString()
  description: string

  @IsNotEmpty()
  @IsString()
  payeeOrPayer: string

  @IsOptional()
  @IsNumber()
  repeat: number

  @IsNotEmpty()
  @IsString()
  createdBy: string

  @IsNotEmpty()
  @IsNumber()
  repeatInterval: number

  @IsNotEmpty()
  @IsString()
  walletId: string
}
