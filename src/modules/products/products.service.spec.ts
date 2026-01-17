import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { ProductsService } from './products.service';
import { ProductRepository } from './product.repository';

const mockProductRepository = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: ProductRepository,
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    service = moduleRef.get(ProductsService);
  });

  describe('create', () => {
    it('should create and return product data', async () => {
      const data = {
        name: 'Rice',
        price: 29.99,
        currentStock: 99,
        category: 'Groceries',
      };

      const mockData = {
        id: '1',
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockProductRepository.create.mockResolvedValue({
        ...mockData,
        toObject() {
          return mockData;
        },
      });

      const result = await service.create(data);

      expect(mockProductRepository.create).toHaveBeenCalledWith(data);
      expect(result.id).toBe('1');
    });
  });

  describe('findAll', () => {
    it('should return mapped products', async () => {
      mockProductRepository.findAll.mockReturnValue(
        [
          {
            id: '1',
            name: 'Rice',
            price: 29.99,
            currentStock: 99,
            category: 'Groceries',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ])

      const result = await service.findAll({});

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });

    it('should return products matching the category', async () => {
      const category = 'Groceries';

      const mockData = [
        {
          id: '1',
          name: 'Rice',
          category,
          price: 29.99,
          currentStock: 99,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          name: 'Beans',
          category,
          price: 19.99,
          currentStock: 99,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockProductRepository.findAll.mockReturnValue(
        [
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
        ])

      const result = await service.findAll({ category });

      expect(mockProductRepository.findAll).toHaveBeenCalledWith({ category });
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('1');
      expect(result[1].id).toBe('2');
    });
  });

  describe('findOne', () => {
    it('should return a single product', async () => {
      mockProductRepository.findOne.mockReturnValue({
        id: '1',
        name: 'Rice',
        price: 29.99,
        currentStock: 99,
        category: 'Groceries',
      });

      const result = await service.findOne('1');

      expect(mockProductRepository.findOne).toHaveBeenCalledWith('1');
      expect(result.id).toBe('1');
    });

    it('should throw NotFoundException if product does not exist', async () => {
      mockProductRepository.findOne.mockReturnValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      mockProductRepository.update.mockReturnValue({
        _id: '1',
        name: 'Rice',
        price: 20.0,
        currentStock: 99,
        category: 'Groceries',
      });

      const result = await service.update('1', {
        price: 20.0,
      });

      expect(result.price).toBe(20.0);
    });

    it('should throw NotFoundException if product does not exist', async () => {
      mockProductRepository.update.mockReturnValue(null);

      await expect(service.update('1', { name: 'X' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete product successfully', async () => {
      mockProductRepository.delete.mockResolvedValue({ id: '1' });

      const result = await service.remove('1');

      expect(result.id).toBe('1');
    });

    it('should throw NotFoundException if product does not exist', async () => {
      mockProductRepository.delete.mockResolvedValue(null);

      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });
  });
});
