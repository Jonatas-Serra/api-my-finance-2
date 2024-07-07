import { Module, forwardRef } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from './entities/user.entity'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { WalletModule } from '../finances/wallets/wallet.module'
import { TransactionsModule } from '../../app/finances/transactions/transactions.module'
import { AccountsModule } from '../../app/finances/accounts/accounts.module'
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
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService, MongooseModule],
})
export class UsersModule {}
