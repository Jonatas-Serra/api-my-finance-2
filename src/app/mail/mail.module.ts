import { MailerModule } from '@nestjs-modules/mailer'
import { Module } from '@nestjs/common'
import { MailService } from './mail.service'
import * as mailgunTransport from 'nodemailer-mailgun-transport'
import { join } from 'path'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'
import { UsersModule } from '../users/users.module'

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: mailgunTransport({
          auth: {
            api_key: process.env.MAILGUN_SENDING_KEY,
            domain: process.env.MAILGUN_DOMAIN,
          },
        }),
        template: {
          dir: join(__dirname, 'emailtemp'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
        defaults: {
          from: process.env.MAILGUN_EMAIL,
        },
      }),
    }),
    UsersModule,
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
