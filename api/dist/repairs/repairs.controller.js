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
exports.RepairsController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const repairs_service_1 = require("./repairs.service");
const create_repair_dto_1 = require("./dto/create-repair.dto");
const update_repair_dto_1 = require("./dto/update-repair.dto");
const change_status_dto_1 = require("./dto/change-status.dto");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
const permissions_guard_1 = require("../common/guards/permissions.guard");
const audit_service_1 = require("../audit/audit.service");
let RepairsController = class RepairsController {
    constructor(svc, audit) {
        this.svc = svc;
        this.audit = audit;
    }
    async list(q, status, branchId, customerId, dateFrom, dateTo, page, pageSize) {
        return this.svc.list({
            q,
            status: status,
            branchId: branchId ? Number(branchId) : undefined,
            customerId: customerId ? Number(customerId) : undefined,
            dateFrom,
            dateTo,
            page: Number(page),
            pageSize: Number(pageSize),
        });
    }
    async create(dto, req) {
        var _a;
        const created = await this.svc.create(dto);
        await this.audit.log({
            userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.sub, ip: req.ip,
            action: 'create', entity: 'repair', entityId: String(created.id),
            details: JSON.stringify(dto),
        });
        return created;
    }
    async update(id, dto, req) {
        var _a;
        const updated = await this.svc.update(id, dto);
        await this.audit.log({
            userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.sub, ip: req.ip,
            action: 'update', entity: 'repair', entityId: String(id),
            details: JSON.stringify(dto),
        });
        return updated;
    }
    async changeStatus(id, dto, req) {
        var _a;
        const updated = await this.svc.changeStatus(id, dto.status);
        await this.audit.log({
            userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.sub, ip: req.ip,
            action: 'status', entity: 'repair', entityId: String(id),
            details: JSON.stringify({ to: dto.status }),
        });
        return updated;
    }
    async remove(id, req) {
        var _a;
        await this.svc.softDelete(id);
        await this.audit.log({
            userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.sub, ip: req.ip,
            action: 'delete', entity: 'repair', entityId: String(id),
        });
        return { ok: true };
    }
};
exports.RepairsController = RepairsController;
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Perms)('repair.read'),
    __param(0, (0, common_1.Query)('q')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('branchId')),
    __param(3, (0, common_1.Query)('customerId')),
    __param(4, (0, common_1.Query)('dateFrom')),
    __param(5, (0, common_1.Query)('dateTo')),
    __param(6, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1))),
    __param(7, (0, common_1.Query)('pageSize', new common_1.DefaultValuePipe(20))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Number, String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], RepairsController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Perms)('repair.create'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_repair_dto_1.CreateRepairDto, Object]),
    __metadata("design:returntype", Promise)
], RepairsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, permissions_decorator_1.Perms)('repair.update'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_repair_dto_1.UpdateRepairDto, Object]),
    __metadata("design:returntype", Promise)
], RepairsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, permissions_decorator_1.Perms)('repair.update'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, change_status_dto_1.ChangeStatusDto, Object]),
    __metadata("design:returntype", Promise)
], RepairsController.prototype, "changeStatus", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.Perms)('repair.delete'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], RepairsController.prototype, "remove", null);
exports.RepairsController = RepairsController = __decorate([
    (0, common_1.Controller)('repairs'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [repairs_service_1.RepairsService, audit_service_1.AuditService])
], RepairsController);
