import { Module } from '@nestjs/common'
import { MulterModule } from '@nestjs/platform-express'
import { UploadController } from './upload.controller'
import { AwsModule } from '../aws/aws.module'
import { memoryStorage } from 'multer'
import { UsersModule } from '../users/users.module'

@Module({
  imports: [
    AwsModule,
    MulterModule.register({
      storage: memoryStorage(),
    }),
    UsersModule,
  ],
  controllers: [UploadController],
})
export class UploadModule {}
