import { IsOptional, IsString, IsDateString } from 'class-validator'

export class GetAccountDto {
  @IsOptional()
  @IsDateString()
  startDate?: string

  @IsOptional()
  @IsDateString()
  endDate?: string

  @IsOptional()
  @IsString()
  status?: string[]
}
