import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User, UserDocument } from './entities/user.entity'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import * as bcrypt from 'bcrypt'
import AppError from 'src/shared/errors/AppError'
import { WalletService } from '../finances/wallets/wallet.service'
import { TransactionService } from '../finances/transactions/transactions.service'
import { AccountsService } from '../finances/accounts/accounts.service'

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private walletService: WalletService,
    private transactionService: TransactionService,
    private accountsService: AccountsService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password.toString(), salt)
    return hash
  }

  async create(createUserDto: CreateUserDto) {
    const checkUser = await this.userModel.findOne({
      email: createUserDto.email,
    })

    if (checkUser) {
      throw new AppError('User already exists')
    }

    createUserDto.password = await this.hashPassword(
      createUserDto.password,
    )

    const createdUser = await new this.userModel(createUserDto).save()

    await this.walletService.create(
      {
        name: 'Carteira',
        initialBalance: 0,
        balance: 0,
        currency: 'BRL',
        createdBy: createdUser._id,
      },
      createdUser._id,
    )

    return createdUser
  }

  async findAll() {
    return this.userModel.find().exec()
  }

  async findOne(email: string) {
    const user = await this.userModel.findOne({ email }).exec()
    if (!user) {
      throw new AppError('User not found')
    }
    return user as User
  }

  async findOneById(_id: string) {
    const user = await this.userModel.findOne({ _id }).exec()
    if (!user) {
      throw new AppError('User not found')
    }
    return user as User
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const checkUser = await this.userModel
      .findOne({
        email: updateUserDto.email,
        _id: { $ne: id },
      })
      .exec()
    if (checkUser) {
      throw new AppError('Email already registered for another user')
    }
    return this.userModel.findByIdAndUpdate(id, updateUserDto).exec()
  }

  async deactivate(id: string) {
    const user = await this.findOneById(id)
    user.isActive = false
    return this.userModel.updateOne({ _id: id }, user).exec()
  }

  async activate(id: string) {
    const user = await this.findOneById(id)
    user.isActive = true
    return this.userModel.updateOne({ _id: id }, user).exec()
  }

  async updatePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this.userModel.findById(userId).exec()

    if (!user) {
      throw new AppError('User not found')
    }

    const isPasswordValid = await bcrypt.compare(
      oldPassword,
      user.password,
    )

    if (!isPasswordValid) {
      throw new AppError('Invalid old password')
    }

    user.password = await this.hashPassword(newPassword)
    return user.save()
  }

  async remove(id: string) {
    const user = await this.findOneById(id)

    if (!user) {
      throw new AppError('User not found')
    }

    await this.accountsService.removeByUserId(id)

    await this.transactionService.removeByUserId(id)

    await this.walletService.removeByUserId(id)

    return this.userModel.findByIdAndDelete(id).exec()
  }
}
