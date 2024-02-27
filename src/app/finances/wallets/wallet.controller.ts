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
import { WalletService } from './wallet.service'
import { CreateWalletDto } from './dto/create-wallet.dto'
import { UpdateWalletDto } from './dto/update-wallet.dto'
import { JwtAuthGuard } from 'src/app/auth/guards/jwt-auth.guard'

@Controller('wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createWalletDto: CreateWalletDto) {
    const createdBy = createWalletDto.createdBy
    return this.walletService.create(createWalletDto, createdBy)
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:creatorId')
  findAll(@Param('creatorId') creatorId: string) {
    return this.walletService.findAll(creatorId)
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.walletService.findOne(id)
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWalletDto: UpdateWalletDto,
  ) {
    return this.walletService.update(id, updateWalletDto)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.walletService.remove(id)
  }
}
