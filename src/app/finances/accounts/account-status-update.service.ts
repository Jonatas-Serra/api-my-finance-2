import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { AccountsService } from './accounts.service'

@Injectable()
export class AccountStatusUpdateService {
  constructor(private readonly accountsService: AccountsService) {}
}
