import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { WalletController } from './wallet.controller'
import { WalletService } from './wallet.service'
import { Wallet, WalletSchema } from './entities/wallet.entity'
import { AccountsService } from '../accounts/accounts.service'
import { AccountSchema } from '../accounts/entities/account.entity'
import { TransactionService } from '../transactions/transactions.service'
import { TransactionSchema } from '../transactions/entities/transaction.entity'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Wallet.name, schema: WalletSchema },
      { name: 'Account', schema: AccountSchema },
      { name: 'Transaction', schema: TransactionSchema },
    ]),
  ],
  exports: [
    MongooseModule.forFeature([
      { name: Wallet.name, schema: WalletSchema },
    ]),
  ],
  controllers: [WalletController],
  providers: [WalletService, AccountsService, TransactionService],
})
export class WalletModule {}
