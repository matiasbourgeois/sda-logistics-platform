import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  // CORREGIDO: Sin 'async' porque findMany ya devuelve una Promise
  findAll(): Promise<Omit<User, 'password'>[]> {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        nombre: true,
        apellido: true,
        telefono: true,
        cuit: true,
        razonSocial: true,
        tipoContratacion: true,
        rol: true,
        verificado: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    // La contraseña se hashea aquí directamente
    data.password = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({ data });
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<Omit<User, 'password'>> {
    const dataToUpdate: Prisma.UserUpdateInput = { ...updateUserDto };
    if (updateUserDto.password) {
      dataToUpdate.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: dataToUpdate,
      });
      const { password, ...result } = updatedUser;
      return result;
    } catch (error) {
      throw new NotFoundException(`Usuario con ID "${id}" no encontrado.`);
    }
  }

  async remove(id: string): Promise<Omit<User, 'password'>> {
    try {
      const deletedUser = await this.prisma.user.delete({
        where: { id },
      });
      const { password, ...result } = deletedUser;
      return result;
    } catch (error) {
      throw new NotFoundException(`Usuario con ID "${id}" no encontrado.`);
    }
  }

  // --- Métodos para uso interno del AuthService ---

  async findOneByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findOneByToken(token: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { verificationToken: token } });
  }

  async verifyUser(id: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: {
        verificado: true,
        verificationToken: null,
      },
    });
  }
}