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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientesController = void 0;
const common_1 = require("@nestjs/common");
const clientes_service_1 = require("./clientes.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
let ClientesController = class ClientesController {
    constructor(svc) {
        this.svc = svc;
    }
    buscar(buscar) {
        return this.svc.buscar(buscar);
    }
    crear(data) {
        return this.svc.crear(data);
    }
};
exports.ClientesController = ClientesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('buscar')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClientesController.prototype, "buscar", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ClientesController.prototype, "crear", null);
exports.ClientesController = ClientesController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('clientes'),
    __metadata("design:paramtypes", [clientes_service_1.ClientesService])
], ClientesController);
