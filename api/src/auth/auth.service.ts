import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { verifyPassword } from '../common/crypto';

@Injectable()
export class AuthService {
  constructor(private users: UsersService, private jwt: JwtService) {}

  async login(username: string, password: string) {
    const user = await this.users.findByUsername(username);
    if (!user || !user.isActive) throw new UnauthorizedException();
    const ok = await verifyPassword(user.passwordHash, password);
    if (!ok) throw new UnauthorizedException();

    const perms = await this.users.getUserPermissions(user.id);
    const payload = { sub: user.id, username: user.username, perms };
    const accessToken = await this.jwt.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '7d',
    });
    const refreshToken = await this.jwt.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });
    return { accessToken, refreshToken };
  }
}
