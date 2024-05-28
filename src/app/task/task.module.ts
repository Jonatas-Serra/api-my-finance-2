import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { TasksService } from './tasks.service'
import { NotificationModule } from 'src/app/notification/notification.module'
import { AccountsModule } from 'src/app/finances/accounts/accounts.module'
import { MailModule } from 'src/app/mail/mail.module'
import { UsersModule } from '../users/users.module'

@Module({
  imports: [
    ScheduleModule.forRoot(),
    AccountsModule,
    MailModule,
    NotificationModule,
    UsersModule,
  ],
  providers: [TasksService],
})
export class TasksModule {}
