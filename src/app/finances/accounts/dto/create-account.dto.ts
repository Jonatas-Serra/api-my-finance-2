import { ApiProperty } from '@nestjs/swagger'
import {
  IsEnum,
  IsNumber,
  IsPositive,
  IsString,
  IsOptional,
  IsNotEmpty,
} from 'class-validator'

export class CreateAccountDto {
  @ApiProperty({
    enum: ['receivable', 'payable'],
    description: 'Type of the account (receivable or payable).',
  })
  @IsNotEmpty()
  @IsEnum(['receivable', 'payable'])
  type: string

  @ApiProperty({
    description: 'Value of the account.',
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  value: number

  @ApiProperty({
    description: 'Due date of the account.',
  })
  @IsNotEmpty()
  @IsString()
  dueDate: Date

  @ApiProperty({
    description: 'Issue date of the account.',
  })
  @IsNotEmpty()
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
  @IsNotEmpty()
  @IsString()
  category: string

  @ApiProperty({
    description: 'Document type of the account.',
  })
  @IsNotEmpty()
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
  @IsNotEmpty()
  @IsString()
  payeeOrPayer: string

  @ApiProperty({
    description: 'Repeat of the account.',
  })
  @IsOptional()
  @IsNumber()
  repeat: number

  @ApiProperty({
    description: 'ID of the user who created the account.',
  })
  @IsNotEmpty()
  @IsString()
  createdBy: string

  @ApiProperty({
    description: 'Repeat interval of the account.',
  })
  @IsNotEmpty()
  @IsNumber()
  repeatInterval: number

  @ApiProperty({
    description: 'Status of the account.',
  })
  @IsNotEmpty()
  @IsString()
  status: string

  @ApiProperty({
    description: 'ID of the wallet associated with this account.',
  })
  @IsNotEmpty()
  @IsString()
  walletId: string
}
