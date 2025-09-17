"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityModule = void 0;
const common_1 = require("@nestjs/common");
const security_controller_1 = require("./security.controller");
const access_control_service_1 = require("./access-control.service");
const audit_logger_service_1 = require("./audit-logger.service");
const encryption_service_1 = require("./encryption.service");
const prisma_module_1 = require("../prisma/prisma.module");
let SecurityModule = class SecurityModule {
};
exports.SecurityModule = SecurityModule;
exports.SecurityModule = SecurityModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [security_controller_1.SecurityController],
        providers: [access_control_service_1.AccessControlService, audit_logger_service_1.AuditLoggerService, encryption_service_1.EncryptionService],
        exports: [access_control_service_1.AccessControlService, audit_logger_service_1.AuditLoggerService, encryption_service_1.EncryptionService],
    })
], SecurityModule);
//# sourceMappingURL=security.module.js.map