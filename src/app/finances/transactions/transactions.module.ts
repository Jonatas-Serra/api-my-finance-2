import { forwardRef, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import {
  Transaction,
  TransactionSchema,
} from './entities/transaction.entity'
import { TransactionService } from './transactions.service'
import { TransactionsController } from './transactions.controller'
import { WalletModule } from '../wallets/wallet.module'
import { WalletSchema } from '../wallets/entities/wallet.entity'
import { WalletService } from '../wallets/wallet.service'
import { AccountsService } from '../accounts/accounts.service'
import { AccountSchema } from '../accounts/entities/account.entity'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
      { name: 'Wallet', schema: WalletSchema },
      { name: 'Account', schema: AccountSchema },
    ]),
    forwardRef(() => WalletModule),
  ],
  exports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
    ]),
    TransactionService,
  ],
  providers: [AccountsService, TransactionService, WalletService],
  controllers: [TransactionsController],
})
export class TransactionsModule {}
