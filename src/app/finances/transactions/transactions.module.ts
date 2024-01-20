import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import {
  Transaction,
  TransactionSchema,
} from './entities/transaction.entity'
import { TransactionService } from './transactions.service'
import { TransactionsController } from './transactions.controller'
import { WalletModule } from '../wallets/wallet.module'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
    ]),
    WalletModule,
  ],
  providers: [TransactionService],
  controllers: [TransactionsController],
})
export class TransactionsModule {}
