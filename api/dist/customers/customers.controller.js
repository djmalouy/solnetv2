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
exports.CustomersController = void 0;
const common_1 = require("@nestjs/common");
const customers_service_1 = require("./customers.service");
const create_customer_dto_1 = require("./dto/create-customer.dto");
const update_customer_dto_1 = require("./dto/update-customer.dto");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
const audit_service_1 = require("../audit/audit.service");
let CustomersController = class CustomersController {
    constructor(svc, audit) {
        this.svc = svc;
        this.audit = audit;
    }
    async list(q, page, pageSize) {
        return this.svc.list({ q, page, pageSize });
    }
    async create(dto, req) {
        var _a;
        const created = await this.svc.create(dto);
        await this.audit.log({
            userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.sub,
            ip: req.ip,
            action: 'create',
            entity: 'customer',
            entityId: String(created.id),
            details: JSON.stringify(dto),
        });
        return created;
    }
    async update(id, dto, req) {
        var _a;
        const updated = await this.svc.update(id, dto);
        await this.audit.log({
            userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.sub,
            ip: req.ip,
            action: 'update',
            entity: 'customer',
            entityId: String(id),
            details: JSON.stringify(dto),
        });
        return updated;
    }
    async remove(id, req) {
        var _a;
        const removed = await this.svc.softDelete(id);
        await this.audit.log({
            userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.sub,
            ip: req.ip,
            action: 'delete',
            entity: 'customer',
            entityId: String(id),
        });
        return { ok: true };
    }
    async getOne(id) {
        return this.svc.findOne(id);
    }
};
exports.CustomersController = CustomersController;
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Perms)('customer.read'),
    __param(0, (0, common_1.Query)('q')),
    __param(1, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('pageSize', new common_1.DefaultValuePipe(20), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Perms)('customer.create'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_customer_dto_1.CreateCustomerDto, Object]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, permissions_decorator_1.Perms)('customer.update'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_customer_dto_1.UpdateCustomerDto, Object]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.Perms)('customer.delete'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "getOne", null);
exports.CustomersController = CustomersController = __decorate([
    (0, common_1.Controller)('customers')
    //@UseGuards(AuthGuard('jwt'), PermissionsGuard)
    ,
    __metadata("design:paramtypes", [customers_service_1.CustomersService, audit_service_1.AuditService])
], CustomersController);
