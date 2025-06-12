import { Controller, Post, Body, HttpCode, HttpStatus, UsePipes, ValidationPipe, UseGuards, Request, Get } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegistrarUsuarioDto } from "./dto/registrar-usuario.dto";
import { LoginUsuarioDto } from "./dto/login-usuario.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from "@nestjs/swagger";
import { Request as ExpressRequest } from 'express';

@ApiTags("Auth") // Define o grupo de tags para a documentação Swagger
@Controller("auth") // Define o prefixo da rota para este controller como /auth
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("registrar") // Rota POST /auth/registrar
  @ApiOperation({ summary: "Registrar usuario", description: "Realiza o cadastro do usuário" })
  @ApiBody({ type: LoginUsuarioDto})
  @ApiResponse({ status: 200, description: 'cadastro bem-sucedido' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true })) // Aplica validação do DTO
  async registrar(@Body() registrarUsuarioDto: RegistrarUsuarioDto) {
    return this.authService.registrar(registrarUsuarioDto);
  }

  @Post("login") // Rota POST /auth/login
  @ApiOperation({ summary: "Autenticar usuario", description: "Realiza o login do usuário e retorna um token JWT." })
  @ApiBody({ type: LoginUsuarioDto})
  @ApiResponse({ status: 200, description: 'Login bem-sucedido', schema: {
    properties: {
      acessToken: { type: 'string', example:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6Ik...' // Exemplo de token JWT
      }
    }}})
    @ApiResponse({ status: 401, description: 'Credenciais inválidas'})

  @HttpCode(HttpStatus.OK) // Define o código de status HTTP para 200 OK em caso de sucesso
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true })) // Aplica validação do DTO
  async login(@Body() loginUsuarioDto: LoginUsuarioDto) {
    return this.authService.login(loginUsuarioDto);
  }
  @UseGuards(JwtAuthGuard) // Protege a rota com o guard JWT
  @Get("perfil") // Rota GET /auth/perfil
  @ApiBearerAuth() // Indica que a rota requer autenticação via Bearer Token
  @ApiOperation({ summary: 'Obter perfil do usuário', description: 'Retorna os dados do usuário autenticado.' })
  @ApiResponse({ status: 200, description: 'Perfil do usuário'})
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  getProfile(@Request() req: ExpressRequest) {
    return req.user;
  }
}
