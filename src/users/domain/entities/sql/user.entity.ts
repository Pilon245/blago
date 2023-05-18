import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Users {
  @PrimaryColumn()
  id: string;

  @Column()
  login: string;

  @Column()
  email: string;

  @Column()
  passwordHash: string;

  @Column()
  createdAt: string;

  @Column({ nullable: true, default: null })
  confirmationCode: string;
}
