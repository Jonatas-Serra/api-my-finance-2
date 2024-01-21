import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { User, UserSchema } from './entities/user.entity'
import { WalletSchema } from '../wallets/entities/wallet.entity'
import { WalletService } from '../wallets/wallet.service'

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
  ],
  controllers: [UsersController],
  providers: [UsersService, WalletService],
})
export class UsersModule {}
