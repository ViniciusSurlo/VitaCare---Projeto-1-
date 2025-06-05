import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { DeviceToken } from './device-token.entity';
import { RegistrarDeviceTokenDto } from './dto/registrar-device-token.dto';

@Injectable()
export class DeviceTokensService {
  constructor(
    @InjectRepository(DeviceToken)
    private deviceTokensRepository: Repository<DeviceToken>,
  ) {}

  /**
   * Registra um novo token de dispositivo para o usuário
   */
  async registrar(usuarioId: number, registrarDeviceTokenDto: RegistrarDeviceTokenDto): Promise<DeviceToken> {
    // Verifica se o token já existe
    const tokenExistente = await this.deviceTokensRepository.findOne({
      where: { token: registrarDeviceTokenDto.token },
    });

    // Se o token já existe para outro usuário, isso é um conflito
    if (tokenExistente && tokenExistente.usuarioId !== usuarioId) {
      throw new ConflictException('Este token de dispositivo já está registrado para outro usuário');
    }

    // Se o token já existe para o mesmo usuário, apenas atualiza a plataforma se necessário
    if (tokenExistente && tokenExistente.usuarioId === usuarioId) {
      if (tokenExistente.plataforma !== registrarDeviceTokenDto.plataforma) {
        tokenExistente.plataforma = registrarDeviceTokenDto.plataforma;
        return this.deviceTokensRepository.save(tokenExistente);
      }
      return tokenExistente; // Retorna o existente sem alterações
    }

    // Cria um novo registro de token
    const novoToken = this.deviceTokensRepository.create({
      usuarioId,
      token: registrarDeviceTokenDto.token,
      plataforma: registrarDeviceTokenDto.plataforma,
    });

    return this.deviceTokensRepository.save(novoToken);
  }

  /**
   * Busca todos os tokens de dispositivo de um usuário específico
   */
  async findAllByUsuario(usuarioId: number): Promise<DeviceToken[]> {
    return this.deviceTokensRepository.find({
      where: { usuarioId },
      order: { criadoEm: 'DESC' },
    });
  }

  /**
   * Busca um token de dispositivo específico por ID
   */
  async findOne(id: number, usuarioId: number): Promise<DeviceToken> {
    const deviceToken = await this.deviceTokensRepository.findOne({
      where: { id },
    });

    if (!deviceToken) {
      throw new NotFoundException(`Token de dispositivo com ID ${id} não encontrado`);
    }

    if (deviceToken.usuarioId !== usuarioId) {
      throw new ForbiddenException('Você não tem permissão para acessar este token de dispositivo');
    }

    return deviceToken;
  }

  /**
   * Remove um token de dispositivo
   */
  async remove(id: number, usuarioId: number): Promise<void> {
    const deviceToken = await this.findOne(id, usuarioId);
    await this.deviceTokensRepository.remove(deviceToken);
  }

  /**
   * Busca todos os tokens de dispositivo para um array de IDs de usuário
   * (Útil para enviar notificações para múltiplos usuários)
   */
  async findAllByUsuarioIds(usuarioIds: number[]): Promise<DeviceToken[]> {
    if (!usuarioIds.length) {
      return [];
    }
    
    return this.deviceTokensRepository.find({
      where: { usuarioId:  In(usuarioIds)  },
    });
  }
}
