import { IsEmail, IsNotEmpty, MinLength, IsString } from 'class-validator';

export class RegistrarUsuarioDto {
  @IsNotEmpty({ message: 'O nome não pode estar vazio.' })
  @IsString()
  nome: string;

  @IsNotEmpty({ message: 'O e-mail não pode estar vazio.' })
  @IsEmail({}, { message: 'Por favor, forneça um e-mail válido.' })
  email: string;

  @IsNotEmpty({ message: 'A senha não pode estar vazia.' })
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres.' })
  senha: string;
}
