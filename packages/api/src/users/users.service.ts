import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

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
        verificationToken: true, // Añadido
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async create(data: CreateUserDto): Promise<Omit<User, 'password'>> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const newUser = await this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
      select: { // Añadido select para que el tipo de retorno coincida
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
        verificationToken: true, // Añadido
        createdAt: true,
        updatedAt: true,
      },
    });
    return newUser; // Ya no necesitamos desestructurar aquí
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
            verificationToken: true, // Añadido
            createdAt: true,
            updatedAt: true,
        }
      });
      return updatedUser;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            throw new NotFoundException(`Usuario con ID "${id}" no encontrado.`);
        }
        throw error;
    }
  }

  async remove(id: string): Promise<Omit<User, 'password'>> {
    try {
      const deletedUser = await this.prisma.user.delete({
        where: { id },
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
            verificationToken: true, // Añadido
            createdAt: true,
            updatedAt: true,
        }
      });
      return deletedUser;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            throw new NotFoundException(`Usuario con ID "${id}" no encontrado.`);
        }
        throw error;
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

  async setVerificationToken(userId: string, token: string): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        verificationToken: token,
      },
    });
  }
}
