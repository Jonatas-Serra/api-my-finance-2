import { plainToClass } from 'class-transformer'
import {
  Body,
  UseGuards,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Param,
} from '@nestjs/common'
import { UsersSerializer } from './serializer/users.serializer'
import { UsersService } from './users.service'
import { JwtAuthGuard } from 'src/app/auth/guards/jwt-auth.guard'
import { IsPublic } from 'src/app/auth/decorators/is-public.decorator'
import {
  ApiBearerAuth,
  ApiTags,
  ApiParam,
  ApiBody,
  ApiResponse,
  ApiOperation,
} from '@nestjs/swagger'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Returns all users.',
  })
  async findAll(): Promise<any> {
    return this.usersService.findAll()
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({
    name: 'id',
    description: 'ID of the user to retrieve',
  })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully retrieved.',
  })
  async findOneById(@Param('id') id: string): Promise<any> {
    return this.usersService.findOneById(id)
  }

  @IsPublic()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('signup')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  async create(@Body() createUserDto: any): Promise<any> {
    return this.usersService.create(createUserDto)
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiParam({
    name: 'id',
    description: 'ID of the user to update',
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
  })
  update(@Param('id') id: string, @Body() updateUserDto: any) {
    return plainToClass(
      UsersSerializer,
      this.usersService.update(id, updateUserDto),
      {
        excludeExtraneousValues: true,
      },
    )
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({
    name: 'id',
    description: 'ID of the user to delete',
  })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully deleted.',
  })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id)
  }
}
