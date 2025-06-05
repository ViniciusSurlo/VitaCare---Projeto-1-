import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class TestarNotificacaoDto {
  @IsNotEmpty({ message: 'O título da notificação é obrigatório' })
  @IsString({ message: 'O título deve ser uma string' })
  titulo: string;

  @IsNotEmpty({ message: 'O corpo da notificação é obrigatório' })
  @IsString({ message: 'O corpo deve ser uma string' })
  corpo: string;

  @IsOptional()
  @IsString({ message: 'Os dados adicionais devem ser uma string JSON' })
  dados?: string;
}
