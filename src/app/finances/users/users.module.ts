import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { User, UserSchema } from './entities/user.entity'
import { WalletSchema } from '../wallets/entities/wallet.entity'
import { WalletService } from '../wallets/wallet.service'
import { AccountsService } from '../accounts/accounts.service'
import { TransactionService } from '../transactions/transactions.service'
import { AccountsModule } from '../accounts/accounts.module'
import { WalletModule } from '../wallets/wallet.module'

@Module({
  exports: [UsersService],
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      { name: 'Wallet', schema: WalletSchema },
    ]),
    AccountsModule,
    WalletModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    AccountsService,
    TransactionService,
    WalletService,
  ],
})
export class UsersModule {}
