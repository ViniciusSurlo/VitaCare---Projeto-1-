import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { ConsultasService } from './consultas.service';
import { CriarConsultaDto } from './dto/criar-consulta.dto';
import { AtualizarConsultaDto } from './dto/atualizar-consulta.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

// Define uma interface para o objeto Request com a propriedade user
interface RequestComUsuario extends Request {
  user: {
    id: number;
    email: string;
  };
}

@Controller('consultas')
@UseGuards(JwtAuthGuard)
export class ConsultasController {
  constructor(private readonly consultasService: ConsultasService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Request() req: RequestComUsuario, @Body() criarConsultaDto: CriarConsultaDto) {
    const usuarioId = req.user.id;
    return this.consultasService.create(usuarioId, criarConsultaDto);
  }

  @Get()
  findAll(@Request() req: RequestComUsuario) {
    const usuarioId = req.user.id;
    return this.consultasService.findAllByUsuario(usuarioId);
  }

  @Get(':id')
  findOne(@Request() req: RequestComUsuario, @Param('id', ParseIntPipe) id: number) {
    const usuarioId = req.user.id;
    return this.consultasService.findOne(id, usuarioId);
  }

  @Patch(':id')
  update(
    @Request() req: RequestComUsuario,
    @Param('id', ParseIntPipe) id: number,
    @Body() atualizarConsultaDto: AtualizarConsultaDto,
  ) {
    const usuarioId = req.user.id;
    return this.consultasService.update(id, usuarioId, atualizarConsultaDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Request() req: RequestComUsuario, @Param('id', ParseIntPipe) id: number) {
    const usuarioId = req.user.id;
    return this.consultasService.remove(id, usuarioId);
  }
}
