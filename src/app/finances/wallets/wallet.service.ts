import AppError from 'src/shared/errors/AppError'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Wallet, WalletDocument } from './entities/wallet.entity'
import { CreateWalletDto } from './dto/create-wallet.dto'
import { UpdateWalletDto } from './dto/update-wallet.dto'
import { TransactionService } from '../transactions/transactions.service'

@Injectable()
export class WalletService {
  constructor(
    @InjectModel(Wallet.name)
    private walletModel: Model<WalletDocument>,
    private transactionService: TransactionService,
  ) {}

  async create(createWalletDto: CreateWalletDto, createdBy: string) {
    const { initialBalance, ...restOfCreateWalletDto } =
      createWalletDto

    if (!initialBalance) {
      createWalletDto.initialBalance = 0
    }

    const createdWallet = new this.walletModel({
      ...restOfCreateWalletDto,
      createdBy,
      initialBalance,
      balance: initialBalance,
    })

    return createdWallet.save()
  }

  async findAll(creatorId: string) {
    const allWallets = await this.walletModel
      .find({ createdBy: creatorId })
      .lean()
      .exec()
    return allWallets
  }

  async findOne(id: string) {
    const wallet = await this.walletModel.findById(id).exec()
    if (!wallet) {
      throw new AppError('Wallet not found')
    }
    return wallet
  }

  async update(id: string, updateWalletDto: UpdateWalletDto) {
    const wallet = await this.walletModel
      .findByIdAndUpdate(id, updateWalletDto, { new: true })
      .exec()

    if (!wallet) {
      throw new AppError('Wallet not found')
    }

    return wallet
  }

  async remove(id: string) {
    const wallet = await this.walletModel.findByIdAndDelete(id).exec()
    if (!wallet) {
      throw new AppError('Wallet not found')
    }

    await this.transactionService.removeByWalletId(id)

    return wallet
  }

  async removeByUserId(userId: string) {
    await this.walletModel.deleteMany({ createdBy: userId }).exec()
  }
}
