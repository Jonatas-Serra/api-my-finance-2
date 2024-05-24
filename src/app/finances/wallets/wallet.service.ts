import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Wallet, WalletDocument } from './entities/wallet.entity'
import { CreateWalletDto } from './dto/create-wallet.dto'
import { UpdateWalletDto } from './dto/update-wallet.dto'
import { TransactionService } from '../transactions/transactions.service'
import AppError from 'src/shared/errors/AppError'

@Injectable()
export class WalletService {
  constructor(
    @InjectModel(Wallet.name)
    private walletModel: Model<WalletDocument>,
    @Inject(forwardRef(() => TransactionService))
    private transactionService: TransactionService,
  ) {}

  async create(createWalletDto: CreateWalletDto, createdBy: string) {
    const { initialBalance, ...restOfCreateWalletDto } =
      createWalletDto

    if (initialBalance < 0) {
      throw new AppError(
        'Initial balance must be greater than or equal to 0',
      )
    }

    const createdWallet = new this.walletModel({
      ...restOfCreateWalletDto,
      createdBy,
      initialBalance: initialBalance || 0,
      balance: initialBalance,
    })

    return createdWallet.save()
  }

  async transferBetweenWallets(
    sourceWalletId: string,
    targetWalletId: string,
    amount: number,
    description: string,
    createdBy: string,
    date: Date,
  ) {
    const sourceWallet = await this.walletModel
      .findById(sourceWalletId)
      .exec()
    const targetWallet = await this.walletModel
      .findById(targetWalletId)
      .exec()

    if (!sourceWallet || !targetWallet) {
      throw new AppError('Source or target wallet not found')
    }

    if (sourceWallet.balance < amount) {
      throw new AppError('Insufficient balance')
    }

    const sourceBalance = sourceWallet.balance - amount
    const targetBalance = targetWallet.balance + amount

    await this.setWalletBalance(sourceWalletId, sourceBalance)
    await this.setWalletBalance(targetWalletId, targetBalance)

    const transaction = await this.transactionService.create({
      type: 'Transfer',
      amount,
      sourceWalletId,
      targetWalletId,
      date,
      description,
      category: 'Transferência entre carteiras',
      createdBy,
      walletId: targetWalletId,
    })

    return transaction
  }

  async findAll(creatorId: string) {
    return this.walletModel
      .find({ createdBy: creatorId })
      .lean()
      .exec()
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

  private async setWalletBalance(walletId: string, balance: number) {
    const wallet = await this.walletModel.findById(walletId).exec()
    if (!wallet) {
      throw new AppError('Wallet not found')
    }

    wallet.balance = balance
    await wallet.save()
  }

  public async calculateWalletBalance(walletId: string) {
    const wallet = await this.walletModel.findById(walletId).exec()
    if (!wallet) {
      throw new AppError('Wallet not found')
    }

    const transactions =
      await this.transactionService.findAllByWalletId(walletId)

    let balance = wallet.balance

    transactions.forEach((transaction) => {
      if (
        transaction.type === 'Deposit' ||
        transaction.type === 'Transfer'
      ) {
        balance += transaction.amount
      } else if (transaction.type === 'Withdrawal') {
        balance -= transaction.amount
      }
    })

    return balance
  }

  public async updateWalletBalance(walletId: string) {
    const balance = await this.calculateWalletBalance(walletId)
    await this.setWalletBalance(walletId, balance)
  }

  async removeTransactionFromWallet(
    walletId: string,
    transactionId: string,
  ) {
    const wallet = await this.walletModel.findById(walletId).exec()
    if (!wallet) {
      throw new AppError('Wallet not found')
    }

    console.log('Wallet transactions:', wallet.transactions)
    console.log('Transaction ID to remove:', transactionId)

    const transactionIdStr = transactionId.toString()

    const transactionIndex = wallet.transactions.findIndex((id) => {
      console.log('Comparing with transaction ID:', id.toString())
      return id.toString() === transactionIdStr
    })

    console.log('Found transaction index:', transactionIndex)

    if (transactionIndex === -1) {
      throw new AppError('Transaction not found in wallet')
    }

    wallet.transactions.splice(transactionIndex, 1)
    await wallet.save()
  }
}
