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
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger'

@ApiTags('wallets')
@ApiBearerAuth()
@Controller('wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new wallet' })
  @ApiBody({ type: CreateWalletDto })
  @ApiResponse({
    status: 201,
    description: 'The wallet has been successfully created.',
  })
  create(@Body() createWalletDto: CreateWalletDto) {
    const createdBy = createWalletDto.createdBy
    return this.walletService.create(createWalletDto, createdBy)
  }

  @UseGuards(JwtAuthGuard)
  @Post('transfer')
  @ApiOperation({ summary: 'Transfer between wallets' })
  @ApiBody({
    description: 'Transfer details',
    schema: {
      type: 'object',
      properties: {
        sourceWalletId: { type: 'string' },
        targetWalletId: { type: 'string' },
        amount: { type: 'number' },
        description: { type: 'string' },
        createdBy: { type: 'string' },
        date: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The transfer has been successfully processed.',
  })
  transferBetweenWallets(
    @Body('sourceWalletId') sourceWalletId: string,
    @Body('targetWalletId') targetWalletId: string,
    @Body('amount') amount: number,
    @Body('description') description: string,
    @Body('createdBy') createdBy: string,
    @Body('date') date: Date,
  ) {
    return this.walletService.transferBetweenWallets(
      sourceWalletId,
      targetWalletId,
      amount,
      description,
      createdBy,
      date,
    )
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:creatorId')
  @ApiOperation({ summary: 'Get all wallets for a user' })
  @ApiParam({
    name: 'creatorId',
    description: 'ID of the user to retrieve wallets for',
  })
  @ApiResponse({
    status: 200,
    description: 'The wallets have been successfully retrieved.',
  })
  findAll(@Param('creatorId') creatorId: string) {
    return this.walletService.findAll(creatorId)
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a wallet by ID' })
  @ApiParam({
    name: 'id',
    description: 'ID of the wallet to retrieve',
  })
  @ApiResponse({
    status: 200,
    description: 'The wallet has been successfully retrieved.',
  })
  findOne(@Param('id') id: string) {
    return this.walletService.findOne(id)
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a wallet' })
  @ApiParam({
    name: 'id',
    description: 'ID of the wallet to update',
  })
  @ApiBody({ type: UpdateWalletDto })
  @ApiResponse({
    status: 200,
    description: 'The wallet has been successfully updated.',
  })
  update(
    @Param('id') id: string,
    @Body() updateWalletDto: UpdateWalletDto,
  ) {
    return this.walletService.update(id, updateWalletDto)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a wallet' })
  @ApiParam({
    name: 'id',
    description: 'ID of the wallet to delete',
  })
  @ApiResponse({
    status: 200,
    description: 'The wallet has been successfully deleted.',
  })
  remove(@Param('id') id: string) {
    return this.walletService.remove(id)
  }
}
