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

  // Ahora llamamos al método 'create' pasando el token como segundo argumento
  const newUser = await this.usersService.create(
    createUserDto,
    verificationToken,
  );

  await this.mailService.sendUserConfirmation(newUser, verificationToken);

  const { password, ...result } = newUser;
  return result;
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