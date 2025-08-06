import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto) { const hashedPassword = await bcrypt.hash(createUserDto.password, 10); try { const user = await this.prisma.user.create({ data: { ...createUserDto, password: hashedPassword }, select: { id: true, username: true, role: true, status: true } }); return user; } catch (error) { if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') { throw new ConflictException(`Username "${createUserDto.username}" already exists.`); } throw error; } }
  findAll() { return this.prisma.user.findMany({ select: { id: true, username: true, role: true, status: true } }); }
  findOneByUsername(username: string) { return this.prisma.user.findUnique({ where: { username } }); }
  async update(id: number, updateUserDto: UpdateUserDto) { if (updateUserDto.password) { updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10); } return this.prisma.user.update({ where: { id }, data: updateUserDto, select: { id: true, username: true, role: true, status: true } }); }
  remove(id: number) { return this.prisma.user.delete({ where: { id } }); }
}