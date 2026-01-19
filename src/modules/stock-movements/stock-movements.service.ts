import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GetStockMovementDto } from './dtos/get-stock-movement.dto';
import { CreateStockMovementDto } from './dtos/create-stock-movement.dto';
import { UpdateStockMovementDto } from './dtos/update-stock-movement.dto';
import { FindStockMovementQueryDto } from './dtos/find-stock-movement-query.dto';
import { StockMovementType } from '@enums/stock-movement-type.enum';
import { ParsedQueryFilterStockMovements } from './interfaces/parsed-query-filter-stock-movements';
import { StockMovementRepository } from './stock-movement.repository';
import { ProductRepository } from '@products/product.repository';
import { UserRepository } from '@users/user.repository';

@Injectable()
export class StockMovementsService {
  constructor(
    private readonly stockMovementRepository: StockMovementRepository,
    private readonly productRepository: ProductRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async findAll(query?: FindStockMovementQueryDto) {
    const filter: ParsedQueryFilterStockMovements = {};
    let page = 1;
    let limit = 10;

    if (query?.productId) {
      filter.productId = query.productId;
    }

    if (query?.reason) {
      filter.reason = query.reason;
    }

    if (query?.type) {
      filter.type = query.type;
    }

    if (query?.createdBy) {
      filter.createdBy = query.createdBy;
    }

    if (query?.page) {
      page = query.page;
    }

    if (query?.limit) {
      limit = query.limit;
    }

    const stockMovements = await this.stockMovementRepository.findAll(
      filter,
      page,
      limit,
    );
    const total = await this.stockMovementRepository.total(filter);

    const totalPages = Math.ceil(total / limit);

    return {
      data: stockMovements,
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

  async findOne(id: string): Promise<GetStockMovementDto> {
    const stockMovement = await this.stockMovementRepository.findOne(id);

    if (!stockMovement) {
      throw new NotFoundException(`StockMovement with id ${id} not found`);
    }

    return stockMovement;
  }

  async create(
    createStockMovementDto: CreateStockMovementDto,
  ): Promise<GetStockMovementDto> {
    const productExists = await this.productRepository.exists(
      createStockMovementDto.productId,
    );

    if (!productExists) {
      throw new NotFoundException(
        `Product with id ${createStockMovementDto.productId} not found`,
      );
    }

    const userExists = await this.userRepository.exists(
      createStockMovementDto.createdBy,
    );

    if (!userExists) {
      throw new NotFoundException(
        `User with id ${createStockMovementDto.productId} not found`,
      );
    }

    if (createStockMovementDto.type === StockMovementType.ADJUSTMENT) {
      await this.productRepository.setStockQuantity(
        createStockMovementDto.productId,
        createStockMovementDto.quantity,
      );
    } else {
      const delta =
        createStockMovementDto.type === StockMovementType.OUT
          ? -createStockMovementDto.quantity
          : createStockMovementDto.quantity;

      const success = await this.productRepository.applyStockDelta(
        createStockMovementDto.productId,
        delta,
      );

      if (!success) {
        throw new BadRequestException('Insufficient stock');
      }
    }

    const movement = await this.stockMovementRepository.create(
      createStockMovementDto,
    );
    return movement;
  }

  async update(
    id: string,
    dto: UpdateStockMovementDto,
  ): Promise<GetStockMovementDto> {
    const existing = await this.stockMovementRepository.findOne(id);

    if (!existing) {
      throw new NotFoundException(`StockMovement with id ${id} not found`);
    }

    const oldProductId = existing.productId;
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
      await this.productRepository.revertStockDelta(oldProductId, oldDelta);
    }

    if (newType === StockMovementType.ADJUSTMENT) {
      await this.productRepository.setStockQuantity(newProductId, newQuantity);
    } else {
      const success = await this.productRepository.applyStockDelta(
        newProductId,
        newDelta,
      );

      if (!success) {
        if (oldDelta !== null) {
          await this.productRepository.revertStockDelta(oldProductId, oldDelta);
        }
        throw new BadRequestException('Insufficient stock');
      }
    }

    const updated = await this.stockMovementRepository.update(id, dto);

    if (!updated) {
      throw new NotFoundException();
    }

    return updated;
  }

  async remove(id: string): Promise<GetStockMovementDto> {
    const movement = await this.stockMovementRepository.findOne(id);

    if (!movement) {
      throw new NotFoundException(`StockMovement with id ${id} not found`);
    }

    if (movement.type !== StockMovementType.ADJUSTMENT) {
      const delta =
        movement.type === StockMovementType.OUT
          ? movement.quantity
          : -movement.quantity;

      const success = await this.productRepository.applyStockDelta(
        movement.productId,
        delta,
      );

      if (!success) {
        throw new BadRequestException('Cannot revert stock movement');
      }
    }

    return await this.stockMovementRepository.delete(id);
  }
}
