import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsDate,
} from 'class-validator'

export class UpdateTransactionDto {
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

  @IsNotEmpty()
  @IsString()
  walletId: string
}
