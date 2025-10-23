"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const crypto_1 = require("../common/crypto");
let AuthService = class AuthService {
    constructor(users, jwt) {
        this.users = users;
        this.jwt = jwt;
    }
    async login(username, password) {
        const user = await this.users.findByUsername(username);
        if (!user || !user.isActive)
            throw new common_1.UnauthorizedException();
        const ok = await (0, crypto_1.verifyPassword)(user.passwordHash, password);
        if (!ok)
            throw new common_1.UnauthorizedException();
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService, jwt_1.JwtService])
], AuthService);
