import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import {
  Transaction,
  TransactionDocument,
} from './entities/transaction.entity'
import {
  Wallet,
  WalletDocument,
} from '../wallets/entities/wallet.entity'
import { CreateTransactionDto } from './dto/create-transaction.dto'
import { UpdateTransactionDto } from './dto/update-transaction.dto'
import AppError from 'src/shared/errors/AppError'

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
    @InjectModel(Wallet.name)
    private walletModel: Model<WalletDocument>,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    const createdTransaction = new this.transactionModel(
      createTransactionDto,
    )
    const savedTransaction = await createdTransaction.save()

    await this.updateWalletTransactions(
      createTransactionDto.walletId,
      savedTransaction._id,
    )

    await this.updateWalletBalance(createTransactionDto.walletId)

    return savedTransaction
  }

  async findAllByWalletId(walletId: string) {
    return this.transactionModel.find({ walletId }).lean().exec()
  }

  async findAllTransactions() {
    return this.transactionModel.find().exec()
  }

  async findOne(id: string) {
    const transaction = await this.transactionModel
      .findById(id)
      .exec()
    if (!transaction) {
      throw new AppError('Transaction not found')
    }
    return transaction
  }

  async update(
    id: string,
    updateTransactionDto: UpdateTransactionDto,
  ) {
    const transaction = await this.transactionModel
      .findByIdAndUpdate(id, updateTransactionDto, { new: true })
      .exec()

    if (!transaction) {
      throw new AppError('Transaction not found')
    }

    await this.updateWalletBalance(transaction.walletId)

    return transaction
  }

  async remove(id: string) {
    const transaction = await this.transactionModel
      .findByIdAndDelete(id)
      .exec()

    if (!transaction) {
      throw new AppError('Transaction not found')
    }

    await this.updateWalletBalance(transaction.walletId)

    return transaction
  }

  async removeByWalletId(walletId: string) {
    await this.transactionModel.deleteMany({ walletId }).exec()
  }

  async removeByAccountId(accountId: string) {
    const transactions = await this.transactionModel
      .find({ accountId })
      .exec()

    if (transactions.length > 0) {
      await this.transactionModel.deleteMany({ accountId }).exec()
    }
  }

  async removeByUserId(userId: string) {
    const wallets = await this.walletModel
      .find({ createdBy: userId })
      .exec()
    const walletIds = wallets.map((wallet) => wallet._id)

    await this.transactionModel
      .deleteMany({ walletId: { $in: walletIds } })
      .exec()
  }

  private async updateWalletTransactions(
    walletId: string,
    transactionId: string,
  ) {
    const wallet = await this.walletModel.findById(walletId).exec()
    if (!wallet) {
      throw new AppError('Wallet not found')
    }
    const transaction = await this.transactionModel
      .findById(transactionId)
      .exec()
    wallet.transactions.push(transaction)
    await wallet.save()
  }

  async findAll(creatorId: string) {
    return this.transactionModel.find({ createdBy: creatorId }).exec()
  }

  private async updateWalletBalance(walletId: string) {
    const wallet = await this.walletModel.findById(walletId).exec()
    if (!wallet) {
      throw new AppError('Wallet not found')
    }

    const transactions = await this.transactionModel
      .find({ walletId })
      .exec()
    const initialBalance = wallet.initialBalance || 0

    const balance = transactions.reduce((total, transaction) => {
      if (transaction.type === 'Deposit') {
        return total + transaction.amount
      } else if (transaction.type === 'Withdrawal') {
        return total - transaction.amount
      }
      return total
    }, initialBalance)

    wallet.balance = balance
    await wallet.save()
  }
}
