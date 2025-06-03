import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Medicamento } from './medicamento.entity';
import { HorarioMedicamento } from '../horarios-medicamentos/horario-medicamento.entity';
import { CriarMedicamentoDto } from './dto/criar-medicamento.dto';
import { AtualizarMedicamentoDto } from './dto/atualizar-medicamento.dto';

@Injectable()
export class MedicamentosService {
  constructor(
    @InjectRepository(Medicamento)
    private medicamentosRepository: Repository<Medicamento>,
    @InjectRepository(HorarioMedicamento)
    private horariosRepository: Repository<HorarioMedicamento>,
  ) {}

  /**
   * Cria um novo medicamento com seus horários
   */
  async create(usuarioId: number, criarMedicamentoDto: CriarMedicamentoDto): Promise<Medicamento> {
    const novoMedicamento = this.medicamentosRepository.create({
      ...criarMedicamentoDto,
      usuarioId: usuarioId, // Usando camelCase
      horarios: [],
    });

    const medicamentoSalvo = await this.medicamentosRepository.save(novoMedicamento);

    if (criarMedicamentoDto.horarios && criarMedicamentoDto.horarios.length > 0) {
      const horarios = criarMedicamentoDto.horarios.map(horarioDto => {
        return this.horariosRepository.create({
          medicamentoId: medicamentoSalvo.id, // Usando camelCase
          horarioAdministracao: horarioDto.horario, // Mapeando DTO.horario para entidade.horarioAdministracao
          quantidadeComprimido: horarioDto.quantidade_comprimido, // Mapeando DTO.quantidade_comprimido para entidade.quantidadeComprimido
          ativo: true,
        });
      });

      const horariosSalvos = await this.horariosRepository.save(horarios);
      // Não precisamos reatribuir, o TypeORM gerencia a relação
    }

    // Recarrega o medicamento para garantir que a relação 'horarios' esteja populada
    const medicamentoCompleto = await this.medicamentosRepository.findOne({
      where: { id: medicamentoSalvo.id },
      relations: ['horarios'],
    });

    // Tratamento para o caso (improvável) de não encontrar o medicamento recém-salvo
    if (!medicamentoCompleto) {
        throw new NotFoundException(`Erro ao recarregar o medicamento com ID ${medicamentoSalvo.id} após a criação.`);
    }

    return medicamentoCompleto;
  }

  /**
   * Busca todos os medicamentos de um usuário específico
   */
  async findAllByUsuario(usuarioId: number): Promise<Medicamento[]> {
    return this.medicamentosRepository.find({
      where: { usuarioId: usuarioId }, // Usando camelCase
      relations: ['horarios'],
      order: {
        criadoEm: 'DESC', // Usando camelCase
      },
    });
  }

  /**
   * Busca um medicamento específico por ID
   */
  async findOne(id: number, usuarioId: number): Promise<Medicamento> {
    const medicamento = await this.medicamentosRepository.findOne({
      where: { id: id }, // Usando camelCase
      relations: ['horarios'],
    });

    if (!medicamento) {
      throw new NotFoundException(`Medicamento com ID ${id} não encontrado`);
    }

    if (medicamento.usuarioId !== usuarioId) { // Usando camelCase
      throw new ForbiddenException('Você não tem permissão para acessar este medicamento');
    }

    return medicamento;
  }

  // Substitua APENAS este método no arquivo src/medicamentos/medicamentos.service.ts

  /**
   * Atualiza um medicamento existente
   */
  async update(id: number, usuarioId: number, atualizarMedicamentoDto: AtualizarMedicamentoDto): Promise<Medicamento> {
    const medicamento = await this.findOne(id, usuarioId);

    // 1. Separa os dados do DTO: campos do Medicamento vs. Horarios
    const { horarios: horariosDto, ...dadosMedicamentoDto } = atualizarMedicamentoDto;

    // 2. Mescla e salva apenas os campos básicos do Medicamento
    this.medicamentosRepository.merge(medicamento, dadosMedicamentoDto);
    await this.medicamentosRepository.save(medicamento); // Salva as alterações básicas

    // 3. Se novos horários foram fornecidos no DTO, atualiza-os
    if (horariosDto) {
      // Remove os horários antigos associados a este medicamento
      if (medicamento.horarios && medicamento.horarios.length > 0) {
        await this.horariosRepository.remove(medicamento.horarios);
      }

      // Cria os novos horários a partir do DTO
      const novosHorarios = horariosDto.map(horarioDto => {
        return this.horariosRepository.create({
          medicamentoId: medicamento.id,
          horarioAdministracao: horarioDto.horario,
          quantidadeComprimido: horarioDto.quantidade_comprimido,
          ativo: true,
        });
      });

      // Salva os novos horários no banco
      await this.horariosRepository.save(novosHorarios);
    }

    // 4. Recarrega o medicamento completo para retornar a versão mais atualizada
    const medicamentoAtualizado = await this.medicamentosRepository.findOne({
        where: { id: id },
        relations: ["horarios"], // Garante que os horários (novos ou antigos) sejam carregados
    });

    // Tratamento de erro caso não encontre após atualização (improvável, mas seguro)
    if (!medicamentoAtualizado) {
        throw new NotFoundException(`Erro ao recarregar o medicamento com ID ${id} após a atualização.`);
    }

    return medicamentoAtualizado;
  }

// Mantenha o restante do arquivo como está (constructor, create, findAllByUsuario, findOne, remove)


  /**
   * Remove um medicamento
   */
  async remove(id: number, usuarioId: number): Promise<void> {
    const medicamento = await this.findOne(id, usuarioId);
    await this.medicamentosRepository.remove(medicamento);
  }
}

