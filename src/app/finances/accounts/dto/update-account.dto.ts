import {
  IsEnum,
  IsNumber,
  IsPositive,
  IsString,
  IsOptional,
} from 'class-validator'

export class UpdateAccountDto {
  @IsOptional()
  @IsEnum(['receivable', 'payable'])
  type: string

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
}
