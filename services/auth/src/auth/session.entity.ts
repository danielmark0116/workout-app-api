import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne
} from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Session extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column()
  userId: number;

  @ManyToOne(
    type => User,
    user => user.userSessions,
    { eager: false }
  )
  user: User;
}
