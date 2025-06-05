import { IsOptional, IsString, IsDateString, IsInt, Min, Max, MinLength, IsEmail } from 'class-validator';

export class AtualizarUsuarioDto {
  @IsOptional()
  @IsString({ message: 'O nome deve ser uma string' })
  nome?: string;

  @IsOptional()
  @IsEmail({}, {message: 'Deve ser um email' })
  email?: string;

  @IsOptional()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  senha?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Data de nascimento inválida' })
  dataNascimento?: string;

  @IsOptional()
  @IsString({ message: 'O telefone deve ser uma string' })
  telefone?: string;
}