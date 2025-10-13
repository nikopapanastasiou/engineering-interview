import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ProfileModule } from "../profile/profile.module";
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';

@Module({
    imports: [
        ProfileModule,
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'dev-secret',
            signOptions: { expiresIn: '7d' },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    exports: [AuthService],
})
export class AuthModule {}