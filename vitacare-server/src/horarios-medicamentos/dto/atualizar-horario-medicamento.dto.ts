import { IsOptional, IsInt, IsString, Min, Max, Matches } from 'class-validator';

export class AtualizarHorarioMedicamentoDto {
  @IsOptional()
  @IsString({ message: 'O horário deve ser uma string' })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'O horário deve estar no formato HH:MM (ex: 08:30)',
  })
  horario?: string;

  @IsOptional()
  @IsInt({ message: 'A quantidade de comprimido deve ser um número inteiro' })
  @Min(1, { message: 'A quantidade mínima é 1' })
  @Max(10, { message: 'A quantidade máxima é 10' })
  quantidade_comprimido?: number;

  @IsOptional()
  @IsInt({ message: 'O status ativo deve ser um booleano' })
  ativo?: boolean;
}
