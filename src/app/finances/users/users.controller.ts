import { plainToClass } from 'class-transformer'
import { Body, Controller, Get, Patch, Post } from '@nestjs/common'
import { Param } from '@nestjs/common'
import { UsersSerializer } from './serializer/users.serializer'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<any> {
    return this.usersService.findAll()
  }

  @Post('signup')
  async create(@Body() createUserDto: any): Promise<any> {
    return this.usersService.create(createUserDto)
  }

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
}
