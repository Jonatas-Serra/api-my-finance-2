import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Patch,
} from '@nestjs/common'
import { TransactionService } from './transactions.service'
import { CreateTransactionDto } from './dto/create-transaction.dto'
import { UpdateTransactionDto } from './dto/update-transaction.dto'
import { JwtAuthGuard } from 'src/app/auth/guards/jwt-auth.guard'
import {
  ApiTags,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger'

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBody({ type: CreateTransactionDto })
  @ApiResponse({
    status: 201,
    description: 'The transaction has been successfully created.',
  })
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.create(createTransactionDto)
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':creatorId')
  @ApiParam({
    name: 'creatorId',
    description: 'ID of the creator/user',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns all transactions for the specified user.',
  })
  findAll(@Param('creatorId') creatorId: string) {
    return this.transactionsService.findAll(creatorId)
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
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

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
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
