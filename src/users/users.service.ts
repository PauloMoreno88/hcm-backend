import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { UpdateUserDto } from './dto/update-user.dto';

const publicUserSelect = {
  id: true,
  email: true,
  name: true,
  createdAt: true,
  updatedAt: true,
} as const;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: publicUserSelect,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmailWithPassword(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(data: { email: string; password: string; name?: string }) {
    try {
      return await this.prisma.user.create({
        data,
        select: publicUserSelect,
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ConflictException('Email already registered');
      }
      throw e;
    }
  }

  async updateProfile(userId: string, dto: UpdateUserDto) {
    try {
      return await this.prisma.user.update({
        where: { id: userId },
        data: dto,
        select: publicUserSelect,
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          throw new NotFoundException('User not found');
        }
        if (e.code === 'P2002') {
          throw new ConflictException('Email already in use');
        }
      }
      throw e;
    }
  }
}
