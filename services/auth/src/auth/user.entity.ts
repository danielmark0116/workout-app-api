import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToMany
} from "typeorm";

import * as bcrypt from "bcrypt";
import { Session } from "./session.entity";

@Entity()
@Unique(["email"])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: new Date().getTime() })
  createdAt: string;

  @OneToMany(
    type => Session,
    session => session.user,
    { eager: true }
  )
  userSessions: Session[];

  validatePassword(password: string): boolean {
    return bcrypt.compareSync(password, this.password);
  }

  async isSessionActive(session: Session): Promise<boolean> {
    // const isActive = await this.userSessions.includes();

    return true;
  }
}
