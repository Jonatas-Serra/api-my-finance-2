import { Injectable } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { AccountsService } from 'src/app/finances/accounts/accounts.service'
import { UsersService } from '../users/users.service'
import { NotificationsService } from 'src/app/notification/notification.service'
import { MailService } from 'src/app/mail/mail.service'

@Injectable()
export class TasksService {
  constructor(
    private readonly usersService: UsersService,
    private readonly accountsService: AccountsService,
    private readonly notificationsService: NotificationsService,
    private readonly mailService: MailService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async handleCron() {
    const accounts = await this.accountsService.findDueAccounts()
    for (const account of accounts) {
      const user = await this.usersService.findOneById(
        account.createdBy,
      )
      await this.notificationsService.create(
        account.createdBy,
        `Sua conta no valor ${new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(
          account.value,
        )} está vencendo em ${new Intl.DateTimeFormat('pt-BR', {
          timeZone: 'UTC',
        }).format(new Date(account.dueDate))}`,
      )
      await this.mailService.sendAccountDueNotification(
        user.email,
        `Sua conta no valor ${new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(
          account.value,
        )} está vencendo em ${new Intl.DateTimeFormat('pt-BR', {
          timeZone: 'UTC',
        }).format(new Date(account.dueDate))}`,
      )
    }
  }
}
