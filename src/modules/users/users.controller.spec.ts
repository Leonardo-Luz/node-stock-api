import { Test } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserRole } from '@enums/user-role.enum';
import { GetUserDto } from './dtos/get-user.dto';
import { CreateUserDto } from './dtos/create-user.dto';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: jest.Mocked<UsersService>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
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

    usersService = moduleRef.get(UsersService);
    usersController = moduleRef.get(UsersController);
  });

  describe('create', () => {
    it('should delegate user creation to the service and return public user data', async () => {
      const createDto: CreateUserDto = {
        name: 'John Doe',
        email: 'john@mail.com',
        password: 'sEcure-p@ssw0rd',
      };

      const serviceResult: GetUserDto = {
        id: '695effb8efab678ec35554fd',
        name: 'John Doe',
        email: 'john@mail.com',
        role: UserRole.VIEWER,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      usersService.create.mockResolvedValue(serviceResult);

      const result = await usersController.create(createDto);

      expect(usersService.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(serviceResult);
      expect(result).not.toHaveProperty('password');
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result: GetUserDto[] = [
        {
          id: '695effb8efab678ec35554fd',
          name: 'John Doe',
          email: 'john@mail.com',
          role: UserRole.VIEWER,
          createdAt: new Date('2012-01-01T10:00:00.000Z'),
          updatedAt: new Date('2012-01-02T10:00:00.000Z'),
        },
        {
          id: '695f01eda017cb8fb683f27e',
          name: 'Roberto Carlos',
          email: 'roberto@mail.com',
          role: UserRole.ADMIN,
          createdAt: new Date('2026-01-01T09:00:00.000Z'),
          updatedAt: new Date('2026-01-06T11:30:00.000Z'),
        },
      ];

      usersService.findAll.mockResolvedValue(result);

      const response = await usersController.findAll();

      expect(response).toEqual(result);
      expect(usersService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single user by id', async () => {
      const user: GetUserDto = {
        id: '695effb8efab678ec35554fd',
        name: 'John Doe',
        email: 'john@mail.com',
        role: UserRole.VIEWER,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      usersService.findOne.mockResolvedValue(user);

      const result = await usersController.findOne({
        id: 'a93fe07b-7a93-4bf4-8b2c-77eaa41ba220',
      });

      expect(usersService.findOne).toHaveBeenCalledWith(
        'a93fe07b-7a93-4bf4-8b2c-77eaa41ba220',
      );
      expect(result).toEqual(user);
    });
  });

  describe('update', () => {
    it('should delegate update to the service and return updated user', async () => {
      const updatedUser: GetUserDto = {
        id: '695effb8efab678ec35554fd',
        name: 'John Updated',
        email: 'john@mail.com',
        role: UserRole.VIEWER,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      usersService.update.mockResolvedValue(updatedUser);

      const result = await usersController.update(
        { id: 'a93fe07b-7a93-4bf4-8b2c-77eaa41ba220' },
        { name: 'John Updated' },
      );

      expect(usersService.update).toHaveBeenCalledWith(
        'a93fe07b-7a93-4bf4-8b2c-77eaa41ba220',
        { name: 'John Updated' },
      );
      expect(result).toEqual(updatedUser);
    });
  });

  describe('remove', () => {
    it('should delegate deletion to the service', async () => {
      usersService.remove.mockResolvedValue();

      await expect(
        usersController.remove({
          id: 'a93fe07b-7a93-4bf4-8b2c-77eaa41ba220',
        }),
      ).resolves.toBeUndefined();

      expect(usersService.remove).toHaveBeenCalledWith(
        'a93fe07b-7a93-4bf4-8b2c-77eaa41ba220',
      );
    });
  });
});
