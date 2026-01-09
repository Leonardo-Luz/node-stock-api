import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { GetProductDto } from "./dtos/get-product.dto";
import { ApiProperty, ApiTags } from "@nestjs/swagger";
import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dtos/create-product.dto";
import { UpdateProductDto } from "./dtos/update-product.dto";
import { IsMongoId } from "class-validator";
import { FindProductsQueryDto } from "./dtos/find-products-query.dto";

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

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Get()
  async findAll(@Query() query: FindProductsQueryDto): Promise<GetProductDto[]> {
    return await this.productsService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param() params: FindOneParams): Promise<GetProductDto> {
    return await this.productsService.findOne(params.id)
  }

  @Post()
  async create(@Body() createProductDto: CreateProductDto): Promise<GetProductDto> {
    return await this.productsService.create(createProductDto)
  }

  @Put(':id')
  async update(@Param() params: UpdateParams, @Body() updateProductDto: UpdateProductDto): Promise<GetProductDto> {
    return await this.productsService.update(params.id, updateProductDto)
  }

  @Delete(':id')
  async remove(@Param() params: DeleteParams) {
    await this.productsService.remove(params.id)
  }
}
