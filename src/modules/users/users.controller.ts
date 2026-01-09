import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { GetUserDto } from "./dtos/get-user.dto";
import { ApiProperty, ApiTags } from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { IsMongoId } from "class-validator";

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
  constructor(private readonly usersService: UsersService) { }

  @Get()
  async findAll(): Promise<GetUserDto[]> {
    return await this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param() params: FindOneParams): Promise<GetUserDto> {
    return await this.usersService.findOne(params.id)
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<GetUserDto> {
    return await this.usersService.create(createUserDto)
  }

  @Put(':id')
  async update(@Param() params: UpdateParams, @Body() updateUserDto: UpdateUserDto): Promise<GetUserDto> {
    return await this.usersService.update(params.id, updateUserDto)
  }

  @Delete(':id')
  async remove(@Param() params: DeleteParams) {
    await this.usersService.remove(params.id)
  }
}
