import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { GetStockMovementDto } from "./dtos/get-stock-movement.dto";
import { ApiCookieAuth, ApiProperty, ApiTags } from "@nestjs/swagger";
import { StockMovementsService } from "./stock-movements.service";
import { CreateStockMovementDto } from "./dtos/create-stock-movement.dto";
import { UpdateStockMovementDto } from "./dtos/update-stock-movement.dto";
import { IsMongoId } from "class-validator";
import { FindStockMovementQueryDto } from "./dtos/find-stock-movement-query.dto";
import { ApiRoles } from "@auth/decorators/api-roles.decorator";
import { Roles } from "@auth/decorators/roles.decorator";
import { UserRole } from "@enums/user-role.enum";
import { RolesGuard } from "@auth/guards/roles.guard";
import { JwtAuthGuard } from "@auth/guards/jwt-auth.guard";

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

@ApiTags('Stock Movements')
@Controller('stock-movements')
export class StockMovementsController {
  constructor(private readonly stockMovementsService: StockMovementsService) { }

  @ApiCookieAuth('access_token')
  @ApiRoles(UserRole.ADMIN, UserRole.MANAGER, UserRole.VIEWER)
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.VIEWER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async findAll(@Query() query: FindStockMovementQueryDto): Promise<GetStockMovementDto[]> {
    return await this.stockMovementsService.findAll(query);
  }

  @ApiCookieAuth('access_token')
  @ApiRoles(UserRole.ADMIN, UserRole.MANAGER, UserRole.VIEWER)
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.VIEWER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  async findOne(@Param() params: FindOneParams): Promise<GetStockMovementDto> {
    return await this.stockMovementsService.findOne(params.id)
  }

  @ApiCookieAuth('access_token')
  @ApiRoles(UserRole.ADMIN, UserRole.MANAGER)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(@Body() createStockMovementDto: CreateStockMovementDto): Promise<GetStockMovementDto> {
    return await this.stockMovementsService.create(createStockMovementDto)
  }

  @ApiCookieAuth('access_token')
  @ApiRoles(UserRole.ADMIN, UserRole.MANAGER)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id')
  async update(@Param() params: UpdateParams, @Body() updateStockMovementDto: UpdateStockMovementDto): Promise<GetStockMovementDto> {
    return await this.stockMovementsService.update(params.id, updateStockMovementDto)
  }

  @ApiCookieAuth('access_token')
  @ApiRoles(UserRole.ADMIN, UserRole.MANAGER)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async remove(@Param() params: DeleteParams) {
    await this.stockMovementsService.remove(params.id)
  }
}
