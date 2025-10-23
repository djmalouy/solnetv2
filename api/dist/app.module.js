"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const rbac_module_1 = require("./rbac/rbac.module");
const audit_module_1 = require("./audit/audit.module");
const customers_module_1 = require("./customers/customers.module");
const repairs_module_1 = require("./repairs/repairs.module");
const sales_module_1 = require("./sales/sales.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule, users_module_1.UsersModule, rbac_module_1.RbacModule, audit_module_1.AuditModule, customers_module_1.CustomersModule, repairs_module_1.RepairsModule, sales_module_1.SalesModule,],
    })
], AppModule);
