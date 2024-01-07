import { MongooseModule } from '@nestjs/mongoose'
import { Module } from '@nestjs/common'
import { UsersModule } from './finances/users/users.module'
import { AccountsModule } from './finances/accounts/accounts.module'
import { AuthModule } from './auth/auth.module'
import 'dotenv/config'

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@myfinance.izkzvzb.mongodb.net/?retryWrites=true&w=majority`,
    ),
    UsersModule,
    AccountsModule,
  ],
  controllers: [],
  providers: [AuthModule],
})
export class AppModule {}
