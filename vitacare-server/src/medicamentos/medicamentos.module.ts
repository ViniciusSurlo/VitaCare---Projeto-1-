import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicamentosController } from './medicamentos.controller';
import { MedicamentosService } from './medicamentos.service';
import { Medicamento } from './medicamento.entity';
import { HorarioMedicamento } from 'src/horarios-medicamentos/horario-medicamento.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Medicamento, HorarioMedicamento])],
  controllers: [MedicamentosController],
  providers: [MedicamentosService],
  exports: [MedicamentosService],
})
export class MedicamentosModule {}
// Este módulo define o módulo de medicamentos, que inclui o controlador e o serviço para gerenciar medicamentos.
// Ele importa o TypeOrmModule para permitir a interação com a entidade Medicamento no banco de dados.
// O módulo também exporta o MedicamentosService para que possa ser utilizado em outros módulos, se necessário.
// O controlador MedicamentosController é responsável por lidar com as requisições HTTP relacionadas a medicamentos