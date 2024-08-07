import { Injectable, forwardRef, Inject } from '@nestjs/common'
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
import { AwsS3Service } from '../aws/aws-s3.service'

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(forwardRef(() => WalletService))
    private walletService: WalletService,
    @Inject(forwardRef(() => TransactionService))
    private transactionService: TransactionService,
    @Inject(forwardRef(() => AccountsService))
    private accountsService: AccountsService,
    private awsS3Service: AwsS3Service,
  ) {}

  async hashPassword(password: string): Promise<string> {
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password.toString(), salt)
    return hash
  }

  async validatePassword(
    userId: string,
    currentPassword: string,
  ): Promise<boolean> {
    const user = await this.userModel.findById(userId).exec()
    if (!user) {
      throw new AppError('User not found', 404)
    }
    return bcrypt.compare(currentPassword, user.password)
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
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec()
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

  public async updatePassword(
    userId: string,
    newPassword: string,
  ): Promise<void> {
    const hashedPassword = await this.hashPassword(newPassword)
    await this.userModel
      .findByIdAndUpdate(userId, { password: hashedPassword })
      .exec()
  }

  public async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const isPasswordValid = await this.validatePassword(
      userId,
      currentPassword,
    )

    if (!isPasswordValid) {
      throw new AppError('Current password is incorrect', 400)
    }

    await this.updatePassword(userId, newPassword)
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

  async updateProfilePicture(
    id: string,
    photoUrl: string,
  ): Promise<User> {
    const user = await this.userModel.findById(id).exec()
    if (!user) {
      throw new AppError('User not found', 404)
    }

    if (user.photo) {
      const photoKey = user.photo.split('/').pop()
      await this.awsS3Service.deleteFile(
        process.env.AWS_S3_BUCKET_NAME,
        photoKey,
      )
    }

    user.photo = photoUrl
    await user.save()
    return user
  }

  async removeProfilePicture(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec()
    if (!user) {
      throw new AppError('User not found', 404)
    }

    if (user.photo) {
      const photoKey = user.photo.split('/').pop()
      await this.awsS3Service.deleteFile(
        process.env.AWS_S3_BUCKET_NAME,
        photoKey,
      )
      user.photo = null
      await user.save()
    }

    return user
  }
}
