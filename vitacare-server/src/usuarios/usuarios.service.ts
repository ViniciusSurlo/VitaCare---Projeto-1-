// /home/ubuntu/vitacare_project/vitacare-server/src/usuarios/usuarios.service.ts
import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Usuario } from "./usuario.entity";
import { CriarUsuarioDto } from "./dto/criar-usuario.dto";
import { AtualizarUsuarioDto } from "./dto/atualizar-usuario.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
  ) {}

  // Retorna o usuário criado SEM o hash da senha
  async create(criarUsuarioDto: CriarUsuarioDto): Promise<Omit<Usuario, 'senhaHash'>> {
    const { nome, email, senha } = criarUsuarioDto;

    const usuarioExistente = await this.findByEmail(email);
    if (usuarioExistente) {
      throw new ConflictException('Este email já está em uso.');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(senha, salt);

    // Criar a instância da entidade usando o campo correto 'senhaHash'
    const novoUsuario = this.usuariosRepository.create({
      nome,
      email,
      senhaHash: hashedPassword, // CORRIGIDO: Usar senhaHash
      // Incluir outros campos do DTO se existirem na entidade, como dataNascimento, telefone
      // dataNascimento: criarUsuarioDto.dataNascimento ? new Date(criarUsuarioDto.dataNascimento) : undefined,
      // telefone: criarUsuarioDto.telefone,
    });

    const savedUser = await this.usuariosRepository.save(novoUsuario);

    // Remover o hash da senha do objeto retornado
    const { senhaHash: _, ...result } = savedUser;
    return result;
  }

  async findOne(id: number): Promise<Usuario> {
    const usuario = await this.usuariosRepository.findOne({ where: { id } });
    if (!usuario) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }
    return usuario; // Retorna o usuário completo, incluindo senhaHash (será filtrado depois, se necessário)
  }

  async findByEmail(email: string): Promise<Usuario | undefined> {
    const usuario = await this.usuariosRepository.findOne({ where: { email } });
    return usuario ?? undefined;
  }

  // Retorna o usuário atualizado SEM o hash da senha
  async update(id: number, atualizarUsuarioDto: AtualizarUsuarioDto): Promise<Omit<Usuario, 'senhaHash'>> {
    const usuario = await this.findOne(id);

    // Verificar email existente se estiver sendo alterado
    if (atualizarUsuarioDto.email && atualizarUsuarioDto.email !== usuario.email) {
      const emailExistente = await this.findByEmail(atualizarUsuarioDto.email);
      if (emailExistente && emailExistente.id !== id) {
        throw new ConflictException('Este email já está em uso por outro usuário.');
      }
    }

    // Atualizar campos do DTO, exceto a senha por enquanto
    const { senha, ...dadosParaAtualizar } = atualizarUsuarioDto;
    Object.assign(usuario, dadosParaAtualizar);
    // Se dataNascimento for string, converter para Date
    // if (dadosParaAtualizar.dataNascimento) {
    //   usuario.dataNascimento = new Date(dadosParaAtualizar.dataNascimento);
    // }

    // Hash e atualiza a senha SE ela foi fornecida no DTO
    if (senha) {
      const salt = await bcrypt.genSalt();
      usuario.senhaHash = await bcrypt.hash(senha, salt); // CORRIGIDO: Atualizar senhaHash
    }

    const updatedUser = await this.usuariosRepository.save(usuario);

    // Remover o hash da senha do objeto retornado
    const { senhaHash: _, ...result } = updatedUser;
    return result;
  }

  async remove(id: number): Promise<void> {
    const result = await this.usuariosRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }
  }

  // Retorna todos os usuários SEM o hash da senha
  async findAll(): Promise<Omit<Usuario, 'senhaHash'>[]> {
    return this.usuariosRepository.find({
      select: ['id', 'nome', 'email', 'criadoEm', 'atualizadoEm'], // Seleciona campos específicos, omitindo senhaHash
    });
  }
}
