import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { UsersModule } from './users/users.module'
import { AccountsModule } from './finances/accounts/accounts.module'
import { AuthModule } from './auth/auth.module'
import { WalletModule } from './finances/wallets/wallet.module'
import { TransactionsModule } from './finances/transactions/transactions.module'
import { NotificationModule } from './notification/notification.module'
import { MailModule } from './mail/mail.module'
import { TasksModule } from './task/task.module'
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
    NotificationModule,
    MailModule,
    TasksModule,
  ],
  providers: [],
  controllers: [],
})
export class AppModule {}
