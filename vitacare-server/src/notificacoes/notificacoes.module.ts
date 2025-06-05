import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificacoesService } from './notificacoes.service';
import { NotificacoesController } from './notificacoes.controller';
import { DeviceTokensModule } from '../device-tokens/device-tokens.module';
import { MedicamentosModule } from '../medicamentos/medicamentos.module';
import { ConsultasModule } from '../consultas/consultas.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forFeature([]),
    DeviceTokensModule,
    MedicamentosModule,
    ConsultasModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [NotificacoesController],
  providers: [NotificacoesService],
  exports: [NotificacoesService],
})
export class NotificacoesModule {}
