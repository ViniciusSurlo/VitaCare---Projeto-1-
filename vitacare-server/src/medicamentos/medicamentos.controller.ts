// src/medicamentos/medicamentos.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { MedicamentosService } from './medicamentos.service';
import { CriarMedicamentoDto } from './dto/criar-medicamento.dto';
import { AtualizarMedicamentoDto } from './dto/atualizar-medicamento.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
// Define uma interface para o objeto Request com a propriedade user
interface RequestComUsuario extends Request {
  user: {
    id: number;
    email: string;
    // Adicione outras propriedades se o seu payload JWT tiver mais dados
  };
}

@Controller('medicamentos')
@UseGuards(JwtAuthGuard)
export class MedicamentosController {
  constructor(private readonly medicamentosService: MedicamentosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Request() req: RequestComUsuario, @Body() criarMedicamentoDto: CriarMedicamentoDto) {
    const usuarioId = req.user.id;
    return this.medicamentosService.create(usuarioId, criarMedicamentoDto);
  }

  @Get()
  findAll(@Request() req: RequestComUsuario) {
    const usuarioId = req.user.id;
    return this.medicamentosService.findAllByUsuario(usuarioId);
  }

  @Get(':id')
  findOne(@Request() req: RequestComUsuario, @Param('id', ParseIntPipe) id: number) {
    const usuarioId = req.user.id;
    return this.medicamentosService.findOne(id, usuarioId);
  }

  @Patch(':id')
  update(@Request() req: RequestComUsuario, @Param('id', ParseIntPipe) id: number, @Body() atualizarMedicamentoDto: AtualizarMedicamentoDto) {
    const usuarioId = req.user.id;
    return this.medicamentosService.update(id, usuarioId, atualizarMedicamentoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Request() req: RequestComUsuario, @Param('id', ParseIntPipe) id: number) {
    const usuarioId = req.user.id;
    return this.medicamentosService.remove(id, usuarioId);
  }
}
