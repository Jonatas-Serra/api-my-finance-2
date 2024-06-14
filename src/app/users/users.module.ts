import { Module, forwardRef } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { User, UserSchema } from './entities/user.entity'
import { WalletModule } from '../finances/wallets/wallet.module'
import { TransactionsModule } from '../finances/transactions/transactions.module'
import { AccountsModule } from '../finances/accounts/accounts.module'
import { AwsModule } from '../aws/aws.module'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
    ]),
    forwardRef(() => WalletModule),
    forwardRef(() => TransactionsModule),
    forwardRef(() => AccountsModule),
    AwsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
