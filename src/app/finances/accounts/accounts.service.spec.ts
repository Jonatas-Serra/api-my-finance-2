import { Test, TestingModule } from '@nestjs/testing'
import { getModelToken } from '@nestjs/mongoose'
import { AccountsService } from './accounts.service'
import { Account, AccountDocument } from './entities/account.entity'
import { TransactionService } from '../transactions/transactions.service'
import { Model, Types } from 'mongoose'
import { CreateAccountDto } from './dto/create-account.dto'
import { UpdateAccountDto } from './dto/update-account.dto'

const mockAccount = {
  _id: new Types.ObjectId(),
  type: 'payable',
  value: 100,
  dueDate: new Date(),
  issueDate: new Date(),
  payeeOrPayer: 'Test Payee',
  status: 'Pending',
  isPaid: false,
  save: jest.fn().mockResolvedValue(this),
  remove: jest.fn(),
}

const mockAccountModel = {
  new: jest.fn().mockReturnValue(mockAccount),
  constructor: jest.fn().mockReturnValue(mockAccount),
  find: jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue([mockAccount]),
  }),
  findById: jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(mockAccount),
  }),
  findByIdAndDelete: jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(mockAccount),
  }),
  findByIdAndUpdate: jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(mockAccount),
  }),
  create: jest.fn().mockResolvedValue(mockAccount),
  save: jest.fn(),
  exec: jest.fn().mockResolvedValue(mockAccount),
}

const mockTransactionService = {
  create: jest.fn(),
  removeByAccountId: jest.fn(),
  findAllByAccountId: jest.fn().mockResolvedValue([]),
  remove: jest.fn(),
}

describe('AccountsService', () => {
  let service: AccountsService
  let model: Model<AccountDocument>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountsService,
        {
          provide: getModelToken(Account.name),
          useValue: mockAccountModel,
        },
        {
          provide: TransactionService,
          useValue: mockTransactionService,
        },
      ],
    }).compile()

    service = module.get<AccountsService>(AccountsService)
    model = module.get<Model<AccountDocument>>(
      getModelToken(Account.name),
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('should create a new account', async () => {
      const createAccountDto: CreateAccountDto = {
        type: 'payable',
        value: 100,
        dueDate: new Date().toISOString(),
        issueDate: new Date().toISOString(),
        payeeOrPayer: 'Test Payee',
        category: 'Test Category',
        documentNumber: '123456',
        documentType: 'invoice',
        description: 'Test Description',
        createdBy: 'userId',
        repeat: 1,
        repeatInterval: 1,
        status: 'Pending',
        walletId: 'walletId',
      }
      const result = await service.create(createAccountDto, 'userId')
      expect(result).toMatchObject(createAccountDto)
      expect(result.status).toBe('Pending')
    })
  })

  describe('findOne', () => {
    it('should find an account by id', async () => {
      const result = await service.findOne(mockAccount._id.toString())
      expect(result).toBeDefined()
      expect(result._id).toEqual(mockAccount._id)
    })

    it('should throw an error if account not found', async () => {
      jest.spyOn(model, 'findById').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any)
      await expect(
        service.findOne(new Types.ObjectId().toString()),
      ).rejects.toThrow('Account not found')
    })
  })

  describe('update', () => {
    it('should update an account', async () => {
      const updateAccountDto: UpdateAccountDto = {
        type: 'payable',
        value: 150,
        dueDate: new Date().toISOString(),
        issueDate: new Date().toISOString(),
        payeeOrPayer: 'Test Payee',
        category: 'Test Category',
        documentNumber: '123456',
        documentType: 'invoice',
        description: 'Updated Description',
        repeat: 1,
        repeatInterval: 1,
        walletId: 'walletId',
        status: 'Pending',
      }
      const result = await service.update(
        mockAccount._id.toString(),
        updateAccountDto,
      )
      expect(result).toBeDefined()
      expect(result.value).toBe(updateAccountDto.value)
    })

    it('should throw an error if account not found', async () => {
      jest.spyOn(model, 'findById').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any)
      const updateAccountDto: UpdateAccountDto = {
        type: 'payable',
        value: 150,
        dueDate: new Date().toISOString(),
        issueDate: new Date().toISOString(),
        payeeOrPayer: 'Test Payee',
        category: 'Test Category',
        documentNumber: '123456',
        documentType: 'invoice',
        description: 'Updated Description',
        repeat: 1,
        repeatInterval: 1,
        walletId: 'walletId',
        status: 'Pending',
      }
      await expect(
        service.update(
          new Types.ObjectId().toString(),
          updateAccountDto,
        ),
      ).rejects.toThrow('Account not found')
    })

    it('should throw an error if account is already paid', async () => {
      const paidAccount = { ...mockAccount, status: 'Paid' }
      jest.spyOn(model, 'findById').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(paidAccount),
      } as any)
      const updateAccountDto: UpdateAccountDto = {
        type: 'payable',
        value: 150,
        dueDate: new Date().toISOString(),
        issueDate: new Date().toISOString(),
        payeeOrPayer: 'Test Payee',
        category: 'Test Category',
        documentNumber: '123456',
        documentType: 'invoice',
        description: 'Updated Description',
        repeat: 1,
        repeatInterval: 1,
        walletId: 'walletId',
        status: 'Pending',
      }
      await expect(
        service.update(paidAccount._id.toString(), updateAccountDto),
      ).rejects.toThrow('Account already paid')
    })
  })

  describe('remove', () => {
    it('should remove an account', async () => {
      const result = await service.remove(mockAccount._id.toString())
      expect(result).toBeDefined()
    })

    it('should throw an error if account not found', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any)
      await expect(
        service.remove(new Types.ObjectId().toString()),
      ).rejects.toThrow('Account not found')
    })
  })

  describe('pay', () => {
    it('should mark an account as paid and create a transaction', async () => {
      const result = await service.pay(
        mockAccount._id.toString(),
        'walletId',
        new Date(),
      )
      expect(result).toBeDefined()
      expect(result.status).toBe('Paid')
    })

    it('should throw an error if account is already paid', async () => {
      const paidAccount = {
        ...mockAccount,
        status: 'Paid',
        isPaid: true,
      }
      jest.spyOn(model, 'findById').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(paidAccount),
      } as any)
      await expect(
        service.pay(
          paidAccount._id.toString(),
          'walletId',
          new Date(),
        ),
      ).rejects.toThrow('Account already paid')
    })

    it('should throw an error if account not found', async () => {
      jest.spyOn(model, 'findById').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any)
      await expect(
        service.pay(
          new Types.ObjectId().toString(),
          'walletId',
          new Date(),
        ),
      ).rejects.toThrow('Account not found')
    })
  })
})
