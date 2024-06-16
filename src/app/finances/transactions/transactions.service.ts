import { Injectable, Inject, forwardRef } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
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
import { WalletService } from '../wallets/wallet.service'
import { AccountsService } from '../accounts/accounts.service'

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
    @InjectModel(Wallet.name)
    private walletModel: Model<WalletDocument>,
    @Inject(forwardRef(() => WalletService))
    private walletService: WalletService,
    @Inject(forwardRef(() => AccountsService))
    private accountsService: AccountsService,
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

    await this.updateWalletBalance(createTransactionDto.walletId)

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

  async findTransactions(
    userId: string,
    startDate: string,
    endDate: string,
    type: string,
  ) {
    const query: any = { createdBy: userId }

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      }
    }

    if (type) {
      query.type = type
    }

    return this.transactionModel.find(query).exec()
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

  async remove(id: string, preventRecursiveCall = false) {
    const transaction = await this.transactionModel
      .findById(id)
      .exec()

    if (!transaction) {
      throw new AppError('Transaction not found')
    }

    if (transaction.sourceWalletId) {
      await this.reverseTransferTransaction(transaction.id)
    } else if (transaction.walletId) {
      await this.walletService.removeTransactionFromWallet(
        transaction.walletId,
        transaction._id,
      )
    }

    if (transaction.accountId && !preventRecursiveCall) {
      await this.accountsService.underPaidAccounts(
        transaction.accountId,
        true,
      )
    }

    await this.transactionModel.findByIdAndDelete(id).exec()

    if (transaction.walletId) {
      await this.updateWalletBalance(transaction.walletId)
    }

    return transaction
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
    _id: string,
  ) {
    const wallet = await this.walletModel.findById(walletId).exec()
    if (!wallet) {
      throw new AppError('Wallet not found')
    }

    const transaction = await this.transactionModel
      .findById(_id)
      .exec()
    if (!transaction) {
      throw new AppError('Transaction not found')
    }

    wallet.transactions.push(new Types.ObjectId(transaction._id))
    await wallet.save()
  }

  async findAll(creatorId: string) {
    return this.transactionModel.find({ createdBy: creatorId }).exec()
  }

  private async calculateWalletBalance(
    walletId: string,
  ): Promise<number> {
    const wallet = await this.walletModel.findById(walletId).exec()
    if (!wallet) {
      throw new AppError('Wallet not found')
    }

    const transactions = await this.transactionModel
      .find({ walletId })
      .lean()
      .exec()

    let balance = wallet.initialBalance

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

  private async setWalletBalance(walletId: string, balance: number) {
    const wallet = await this.walletModel.findById(walletId).exec()
    if (!wallet) {
      throw new AppError('Wallet not found')
    }

    wallet.balance = balance
    await wallet.save()
  }

  async updateWalletBalance(walletId: string) {
    const balance = await this.calculateWalletBalance(walletId)
    await this.setWalletBalance(walletId, balance)
  }
}
