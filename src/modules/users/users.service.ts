import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { GetUserDto } from './dtos/get-user.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) { }

  async findAll(): Promise<GetUserDto[]> {
    const users = await this.userModel.find().lean();
    return users.map(this.toDto);
  }

  async findOne(id: string): Promise<GetUserDto> {
    const user = await this.userModel.findById(id).lean();

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return this.toDto(user);
  }

  async create(createUserDto: CreateUserDto): Promise<GetUserDto> {
    createUserDto.password = await bcrypt.hash(createUserDto.password, 12)

    const createdUser = await this.userModel.create(createUserDto);
    return this.toDto(createdUser.toObject());
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<GetUserDto> {
    if (updateUserDto.password)
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 12)

    const user = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, {
        new: true,
        runValidators: true,
      })
      .lean();

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return this.toDto(user);
  }

  async remove(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id);

    if (!result) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }

  private toDto(user: any): GetUserDto {
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }
}
