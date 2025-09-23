import { Shop } from '../../shop/entities/shop.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';

export enum PaymentStatus {
  ACCEPTED = 'accepted', // When the payment is created
  PROCESSED = 'processed', // Payment sum without commission and blocked is available
  COMPLETED = 'completed', // Blocked is available
  PAID_OUT = 'paid_out',
}

// TODO: BigInt refactor?
@Entity({ name: 'payments' })
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Shop, (shop) => shop.payments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'shop_id' })
  shop: Shop;

  @Column({ name: 'shop_id' })
  shopId: number;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.ACCEPTED,
  })
  status: PaymentStatus;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  commissionA: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  commissionB: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  commissionC: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  blockedD: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
