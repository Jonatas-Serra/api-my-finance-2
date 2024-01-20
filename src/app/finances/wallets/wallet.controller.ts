import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common'
import { WalletService } from './wallet.service'
import { CreateWalletDto } from './dto/create-wallet.dto'
import { UpdateWalletDto } from './dto/update-wallet.dto'

@Controller('wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post()
  create(@Body() createWalletDto: CreateWalletDto) {
    const createdBy = createWalletDto.createdBy
    return this.walletService.create(createWalletDto, createdBy)
  }

  @Get('user/:creatorId')
  findAll(@Param('creatorId') creatorId: string) {
    return this.walletService.findAll(creatorId)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.walletService.findOne(id)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWalletDto: UpdateWalletDto,
  ) {
    return this.walletService.update(id, updateWalletDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.walletService.remove(id)
  }
}
