import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateWalletDto {
  @ApiProperty({ description: 'The updated name of the wallet' })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name?: string

  @ApiProperty({ description: 'The updated balance of the wallet' })
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  balance?: number

  @ApiProperty({ description: 'The updated currency of the wallet' })
  @IsOptional()
  @IsString()
  currency?: string
}
