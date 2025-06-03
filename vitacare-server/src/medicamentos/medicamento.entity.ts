import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Usuario } from '../usuarios/usuario.entity'; // Importamos a entidade Usuario para o relacionamento
import { HorarioMedicamento } from 'src/horarios-medicamentos/horario-medicamento.entity';
@Entity({ name: 'medicamentos' })
export class Medicamento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'usuario_id', type: 'int', nullable: false })
  usuarioId: number;

  @ManyToOne(() => Usuario, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'usuario_id' }) // Especifica a coluna da chave estrangeira
  usuario: Usuario;

  @Column({ type: 'varchar', length: 255, nullable: false })
  nome: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  dosagem: string;

  @Column({ name: 'forma_farmaceutica', type: 'varchar', length: 100, nullable: true })
  formaFarmaceutica: string;

  @Column({ type: 'int', nullable: true })
  quantidade: number;

  @Column({ type: 'text', nullable: true })
  instrucoes: string;

  @CreateDateColumn({ name: 'criado_em', type: 'timestamp with time zone' })
  criadoEm: Date;

  @UpdateDateColumn({ name: 'atualizado_em', type: 'timestamp with time zone' })
  atualizadoEm: Date;

  // Relacionamento com HorariosMedicamentos será adicionado depois
  @OneToMany(() => HorarioMedicamento, (horario) => horario.medicamento, {cascade: true})
  horarios: HorarioMedicamento[];
}
