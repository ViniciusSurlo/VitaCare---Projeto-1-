import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../usuarios/usuario.entity'; // Importamos a entidade Usuario

@Entity({ name: 'consultas' })
export class Consulta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'usuario_id', type: 'int', nullable: false })
  usuarioId: number;

  @ManyToOne(() => Usuario, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @Column({ type: 'varchar', length: 255, nullable: false })
  titulo: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  especialidade: string;

  @Column({ name: 'nome_medico', type: 'varchar', length: 255, nullable: true })
  nomeMedico: string;

  @Column({ name: 'local_consulta', type: 'text', nullable: true })
  localConsulta: string;

  @Column({ name: 'data_hora_consulta', type: 'timestamp with time zone', nullable: false })
  dataHoraConsulta: Date;

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @Column({ name: 'lembrete_antecedencia_minutos', type: 'int', nullable: true })
  lembreteAntecedenciaMinutos: number;

  @CreateDateColumn({ name: 'criado_em', type: 'timestamp with time zone' })
  criadoEm: Date;

  @UpdateDateColumn({ name: 'atualizado_em', type: 'timestamp with time zone' })
  atualizadoEm: Date;
}
