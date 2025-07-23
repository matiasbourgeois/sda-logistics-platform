import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    // Llama al constructor de PrismaClient
    super();
  }

  async onModuleInit() {
    // Este método es de NestJS. Se ejecuta cuando el módulo se inicia.
    // Aquí nos conectamos a la base de datos.
    await this.$connect();
  }

  async onModuleDestroy() {
    // Este método es de NestJS. Se ejecuta cuando la aplicación se apaga.
    // Aquí nos desconectamos de forma segura de la base de datos.
    await this.$disconnect();
  }
}