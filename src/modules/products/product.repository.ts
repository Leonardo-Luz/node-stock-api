import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './product.schema';
import { Model } from 'mongoose';
import { UpdateUserDto } from '@users/dtos/update-user.dto';
import { ParsedQueryFilterProducts } from './interfaces/parsed-query-filter-products.interface';
import { CreateProductDto } from './dtos/create-product.dto';
import { plainToInstance } from 'class-transformer';
import { GetProductDto } from './dtos/get-product.dto';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async exists(id: string) {
    return await this.productModel.exists({
      _id: id,
    });
  }

  async findAll(
    filter: ParsedQueryFilterProducts,
    page: number,
    limit: number,
  ) {
    const products = await this.productModel
      .find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();

    return plainToInstance(GetProductDto, products, {
      excludeExtraneousValues: true,
    });
  }

  async total(filter: ParsedQueryFilterProducts) {
    return await this.productModel.countDocuments(filter);
  }

  async findOne(id: string) {
    const product = await this.productModel.findById(id).lean();

    return plainToInstance(GetProductDto, product, {
      excludeExtraneousValues: true,
    });
  }

  async create(createProductDto: CreateProductDto) {
    const product = await this.productModel.create(createProductDto);

    return plainToInstance(GetProductDto, product, {
      excludeExtraneousValues: true,
    });
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
    });
  }

  async delete(id: string) {
    const product = await this.productModel.findByIdAndDelete(id).lean();

    return plainToInstance(GetProductDto, product, {
      excludeExtraneousValues: true,
    });
  }

  async applyStockDelta(id: string, delta: number): Promise<boolean> {
    const result = await this.productModel.updateOne(
      {
        _id: id,
        ...(delta < 0 && {
          currentStock: { $gte: Math.abs(delta) },
        }),
      },
      { $inc: { currentStock: delta } },
    );

    return result.modifiedCount === 1;
  }

  async setStockQuantity(id: string, quantity: number): Promise<boolean> {
    const result = await this.productModel.updateOne(
      { _id: id },
      { $set: { currentStock: quantity } },
    );

    return result.modifiedCount === 1;
  }

  async revertStockDelta(id: string, previousDelta: number): Promise<boolean> {
    const result = await this.productModel.updateOne(
      { _id: id },
      { $inc: { currentStock: -previousDelta } },
    );

    return result.modifiedCount === 1;
  }
}
