import { Test } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { GetProductDto } from './dtos/get-product.dto';
import { CreateProductDto } from './dtos/create-product.dto';

describe('ProductsController', () => {
  let productsController: ProductsController;
  let productsService: jest.Mocked<ProductsService>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
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

    productsService = moduleRef.get(ProductsService);
    productsController = moduleRef.get(ProductsController);
  });

  describe('create', () => {
    it('should delegate product creation to the service and return product data', async () => {
      const createDto: CreateProductDto = {
        name: 'Rice',
        price: 29.99,
        currentStock: 99,
        category: 'Groceries',
      };

      const serviceResult: GetProductDto = {
        id: '1',
        name: 'Rice',
        price: 29.99,
        currentStock: 99,
        category: 'Groceries',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      productsService.create.mockResolvedValue(serviceResult);

      const result = await productsController.create(createDto);

      expect(productsService.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(serviceResult);
      expect(result).not.toHaveProperty('password');
    });
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const result: GetProductDto[] = [
        {
          id: '1',
          name: 'Rice',
          price: 29.99,
          currentStock: 99,
          category: 'Groceries',
          createdAt: new Date('2012-01-01T10:00:00.000Z'),
          updatedAt: new Date('2012-01-02T10:00:00.000Z'),
        },
        {
          id: '2',
          name: 'Beans',
          category: 'Groceries',
          price: 19.99,
          currentStock: 99,
          createdAt: new Date('2026-01-01T09:00:00.000Z'),
          updatedAt: new Date('2026-01-06T11:30:00.000Z'),
        },
      ];

      productsService.findAll.mockResolvedValue(result);

      const response = await productsController.findAll({});

      expect(response).toEqual(result);
      expect(productsService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single product by id', async () => {
      const product: GetProductDto = {
        id: '1',
        name: 'Rice',
        price: 29.99,
        currentStock: 99,
        category: 'Groceries',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      productsService.findOne.mockResolvedValue(product);

      const result = await productsController.findOne({
        id: '1',
      });

      expect(productsService.findOne).toHaveBeenCalledWith('1');
      expect(result).toEqual(product);
    });
  });

  describe('update', () => {
    it('should delegate update to the service and return updated product', async () => {
      const updatedProduct: GetProductDto = {
        id: '1',
        name: 'Rice',
        price: 29.99,
        currentStock: 99,
        category: 'Groceries',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      productsService.update.mockResolvedValue(updatedProduct);

      const result = await productsController.update(
        { id: '1' },
        { price: 20.0 },
      );

      expect(productsService.update).toHaveBeenCalledWith('1', { price: 20.0 });
      expect(result).toEqual(updatedProduct);
    });
  });

  describe('remove', () => {
    it('should delegate deletion to the service', async () => {
      productsService.remove.mockResolvedValue();

      await expect(
        productsController.remove({
          id: '1',
        }),
      ).resolves.toBeUndefined();

      expect(productsService.remove).toHaveBeenCalledWith('1');
    });
  });
});
