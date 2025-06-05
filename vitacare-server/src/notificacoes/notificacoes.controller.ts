import { Controller, Get, Post, Body, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { NotificacoesService } from './notificacoes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TestarNotificacaoDto } from './dto/testar-notificacao.dto';

// Define uma interface para o objeto Request com a propriedade user
interface RequestComUsuario extends Request {
  user: {
    id: number;
    email: string;
  };
}

@Controller('notificacoes')
@UseGuards(JwtAuthGuard)
export class NotificacoesController {
  constructor(private readonly notificacoesService: NotificacoesService) {}

  @Post('testar')
  @HttpCode(HttpStatus.OK)
  testarNotificacao(@Request() req: RequestComUsuario, @Body() testarNotificacaoDto: TestarNotificacaoDto) {
    const usuarioId = req.user.id;
    return this.notificacoesService.enviarNotificacaoTeste(usuarioId, testarNotificacaoDto);
  }

  @Get('status')
  getStatus(@Request() req: RequestComUsuario) {
    const usuarioId = req.user.id;
    return this.notificacoesService.getStatusNotificacoes(usuarioId);
  }
}
