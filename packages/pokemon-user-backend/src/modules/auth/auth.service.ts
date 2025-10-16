import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ProfileService } from "../profile/profile.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly profiles: ProfileService,
    private readonly jwt: JwtService,
  ) {}

  async signup(email: string, displayName: string, password: string) {
    const user = await this.profiles.createWithPassword(email, displayName, password);
    return this.issueToken(user.id, user.email, user.displayName);
  }

  async login(email: string, password: string) {
    const user = await this.profiles.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    return this.issueToken(user.id, user.email, user.displayName);
  }

  private async issueToken(sub: string, email: string, displayName: string) {
    const payload = { sub, email, displayName };
    const access_token = await this.jwt.signAsync(payload);
    return { 
      access_token,
      user: {
        id: sub,
        email,
        displayName,
      }
    };
  }
}