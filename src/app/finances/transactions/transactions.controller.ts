import { Controller, Get, Post, Body, Param } from '@nestjs/common'
import { TransactionService } from './transactions.service'
import { CreateTransactionDto } from './dto/create-transaction.dto'

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionService,
  ) {}

  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.create(createTransactionDto)
  }

  @Get(':creatorId')
  findAll(@Param('creatorId') creatorId: string) {
    return this.transactionsService.findAll(creatorId)
  }
}
