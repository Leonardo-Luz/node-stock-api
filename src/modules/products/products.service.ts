import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './product.schema';
import { GetProductDto } from './dtos/get-product.dto';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { FindProductsQueryDto } from './dtos/find-products-query.dto';
import { ParsedQueryFilterProducts } from './interfaces/parsed-query-filter-products.interface';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) { }

  async findAll(query?: FindProductsQueryDto): Promise<GetProductDto[]> {
    const filter: ParsedQueryFilterProducts = {};

    if (query?.category) {
      filter.category = query.category;
    }

    if (query?.status) {
      filter.status = query.status;
    }

    if (query?.minPrice || query?.maxPrice) {
      filter.price = {};
      if (query.minPrice) filter.price.$gte = query.minPrice;
      if (query.maxPrice) filter.price.$lte = query.maxPrice;
    }

    const products = await this.productModel.find(filter).lean();
    return products.map(this.toDto);
  }

  async findOne(id: string): Promise<GetProductDto> {
    const product = await this.productModel.findById(id).lean();

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return this.toDto(product);
  }

  async create(createProductDto: CreateProductDto): Promise<GetProductDto> {
    const createdProduct = await this.productModel.create(createProductDto);
    return this.toDto(createdProduct.toObject());
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<GetProductDto> {
    const product = await this.productModel
      .findByIdAndUpdate(id, updateProductDto, {
        new: true,
        runValidators: true,
      })
      .lean();

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return this.toDto(product);
  }

  async remove(id: string): Promise<void> {
    const result = await this.productModel.findByIdAndDelete(id);

    if (!result) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
  }

  private toDto(product: ProductDocument): GetProductDto {
    return {
      id: product._id.toString(),
      name: product.name,
      description: product.description,
      price: product.price,
      currentStock: product.currentStock,
      category: product.category,
      status: product.status,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}
