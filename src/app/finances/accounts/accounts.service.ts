// accounts.service.ts
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Account, AccountDocument } from './entities/account.entity'
import { CreateAccountDto } from './dto/create-account.dto'
import { UpdateAccountDto } from './dto/update-account.dto'

@Injectable()
export class AccountsService {
  constructor(
    @InjectModel(Account.name)
    private accountModel: Model<AccountDocument>,
  ) {}

  async create(
    createAccountDto: CreateAccountDto,
    createdBy: string,
  ) {
    const createdAccount = new this.accountModel({
      ...createAccountDto,
      createdBy,
    })

    return createdAccount.save()
  }

  async findAll(creatorId: string) {
    const allAccounts = await this.accountModel
      .find({ createdBy: creatorId })
      .exec()
    const expandedAccounts = this.expandRepeatingAccounts(allAccounts)
    return expandedAccounts
  }

  async findOne(id: string) {
    const account = await this.accountModel.findById(id).exec()
    if (!account) {
      throw new NotFoundException('Account not found')
    }
    return account
  }

  async update(id: string, updateAccountDto: UpdateAccountDto) {
    const account = await this.accountModel
      .findByIdAndUpdate(id, updateAccountDto, { new: true })
      .exec()

    if (!account) {
      throw new NotFoundException('Account not found')
    }

    return account
  }

  async remove(id: string) {
    const account = await this.accountModel
      .findByIdAndDelete(id)
      .exec()
    if (!account) {
      throw new NotFoundException('Account not found')
    }
    return account
  }

  async pay(id: string, discount: number) {
    const account = await this.accountModel.findById(id).exec()
    if (!account) {
      throw new NotFoundException('Account not found')
    }

    account.isPaid = true
    account.status = 'Paid'
    account.discount = discount

    return account.save()
  }

  private expandRepeatingAccounts(accounts: Account[]) {
    const expandedAccounts: Account[] = []

    accounts.forEach((account) => {
      if (account.repeat) {
        const repeatCount = account.repeat || 1
        for (let i = 1; i <= repeatCount; i++) {
          const expandedAccount: Account = JSON.parse(
            JSON.stringify(account),
          )
          expandedAccount.dueDate = this.calculateNextDueDate(
            account,
            i,
          )
          expandedAccounts.push(expandedAccount)
        }
      } else {
        expandedAccounts.push(account)
      }
    })

    return expandedAccounts
  }

  private calculateNextDueDate(
    account: Account,
    repeatIndex: number,
  ) {
    const { repeatInterval, dueDate } = account
    const newDueDate = new Date(dueDate)
    newDueDate.setMonth(
      newDueDate.getMonth() + repeatIndex * repeatInterval,
    )
    return newDueDate
  }
}
