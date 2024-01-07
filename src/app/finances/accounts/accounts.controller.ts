import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Patch,
} from '@nestjs/common'
import { AccountsService } from './accounts.service'
import { CreateAccountDto } from './dto/create-account.dto'
import { UpdateAccountDto } from './dto/update-account.dto'

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  create(@Body() createAccountDto: CreateAccountDto) {
    const createdBy = createAccountDto.createdBy
    return this.accountsService.create(createAccountDto, createdBy)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accountsService.findOne(id)
  }

  @Get('user/:creatorId')
  async findAll(@Param('creatorId') creatorId: string) {
    const accounts = this.accountsService.findAll(creatorId)

    const simplifiedAccounts = (await accounts).map((account) => ({
      id: account._id,
      type: account.type,
      value: account.value,
      dueDate: account.dueDate,
      issueDate: account.issueDate,
      documentNumber: account.documentNumber,
      category: account.category,
      documentType: account.documentType,
      description: account.description,
      payeeOrPayer: account.payeeOrPayer,
      repeat: account.repeat,
      repeatInterval: account.repeatInterval,
      isPaid: account.isPaid,
      status: account.status,
      discount: account.discount,
      createdBy: account.createdBy,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    }))

    return simplifiedAccounts
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAccountDto: UpdateAccountDto,
  ) {
    return this.accountsService.update(id, updateAccountDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accountsService.remove(id)
  }

  @Patch(':id/pay')
  pay(@Param('id') id: string, @Body('discount') discount: number) {
    return this.accountsService.pay(id, discount)
  }
}
