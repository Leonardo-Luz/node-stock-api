import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Product, ProductDocument } from "./product.schema";
import { Model } from "mongoose";
import { UpdateUserDto } from "@users/dtos/update-user.dto";
import { ParsedQueryFilterProducts } from "./interfaces/parsed-query-filter-products.interface";
import { CreateProductDto } from "./dtos/create-product.dto";
import { plainToInstance } from "class-transformer";
import { GetProductDto } from "./dtos/get-product.dto";

@Injectable()
export class ProductRepository {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) { }

  async findAll(filter: ParsedQueryFilterProducts) {
    const products = await this.productModel.find(filter).lean();

    return plainToInstance(GetProductDto, products, {
      excludeExtraneousValues: true,
    })
  }

  async findOne(id: string) {
    const product = await this.productModel.findById(id).lean();

    return plainToInstance(GetProductDto, product, {
      excludeExtraneousValues: true,
    })
  }

  async create(createProductDto: CreateProductDto) {
    const product = await this.productModel.create(createProductDto);

    return plainToInstance(GetProductDto, product, {
      excludeExtraneousValues: true,
    })
  }

  async update(id: string, updateProductDto: UpdateUserDto) {
    const product = await this.productModel
      .findByIdAndUpdate(id, updateProductDto, {
        new: true,
        runValidators: true,
      })
      .lean();

    return plainToInstance(GetProductDto, product, {
      excludeExtraneousValues: true,
    })
  }

  async delete(id: string) {
    const product = await this.productModel.findByIdAndDelete(id).lean();

    return plainToInstance(GetProductDto, product, {
      excludeExtraneousValues: true,
    })
  }
}
