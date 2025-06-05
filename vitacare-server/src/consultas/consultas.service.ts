import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Consulta } from './consulta.entity';
import { CriarConsultaDto } from './dto/criar-consulta.dto';
import { AtualizarConsultaDto } from './dto/atualizar-consulta.dto';

@Injectable()
export class ConsultasService {
  constructor(
    @InjectRepository(Consulta)
    private consultasRepository: Repository<Consulta>,
  ) {}

  async create(usuarioId: number, criarConsultaDto: CriarConsultaDto): Promise<Consulta> {
    const consulta = this.consultasRepository.create({
      ...criarConsultaDto,
      usuarioId,
    });
    
    return this.consultasRepository.save(consulta);
  }

  async findAllByUsuario(usuarioId: number): Promise<Consulta[]> {
    return this.consultasRepository.find({
      where: { usuarioId },
      order: { dataHoraConsulta: 'ASC' },
    });
  }

  async findOne(id: number, usuarioId: number): Promise<Consulta> {
    const consulta = await this.consultasRepository.findOne({
      where: { id, usuarioId },
    });
    
    if (!consulta) {
      throw new NotFoundException(`Consulta com ID ${id} não encontrada`);
    }
    
    return consulta;
  }

  async update(id: number, usuarioId: number, atualizarConsultaDto: AtualizarConsultaDto): Promise<Consulta> {
    const consulta = await this.findOne(id, usuarioId);
    
    // Atualiza apenas os campos fornecidos no DTO
    Object.assign(consulta, atualizarConsultaDto);
    
    return this.consultasRepository.save(consulta);
  }

  async remove(id: number, usuarioId: number): Promise<void> {
    const consulta = await this.findOne(id, usuarioId);
    await this.consultasRepository.remove(consulta);
  }
}
