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
import { WalletService } from '../wallets/wallet.service'
import { CreateTransactionDto } from './dto/create-transaction.dto'
import { UpdateTransactionDto } from './dto/update-transaction.dto'
import AppError from 'src/shared/errors/AppError'

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
    @InjectModel(Wallet.name)
    private walletService: WalletService,
    @InjectModel(Wallet.name)
    private walletModel: Model<WalletDocument>,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    const createdTransaction = new this.transactionModel(
      createTransactionDto,
    )
    const savedTransaction = await createdTransaction.save()

    if (createTransactionDto.walletId) {
      await this.updateWalletTransactions(
        createTransactionDto.walletId,
        savedTransaction._id,
      )
    }

    await this.walletService.updateWalletBalance(
      createTransactionDto.walletId,
    )

    return savedTransaction
  }

  async findAllByWalletId(walletId: string) {
    return this.transactionModel.find({ walletId }).lean().exec()
  }

  async findAllByAccountId(accountId: string) {
    return this.transactionModel.find({ accountId }).lean().exec()
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
    await this.walletService.updateWalletBalance(transaction.walletId)
    return transaction
  }

  async reverseTransferTransaction(transactionId: string) {
    const transaction = await this.findOne(transactionId)

    const sourceWalletId = transaction.sourceWalletId
    const targetWalletId = transaction.targetWalletId

    await this.walletModel.updateOne(
      { _id: sourceWalletId },
      { $inc: { balance: transaction.amount } },
    )

    await this.walletModel.updateOne(
      { _id: targetWalletId },
      { $inc: { balance: -transaction.amount } },
    )

    return transaction
  }

  async remove(id: string) {
    const transaction = await this.transactionModel
      .findById(id)
      .exec()

    if (!transaction) {
      throw new AppError('Transaction not found')
    }

    if (transaction.sourceWalletId) {
      await this.reverseTransferTransaction(transaction.id)
    } else if (transaction.walletId) {
      await this.walletService.updateWalletBalance(
        transaction.walletId,
      )
    }

    await this.removeTransactionFromWallet(transaction.walletId, id)

    await this.transactionModel.findByIdAndDelete(id).exec()

    return transaction
  }

  async removeTransactionFromWallet(
    walletId: string,
    transactionId: string,
  ) {
    await this.walletModel.updateOne(
      { _id: walletId },
      { $pull: { transactions: transactionId } },
    )
  }

  async removeByWalletId(walletId: string) {
    await this.transactionModel.deleteMany({ walletId }).exec()
  }

  async removeByAccountId(accountId: string) {
    await this.transactionModel.deleteMany({ accountId }).exec()
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
    if (!transaction) {
      throw new AppError('Transaction not found')
    }
    wallet.transactions.push(transaction)
    await wallet.save()
  }

  async findAll(creatorId: string) {
    return this.transactionModel.find({ createdBy: creatorId }).exec()
  }
}
