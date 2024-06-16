import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Delete,
  UseGuards,
  Patch,
} from '@nestjs/common'
import { TransactionService } from './transactions.service'
import { CreateTransactionDto } from './dto/create-transaction.dto'
import { UpdateTransactionDto } from './dto/update-transaction.dto'
import { GetTransactionsDto } from './dto/get-transaction.dto'
import { JwtAuthGuard } from 'src/app/auth/guards/jwt-auth.guard'
import {
  ApiTags,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger'

@ApiTags('transactions')
@ApiBearerAuth()
@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiBody({ type: CreateTransactionDto })
  @ApiResponse({
    status: 201,
    description: 'The transaction has been successfully created.',
  })
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.create(createTransactionDto)
  }

  @UseGuards(JwtAuthGuard)
  @Get(':creatorId')
  @ApiOperation({ summary: 'Get all transactions for a user' })
  @ApiParam({
    name: 'creatorId',
    description: 'ID of the creator/user',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns all transactions for the specified user.',
  })
  async getTransactions(
    @Param('creatorId') userId: string,
    @Query() query: GetTransactionsDto,
  ) {
    const { startDate, endDate, type } = query
    return this.transactionsService.findTransactions(
      userId,
      startDate,
      endDate,
      type,
    )
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a transaction' })
  @ApiParam({
    name: 'id',
    description: 'ID of the transaction to update',
  })
  @ApiBody({ type: UpdateTransactionDto })
  @ApiResponse({
    status: 200,
    description: 'The transaction has been successfully updated.',
  })
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionsService.update(id, updateTransactionDto)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a transaction' })
  @ApiParam({
    name: 'id',
    description: 'ID of the transaction to delete',
  })
  @ApiResponse({
    status: 200,
    description: 'The transaction has been successfully deleted.',
  })
  remove(@Param('id') id: string) {
    return this.transactionsService.remove(id)
  }
}
