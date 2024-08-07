import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Param,
  UseGuards,
  BadRequestException,
  Delete,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { UsersService } from '../users/users.service'
import { AwsS3Service } from '../aws/aws-s3.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { User } from '../users/entities/user.entity'
import { Express } from 'express'

@ApiTags('upload')
@Controller('upload')
export class UploadController {
  constructor(
    private readonly awsS3Service: AwsS3Service,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('user/:id')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload user profile picture' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 200,
    description: 'Profile picture uploaded successfully.',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async uploadUserProfilePicture(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File is required')
    }

    const bucketName = process.env.AWS_S3_BUCKET_NAME
    const photoUrl = await this.awsS3Service.uploadFile(
      file,
      bucketName,
    )
    return await this.usersService.updateProfilePicture(id, photoUrl)
  }

  @UseGuards(JwtAuthGuard)
  @Delete('user/:id/photo')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove user profile picture' })
  @ApiResponse({
    status: 200,
    description: 'Profile picture removed successfully.',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async removeUserProfilePicture(@Param('id') id: string) {
    return await this.usersService.removeProfilePicture(id)
  }
}
