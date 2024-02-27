import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsArray,
} from 'class-validator'
import { Transaction } from 'src/app/finances/transactions/entities/transaction.entity'

export class CreateWalletDto {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsString()
  createdBy: string

  @IsNotEmpty()
  @IsNumber()
  balance: number

  @IsNotEmpty()
  @IsNumber()
  initialBalance: number

  @IsString()
  currency?: string

  @IsArray()
  transactions?: Transaction[]
}
