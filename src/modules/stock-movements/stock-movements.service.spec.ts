import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { StockMovementsService } from './stock-movements.service';
import { StockMovementType } from '@enums/stock-movement-type.enum';
import { StockMovementReason } from '@enums/stock-movement-reason.enum';
import { StockMovementRepository } from './stock-movement.repository';
import { ProductRepository } from '@products/product.repository';
import { UserRepository } from '@users/user.repository';

const mockStockMovementRepository = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  total: jest.fn(),
};

const mockProductRepository = {
  exists: jest.fn(),
  update: jest.fn(),
  applyStockDelta: jest.fn(),
  revertStockDelta: jest.fn(),
  setStockDelta: jest.fn(),
};

const mockUserRepository = {
  exists: jest.fn(),
};

describe('StockMovementService', () => {
  let service: StockMovementsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        StockMovementsService,
        {
          provide: StockMovementRepository,
          useValue: mockStockMovementRepository,
        },
        {
          provide: ProductRepository,
          useValue: mockProductRepository,
        },
        {
          provide: UserRepository,
          useValue: mockUserRepository,
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

      mockProductRepository.exists.mockResolvedValue({
        _id: '69616c3558a5f808452e616c',
      });
      mockUserRepository.exists.mockResolvedValue({
        _id: '69616b6b09612500b6b11faa',
      });
      mockProductRepository.update.mockResolvedValue({
        id: '69616c3558a5f808452e616c',
      });
      mockProductRepository.applyStockDelta.mockResolvedValue(true);

      const mockData = {
        id: '1',
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockStockMovementRepository.create.mockResolvedValue({
        ...mockData,
        toObject() {
          return mockData;
        },
      });

      const result = await service.create(data);

      expect(mockStockMovementRepository.create).toHaveBeenCalledWith(data);
      expect(result.id).toBe('1');
    });
  });

  describe('findAll', () => {
    it('should return pagineted stockMovement', async () => {
      mockStockMovementRepository.total.mockResolvedValue(1);
      mockStockMovementRepository.findAll.mockReturnValue([
        {
          id: '1',
          productId: '69616c3558a5f808452e616c',
          quantity: 12,
          type: StockMovementType.IN,
          reason: StockMovementReason.PURCHASE,
          createdBy: '69616b6b09612500b6b11faa',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      const result = await service.findAll();

      expect(result.data).toHaveLength(1);
      expect(result.data[0].id).toBe('1');
    });

    it('should return stock movement matching the movement reason', async () => {
      const reason = StockMovementReason.PURCHASE;

      const mockData = [
        {
          id: '1',
          productId: '69616c3558a5f808452e616c',
          quantity: 12,
          type: StockMovementType.IN,
          reason,
          createdBy: '69616b6b09612500b6b11faa',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          productId: '69616bdd58a5f808452e616a',
          quantity: 12,
          type: StockMovementType.IN,
          reason,
          createdBy: '69616c9b30fef3f4ae1d8704',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockStockMovementRepository.total.mockResolvedValue(1);
      mockStockMovementRepository.findAll.mockReturnValue([
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
      ]);

      const result = await service.findAll({ reason });

      expect(mockStockMovementRepository.findAll).toHaveBeenCalledWith(
        { reason },
        1,
        10,
      );
      expect(result.data).toHaveLength(2);
      expect(result.data[0].id).toBe('1');
      expect(result.data[1].id).toBe('2');
    });
  });

  describe('findOne', () => {
    it('should return a single stock movement', async () => {
      mockStockMovementRepository.findOne.mockReturnValue({
        id: '1',
        productId: '69616c3558a5f808452e616c',
        quantity: 12,
        type: StockMovementType.IN,
        reason: StockMovementReason.PURCHASE,
        createdBy: '69616b6b09612500b6b11faa',
      });

      const result = await service.findOne('1');

      expect(mockStockMovementRepository.findOne).toHaveBeenCalledWith('1');
      expect(result.id).toBe('1');
    });

    it('should throw NotFoundException if stock movement does not exist', async () => {
      mockStockMovementRepository.findOne.mockReturnValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a stock movement', async () => {
      mockProductRepository.exists.mockResolvedValue({
        _id: '69616c3558a5f808452e616c',
      });
      mockUserRepository.exists.mockResolvedValue({
        _id: '69616b6b09612500b6b11faa',
      });

      mockProductRepository.update.mockResolvedValue({
        id: '69616c3558a5f808452e616c',
      });
      mockProductRepository.applyStockDelta.mockResolvedValue(true);
      mockStockMovementRepository.update.mockReturnValue({
        id: '1',
        productId: '69616c3558a5f808452e616c',
        quantity: 20,
        type: StockMovementType.IN,
        reason: StockMovementReason.PURCHASE,
        createdBy: '69616b6b09612500b6b11faa',
      });
      mockStockMovementRepository.findOne.mockReturnValue({
        id: '1',
        productId: '69616c3558a5f808452e616c',
        quantity: 20,
        type: StockMovementType.IN,
        reason: StockMovementReason.PURCHASE,
        createdBy: '69616b6b09612500b6b11faa',
      });

      const result = await service.update('1', {
        quantity: 20,
      });

      expect(result.quantity).toBe(20);
    });

    it('should throw NotFoundException if stockMovement does not exist', async () => {
      mockStockMovementRepository.update.mockReturnValue(null);
      mockStockMovementRepository.findOne.mockReturnValue(null);

      await expect(service.update('1', { productId: 'X' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete stock movement successfully', async () => {
      mockStockMovementRepository.findOne.mockResolvedValue({
        id: '1',
        productId: '1',
      });
      mockStockMovementRepository.delete.mockResolvedValue({
        id: '1',
        productId: '1',
      });
      mockProductRepository.applyStockDelta.mockResolvedValue({ id: '1' });

      const result = await service.remove('1');

      expect(result.id).toBe('1');
    });

    it('should throw NotFoundException if stockMovement does not exist', async () => {
      mockStockMovementRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });
  });
});
