import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Medicamento } from '../medicamentos/medicamento.entity';

@Entity({ name: 'horarios_medicamentos' })
export class HorarioMedicamento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'medicamento_id', type: 'int', nullable: false })
  medicamentoId: number;

  @ManyToOne(() => Medicamento, (medicamento) => medicamento.horarios, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'medicamento_id' })
  medicamento: Medicamento;

  @Column({ name: 'horario_administracao', type: 'time', nullable: false })
  horarioAdministracao: string;

  @Column({ name: 'quantidade_comprimido', type: 'int', nullable: true }) // Mapeia para a coluna do banco
  quantidadeComprimido: number; // Propriedade na classe (camelCase)

  @Column({ type: 'boolean', default: true, nullable: false })
  ativo: boolean;

  @CreateDateColumn({ name: 'criado_em', type: 'timestamp with time zone' })
  criadoEm: Date;

  @UpdateDateColumn({ name: 'atualizado_em', type: 'timestamp with time zone' })
  atualizadoEm: Date;
}
