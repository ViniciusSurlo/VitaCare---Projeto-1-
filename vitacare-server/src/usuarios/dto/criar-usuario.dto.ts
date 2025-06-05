import { IsNotEmpty, IsString, IsOptional, IsDateString, IsInt, Min, Max, IsEmail, MinLength } from 'class-validator';

export class CriarUsuarioDto {
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @IsString({ message: 'O nome deve ser uma string' })
  nome: string;

  @IsNotEmpty({ message: 'O email é obrigatório' })
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  senha: string;

  @IsOptional()
  @IsDateString({}, { message: 'Data de nascimento inválida' })
  dataNascimento?: string;

  @IsOptional()
  @IsString({ message: 'O telefone deve ser uma string' })
  telefone?: string;
}