import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service"; // Ajuste o caminho se sua pasta auth não estiver na raiz de src

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' }); // Informa ao Passport que o campo de usuário é 'email'
  }

  async validate(email: string, pass: string): Promise<any> {
    const user = await this.authService.validateUserForLocalStrategy(email, pass);
    if (!user) {
      throw new UnauthorizedException("Credenciais inválidas (estratégia local).");
    }
    return user; // Retorna o usuário (sem a senha)
  }
}
