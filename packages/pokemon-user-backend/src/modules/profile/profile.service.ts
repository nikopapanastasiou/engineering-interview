import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DRIZZLE_CLIENT, DrizzleDatabase } from '../database/db.tokens';
import {
  NewProfile,
  Profile,
  profilesTable,
} from '../database/entities/profile.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ProfileService {
  constructor(
    @Inject(DRIZZLE_CLIENT) private readonly db: DrizzleDatabase,
  ) {}

  async findAll(): Promise<Profile[]> {
    return this.db.select().from(profilesTable);
  }

  async findByEmail(email: string): Promise<Profile | null> {
    return this.db.query.profilesTable.findFirst({
      where: eq(profilesTable.email, email),
    });
  }

  async findById(id: string): Promise<Profile> {
    const profile = await this.db.query.profilesTable.findFirst({
      where: eq(profilesTable.id, id),
    });

    if (!profile) {
      throw new NotFoundException(`Profile ${id} not found`);
    }

    return profile;
  }

  async create(payload: NewProfile): Promise<Profile> {
    const [created] = await this.db
      .insert(profilesTable)
      .values(payload)
      .returning();

    return created;
  }

  async createWithPassword(email: string, displayName: string, password: string): Promise<Profile> {
    const passwordHash = await bcrypt.hash(password, 10);
    const [created] = await this.db
      .insert(profilesTable)
      .values({ email, displayName, passwordHash } as NewProfile)
      .returning();
    return created;
  }

  async update(id: string, payload: Partial<NewProfile>): Promise<Profile> {
    const [updated] = await this.db
      .update(profilesTable)
      .set(payload)
      .where(eq(profilesTable.id, id))
      .returning();

    if (!updated) {
      throw new NotFoundException(`Profile ${id} not found`);
    }

    return updated;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.db
      .delete(profilesTable)
      .where(eq(profilesTable.id, id))
      .returning({ id: profilesTable.id });

    if (deleted.length === 0) {
      throw new NotFoundException(`Profile ${id} not found`);
    }
  }

  /**
   * Compatibility helper used by the legacy auth flow.
   * Returns the first profile found, or null if none exist.
   */
  async getProfile(): Promise<Profile | null> {
    const profiles = await this.findAll();
    return profiles[0] ?? null;
  }
}