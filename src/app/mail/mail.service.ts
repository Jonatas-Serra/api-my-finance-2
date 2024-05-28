import { Injectable } from '@nestjs/common'
import { MailerService } from '@nestjs-modules/mailer'
import { UsersService } from '../users/users.service'

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private usersService: UsersService,
  ) {}

  async sendAccountDueNotification(
    email: string,
    notificationMessage: string,
  ) {
    const user = await this.usersService.findOne(email)

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Account Due Notification',
        template: 'account-due',
        context: {
          notificationMessage,
          username: user.name,
        },
      })
      console.log('Email sent')
    } catch (e) {
      console.error(e)
    }
  }
}
