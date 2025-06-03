import { PartialType } from '@nestjs/mapped-types';
import { CriarMedicamentoDto } from './criar-medicamento.dto';

export class AtualizarMedicamentoDto extends PartialType(CriarMedicamentoDto) {}

