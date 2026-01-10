import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { GetStockMovementDto } from "./dtos/get-stock-movement.dto";
import { ApiProperty, ApiTags } from "@nestjs/swagger";
import { StockMovementsService } from "./stock-movements.service";
import { CreateStockMovementDto } from "./dtos/create-stock-movement.dto";
import { UpdateStockMovementDto } from "./dtos/update-stock-movement.dto";
import { IsMongoId } from "class-validator";
import { FindStockMovementQueryDto } from "./dtos/find-stock-movement-query.dto";

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

  @Get()
  async findAll(@Query() query: FindStockMovementQueryDto): Promise<GetStockMovementDto[]> {
    return await this.stockMovementsService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param() params: FindOneParams): Promise<GetStockMovementDto> {
    return await this.stockMovementsService.findOne(params.id)
  }

  @Post()
  async create(@Body() createStockMovementDto: CreateStockMovementDto): Promise<GetStockMovementDto> {
    return await this.stockMovementsService.create(createStockMovementDto)
  }

  @Put(':id')
  async update(@Param() params: UpdateParams, @Body() updateStockMovementDto: UpdateStockMovementDto): Promise<GetStockMovementDto> {
    return await this.stockMovementsService.update(params.id, updateStockMovementDto)
  }

  @Delete(':id')
  async remove(@Param() params: DeleteParams) {
    await this.stockMovementsService.remove(params.id)
  }
}
