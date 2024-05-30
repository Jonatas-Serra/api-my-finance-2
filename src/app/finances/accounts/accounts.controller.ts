import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
} from '@nestjs/common'
import {
  ApiTags,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger'
import { AccountsService } from './accounts.service'
import { CreateAccountDto } from './dto/create-account.dto'
import { UpdateAccountDto } from './dto/update-account.dto'
import { Account } from './entities/account.entity'
import { JwtAuthGuard } from 'src/app/auth/guards/jwt-auth.guard'

interface AccountWithId extends Account {
  _id: any
}

@ApiTags('accounts')
@ApiBearerAuth()
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new account' })
  @ApiBody({ type: CreateAccountDto })
  @ApiResponse({
    status: 201,
    description: 'The account has been successfully created.',
  })
  create(@Body() createAccountDto: CreateAccountDto) {
    const createdBy = createAccountDto.createdBy
    if (createAccountDto.repeat) {
      return this.accountsService.createRecurringAccounts(
        createAccountDto,
        createdBy,
      )
    } else {
      return this.accountsService.create(createAccountDto, createdBy)
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get an account by ID' })
  @ApiParam({
    name: 'id',
    description: 'ID of the account to retrieve',
  })
  @ApiResponse({
    status: 200,
    description: 'The account has been successfully retrieved.',
  })
  findOne(@Param('id') id: string) {
    return this.accountsService.findOne(id)
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:creatorId')
  @ApiOperation({ summary: 'Get all accounts for a user' })
  @ApiParam({
    name: 'creatorId',
    description: 'ID of the user to retrieve accounts for',
  })
  @ApiResponse({
    status: 200,
    description: 'The accounts have been successfully retrieved.',
  })
  async findAll(@Param('creatorId') creatorId: string) {
    const accounts = await this.accountsService.findAll(creatorId)
    const uniqueAccounts: Record<string, AccountWithId> = {}
    accounts.forEach((account: AccountWithId) => {
      const { _id, ...rest } = account
      uniqueAccounts[_id] = { _id, ...rest }
    })
    const simplifiedAccounts = Object.values(uniqueAccounts)
    return simplifiedAccounts
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update an account' })
  @ApiParam({
    name: 'id',
    description: 'ID of the account to update',
  })
  @ApiBody({ type: UpdateAccountDto })
  @ApiResponse({
    status: 200,
    description: 'The account has been successfully updated.',
  })
  update(
    @Param('id') id: string,
    @Body() updateAccountDto: UpdateAccountDto,
  ) {
    return this.accountsService.update(id, updateAccountDto)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete an account' })
  @ApiParam({
    name: 'id',
    description: 'ID of the account to delete',
  })
  @ApiResponse({
    status: 200,
    description: 'The account has been successfully deleted.',
  })
  remove(@Param('id') id: string) {
    return this.accountsService.remove(id)
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/pay')
  @ApiOperation({ summary: 'Pay an account' })
  @ApiParam({ name: 'id', description: 'ID of the account to pay' })
  @ApiBody({
    description: 'Wallet ID and payday information',
    schema: {
      type: 'object',
      properties: {
        walletId: { type: 'string' },
        payday: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The account has been successfully paid.',
  })
  pay(@Param('id') id: string, @Body() requestBody: any) {
    const { walletId, payday } = requestBody
    return this.accountsService.pay(id, walletId, payday)
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/underPay')
  @ApiOperation({ summary: 'Mark an account as underpaid' })
  @ApiParam({
    name: 'id',
    description: 'ID of the account to mark as underpaid',
  })
  @ApiResponse({
    status: 200,
    description:
      'The account has been successfully marked as underpaid.',
  })
  underPay(@Param('id') id: string) {
    return this.accountsService.underPaidAccounts(id)
  }
}
