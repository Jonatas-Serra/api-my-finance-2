import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { UsersModule } from './users/users.module'
import { AccountsModule } from './finances/accounts/accounts.module'
import { AuthModule } from './auth/auth.module'
import { WalletModule } from './finances/wallets/wallet.module'
import { TransactionsModule } from './finances/transactions/transactions.module'
import { NotificationModule } from './notification/notification.module'
import { AwsModule } from './aws/aws.module'
import { UploadModule } from './upload/upload.module'
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
    AwsModule,
    UploadModule,
  ],
  providers: [],
  controllers: [],
})
export class AppModule {}
