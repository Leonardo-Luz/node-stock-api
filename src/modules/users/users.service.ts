import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GetUserDto } from './dtos/get-user.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './user.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
  ) { }

  async findAll(): Promise<GetUserDto[]> {
    return await this.userRepository.findAll();
  }

  async findByEmail(email: string): Promise<GetUserDto | null> {
    const user = await this.userRepository.findByEmail(email);

    return user;
  }

  async findById(id: string): Promise<GetUserDto> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  async findByIdWithRefreshToken(id: string): Promise<GetUserDto | null> {
    const user = await this.userRepository.findByIdWithRefreshToken(id);

    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<GetUserDto> {
    createUserDto.password = await bcrypt.hash(createUserDto.password, 12);

    try {
      const createdUser = await this.userRepository.create(createUserDto);
      return createdUser;
    } catch (error) {
      const errorData = error as {
        code: number;
        keyPattern?: { email: string };
      };

      if (errorData.code === 11000 && errorData.keyPattern?.email) {
        throw new ConflictException('Email already in use');
      }

      throw error;
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<GetUserDto> {
    if (updateUserDto.password)
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 12);

    const user = await this.userRepository
      .update(id, updateUserDto);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  async updateRefreshToken(
    id: string,
    hashedRefreshToken: string | null,
  ): Promise<void> {
    await this.userRepository.updateRefreshToken(id, hashedRefreshToken);
  }

  async remove(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);

    if (!result) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }
}
