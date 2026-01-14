import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UsersService } from './users.service';
import { User } from './user.schema';
import { UserRole } from '@enums/user-role.enum';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

const mockUserModel = {
  find: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = moduleRef.get(UsersService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should hash password and return public user data', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');

      const mockData = {
        _id: '1',
        name: 'John Doe',
        email: 'john@mail.com',
        role: UserRole.VIEWER,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserModel.create.mockResolvedValue({
        ...mockData,
        toObject() {
          return mockData;
        },
      });

      const result = await service.create({
        name: 'John Doe',
        email: 'john@mail.com',
        password: 'plain-password',
      });

      expect(bcrypt.hash).toHaveBeenCalledWith('plain-password', 12);
      expect(mockUserModel.create).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@mail.com',
        password: 'hashed-password',
      });
      expect(result).not.toHaveProperty('password');
    });
  });

  describe('findAll', () => {
    it('should return mapped users', async () => {
      mockUserModel.find.mockReturnValue({
        lean: jest.fn().mockResolvedValue([
          {
            _id: '1',
            name: 'John Doe',
            email: 'john@mail.com',
            role: UserRole.VIEWER,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]),
      });

      const result = await service.findAll();

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
      expect(result[0]).not.toHaveProperty('password');
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      mockUserModel.findById.mockReturnValue({
        lean: jest.fn().mockResolvedValue({
          _id: '1',
          name: 'John Doe',
          email: 'john@mail.com',
          role: UserRole.VIEWER,
        }),
      });

      const result = await service.findOne('1');

      expect(mockUserModel.findById).toHaveBeenCalledWith('1');
      expect(result.id).toBe('1');
    });

    it('should throw NotFoundException if user does not exist', async () => {
      mockUserModel.findById.mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should hash password when updating it', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');

      mockUserModel.findByIdAndUpdate.mockReturnValue({
        lean: jest.fn().mockResolvedValue({
          _id: '1',
          name: 'John Updated',
          email: 'john@mail.com',
          role: UserRole.VIEWER,
        }),
      });

      const result = await service.update('1', {
        password: 'new-password',
      });

      expect(bcrypt.hash).toHaveBeenCalledWith('new-password', 12);
      expect(result.name).toBe('John Updated');
    });

    it('should throw NotFoundException if user does not exist', async () => {
      mockUserModel.findByIdAndUpdate.mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      });

      await expect(service.update('1', { name: 'X' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete user successfully', async () => {
      mockUserModel.findByIdAndDelete.mockResolvedValue({ _id: '1' });

      await expect(service.remove('1')).resolves.toBeUndefined();
    });

    it('should throw NotFoundException if user does not exist', async () => {
      mockUserModel.findByIdAndDelete.mockResolvedValue(null);

      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });
  });
});
