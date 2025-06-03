import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Usuario } from '../usuarios/usuario.entity';

@Entity({ name: 'device_tokens' })
export class DeviceToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'usuario_id', type: 'int', nullable: false })
  usuarioId: number;

  @ManyToOne(() => Usuario, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @Index({ unique: true }) // Um token de dispositivo deve ser único
  @Column({ type: 'text', unique: true, nullable: false })
  token: string;

  @Column({ type: 'varchar', length: 50, nullable: false }) // Ex: 'android', 'ios', 'web'
  plataforma: string;

  @CreateDateColumn({ name: 'criado_em', type: 'timestamp with time zone' })
  criadoEm: Date;

  @UpdateDateColumn({ name: 'atualizado_em', type: 'timestamp with time zone' })
  atualizadoEm: Date;
}
