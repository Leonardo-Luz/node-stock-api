import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { StockMovement, StockMovementDocument } from './stock-movement.schema';
import { Model } from 'mongoose';
import { ParsedQueryFilterStockMovements } from './interfaces/parsed-query-filter-stock-movements';
import { CreateStockMovementDto } from './dtos/create-stock-movement.dto';
import { plainToInstance } from 'class-transformer';
import { GetStockMovementDto } from './dtos/get-stock-movement.dto';
import { UpdateStockMovementDto } from './dtos/update-stock-movement.dto';

@Injectable()
export class StockMovementRepository {
  constructor(
    @InjectModel(StockMovement.name)
    private readonly stockMovementModel: Model<StockMovementDocument>,
  ) {}

  async findAll(filter: ParsedQueryFilterStockMovements) {
    const stockMovements = await this.stockMovementModel.find(filter).lean();

    return plainToInstance(GetStockMovementDto, stockMovements, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: string) {
    const stockMovement = await this.stockMovementModel.findById(id).lean();

    return plainToInstance(GetStockMovementDto, stockMovement, {
      excludeExtraneousValues: true,
    });
  }

  async create(createStockMovementDto: CreateStockMovementDto) {
    const stockMovement = await this.stockMovementModel.create(
      createStockMovementDto,
    );

    return plainToInstance(GetStockMovementDto, stockMovement, {
      excludeExtraneousValues: true,
    });
  }

  async update(id: string, updateStockMovementDto: UpdateStockMovementDto) {
    const stockMovement = await this.stockMovementModel
      .findByIdAndUpdate(id, updateStockMovementDto, {
        new: true,
        runValidators: true,
      })
      .lean();

    return plainToInstance(GetStockMovementDto, stockMovement, {
      excludeExtraneousValues: true,
    });
  }

  async delete(id: string) {
    const stockMovement = await this.stockMovementModel
      .findByIdAndDelete(id)
      .lean();

    return plainToInstance(GetStockMovementDto, stockMovement, {
      excludeExtraneousValues: true,
    });
  }
}
