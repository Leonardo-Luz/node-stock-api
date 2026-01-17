import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetProductDto } from './dtos/get-product.dto';
import { ApiCookieAuth, ApiProperty, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { IsMongoId } from 'class-validator';
import { FindProductsQueryDto } from './dtos/find-products-query.dto';
import { ApiRoles } from '@auth/decorators/api-roles.decorator';
import { Roles } from '@auth/decorators/roles.decorator';
import { RolesGuard } from '@auth/guards/roles.guard';
import { UserRole } from '@enums/user-role.enum';
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

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiCookieAuth('access_token')
  @ApiRoles(UserRole.ADMIN, UserRole.MANAGER, UserRole.VIEWER)
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.VIEWER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async findAll(
    @Query() query: FindProductsQueryDto,
  ): Promise<GetProductDto[]> {
    return await this.productsService.findAll(query);
  }

  @ApiCookieAuth('access_token')
  @ApiRoles(UserRole.ADMIN, UserRole.MANAGER, UserRole.VIEWER)
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.VIEWER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  async findOne(@Param() params: FindOneParams): Promise<GetProductDto> {
    return await this.productsService.findOne(params.id);
  }

  @ApiCookieAuth('access_token')
  @ApiRoles(UserRole.ADMIN, UserRole.MANAGER)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<GetProductDto> {
    return await this.productsService.create(createProductDto);
  }

  @ApiCookieAuth('access_token')
  @ApiRoles(UserRole.ADMIN, UserRole.MANAGER)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id')
  async update(
    @Param() params: UpdateParams,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<GetProductDto> {
    return await this.productsService.update(params.id, updateProductDto);
  }

  @ApiCookieAuth('access_token')
  @ApiRoles(UserRole.ADMIN, UserRole.MANAGER)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async remove(@Param() params: DeleteParams): Promise<GetProductDto> {
    return await this.productsService.remove(params.id);
  }
}
