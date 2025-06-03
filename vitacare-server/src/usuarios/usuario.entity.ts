import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, } from 'typeorm';

@Entity({ name: 'usuarios' }) // Define o nome da tabela no banco de dados como 'usuarios'
export class Usuario {
  @PrimaryGeneratedColumn() // Define 'id' como chave primária autoincrementável
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  nome: string;

  @Index({ unique: true }) // Cria um índice único para a coluna 'email'
  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  email: string;

  @Column({ name: 'senha_hash', type: 'varchar', length: 255, nullable: false })
  senhaHash: string; // No código usamos camelCase (senhaHash) e o TypeORM pode mapear para snake_case (senha_hash) no banco se configurado, ou podemos ser explícitos com @Column({name: 'senha_hash'})

  @CreateDateColumn({ name: 'criado_em', type: 'timestamp with time zone' })
  criadoEm: Date;

  @UpdateDateColumn({ name: 'atualizado_em', type: 'timestamp with time zone' })
  atualizadoEm: Date;

  // Aqui poderíamos adicionar relacionamentos no futuro, como:
  // @OneToMany(() => Medicamento, (medicamento) => medicamento.usuario)
  // medicamentos: Medicamento[];

  // @OneToMany(() => Consulta, (consulta) => consulta.usuario)
  // consultas: Consulta[];

  // @OneToMany(() => DeviceToken, (deviceToken) => deviceToken.usuario)
  // deviceTokens: DeviceToken[];
}
