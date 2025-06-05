import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HorarioMedicamento } from './horario-medicamento.entity';
import { Medicamento } from '../medicamentos/medicamento.entity';
import { CriarHorarioMedicamentoDto } from './dto/criar-horario-medicamento.dto';
import { AtualizarHorarioMedicamentoDto } from './dto/atualizar-horario-medicamento.dto';

@Injectable()
export class HorariosMedicamentosService {
  constructor(
    @InjectRepository(HorarioMedicamento)
    private horariosMedicamentosRepository: Repository<HorarioMedicamento>,
    @InjectRepository(Medicamento)
    private medicamentosRepository: Repository<Medicamento>,
  ) {}

  /**
   * Cria um novo horário de medicamento
   */
  async create(usuarioId: number, criarHorarioMedicamentoDto: CriarHorarioMedicamentoDto): Promise<HorarioMedicamento> {
    // Verifica se o medicamento existe e pertence ao usuário
    const medicamento = await this.medicamentosRepository.findOne({
      where: { 
        id: criarHorarioMedicamentoDto.medicamentoId,
        usuarioId: usuarioId
      },
    });

    if (!medicamento) {
      throw new NotFoundException(`Medicamento com ID ${criarHorarioMedicamentoDto.medicamentoId} não encontrado ou não pertence ao usuário`);
    }

    // Cria o novo horário
    const novoHorario = this.horariosMedicamentosRepository.create({
      medicamentoId: criarHorarioMedicamentoDto.medicamentoId,
      horarioAdministracao: criarHorarioMedicamentoDto.horario,
      quantidadeComprimido: criarHorarioMedicamentoDto.quantidade_comprimido,
      ativo: true,
    });

    return this.horariosMedicamentosRepository.save(novoHorario);
  }

  /**
   * Busca todos os horários de um medicamento específico
   */
  async findAllByMedicamento(medicamentoId: number, usuarioId: number): Promise<HorarioMedicamento[]> {
    // Verifica se o medicamento existe e pertence ao usuário
    const medicamento = await this.medicamentosRepository.findOne({
      where: { 
        id: medicamentoId,
        usuarioId: usuarioId
      },
    });

    if (!medicamento) {
      throw new NotFoundException(`Medicamento com ID ${medicamentoId} não encontrado ou não pertence ao usuário`);
    }

    return this.horariosMedicamentosRepository.find({
      where: { medicamentoId: medicamentoId },
      order: { horarioAdministracao: 'ASC' },
    });
  }

  /**
   * Busca um horário específico por ID
   */
  async findOne(id: number, usuarioId: number): Promise<HorarioMedicamento> {
    const horario = await this.horariosMedicamentosRepository.findOne({
      where: { id: id },
      relations: ['medicamento'],
    });

    if (!horario) {
      throw new NotFoundException(`Horário de medicamento com ID ${id} não encontrado`);
    }

    // Verifica se o medicamento associado pertence ao usuário
    if (horario.medicamento.usuarioId !== usuarioId) {
      throw new ForbiddenException('Você não tem permissão para acessar este horário de medicamento');
    }

    return horario;
  }

  /**
   * Atualiza um horário de medicamento existente
   */
  async update(id: number, usuarioId: number, atualizarHorarioMedicamentoDto: AtualizarHorarioMedicamentoDto): Promise<HorarioMedicamento> {
    const horario = await this.findOne(id, usuarioId);
    
    // Atualiza apenas os campos fornecidos no DTO
    if (atualizarHorarioMedicamentoDto.horario !== undefined) {
      horario.horarioAdministracao = atualizarHorarioMedicamentoDto.horario;
    }
    
    if (atualizarHorarioMedicamentoDto.quantidade_comprimido !== undefined) {
      horario.quantidadeComprimido = atualizarHorarioMedicamentoDto.quantidade_comprimido;
    }
    
    if (atualizarHorarioMedicamentoDto.ativo !== undefined) {
      horario.ativo = atualizarHorarioMedicamentoDto.ativo;
    }
    
    return this.horariosMedicamentosRepository.save(horario);
  }

  /**
   * Remove um horário de medicamento
   */
  async remove(id: number, usuarioId: number): Promise<void> {
    const horario = await this.findOne(id, usuarioId);
    await this.horariosMedicamentosRepository.remove(horario);
  }
}
