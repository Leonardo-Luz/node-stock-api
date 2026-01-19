import { Injectable, NotFoundException } from '@nestjs/common';
import { GetProductDto } from './dtos/get-product.dto';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { FindProductsQueryDto } from './dtos/find-products-query.dto';
import { ParsedQueryFilterProducts } from './interfaces/parsed-query-filter-products.interface';
import { ProductRepository } from './product.repository';

@Injectable()
export class ProductsService {
  constructor(private readonly productRepository: ProductRepository) {}

  async findAll(query?: FindProductsQueryDto) {
    const filter: ParsedQueryFilterProducts = {};
    let page = 1;
    let limit = 10;

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

    if (query?.page) {
      page = query.page;
    }

    if (query?.limit) {
      limit = query.limit;
    }

    const products = await this.productRepository.findAll(filter, page, limit);
    const total = await this.productRepository.total(filter);

    const totalPages = Math.ceil(total / limit);

    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1 && page <= totalPages + 1,
      },
    };
  }

  async findOne(id: string): Promise<GetProductDto> {
    const product = await this.productRepository.findOne(id);

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return product;
  }

  async create(createProductDto: CreateProductDto): Promise<GetProductDto> {
    const createdProduct =
      await this.productRepository.create(createProductDto);

    return createdProduct;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<GetProductDto> {
    const product = await this.productRepository.update(id, updateProductDto);

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return product;
  }

  async remove(id: string): Promise<GetProductDto> {
    const result = await this.productRepository.delete(id);

    if (!result) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return result;
  }
}
