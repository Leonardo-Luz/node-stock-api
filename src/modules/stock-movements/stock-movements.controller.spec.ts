import { Test } from '@nestjs/testing';
import { StockMovementsController } from './stock-movements.controller';
import { StockMovementsService } from './stock-movements.service';
import { GetStockMovementDto } from './dtos/get-stock-movement.dto';
import { CreateStockMovementDto } from './dtos/create-stock-movement.dto';
import { StockMovementType } from '@enums/stock-movement-type.enum';
import { StockMovementReason } from '@enums/stock-movement-reason.enum';

describe('StockMovementController', () => {
  let stockMovementController: StockMovementsController;
  let stockMovementService: jest.Mocked<StockMovementsService>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [StockMovementsController],
      providers: [
        {
          provide: StockMovementsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    stockMovementService = moduleRef.get(StockMovementsService);
    stockMovementController = moduleRef.get(StockMovementsController);
  });

  describe('create', () => {
    it('should delegate stock movement creation to the service and return stock movement data', async () => {
      const createDto: CreateStockMovementDto = {
        productId: '69616c3558a5f808452e616c',
        quantity: 12,
        type: StockMovementType.IN,
        reason: StockMovementReason.PURCHASE,
        createdBy: '69616b6b09612500b6b11faa',
      };

      const serviceResult: GetStockMovementDto = {
        id: '1',
        productId: '69616c3558a5f808452e616c',
        quantity: 12,
        type: StockMovementType.IN,
        reason: StockMovementReason.PURCHASE,
        createdBy: '69616b6b09612500b6b11faa',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      stockMovementService.create.mockResolvedValue(serviceResult);

      const result = await stockMovementController.create(createDto);

      expect(stockMovementService.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(serviceResult);
    });
  });

  describe('findAll', () => {
    it('should return an array of stockMovement', async () => {
      const result: GetStockMovementDto[] = [
        {
          id: '1',
          productId: '69616c3558a5f808452e616c',
          quantity: 12,
          type: StockMovementType.IN,
          reason: StockMovementReason.PURCHASE,
          createdBy: '69616b6b09612500b6b11faa',
          createdAt: new Date('2012-01-01T10:00:00.000Z'),
          updatedAt: new Date('2012-01-02T10:00:00.000Z'),
        },
        {
          id: '2',
          productId: '69616bdd58a5f808452e616a',
          quantity: 12,
          type: StockMovementType.IN,
          reason: StockMovementReason.PURCHASE,
          createdBy: '69616c9b30fef3f4ae1d8704',
          createdAt: new Date('2026-01-01T09:00:00.000Z'),
          updatedAt: new Date('2026-01-06T11:30:00.000Z'),
        },
      ];

      stockMovementService.findAll.mockResolvedValue(result);

      const response = await stockMovementController.findAll({});

      expect(response).toEqual(result);
      expect(stockMovementService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single stockMovement by id', async () => {
      const stockMovement: GetStockMovementDto = {
        id: '1',
        productId: '69616c3558a5f808452e616c',
        quantity: 12,
        type: StockMovementType.IN,
        reason: StockMovementReason.PURCHASE,
        createdBy: '69616b6b09612500b6b11faa',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      stockMovementService.findOne.mockResolvedValue(stockMovement);

      const result = await stockMovementController.findOne({
        id: '1',
      });

      expect(stockMovementService.findOne).toHaveBeenCalledWith('1');
      expect(result).toEqual(stockMovement);
    });
  });

  describe('update', () => {
    it('should delegate update to the service and return updated stockMovement', async () => {
      const updatedStockMovement: GetStockMovementDto = {
        id: '1',
        productId: '69616c3558a5f808452e616c',
        quantity: 20,
        type: StockMovementType.IN,
        reason: StockMovementReason.PURCHASE,
        createdBy: '69616b6b09612500b6b11faa',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      stockMovementService.update.mockResolvedValue(updatedStockMovement);

      const result = await stockMovementController.update(
        { id: '1' },
        { quantity: 20.0 },
      );

      expect(stockMovementService.update).toHaveBeenCalledWith('1', {
        quantity: 20.0,
      });
      expect(result).toEqual(updatedStockMovement);
    });
  });

  describe('remove', () => {
    it('should delegate deletion to the service', async () => {
      stockMovementService.remove.mockResolvedValue();

      await expect(
        stockMovementController.remove({
          id: '1',
        }),
      ).resolves.toBeUndefined();

      expect(stockMovementService.remove).toHaveBeenCalledWith('1');
    });
  });
});
