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

    return savedTransaction
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
}
