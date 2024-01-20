import { Test, TestingModule } from '@nestjs/testing'
import { MongooseModule } from '@nestjs/mongoose'
import { getModelToken } from '@nestjs/mongoose'
import { AccountsService } from './accounts.service'
import {
  Account,
  AccountDocument,
  AccountSchema,
} from './entities/account.entity'
import { CreateAccountDto } from './dto/create-account.dto'

describe('AccountsService', () => {
  let service: AccountsService
  let mockAccountModel

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountsService],
      imports: [
        MongooseModule.forFeature([
          { name: Account.name, schema: AccountSchema },
        ]),
      ],
    }).compile()

    service = module.get<AccountsService>(AccountsService)
    mockAccountModel = module.get(getModelToken('Account'))
  })

  it('should create a single account successfully', async () => {
    const createAccountDto = new CreateAccountDto()
    createAccountDto.type = 'payable'
    createAccountDto.value = 100
    createAccountDto.dueDate = new Date()
    createAccountDto.issueDate = new Date()
    createAccountDto.documentNumber = '123'
    createAccountDto.category = 'Test'
    createAccountDto.documentType = 'Test'
    createAccountDto.description = 'Test Description'
    createAccountDto.payeeOrPayer = 'Test Payee'
    createAccountDto.repeat = 0
    createAccountDto.repeatInterval = 1
    createAccountDto.createdBy = 'test-user'

    const createdAccount = {
      _id: 'generated-id',
      ...createAccountDto,
    }

    mockAccountModel.create.mockReturnValue(createdAccount)

    const result = await service.create(createAccountDto, 'createdBy')

    expect(result).toEqual(createdAccount)
  })

  it('should create multiple recurring accounts successfully', async () => {
    const createAccountDto = new CreateAccountDto()
    createAccountDto.type = 'payable'
    createAccountDto.value = 100
    createAccountDto.dueDate = new Date()
    createAccountDto.issueDate = new Date()
    createAccountDto.documentNumber = '123'
    createAccountDto.category = 'Test'
    createAccountDto.documentType = 'Test'
    createAccountDto.description = 'Test Description'
    createAccountDto.payeeOrPayer = 'Test Payee'
    createAccountDto.repeat = 3
    createAccountDto.repeatInterval = 1
    createAccountDto.createdBy = 'test-user'

    const createdAccount = {
      _id: 'generated-id',
      ...createAccountDto,
    }

    mockAccountModel.insertMany.mockReturnValue([
      createdAccount,
      createdAccount,
      createdAccount,
    ])

    const createdAccounts = await service.createRecurringAccounts(
      createAccountDto,
      'test-user',
    )

    expect(createdAccounts.length).toBe(3)
    expect(createdAccounts[0]).toEqual(createdAccount)
  })
})
