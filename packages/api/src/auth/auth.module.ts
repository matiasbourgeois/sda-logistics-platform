import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import jwtConfig from '../config/jwt.config';

@Module({
  imports: [
    UsersModule, // Importamos UsersModule para tener acceso a UsersService
    PassportModule,
    JwtModule.registerAsync({
      // Usamos la configuración tipada que ya habíamos creado
      useFactory: async (config: ConfigType<typeof jwtConfig>) => ({
        secret: config.secret,
        signOptions: { expiresIn: '1h' },
      }),
      inject: [jwtConfig.KEY],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}