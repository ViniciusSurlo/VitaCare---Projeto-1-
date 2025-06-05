import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { HorariosMedicamentosService } from './horarios-medicamentos.service';
import { CriarHorarioMedicamentoDto } from './dto/criar-horario-medicamento.dto';
import { AtualizarHorarioMedicamentoDto } from './dto/atualizar-horario-medicamento.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

// Define uma interface para o objeto Request com a propriedade user
interface RequestComUsuario extends Request {
  user: {
    id: number;
    email: string;
  };
}

@Controller('horarios-medicamentos')
@UseGuards(JwtAuthGuard)
export class HorariosMedicamentosController {
  constructor(private readonly horariosMedicamentosService: HorariosMedicamentosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Request() req: RequestComUsuario, @Body() criarHorarioMedicamentoDto: CriarHorarioMedicamentoDto) {
    const usuarioId = req.user.id;
    return this.horariosMedicamentosService.create(usuarioId, criarHorarioMedicamentoDto);
  }

  @Get('medicamento/:medicamentoId')
  findAllByMedicamento(
    @Request() req: RequestComUsuario,
    @Param('medicamentoId', ParseIntPipe) medicamentoId: number,
  ) {
    const usuarioId = req.user.id;
    return this.horariosMedicamentosService.findAllByMedicamento(medicamentoId, usuarioId);
  }

  @Get(':id')
  findOne(@Request() req: RequestComUsuario, @Param('id', ParseIntPipe) id: number) {
    const usuarioId = req.user.id;
    return this.horariosMedicamentosService.findOne(id, usuarioId);
  }

  @Patch(':id')
  update(
    @Request() req: RequestComUsuario,
    @Param('id', ParseIntPipe) id: number,
    @Body() atualizarHorarioMedicamentoDto: AtualizarHorarioMedicamentoDto,
  ) {
    const usuarioId = req.user.id;
    return this.horariosMedicamentosService.update(id, usuarioId, atualizarHorarioMedicamentoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Request() req: RequestComUsuario, @Param('id', ParseIntPipe) id: number) {
    const usuarioId = req.user.id;
    return this.horariosMedicamentosService.remove(id, usuarioId);
  }
}
