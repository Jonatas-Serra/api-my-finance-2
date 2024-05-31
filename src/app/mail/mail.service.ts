import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { MailerService } from '@nestjs-modules/mailer'
import { UsersService } from '../users/users.service'

@Injectable()
export class MailService {
  constructor(
    @Inject(forwardRef(() => MailerService))
    private mailerService: MailerService,
    @Inject(forwardRef(() => UsersService))
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
    } catch (e) {
      console.error(e)
    }
  }

  async sendPasswordResetToken(email: string, token: string) {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Password Reset Request',
        template: './password-reset',
        context: {
          resetLink,
        },
      })
    } catch (e) {
      console.error(e)
    }
  }
}
