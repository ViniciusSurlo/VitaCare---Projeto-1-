import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { UsuariosModule } from "../usuarios/usuarios.module"; // Importe o UsuariosModule
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtStrategy, jwtConstants } from "./strategies/jwt.strategy"; // Importe JwtStrategy e jwtConstants
import { LocalStrategy } from "./strategies/local.strategy"; // Importe LocalStrategy

@Module({
  imports: [
    UsuariosModule, // Para acessar o UsuariosService
    PassportModule.register({ defaultStrategy: 'jwt' }), // Configura o Passport
    JwtModule.register({
      secret: jwtConstants.secret, // Chave secreta para assinar os tokens
      signOptions: { expiresIn: '1d' }, // Tempo de expiração do token (ex: 1 dia)
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy, // Registre as estratégias como providers
    JwtStrategy,
  ],
  exports: [AuthService, JwtModule], // Exporte AuthService e JwtModule se precisar em outros lugares
})
export class AuthModule {}
