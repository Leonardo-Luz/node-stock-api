import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UsersService } from './users.service';
import { UserRole } from '@enums/user-role.enum';
import { UserRepository } from './user.repository';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

const mockUserRepository = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  total: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
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
        id: '1',
        name: 'John Doe',
        email: 'john@mail.com',
        role: UserRole.VIEWER,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepository.create.mockResolvedValue({
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
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@mail.com',
        password: 'hashed-password',
      });
      expect(result).not.toHaveProperty('password');
    });
  });

  describe('findAll', () => {
    it('should return mapped users', async () => {
      mockUserRepository.total.mockReturnValue(1);

      mockUserRepository.findAll.mockReturnValue([
        {
          id: '1',
          name: 'John Doe',
          email: 'john@mail.com',
          role: UserRole.VIEWER,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      const result = await service.findAll();

      expect(result.data).toHaveLength(1);
      expect(result.data[0].id).toBe('1');
      expect(result.data[0]).not.toHaveProperty('password');
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      mockUserRepository.findById.mockReturnValue({
        id: '1',
        name: 'John Doe',
        email: 'john@mail.com',
        role: UserRole.VIEWER,
      });

      const result = await service.findById('1');

      expect(mockUserRepository.findById).toHaveBeenCalledWith('1');
      expect(result.id).toBe('1');
    });

    it('should throw NotFoundException if user does not exist', async () => {
      mockUserRepository.findById.mockReturnValue(null);

      await expect(service.findById('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should hash password when updating it', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');

      mockUserRepository.update.mockReturnValue({
        id: '1',
        name: 'John Updated',
        email: 'john@mail.com',
        role: UserRole.VIEWER,
      });

      const result = await service.update('1', {
        password: 'new-password',
      });

      expect(bcrypt.hash).toHaveBeenCalledWith('new-password', 12);
      expect(result.name).toBe('John Updated');
    });

    it('should throw NotFoundException if user does not exist', async () => {
      mockUserRepository.update.mockReturnValue(null);

      await expect(service.update('1', { name: 'X' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete user successfully', async () => {
      mockUserRepository.delete.mockResolvedValue({ id: '1' });

      const result = await service.remove('1');

      expect(result.id).toBe('1');
    });

    it('should throw NotFoundException if user does not exist', async () => {
      mockUserRepository.delete.mockResolvedValue(null);

      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });
  });
});
