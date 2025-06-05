import { Controller, Get, Post, Body, Delete, UseGuards, Request, HttpCode, HttpStatus, Param, ParseIntPipe } from '@nestjs/common';
import { DeviceTokensService } from './device-tokens.service';
import { RegistrarDeviceTokenDto } from './dto/registrar-device-token.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

// Define uma interface para o objeto Request com a propriedade user
interface RequestComUsuario extends Request {
  user: {
    id: number;
    email: string;
  };
}

@Controller('device-tokens')
@UseGuards(JwtAuthGuard)
export class DeviceTokensController {
  constructor(private readonly deviceTokensService: DeviceTokensService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  registrar(@Request() req: RequestComUsuario, @Body() registrarDeviceTokenDto: RegistrarDeviceTokenDto) {
    const usuarioId = req.user.id;
    return this.deviceTokensService.registrar(usuarioId, registrarDeviceTokenDto);
  }

  @Get()
  findAll(@Request() req: RequestComUsuario) {
    const usuarioId = req.user.id;
    return this.deviceTokensService.findAllByUsuario(usuarioId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Request() req: RequestComUsuario, @Param('id', ParseIntPipe) id: number) {
    const usuarioId = req.user.id;
    return this.deviceTokensService.remove(id, usuarioId);
  }
}
