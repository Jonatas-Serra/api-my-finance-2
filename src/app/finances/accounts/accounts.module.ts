import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AccountsController } from './accounts.controller'
import { AccountsService } from './accounts.service'
import { AccountSchema } from './entities/account.entity'
import { TransactionService } from '../transactions/transactions.service'
import { TransactionSchema } from '../transactions/entities/transaction.entity'
import { WalletSchema } from '../wallets/entities/wallet.entity'
import { WalletService } from '../wallets/wallet.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Account', schema: AccountSchema },
      { name: 'Transaction', schema: TransactionSchema },
      { name: 'Wallet', schema: WalletSchema },
    ]),
  ],
  controllers: [AccountsController],
  providers: [AccountsService, TransactionService, WalletService],
})
export class AccountsModule {}
