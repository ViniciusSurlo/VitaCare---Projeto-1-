import { IsNotEmpty, IsString, IsOptional, IsDateString, IsInt, Min, Max, IsEmail, MinLength } from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';

export class CriarUsuarioDto {
  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'Maria Helena da Silva',
  })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @IsString({ message: 'O nome deve ser uma string' })
  nome: string;

  @ApiProperty({
    description: 'Email do usuário (usado para login',
    example: 'maria.helena@gmail.com'
  })
  @IsNotEmpty({ message: 'O email é obrigatório' })
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @ApiProperty({
    description: 'Senha do usuario',
    example: '123456',
    minLength: 6,
  })
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  senha: string;

  @ApiProperty({
    description: 'Data de nascimento do usuário',
    example: '1990-05-15',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Data de nascimento inválida' })
  dataNascimento?: string;

  @ApiProperty({
    description: 'Telefone do usuário (opcional)',
    example: '+55 18 91234-5678',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'O telefone deve ser uma string' })
  telefone?: string;
}