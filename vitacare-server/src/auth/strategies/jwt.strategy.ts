import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsuariosService } from "../../usuarios/usuarios.service"; // Ajuste o caminho se necessário

// Chave secreta para assinar e verificar JWTs. DEVE ser a mesma usada no AuthModule!
// Em um app real, isso viria de variáveis de ambiente.
export const jwtConstants = {
  secret: "SEGREDO_SUPER_SECRETO_DO_JWT_VITA_CARE_2025", // MUDE ISSO PARA ALGO SEGURO E GUARDE EM VARIÁVEL DE AMBIENTE!
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly usuariosService: UsuariosService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any): Promise<any> {
    // payload contém { sub: usuario.id, email: usuario.email } que definimos no login
    const usuario = await this.usuariosService.findOneById(payload.sub);
    if (!usuario) {
      throw new UnauthorizedException("Token inválido ou usuário não encontrado.");
    }
    // O que é retornado aqui será anexado a request.user nos controllers protegidos por JwtAuthGuard
    // Removido temporariamente para simplificar, ajuste conforme sua entidade Usuario
    // return { id: payload.sub, email: payload.email, nome: usuario.nome }; 
    return { id: payload.sub, email: payload.email }; // Retorne os dados que você precisa
  }
}
