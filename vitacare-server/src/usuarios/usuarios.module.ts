import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm"; // Certifique-se que TypeOrmModule está importado
import { UsuariosService } from "./usuarios.service";
import { UsuariosController } from "./usuarios.controller";
import { Usuario } from "./usuario.entity"; // Certifique-se que a entidade Usuario está importada

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]) // ESTA LINHA É CRUCIAL!
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService], // Exportamos para que o AuthModule possa usar o UsuariosService
})
export class UsuariosModule {}
