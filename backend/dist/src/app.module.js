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
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const students_module_1 = require("./students/students.module");
const scholarships_module_1 = require("./scholarships/scholarships.module");
const notifications_module_1 = require("./notifications/notifications.module");
const mail_module_1 = require("./mail/mail.module");
const health_module_1 = require("./health/health.module");
const applications_module_1 = require("./applications/applications.module");
const documents_module_1 = require("./documents/documents.module");
const payments_module_1 = require("./payments/payments.module");
const analytics_module_1 = require("./analytics/analytics.module");
const communications_module_1 = require("./communications/communications.module");
const reports_module_1 = require("./reports/reports.module");
const security_module_1 = require("./security/security.module");
const compliance_module_1 = require("./compliance/compliance.module");
const upload_module_1 = require("./upload/upload.module");
const app_controller_1 = require("./app.controller");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60000,
                    limit: 100,
                },
            ]),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            students_module_1.StudentsModule,
            scholarships_module_1.ScholarshipsModule,
            applications_module_1.ApplicationsModule,
            documents_module_1.DocumentsModule,
            payments_module_1.PaymentsModule,
            analytics_module_1.AnalyticsModule,
            notifications_module_1.NotificationsModule,
            communications_module_1.CommunicationsModule,
            reports_module_1.ReportsModule,
            security_module_1.SecurityModule,
            compliance_module_1.ComplianceModule,
            upload_module_1.UploadModule,
            mail_module_1.MailModule,
            health_module_1.HealthModule,
        ],
        controllers: [app_controller_1.AppController],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map