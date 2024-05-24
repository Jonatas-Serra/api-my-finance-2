import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AccountsController } from './accounts.controller'
import { AccountsService } from './accounts.service'
import { AccountSchema } from './entities/account.entity'
import { TransactionService } from '../transactions/transactions.service'
import { TransactionSchema } from '../transactions/entities/transaction.entity'
import { WalletSchema } from '../wallets/entities/wallet.entity'
import { WalletService } from '../wallets/wallet.service'

import { AccountStatusUpdateService } from './account-status-update.service'
import { ScheduleModule } from '@nestjs/schedule'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Account', schema: AccountSchema },
      { name: 'Transaction', schema: TransactionSchema },
      { name: 'Wallet', schema: WalletSchema },
    ]),
    ScheduleModule.forRoot(),
  ],
  exports: [
    MongooseModule.forFeature([
      { name: 'Account', schema: AccountSchema },
    ]),
    AccountsService,
  ],
  controllers: [AccountsController],
  providers: [
    AccountStatusUpdateService,
    AccountsService,
    TransactionService,
    WalletService,
  ],
})
export class AccountsModule {}
