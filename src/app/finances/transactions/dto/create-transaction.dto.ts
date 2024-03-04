import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsDate,
} from 'class-validator'

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsString()
  type: string

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount: number

  @IsNotEmpty()
  @IsDate()
  date: Date

  @IsNotEmpty()
  @IsString()
  description: string

  @IsNotEmpty()
  @IsString()
  category: string

  @IsNotEmpty()
  @IsString()
  createdBy: string

  @IsString()
  walletId?: string

  @IsString()
  sourceWalletId: string

  @IsString()
  targetWalletId: string
}
