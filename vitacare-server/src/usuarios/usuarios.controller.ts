import { Controller, UseGuards, Get, Put, Delete, Param } from '@nestjs/common';
import { Request, Body, UsePipes, ValidationPipe } from '@nestjs/common';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UsuariosService } from './usuarios.service';
import { AtualizarUsuarioDto } from './dto/atualizar-usuario.dto';
import { ParseIntPipe } from '@nestjs/common';
import { Request as  ExpressRequest } from 'express';
@Controller('usuarios')
@UseGuards(JwtAuthGuard)
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get('perfil')
  getPerfil(@Request() req : any) {
    return this.usuariosService.findOne(req.user.id);
  }

  @Put('perfil')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  atualizarPerfil(@Request() req : any, @Body() atualizarUsuarioDto: AtualizarUsuarioDto) {
    return this.usuariosService.update(req.user.id, atualizarUsuarioDto);
  }

  // Endpoints administrativos (não implementados no MVP)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.findOne(id);
  }

  @Get()
  findAll() {
    return this.usuariosService.findAll();
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.remove(id);
  }
}