import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique
} from "typeorm";

import * as bcrypt from "bcrypt";

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

  @Column({ default: "" })
  userSessions: string;

  validatePassword(password: string): boolean {
    return bcrypt.compareSync(password, this.password);
  }

  isSessionActive(uuid: string): boolean {
    return this.userSessions.split(",").includes(uuid);
  }
}
