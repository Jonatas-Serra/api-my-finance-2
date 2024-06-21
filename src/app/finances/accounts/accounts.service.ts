import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { TransactionService } from '../transactions/transactions.service'
import { Account, AccountDocument } from './entities/account.entity'
import { CreateAccountDto } from './dto/create-account.dto'
import { UpdateAccountDto } from './dto/update-account.dto'
import AppError from '../../../shared/errors/AppError'
import { addMonths, parseISO } from 'date-fns'

@Injectable()
export class AccountsService {
  constructor(
    @InjectModel(Account.name)
    private readonly accountModel: Model<AccountDocument>,
    @Inject(forwardRef(() => TransactionService))
    private readonly transactionService: TransactionService,
  ) {}

  async create(
    createAccountDto: CreateAccountDto,
    createdBy: string,
  ) {
    createAccountDto.dueDate = new Date(
      createAccountDto.dueDate,
    ).toISOString()
    createAccountDto.issueDate = new Date(
      createAccountDto.issueDate,
    ).toISOString()
    createAccountDto.status = this.definedAccountStatus(
      parseISO(createAccountDto.dueDate),
    )

    const createdAccount = new this.accountModel({
      ...createAccountDto,
      dueDate: new Date(createAccountDto.dueDate),
      issueDate: new Date(createAccountDto.issueDate),
      createdBy,
    })

    return await createdAccount.save()
  }

  async createRecurringAccounts(
    createAccountDto: CreateAccountDto,
    createdBy: string,
  ) {
    const { repeat } = createAccountDto
    const recurringAccounts = []

    for (let i = 0; i < repeat; i++) {
      const nextDueDate = this.calculateNextDueDate(
        parseISO(createAccountDto.dueDate),
        i,
      )
      const status = this.definedAccountStatus(nextDueDate)

      const newAccount = new this.accountModel({
        ...createAccountDto,
        createdBy,
        dueDate: nextDueDate,
        status,
      })
      newAccount._id = newAccount.id
      recurringAccounts.push(newAccount)
    }

    return this.accountModel.insertMany(recurringAccounts)
  }

  async findAll(creatorId: string): Promise<Account[]> {
    return this.accountModel.find({ createdBy: creatorId }).exec()
  }

  async findOne(_id: string) {
    const account = await this.accountModel.findById(_id).exec()
    if (!account) {
      throw new AppError('Account not found')
    }
    return account
  }

  async findUserById(createdBy: string) {
    const account = await this.accountModel
      .findOne({ createdBy })
      .exec()
    if (!account) {
      throw new AppError('Account not found')
    }

    return account
  }

  async findAllByUserIdAndDateRange(
    userId: string,
    startDate?: string,
    endDate?: string,
    status?: string[],
  ): Promise<Account[]> {
    const filter: any = { createdBy: userId }

    if (startDate) {
      filter.dueDate = { $gte: new Date(startDate) }
    }
    if (endDate) {
      if (!filter.dueDate) {
        filter.dueDate = {}
      }
      filter.dueDate.$lte = new Date(endDate)
    }

    if (status && status.length > 0) {
      filter.status = { $in: status }
    }

    return this.accountModel.find(filter).exec()
  }

  async findAllByUserIdAndDateRangeAndType(
    userId: string,
    startDate?: string,
    endDate?: string,
    type?: string[],
  ): Promise<Account[]> {
    const filter: any = { createdBy: userId }

    if (startDate) {
      filter.dueDate = { $gte: new Date(startDate) }
    }
    if (endDate) {
      if (!filter.dueDate) {
        filter.dueDate = {}
      }
      filter.dueDate.$lte = new Date(endDate)
    }

    if (type && type.length > 0) {
      filter.type = { $in: type }
    }

    return this.accountModel.find(filter).exec()
  }

  async findDueAccounts() {
    const currentDate = new Date()
    const accounts = await this.accountModel
      .find({ dueDate: { $lte: currentDate } })
      .exec()

    const accountsToNotify = accounts.filter(
      (account) => account.status !== 'Paid',
    )

    return accountsToNotify
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
        parseISO(updateAccountDto.dueDate),
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
      await this.transactionService.removeByAccountId(
        account._id.toString(),
      )
    }

    return account
  }

  async removeByUserId(userId: string) {
    const accounts = await this.accountModel
      .find({ createdBy: userId })
      .exec()

    for (const account of accounts) {
      if (account.isPaid && account._id) {
        await this.transactionService.removeByAccountId(
          account._id.toString(),
        )
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
    const transactions =
      await this.transactionService.findAllByAccountId(id)

    if (!account) {
      throw new AppError('Account not found')
    }

    if (!transactions || transactions.length === 0) {
      throw new AppError('Transaction not found')
    }

    await this.transactionService.remove(
      transactions[0]._id,
      preventRecursiveCall,
    )

    account.isPaid = false
    account.status = account.dueDate < new Date() ? 'Late' : 'Pending'

    return account.save()
  }

  public async updateAccountStatus() {
    console.log('Updating account status')
    const accounts = await this.accountModel.find().exec()

    for (const account of accounts) {
      if (account.isPaid && account.status !== 'Paid') {
        account.status = 'Paid'
      } else if (!account.isPaid) {
        account.status = this.definedAccountStatus(account.dueDate)
      }
      await account.save()
    }
  }

  private expandRepeatingAccounts(
    accounts: AccountDocument[],
  ): AccountDocument[] {
    const expandedAccounts = []

    accounts.forEach((account) => {
      expandedAccounts.push(account)

      if (account.repeat) {
        for (let i = 1; i <= account.repeat; i++) {
          const nextDueDate = this.calculateNextDueDate(
            account.dueDate,
            i,
          )
          const newAccount = {
            ...account.toObject(),
            _id: undefined,
            dueDate: nextDueDate,
            status: this.definedAccountStatus(nextDueDate),
          }
          expandedAccounts.push(newAccount)
        }
      }
    })

    return expandedAccounts
  }

  private calculateNextDueDate(
    originalDate: Date,
    repeatIndex: number,
  ): Date {
    return addMonths(originalDate, repeatIndex)
  }

  private definedAccountStatus(dueDate: Date): string {
    const today = new Date()
    if (today > dueDate) {
      return 'Late'
    }
    return 'Pending'
  }
}
