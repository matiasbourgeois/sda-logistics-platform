import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import mailConfig from '../config/mail.config';
import { User } from '@prisma/client';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(
    @Inject(mailConfig.KEY)
    private readonly config: ConfigType<typeof mailConfig>,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.config.host,
      port: this.config.port,
      secure: this.config.secure,
      auth: {
        user: this.config.auth.user,
        pass: this.config.auth.pass,
      },
    });
  }

  // NUEVO MÉTODO PARA ENVIAR EL EMAIL DE VERIFICACIÓN
  async sendUserConfirmation(user: User, token: string) {
    // A futuro, la URL debería venir de una variable de entorno
    const url = `http://localhost:3001/auth/verify?token=${token}`;

    await this.transporter.sendMail({
      from: '"Sol del Amanecer" <logistica@soldelamanecer.ar>', // Dirección del remitente
      to: user.email, // Lista de destinatarios
      subject: '¡Bienvenido! Confirma tu Email', // Línea de Asunto
      // Cuerpo del email en texto plano (para clientes de correo antiguos)
      text: `Hola ${user.nombre}, por favor, confirma tu email haciendo clic en el siguiente enlace: ${url}`,
      // Cuerpo del email en HTML (para la mayoría de los clientes de correo)
      html: `
        <p>¡Hola ${user.nombre}!</p>
        <p>Gracias por registrarte en Sol del Amanecer. Por favor, confirma tu dirección de correo electrónico haciendo clic en el siguiente enlace:</p>
        <a href="${url}">Confirmar mi Email</a>
        <p>Si no te registraste en nuestro sitio, puedes ignorar este correo.</p>
      `,
    });
  }
}