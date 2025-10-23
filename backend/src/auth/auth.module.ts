import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';


@Module({
    imports: [
    JwtModule.register({
    secret: process.env.JWT_SECRETO,
    signOptions: { expiresIn: process.env.JWT_EXPIRA || '8h' },
    }),
    ],
    providers: [AuthService, JwtStrategy],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {}