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
exports.SalesController = void 0;
const common_1 = require("@nestjs/common");
const sales_service_1 = require("./sales.service");
const create_sale_dto_1 = require("./dto/create-sale.dto");
const update_sale_dto_1 = require("./dto/update-sale.dto");
const audit_service_1 = require("../audit/audit.service");
let SalesController = class SalesController {
    constructor(svc, audit) {
        this.svc = svc;
        this.audit = audit;
    }
    async list(q, page, pageSize, customerId) {
        return this.svc.list({ q, page, pageSize, customerId });
    }
    async getOne(id) {
        return this.svc.findOne(id);
    }
    async create(dto, req) {
        var _a;
        const created = await this.svc.create(dto);
        await this.audit.log({
            userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.sub,
            ip: req.ip,
            action: 'create',
            entity: 'sale',
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
            entity: 'sale',
            entityId: String(id),
            details: JSON.stringify(dto),
        });
        return updated;
    }
    async remove(id, req) {
        var _a;
        const deleted = await this.svc.remove(id);
        await this.audit.log({
            userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.sub,
            ip: req.ip,
            action: 'delete',
            entity: 'sale',
            entityId: String(id),
        });
        return deleted;
    }
};
exports.SalesController = SalesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('q')),
    __param(1, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('pageSize', new common_1.DefaultValuePipe(50), common_1.ParseIntPipe)),
    __param(3, (0, common_1.Query)('customerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, Number]),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "getOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_sale_dto_1.CreateSaleDto, Object]),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_sale_dto_1.UpdateSaleDto, Object]),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "remove", null);
exports.SalesController = SalesController = __decorate([
    (0, common_1.Controller)('sales'),
    __metadata("design:paramtypes", [sales_service_1.SalesService, audit_service_1.AuditService])
], SalesController);
