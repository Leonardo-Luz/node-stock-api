import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';

import { StockMovementsService } from './stock-movements.service';
import { StockMovement } from './stock-movement.schema';
import { StockMovementType } from '@enums/stock-movement-type.enum';
import { StockMovementReason } from '@enums/stock-movement-reason.enum';
import { Product } from '../products/product.schema';
import { User } from '../users/user.schema';

const mockStockMovementModel = {
  find: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
};

const mockProductModel = {
  exists: jest.fn(),
  updateOne: jest.fn(),
};

const mockUserModel = {
  exists: jest.fn(),
};

describe('StockMovementService', () => {
  let service: StockMovementsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        StockMovementsService,
        {
          provide: getModelToken(StockMovement.name),
          useValue: mockStockMovementModel,
        },
        {
          provide: getModelToken(Product.name),
          useValue: mockProductModel,
        },
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = moduleRef.get(StockMovementsService);
  });

  describe('create', () => {
    it('should create and return stockMovement data', async () => {
      const data = {
        productId: '69616c3558a5f808452e616c',
        quantity: 12,
        type: StockMovementType.IN,
        reason: StockMovementReason.PURCHASE,
        createdBy: '69616b6b09612500b6b11faa',
      };

      mockProductModel.updateOne.mockResolvedValue({ modifiedCount: 1 });
      mockProductModel.exists.mockResolvedValue({
        _id: '69616c3558a5f808452e616c',
      });
      mockUserModel.exists.mockResolvedValue({
        _id: '69616b6b09612500b6b11faa',
      });

      const mockData = {
        _id: '1',
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockStockMovementModel.create.mockResolvedValue({
        ...mockData,
        toObject() {
          return mockData;
        },
      });

      const result = await service.create(data);

      expect(mockStockMovementModel.create).toHaveBeenCalledWith(data);
      expect(result.id).toBe('1');
    });
  });

  describe('findAll', () => {
    it('should return mapped stockMovement', async () => {
      mockStockMovementModel.find.mockReturnValue({
        lean: jest.fn().mockResolvedValue([
          {
            _id: '1',
            productId: '69616c3558a5f808452e616c',
            quantity: 12,
            type: StockMovementType.IN,
            reason: StockMovementReason.PURCHASE,
            createdBy: '69616b6b09612500b6b11faa',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]),
      });

      const result = await service.findAll({});

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });

    it('should return stock movement matching the movement reason', async () => {
      const reason = StockMovementReason.PURCHASE;

      const mockData = [
        {
          _id: '1',
          productId: '69616c3558a5f808452e616c',
          quantity: 12,
          type: StockMovementType.IN,
          reason,
          createdBy: '69616b6b09612500b6b11faa',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          _id: '2',
          productId: '69616bdd58a5f808452e616a',
          quantity: 12,
          type: StockMovementType.IN,
          reason,
          createdBy: '69616c9b30fef3f4ae1d8704',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockStockMovementModel.find.mockReturnValue({
        lean: jest.fn().mockResolvedValue([
          {
            ...mockData[0],
            toObject() {
              return mockData[0];
            },
          },
          {
            ...mockData[1],
            toObject() {
              return mockData[1];
            },
          },
        ]),
      });

      const result = await service.findAll({ reason });

      expect(mockStockMovementModel.find).toHaveBeenCalledWith({ reason });
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('1');
      expect(result[1].id).toBe('2');
    });
  });

  describe('findOne', () => {
    it('should return a single stock movement', async () => {
      mockStockMovementModel.findById.mockReturnValue({
        lean: jest.fn().mockResolvedValue({
          _id: '1',
          productId: '69616c3558a5f808452e616c',
          quantity: 12,
          type: StockMovementType.IN,
          reason: StockMovementReason.PURCHASE,
          createdBy: '69616b6b09612500b6b11faa',
        }),
      });

      const result = await service.findOne('1');

      expect(mockStockMovementModel.findById).toHaveBeenCalledWith('1');
      expect(result.id).toBe('1');
    });

    it('should throw NotFoundException if stock movement does not exist', async () => {
      mockStockMovementModel.findById.mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a stock movement', async () => {
      mockProductModel.exists.mockResolvedValue({
        _id: '69616c3558a5f808452e616c',
      });
      mockUserModel.exists.mockResolvedValue({
        _id: '69616b6b09612500b6b11faa',
      });
      mockProductModel.updateOne.mockResolvedValue({ modifiedCount: 1 });
      mockStockMovementModel.findByIdAndUpdate.mockReturnValue({
        lean: jest.fn().mockResolvedValue({
          _id: '1',
          productId: String('69616c3558a5f808452e616c'),
          quantity: 20,
          type: StockMovementType.IN,
          reason: StockMovementReason.PURCHASE,
          createdBy: String('69616b6b09612500b6b11faa'),
        }),
      });
      mockStockMovementModel.findById.mockReturnValue({
        lean: jest.fn().mockResolvedValue({
          _id: '1',
          productId: String('69616c3558a5f808452e616c'),
          quantity: 20,
          type: StockMovementType.IN,
          reason: StockMovementReason.PURCHASE,
          createdBy: String('69616b6b09612500b6b11faa'),
        }),
      });

      const result = await service.update('1', {
        quantity: 20,
      });

      expect(result.quantity).toBe(20);
    });

    it('should throw NotFoundException if stockMovement does not exist', async () => {
      mockStockMovementModel.findByIdAndUpdate.mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      });
      mockStockMovementModel.findById.mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      });

      await expect(service.update('1', { productId: 'X' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete stock movement successfully', async () => {
      mockStockMovementModel.findByIdAndDelete.mockResolvedValue({ _id: '1' });
      mockProductModel.updateOne.mockResolvedValue({ modifiedCount: 1 });

      await service.remove('1');

      expect(mockStockMovementModel.findByIdAndDelete).toHaveBeenCalledWith(
        '1',
      );
    });

    it('should throw NotFoundException if stockMovement does not exist', async () => {
      mockStockMovementModel.findById.mockResolvedValue(null);

      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });
  });
});
