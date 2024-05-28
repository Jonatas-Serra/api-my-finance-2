import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { TransactionService } from '../transactions/transactions.service'
import { Account, AccountDocument } from './entities/account.entity'
import { CreateAccountDto } from './dto/create-account.dto'
import { UpdateAccountDto } from './dto/update-account.dto'
import AppError from '../../../shared/errors/AppError'

@Injectable()
export class AccountsService {
  constructor(
    @InjectModel(Account.name)
    private accountModel: Model<AccountDocument>,
    @Inject(forwardRef(() => TransactionService))
    private transactionService: TransactionService,
  ) {}

  async create(
    createAccountDto: CreateAccountDto,
    createdBy: string,
  ) {
    createAccountDto.status = this.definedAccountStatus(
      createAccountDto.dueDate,
    )

    const createdAccount = new this.accountModel({
      ...createAccountDto,
      createdBy,
    })

    return createdAccount.save()
  }

  async createRecurringAccounts(
    createAccountDto: CreateAccountDto,
    createdBy: string,
  ) {
    const { repeat } = createAccountDto
    const recurringAccounts = []

    for (let i = 1; i <= repeat; i++) {
      const newAccount = new this.accountModel({
        ...createAccountDto,
        createdBy,
        dueDate: this.calculateNextDueDate(createAccountDto, i),
      })

      newAccount._id = newAccount.id
      recurringAccounts.push(newAccount)
    }

    return this.accountModel.insertMany(recurringAccounts)
  }

  async findAll(creatorId: string) {
    const allAccounts = await this.accountModel
      .find({ createdBy: creatorId })
      .lean()
      .exec()
    const expandedAccounts = this.expandRepeatingAccounts(allAccounts)
    return expandedAccounts
  }

  async findOne(id: string) {
    const account = await this.accountModel.findById(id).exec()
    if (!account) {
      throw new AppError('Account not found')
    }
    return account
  }

  async update(id: string, updateAccountDto: UpdateAccountDto) {
    const account = await this.accountModel.findById(id).exec()
    if (!account) {
      throw new AppError('Account not found')
    }

    if (account.status === 'Paid') {
      throw new AppError('Account already paid')
    } else {
      updateAccountDto.status = this.definedAccountStatus(
        updateAccountDto.dueDate,
      )
    }

    const updatedAccount = await this.accountModel.findByIdAndUpdate(
      id,
      updateAccountDto,
      { new: true },
    )

    return updatedAccount
  }

  async remove(id: string) {
    const account = await this.accountModel
      .findByIdAndDelete(id)
      .exec()

    if (!account) {
      throw new AppError('Account not found')
    }

    if (account.status === 'Paid') {
      await this.transactionService.removeByAccountId(account._id)
    }

    return account
  }

  async removeByUserId(userId: string) {
    const accounts = await this.accountModel
      .find({ createdBy: userId })
      .exec()

    for (const account of accounts) {
      if (account.isPaid && account.transactionId) {
        await this.transactionService.remove(account.transactionId)
      }

      await this.accountModel.findByIdAndDelete(account._id).exec()
    }
  }

  async pay(id: string, walletId: string, payday: Date) {
    const account = await this.accountModel.findById(id).exec()
    const paydayDate = new Date(payday)

    if (!account) {
      throw new AppError('Account not found')
    }

    if (account.isPaid) {
      throw new AppError('Account already paid')
    }

    account.isPaid = true
    account.status = 'Paid'
    account.payday = paydayDate
    const updatedAccount = await account.save()

    await this.transactionService.create({
      walletId: walletId,
      amount: updatedAccount.value,
      type:
        updatedAccount.type === 'receivable'
          ? 'Deposit'
          : 'Withdrawal',
      date: updatedAccount.payday,
      accountId: account._id,
      description: updatedAccount.payeeOrPayer,
      category: updatedAccount.category,
      createdBy: updatedAccount.createdBy,
      sourceWalletId: '',
      targetWalletId: '',
    })

    return updatedAccount
  }

  async underPaidAccounts(id: string, preventRecursiveCall = false) {
    const account = await this.accountModel.findById(id).exec()
    const transaction =
      await this.transactionService.findAllByAccountId(id)

    if (!account) {
      throw new AppError('Account not found')
    }

    if (!transaction || transaction.length === 0) {
      throw new AppError('Transaction not found')
    }

    await this.transactionService.remove(
      transaction[0]._id,
      preventRecursiveCall,
    )

    account.isPaid = false
    account.status = account.dueDate < new Date() ? 'Late' : 'Pending'

    return account.save()
  }

  private expandRepeatingAccounts(accounts: Account[]) {
    const expandedAccounts: Account[] = []

    accounts.forEach((account) => {
      if (account.repeat) {
        const repeatCount = account.repeat || 1
        for (let i = 1; i <= repeatCount; i++) {
          const expandedAccount: Account = {
            ...account,
            dueDate: this.calculateNextDueDate(account, i),
          }
          expandedAccounts.push(expandedAccount)
        }
      } else {
        expandedAccounts.push(account)
      }
    })

    return expandedAccounts
  }

  private calculateNextDueDate(
    account: CreateAccountDto,
    repeatIndex: number,
  ) {
    const { repeatInterval, dueDate } = account
    const newDueDate = new Date(dueDate)
    newDueDate.setMonth(
      newDueDate.getMonth() + repeatIndex * repeatInterval,
    )
    return newDueDate
  }

  async updateAccountStatus() {
    const currentDate = new Date()
    const accounts = await this.accountModel.find().exec()

    for (const account of accounts) {
      if (account.status !== 'Paid') {
        const dueDate = new Date(account.dueDate)
        if (dueDate < currentDate) {
          account.status = 'Late'
        } else {
          account.status = 'Pending'
        }
        await account.save()
      }
    }
  }

  private definedAccountStatus(dueDate: Date) {
    const currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)

    const dueDateWithoutTime = new Date(dueDate)
    dueDateWithoutTime.setHours(0, 0, 0, 0)

    if (dueDateWithoutTime > currentDate) {
      return 'Pending'
    } else if (dueDateWithoutTime < currentDate) {
      return 'Late'
    } else {
      return 'Pending'
    }
  }
}
