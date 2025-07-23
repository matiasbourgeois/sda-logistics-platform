import { Module, Global } from '@nestjs/common';
import { MailService } from './mail.service';

@Global() // <-- Esto lo hace disponible en toda la app
@Module({
  providers: [MailService],
  exports: [MailService], // Lo exportamos para que otros módulos lo puedan usar
})
export class MailModule {}