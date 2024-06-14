import {
  Injectable,
  Logger,
  BadRequestException,
} from '@nestjs/common'
import { S3 } from 'aws-sdk'
import { v4 as uuidv4 } from 'uuid'
import * as mime from 'mime-types'

@Injectable()
export class AwsS3Service {
  private readonly s3: S3
  private readonly logger = new Logger(AwsS3Service.name)

  constructor() {
    this.s3 = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    })
  }

  async uploadFile(
    file: Express.Multer.File,
    bucketName: string,
  ): Promise<string> {
    if (!file) {
      this.logger.error('File is missing')
      throw new BadRequestException('File is required')
    }

    if (!file.buffer) {
      this.logger.error('File buffer is missing')
      throw new BadRequestException('File should have a buffer')
    }

    const fileName = `${uuidv4()}-${file.originalname}`
    const contentType = mime.lookup(fileName)

    const params = {
      Bucket: bucketName,
      Key: fileName,
      Body: file.buffer,
      ACL: 'public-read',
      ContentType: contentType || 'application/octet-stream',
    }

    const data = await this.s3.upload(params).promise()

    return data.Location
  }

  async deleteFile(
    bucketName: string,
    fileName: string,
  ): Promise<void> {
    const params = {
      Bucket: bucketName,
      Key: fileName,
    }

    await this.s3.deleteObject(params).promise()
  }
}
