import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StockMovement, StockMovementDocument } from './stock-movement.schema';
import { GetStockMovementDto } from './dtos/get-stock-movement.dto';
import { CreateStockMovementDto } from './dtos/create-stock-movement.dto';
import { UpdateStockMovementDto } from './dtos/update-stock-movement.dto';
import { FindStockMovementQueryDto } from './dtos/find-stock-movement-query.dto';
import { ProductDocument, Product } from '../products/product.schema';
import { StockMovementType } from '@enums/stock-movement-type.enum';
import { User, UserDocument } from '../users/user.schema';
import { ParsedQueryFilterStockMovement } from './interfaces/parsed-query-filter-stock-movements';

@Injectable()
export class StockMovementsService {
  constructor(
    @InjectModel(StockMovement.name)
    private readonly stockMovementModel: Model<StockMovementDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) { }

  async findAll(
    query?: FindStockMovementQueryDto,
  ): Promise<GetStockMovementDto[]> {
    const filter: ParsedQueryFilterStockMovement = {};

    if (query?.productId) filter.productId = query.productId;

    if (query?.reason) filter.reason = query.reason;

    if (query?.type) filter.type = query.type;

    if (query?.createdBy) filter.createdBy = query.createdBy;

    const stockMovement = await this.stockMovementModel.find(filter).lean();
    return stockMovement.map(this.toDto);
  }

  async findOne(id: string): Promise<GetStockMovementDto> {
    const stockMovement = await this.stockMovementModel.findById(id).lean();

    if (!stockMovement) {
      throw new NotFoundException(`StockMovement with id ${id} not found`);
    }

    return this.toDto(stockMovement);
  }

  async create(
    createStockMovementDto: CreateStockMovementDto,
  ): Promise<GetStockMovementDto> {
    const productExists = await this.productModel.exists({
      _id: createStockMovementDto.productId,
    });

    if (!productExists) {
      throw new NotFoundException(
        `Product with id ${createStockMovementDto.productId} not found`,
      );
    }

    const userExists = await this.userModel.exists({
      _id: createStockMovementDto.createdBy,
    });

    if (!userExists) {
      throw new NotFoundException(
        `User with id ${createStockMovementDto.productId} not found`,
      );
    }

    if (createStockMovementDto.type === StockMovementType.ADJUSTMENT) {
      await this.productModel.updateOne(
        { _id: createStockMovementDto.productId },
        { $set: { currentStock: createStockMovementDto.quantity } },
      );
    } else {
      const delta =
        createStockMovementDto.type === StockMovementType.OUT
          ? -createStockMovementDto.quantity
          : createStockMovementDto.quantity;

      const result = await this.productModel.updateOne(
        {
          _id: createStockMovementDto.productId,
          ...(delta < 0 && {
            currentStock: { $gte: Math.abs(delta) },
          }),
        },
        { $inc: { currentStock: delta } },
      );

      if (result.modifiedCount === 0) {
        throw new BadRequestException('Insufficient stock');
      }
    }

    const movement = await this.stockMovementModel.create(
      createStockMovementDto,
    );
    return this.toDto(movement.toObject());
  }

  async update(
    id: string,
    dto: UpdateStockMovementDto,
  ): Promise<GetStockMovementDto> {
    const existing = await this.stockMovementModel.findById(id).lean();

    if (!existing) {
      throw new NotFoundException(`StockMovement with id ${id} not found`);
    }

    const oldProductId = existing.productId.toString();
    const newProductId = dto.productId ?? oldProductId;

    const oldDelta =
      existing.type === StockMovementType.ADJUSTMENT
        ? null
        : existing.type === StockMovementType.OUT
          ? -existing.quantity
          : existing.quantity;

    const newType = dto.type ?? existing.type;
    const newQuantity = dto.quantity ?? existing.quantity;

    const newDelta =
      newType === StockMovementType.OUT ? -newQuantity : newQuantity;

    if (oldDelta !== null) {
      await this.productModel.updateOne(
        { _id: oldProductId },
        { $inc: { currentStock: -oldDelta } },
      );
    }

    if (newType === StockMovementType.ADJUSTMENT) {
      await this.productModel.updateOne(
        { _id: newProductId },
        { $set: { currentStock: newQuantity } },
      );
    } else {
      const result = await this.productModel.updateOne(
        {
          _id: newProductId,
          ...(newDelta < 0 && {
            currentStock: { $gte: Math.abs(newDelta) },
          }),
        },
        { $inc: { currentStock: newDelta } },
      );

      if (result.modifiedCount === 0) {
        if (oldDelta !== null) {
          await this.productModel.updateOne(
            { _id: oldProductId },
            { $inc: { currentStock: oldDelta } },
          );
        }
        throw new BadRequestException('Insufficient stock');
      }
    }

    const updated = await this.stockMovementModel
      .findByIdAndUpdate(id, dto, {
        new: true,
        runValidators: true,
      })
      .lean();

    if (!updated) {
      throw new NotFoundException();
    }

    return this.toDto(updated);
  }

  async remove(id: string): Promise<void> {
    const movement = await this.stockMovementModel.findById(id);

    if (!movement) {
      throw new NotFoundException(`StockMovement with id ${id} not found`);
    }

    if (movement.type !== StockMovementType.ADJUSTMENT) {
      const delta =
        movement.type === StockMovementType.OUT
          ? movement.quantity
          : -movement.quantity;

      const result = await this.productModel.updateOne(
        {
          _id: movement.productId,
          ...(delta < 0 && {
            currentStock: { $gte: Math.abs(delta) },
          }),
        },
        { $inc: { currentStock: delta } },
      );

      if (result.modifiedCount === 0) {
        throw new BadRequestException('Cannot revert stock movement');
      }
    }

    await this.stockMovementModel.findByIdAndDelete(id);
  }

  private toDto(stockMovement: StockMovementDocument): GetStockMovementDto {
    return {
      id: stockMovement._id.toString(),
      productId: stockMovement.productId,
      quantity: stockMovement.quantity,
      type: stockMovement.type,
      reason: stockMovement.reason,
      createdBy: stockMovement.createdBy,
      createdAt: stockMovement.createdAt,
      updatedAt: stockMovement.updatedAt,
    };
  }
}
