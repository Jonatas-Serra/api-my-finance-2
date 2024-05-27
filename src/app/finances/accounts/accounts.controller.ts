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
  @ApiBody({ type: CreateAccountDto })
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
  @ApiParam({
    name: 'id',
    description: 'ID of the account to retrieve',
  })
  findOne(@Param('id') id: string) {
    return this.accountsService.findOne(id)
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:creatorId')
  @ApiParam({
    name: 'creatorId',
    description: 'ID of the user to retrieve accounts for',
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
  @ApiParam({
    name: 'id',
    description: 'ID of the account to update',
  })
  @ApiBody({ type: UpdateAccountDto })
  update(
    @Param('id') id: string,
    @Body() updateAccountDto: UpdateAccountDto,
  ) {
    return this.accountsService.update(id, updateAccountDto)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiParam({
    name: 'id',
    description: 'ID of the account to delete',
  })
  remove(@Param('id') id: string) {
    return this.accountsService.remove(id)
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/pay')
  @ApiParam({ name: 'id', description: 'ID of the account to pay' })
  @ApiBody({
    description: 'Wallet ID and payday information',
    type: Object,
  })
  pay(@Param('id') id: string, @Body() requestBody: any) {
    const { walletId, payday } = requestBody
    return this.accountsService.pay(id, walletId, payday)
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/underPay')
  @ApiParam({
    name: 'id',
    description: 'ID of the account to mark as underpaid',
  })
  underPay(@Param('id') id: string) {
    return this.accountsService.underPaidAccounts(id)
  }
}
