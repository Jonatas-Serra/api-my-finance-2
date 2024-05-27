import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsArray,
} from 'class-validator'
import { Transaction } from 'src/app/finances/transactions/entities/transaction.entity'
import { ApiProperty } from '@nestjs/swagger'

export class CreateWalletDto {
  @ApiProperty({ description: 'The name of the wallet' })
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty({
    description: 'The ID of the user who created the wallet',
  })
  @IsNotEmpty()
  @IsString()
  createdBy: string

  @ApiProperty({ description: 'The current balance of the wallet' })
  @IsNotEmpty()
  @IsNumber()
  balance: number

  @ApiProperty({ description: 'The initial balance of the wallet' })
  @IsNotEmpty()
  @IsNumber()
  initialBalance: number

  @ApiProperty({ description: 'The currency of the wallet' })
  @IsString()
  currency?: string

  @ApiProperty({
    description: 'Array of transactions associated with the wallet',
  })
  @IsArray()
  transactions?: Transaction[]
}
