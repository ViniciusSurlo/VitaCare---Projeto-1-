import { IsNotEmpty, IsString, IsOptional, IsDateString, IsInt, Min, Max } from 'class-validator';

export class CriarConsultaDto {
  @IsNotEmpty({ message: 'O título da consulta é obrigatório' })
  @IsString({ message: 'O título deve ser uma string' })
  titulo: string;

  @IsOptional()
  @IsString({ message: 'A especialidade deve ser uma string' })
  especialidade?: string;

  @IsOptional()
  @IsString({ message: 'O nome do médico deve ser uma string' })
  nomeMedico?: string;

  @IsOptional()
  @IsString({ message: 'O local da consulta deve ser uma string' })
  localConsulta?: string;

  @IsNotEmpty({ message: 'A data e hora da consulta são obrigatórias' })
  @IsDateString({}, { message: 'A data e hora devem estar em formato ISO' })
  dataHoraConsulta: string;

  @IsOptional()
  @IsString({ message: 'As observações devem ser uma string' })
  observacoes?: string;

  @IsOptional()
  @IsInt({ message: 'A antecedência do lembrete deve ser um número inteiro' })
  @Min(5, { message: 'A antecedência mínima é de 5 minutos' })
  @Max(10080, { message: 'A antecedência máxima é de 10080 minutos (7 dias)' })
  lembreteAntecedenciaMinutos?: number;
}
