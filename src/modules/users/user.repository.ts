import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./user.schema";
import { Model } from "mongoose";
import { UpdateUserDto } from "@users/dtos/update-user.dto";
import { CreateUserDto } from "./dtos/create-user.dto";
import { plainToInstance } from "class-transformer";
import { GetUserDto } from "./dtos/get-user.dto";

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) { }

  async exists(id: string) {
    return await this.userModel.exists({
      _id: id,
    });
  }

  async findAll() {
    const users = await this.userModel.find().lean();

    return plainToInstance(GetUserDto, users, {
      excludeExtraneousValues: true,
    })
  }

  async findById(id: string) {
    const user = await this.userModel.findById(id.toString()).lean();

    return plainToInstance(GetUserDto, user, {
      excludeExtraneousValues: true,
    })
  }

  async findByEmail(email: string) {
    const user = await this.userModel
      .findOne({ email })
      .select('+password')
      .lean();

    return plainToInstance(GetUserDto, user, {
      excludeExtraneousValues: true,
    })
  }

  async findByIdWithRefreshToken(id: string) {
    const user = await this.userModel
      .findById(id)
      .select('+hashedRefreshToken')
      .lean();

    return plainToInstance(GetUserDto, user, {
      excludeExtraneousValues: true,
    })
  }

  async create(createUserDto: CreateUserDto) {
    const user = await this.userModel.create(createUserDto);

    return plainToInstance(GetUserDto, user, {
      excludeExtraneousValues: true,
    })
  }

  async updateRefreshToken(id: string, hashedRefreshToken: string | null) {
    await this.userModel.findByIdAndUpdate(id, { hashedRefreshToken }, {
      runValidators: true,
    })
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, {
        new: true,
        runValidators: true,
      })
      .lean();

    return plainToInstance(GetUserDto, user, {
      excludeExtraneousValues: true,
    })
  }

  async delete(id: string) {
    const user = await this.userModel.findByIdAndDelete(id).lean();

    return plainToInstance(GetUserDto, user, {
      excludeExtraneousValues: true,
    })
  }
}
