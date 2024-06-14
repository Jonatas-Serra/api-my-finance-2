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
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { UsersService } from '../users/users.service'
import { AwsS3Service } from '../aws/aws-s3.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(
    private readonly awsS3Service: AwsS3Service,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('user/:id')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload user profile picture' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'Profile picture uploaded successfully.',
  })
  @ApiBearerAuth()
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
  @ApiOperation({ summary: 'Remove user profile picture' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'Profile picture removed successfully.',
  })
  @ApiBearerAuth()
  async removeUserProfilePicture(@Param('id') id: string) {
    return await this.usersService.removeProfilePicture(id)
  }
}
