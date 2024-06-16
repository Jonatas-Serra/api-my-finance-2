import { IsOptional, IsString, IsDateString } from 'class-validator'

export class GetTransactionsDto {
  @IsOptional()
  @IsDateString()
  startDate?: string

  @IsOptional()
  @IsDateString()
  endDate?: string

  @IsOptional()
  @IsString()
  type?: string
}
