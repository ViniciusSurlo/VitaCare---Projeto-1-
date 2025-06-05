import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HorariosMedicamentosController } from './horarios-medicamentos.controller';
import { HorariosMedicamentosService } from './horarios-medicamentos.service';
import { HorarioMedicamento } from './horario-medicamento.entity';
import { Medicamento } from '../medicamentos/medicamento.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HorarioMedicamento, Medicamento])],
  controllers: [HorariosMedicamentosController],
  providers: [HorariosMedicamentosService],
  exports: [HorariosMedicamentosService],
})
export class HorariosMedicamentosModule {}
