import {
  IsEnum,
  IsNumber,
  IsPositive,
  IsString,
  IsOptional,
  IsNotEmpty,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
export class UpdateAccountDto {
  @ApiProperty({
    enum: ['receivable', 'payable'],
    description: 'Type of the account (receivable or payable).',
  })
  @IsNotEmpty()
  @IsEnum(['receivable', 'payable'])
  type: string

  @ApiProperty({
    description: 'ID of the wallet associated with this account.',
  })
  @IsNotEmpty()
  @IsString()
  walletId: string

  @ApiProperty({
    description: 'Value of the account.',
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  value: number

  @ApiProperty({
    description: 'Due date of the account.',
  })
  @IsOptional()
  @IsString()
  dueDate: Date

  @ApiProperty({
    description: 'Issue date of the account.',
  })
  @IsOptional()
  @IsString()
  issueDate: Date

  @ApiProperty({
    description: 'Document number of the account.',
  })
  @IsOptional()
  @IsString()
  documentNumber: string

  @ApiProperty({
    description: 'Category of the account.',
  })
  @IsOptional()
  @IsString()
  category: string

  @ApiProperty({
    description: 'Document type of the account.',
  })
  @IsOptional()
  @IsString()
  documentType: string

  @ApiProperty({
    description: 'Description of the account.',
  })
  @IsOptional()
  @IsString()
  description: string

  @ApiProperty({
    description: 'Payee or payer of the account.',
  })
  @IsOptional()
  @IsString()
  payeeOrPayer: string

  @ApiProperty({
    description: 'Repeat of the account.',
  })
  @IsOptional()
  @IsNumber()
  repeat: number

  @ApiProperty({
    description: 'Status of the account.',
  })
  @IsOptional()
  @IsString()
  status: string

  @ApiProperty({
    description: 'Repeat interval of the account.',
  })
  @IsNotEmpty()
  @IsNumber()
  repeatInterval: number
}
