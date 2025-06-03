import { Controller, Post, Body, HttpCode, HttpStatus, UsePipes, ValidationPipe } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegistrarUsuarioDto } from "./dto/registrar-usuario.dto";
import { LoginUsuarioDto } from "./dto/login-usuario.dto";

@Controller("auth") // Define o prefixo da rota para este controller como /auth
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("registrar") // Rota POST /auth/registrar
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true })) // Aplica validação do DTO
  async registrar(@Body() registrarUsuarioDto: RegistrarUsuarioDto) {
    return this.authService.registrar(registrarUsuarioDto);
  }

  @Post("login") // Rota POST /auth/login
  @HttpCode(HttpStatus.OK) // Define o código de status HTTP para 200 OK em caso de sucesso
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true })) // Aplica validação do DTO
  async login(@Body() loginUsuarioDto: LoginUsuarioDto) {
    return this.authService.login(loginUsuarioDto);
  }
}
