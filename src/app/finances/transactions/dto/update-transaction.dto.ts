import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsDate,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateTransactionDto {
  @ApiProperty({ description: 'Type of the transaction' })
  @IsNotEmpty()
  @IsString()
  type: string

  @ApiProperty({ description: 'Amount of the transaction' })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount: number

  @ApiProperty({ description: 'Date of the transaction' })
  @IsNotEmpty()
  @IsDate()
  date: Date

  @ApiProperty({ description: 'Description of the transaction' })
  @IsNotEmpty()
  @IsString()
  description: string

  @ApiProperty({ description: 'Category of the transaction' })
  @IsNotEmpty()
  @IsString()
  category: string

  @ApiProperty({
    description: 'ID of the user who created the transaction',
  })
  @IsNotEmpty()
  @IsString()
  createdBy: string

  @ApiProperty({
    description: 'ID of the wallet related to the transaction',
  })
  @IsNotEmpty()
  @IsString()
  walletId: string
}
