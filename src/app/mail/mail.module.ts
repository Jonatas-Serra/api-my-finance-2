import { MailerModule } from '@nestjs-modules/mailer'
import { forwardRef, Module } from '@nestjs/common'
import { MailService } from './mail.service'
import { join } from 'path'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'
import { UsersModule } from '../users/users.module'

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT, 10),
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
          },
        },
        template: {
          dir: join(__dirname, 'emailtemp'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
        defaults: {
          from: `"No Reply" <${process.env.SMTP_USER}>`,
        },
      }),
    }),
    forwardRef(() => UsersModule),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
