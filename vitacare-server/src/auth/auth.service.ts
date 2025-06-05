import { Injectable, ConflictException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsuariosService } from "../usuarios/usuarios.service"; 
import { RegistrarUsuarioDto } from "./dto/registrar-usuario.dto";
import { LoginUsuarioDto } from "./dto/login-usuario.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}

  async registrar(registrarUsuarioDto: RegistrarUsuarioDto): Promise<{ message: string }> {
    const { nome, email, senha } = registrarUsuarioDto;

    const usuarioExistente = await this.usuariosService.findByEmail(email);
    if (usuarioExistente) {
      throw new ConflictException("Este e-mail já está em uso.");
    }

    const senhaHash = await bcrypt.hash(senha, 10); // O segundo argumento é o saltRounds

    await this.usuariosService.create({ nome, email, senha });
    return { message: "Usuário registrado com sucesso. Por favor, faça o login." };
  }

  async login(loginUsuarioDto: LoginUsuarioDto): Promise<{ accessToken: string }> {
    const { email, senha } = loginUsuarioDto;
    const usuario = await this.usuariosService.findByEmail(email);

    if (!usuario) {
      throw new UnauthorizedException("Credenciais inválidas.");
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senhaHash);
    if (!senhaValida) {
      throw new UnauthorizedException("Credenciais inválidas.");
    }

    const payload = { sub: usuario.id, email: usuario.email };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  async validateUserForLocalStrategy(email: string, pass: string): Promise<any> {
    const usuario = await this.usuariosService.findByEmail(email);
    if (usuario) {
      const senhaValida = await bcrypt.compare(pass, usuario.senhaHash);
      if (senhaValida) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { senhaHash, ...result } = usuario; // Retorna o usuário sem a senhaHash
        return result;
      }
    }
    return null; // Retorna null se o usuário não for encontrado ou a senha não bater
  }
}
