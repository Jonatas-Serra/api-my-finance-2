import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { User, UserSchema } from './entities/user.entity'
import * as bcrypt from 'bcrypt'

@Module({
  exports: [UsersService],
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema
          schema.pre('save', async function (next) {
            if (this.isModified('password')) {
              const salt = await bcrypt.genSalt(10)
              const hash = await bcrypt.hash(this.password, salt)
              this.password = hash
            }
            next()
          })
          return schema
        },
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
