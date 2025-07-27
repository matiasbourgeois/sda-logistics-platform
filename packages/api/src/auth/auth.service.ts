import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { MailService } from '../mail/mail.service';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async validateUser(email: string, pass: string): Promise<Omit<User, 'password'>> {
    const user = await this.usersService.findOneByEmail(email);

    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('Credenciales inválidas');
  }

  async login(user: Omit<User, 'password'>) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(createUserDto: CreateUserDto) {
    const verificationToken = randomBytes(32).toString('hex');

    // Creamos el usuario sin el token de verificación inicialmente
    const newUser = await this.usersService.create(createUserDto);

    // Ahora, asociamos el token de verificación al usuario recién creado
    await this.usersService.setVerificationToken(newUser.id, verificationToken);

    // Enviamos el correo de confirmación
    await this.mailService.sendUserConfirmation(newUser, verificationToken);

    // Ya no necesitamos desestructurar 'password' aquí, porque usersService.create ya lo omite
    return newUser;
  }

  async verifyEmail(token: string) {
    const user = await this.usersService.findOneByToken(token);

    if (!user) {
      throw new UnauthorizedException('El token de verificación es inválido.');
    }

    await this.usersService.verifyUser(user.id);

    return { message: 'Email verificado con éxito.' };
  }
}
