import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common'
import { TransactionService } from './transactions.service'
import { CreateTransactionDto } from './dto/create-transaction.dto'
import { UpdateTransactionDto } from './dto/update-transaction.dto'

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

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionsService.update(id, updateTransactionDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionsService.remove(id)
  }
}
