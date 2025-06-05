import { IsNotEmpty, IsString, IsIn } from 'class-validator';

export class RegistrarDeviceTokenDto {
  @IsNotEmpty({ message: 'O token do dispositivo é obrigatório' })
  @IsString({ message: 'O token deve ser uma string' })
  token: string;

  @IsNotEmpty({ message: 'A plataforma é obrigatória' })
  @IsString({ message: 'A plataforma deve ser uma string' })
  @IsIn(['android', 'ios', 'web'], { message: 'A plataforma deve ser android, ios ou web' })
  plataforma: string;
}
