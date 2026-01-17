import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { GetUserDto } from './dtos/get-user.dto';
import { ApiCookieAuth, ApiProperty, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { IsMongoId } from 'class-validator';
import { Roles } from '@auth/decorators/roles.decorator';
import { UserRole } from '@enums/user-role.enum';
import { RolesGuard } from '@auth/guards/roles.guard';
import { ApiRoles } from '@auth/decorators/api-roles.decorator';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';

export class FindOneParams {
  @IsMongoId()
  @ApiProperty({ example: '695effb8efab678ec35554fd' })
  id: string;
}

export class UpdateParams {
  @IsMongoId()
  @ApiProperty({ example: '695effb8efab678ec35554fd' })
  id: string;
}

export class DeleteParams {
  @IsMongoId()
  @ApiProperty({ example: '695effb8efab678ec35554fd' })
  id: string;
}

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiCookieAuth('access_token')
  @ApiRoles(UserRole.ADMIN)
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async findAll(): Promise<GetUserDto[]> {
    return await this.usersService.findAll();
  }

  @ApiCookieAuth('access_token')
  @ApiRoles(UserRole.ADMIN)
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  async findOne(@Param() params: FindOneParams): Promise<GetUserDto> {
    return await this.usersService.findById(params.id);
  }

  @ApiCookieAuth('access_token')
  @ApiRoles(UserRole.ADMIN)
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<GetUserDto> {
    return await this.usersService.create(createUserDto);
  }

  @ApiCookieAuth('access_token')
  @ApiRoles(UserRole.ADMIN)
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id')
  async update(
    @Param() params: UpdateParams,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<GetUserDto> {
    return await this.usersService.update(params.id, updateUserDto);
  }

  @ApiCookieAuth('access_token')
  @ApiRoles(UserRole.ADMIN)
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async remove(@Param() params: DeleteParams) {
    return await this.usersService.remove(params.id);
  }
}
