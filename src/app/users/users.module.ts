import { forwardRef, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { User, UserSchema } from './entities/user.entity'
import { WalletSchema } from '../finances/wallets/entities/wallet.entity'
import { WalletService } from '../finances/wallets/wallet.service'
import { AccountsService } from '../finances/accounts/accounts.service'
import { TransactionService } from '../finances/transactions/transactions.service'
import { AccountsModule } from '../finances/accounts/accounts.module'
import { WalletModule } from '../finances/wallets/wallet.module'
import { MailModule } from '../mail/mail.module'

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
    forwardRef(() => AccountsModule),
    forwardRef(() => WalletModule),
    forwardRef(() => MailModule),
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
