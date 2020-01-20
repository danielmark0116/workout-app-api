import { Repository, EntityRepository, createQueryBuilder } from "typeorm";
import { Session } from "inspector";
import { UnauthorizedException } from "@nestjs/common";

@EntityRepository(Session)
export class SessionRepository extends Repository<Session> {
  async deleteSession(sessionId: number): Promise<boolean> {
    const query = this.createQueryBuilder().from(Session, "session");

    query.where("session.id = :id", { id: sessionId });

    const count = await query.getCount();

    if (count === 0) {
      throw new UnauthorizedException("No session");
    }

    await query.delete().execute();

    return true;
  }

  async deleteAllSessions(userId: number) {
    const query = createQueryBuilder().from(Session, "session");

    query.where('session."userId" = :id', { id: userId });

    const count = await query.getCount();

    if (count === 0) {
      throw new UnauthorizedException("No sessions");
    }

    await query.delete().execute();

    return true;
  }

  async isSessionActive(sessionId: number): Promise<boolean> {
    const query = createQueryBuilder().from(Session, "session");

    query.where("session.id = :id", { id: sessionId });

    const count = await query.getCount();

    if (count === 0) {
      throw new UnauthorizedException("Out of session");
    }

    return true;
  }
}
