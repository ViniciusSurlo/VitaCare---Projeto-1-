import { Type } from "class-transformer";
import { IsArray, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

class HorarioMedicamentoDto {
  @IsNotEmpty({ message: "O horário não pode estar vazio." })
  @IsString({ message: "O horário deve ser uma string no formato HH:MM." })
  // Adicionar validação de formato HH:MM se necessário com @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
  horario: string; // Formato HH:MM

  @IsNotEmpty({ message: "A quantidade de comprimidos não pode estar vazia." })
  @IsNumber({}, { message: "A quantidade de comprimidos deve ser um número." })
  quantidade_comprimido: number;
}

export class CriarMedicamentoDto {
  @IsNotEmpty({ message: "O nome do medicamento não pode estar vazio." })
  @IsString()
  nome: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsNotEmpty({ message: "A dosagem não pode estar vazia." })
  @IsString()
  dosagem: string; // Ex: "500mg", "1 comprimido"

  @IsNotEmpty({ message: "A quantidade em estoque não pode estar vazia." })
  @IsNumber({}, { message: "A quantidade em estoque deve ser um número." })
  quantidade_em_estoque: number;

  @IsOptional()
  @IsString()
  instrucoes_adicionais?: string;

  @IsOptional()
  @IsDateString({}, { message: "A data de início do tratamento deve ser uma data válida." })
  data_inicio_tratamento?: Date;

  @IsOptional()
  @IsDateString({}, { message: "A data de fim do tratamento deve ser uma data válida." })
  data_fim_tratamento?: Date;

  @IsArray({ message: "Os horários devem ser uma lista." })
  @ValidateNested({ each: true })
  @Type(() => HorarioMedicamentoDto)
  horarios: HorarioMedicamentoDto[];
}
