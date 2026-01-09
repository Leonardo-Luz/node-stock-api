import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';

import { ProductsService } from './products.service';
import { Product } from './product.schema';

const mockProductModel = {
  find: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
};

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getModelToken(Product.name),
          useValue: mockProductModel,
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
      }

      mockProductModel.create.mockResolvedValue({
        _id: '1',
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
        toObject() {
          return this;
        },
      });

      const result = await service.create(data);

      expect(mockProductModel.create).toHaveBeenCalledWith(data);
      expect(result.id).toBe('1');
    });
  });

  describe('findAll', () => {
    it('should return mapped products', async () => {
      mockProductModel.find.mockReturnValue({
        lean: jest.fn().mockResolvedValue([
          {
            _id: '1',
            name: 'Rice',
            price: 29.99,
            currentStock: 99,
            category: 'Groceries',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]),
      });

      const result = await service.findAll({});

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });

    it('should return products matching the category', async () => {
      const category = 'Groceries';

      mockProductModel.find.mockReturnValue({
        lean: jest.fn().mockResolvedValue([
          {
            _id: '1',
            name: 'Rice',
            category,
            price: 29.99,
            currentStock: 99,
            createdAt: new Date(),
            updatedAt: new Date(),
            toObject() {
              return this;
            },
          },
          {
            _id: '2',
            name: 'Beans',
            category,
            price: 19.99,
            currentStock: 99,
            createdAt: new Date(),
            updatedAt: new Date(),
            toObject() {
              return this;
            },
          },
        ]),
      });

      const result = await service.findAll({ category });

      expect(mockProductModel.find).toHaveBeenCalledWith({ category });
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('1');
      expect(result[1].id).toBe('2');
    });
  });

  describe('findOne', () => {
    it('should return a single product', async () => {
      mockProductModel.findById.mockReturnValue({
        lean: jest.fn().mockResolvedValue({
          _id: '1',
          name: 'Rice',
          price: 29.99,
          currentStock: 99,
          category: 'Groceries',
        }),
      });

      const result = await service.findOne('1');

      expect(mockProductModel.findById).toHaveBeenCalledWith('1');
      expect(result.id).toBe('1');
    });

    it('should throw NotFoundException if product does not exist', async () => {
      mockProductModel.findById.mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      mockProductModel.findByIdAndUpdate.mockReturnValue({
        lean: jest.fn().mockResolvedValue({
          _id: '1',
          name: 'Rice',
          price: 20.0,
          currentStock: 99,
          category: 'Groceries',
        }),
      });

      const result = await service.update('1', {
        price: 20.0,
      });

      expect(result.price).toBe(20.0);
    });

    it('should throw NotFoundException if product does not exist', async () => {
      mockProductModel.findByIdAndUpdate.mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.update('1', { name: 'X' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete product successfully', async () => {
      mockProductModel.findByIdAndDelete.mockResolvedValue({ _id: '1' });

      await service.remove('1');

      expect(mockProductModel.findByIdAndDelete).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if product does not exist', async () => {
      mockProductModel.findByIdAndDelete.mockResolvedValue(null);

      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });
  });
});
