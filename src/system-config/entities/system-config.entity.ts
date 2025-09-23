import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'system_config' })
export class SystemConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  commissionFixedA: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  commissionPercentB: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  blockPercentD: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
