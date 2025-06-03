import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Usuario } from "./usuario.entity";

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async findOneByEmail(email: string): Promise<Usuario | undefined> {
    const usuario = await this.usuarioRepository.findOne({ where: { email } });
    return usuario || undefined; // Se usuario for null, retorna undefined
  }

  async create(userData: Partial<Usuario>): Promise<Usuario> {
    const novoUsuario = this.usuarioRepository.create(userData);
    return this.usuarioRepository.save(novoUsuario);
  }

  async findOneById(id: number): Promise<Usuario | undefined> {
    const usuario = await this.usuarioRepository.findOne({ where: { id } });
    return usuario || undefined; // Se usuario for null, retorna undefined
  }
}
