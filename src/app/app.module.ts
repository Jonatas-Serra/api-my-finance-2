import { MongooseModule } from '@nestjs/mongoose'
import { Module } from '@nestjs/common'
import { UsersModule } from './finances/users/users.module'
import { AccountsModule } from './finances/accounts/accounts.module'
import { AuthModule } from './auth/auth.module'
import { WalletModule } from './finances/wallets/wallet.module'
import { TransactionsModule } from './finances/transactions/transactions.module'
import 'dotenv/config'

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@myfinance.izkzvzb.mongodb.net/?retryWrites=true&w=majority`,
    ),
    WalletModule,
    TransactionsModule,
    UsersModule,
    AuthModule,
    AccountsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
