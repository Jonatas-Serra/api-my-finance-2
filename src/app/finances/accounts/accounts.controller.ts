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
import { AccountsService } from './accounts.service'
import { CreateAccountDto } from './dto/create-account.dto'
import { UpdateAccountDto } from './dto/update-account.dto'
import { Account } from './entities/account.entity'
import { JwtAuthGuard } from 'src/app/auth/guards/jwt-auth.guard'

interface AccountWithId extends Account {
  _id: any
}

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
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
  findOne(@Param('id') id: string) {
    return this.accountsService.findOne(id)
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:creatorId')
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
  update(
    @Param('id') id: string,
    @Body() updateAccountDto: UpdateAccountDto,
  ) {
    return this.accountsService.update(id, updateAccountDto)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accountsService.remove(id)
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/pay')
  pay(@Param('id') id: string, @Body('discount') discount: number) {
    return this.accountsService.pay(id, discount)
  }
}
