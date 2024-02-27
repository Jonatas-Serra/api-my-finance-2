import { plainToClass } from 'class-transformer'
import {
  Body,
  UseGuards,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
} from '@nestjs/common'
import { Param } from '@nestjs/common'
import { UsersSerializer } from './serializer/users.serializer'
import { UsersService } from './users.service'
import { JwtAuthGuard } from 'src/app/auth/guards/jwt-auth.guard'
import { IsPublic } from 'src/app/auth/decorators/is-public.decorator'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<any> {
    return this.usersService.findAll()
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOneById(@Param('id') id: string): Promise<any> {
    return this.usersService.findOneById(id)
  }

  @IsPublic()
  @UseGuards(JwtAuthGuard)
  @Post('signup')
  async create(@Body() createUserDto: any): Promise<any> {
    return this.usersService.create(createUserDto)
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: any) {
    return plainToClass(
      UsersSerializer,
      this.usersService.update(id, updateUserDto),
      {
        excludeExtraneousValues: true,
      },
    )
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/update-password')
  updatePassword(
    @Param('id') id: string,
    @Body()
    updatePasswordDto: { oldPassword: string; newPassword: string },
  ) {
    return this.usersService.updatePassword(
      id,
      updatePasswordDto.oldPassword,
      updatePasswordDto.newPassword,
    )
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id)
  }
}
