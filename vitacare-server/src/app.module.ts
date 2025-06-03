import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './usuarios/usuario.entity';
import { Medicamento } from './medicamentos/medicamento.entity';
import { HorarioMedicamento } from './horarios-medicamentos/horario-medicamento.entity';
import { Consulta } from './consultas/consulta.entity';
import { DeviceToken } from './device-tokens/device-token.entity';
import { UsuariosModule } from './usuarios/usuarios.module'; // Importa o UsuariosModule
import { AuthModule } from './auth/auth.module';         // Importa o AuthModule

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'admin',
      database: 'vitacare',
      entities: [Usuario, Medicamento, HorarioMedicamento, Consulta, DeviceToken],
      synchronize: true,
    }),
    UsuariosModule, // Apenas importe os módulos aqui
    AuthModule,
  ],
  controllers: [AppController], // Apenas o AppController, se ele for realmente global para o app
  providers: [AppService],    // Apenas o AppService, se ele for realmente global para o app
})
export class AppModule {}
