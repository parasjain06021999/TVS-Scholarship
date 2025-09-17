"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongodbModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const config_1 = require("@nestjs/config");
const document_metadata_schema_1 = require("./schemas/document-metadata.schema");
const audit_log_schema_1 = require("./schemas/audit-log.schema");
const application_version_schema_1 = require("./schemas/application-version.schema");
let MongodbModule = class MongodbModule {
};
exports.MongodbModule = MongodbModule;
exports.MongodbModule = MongodbModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forRootAsync({
                useFactory: (configService) => ({
                    uri: configService.get('MONGODB_URI'),
                }),
                inject: [config_1.ConfigService],
            }),
            mongoose_1.MongooseModule.forFeature([
                { name: document_metadata_schema_1.DocumentMetadata.name, schema: document_metadata_schema_1.DocumentMetadataSchema },
                { name: audit_log_schema_1.AuditLog.name, schema: audit_log_schema_1.AuditLogSchema },
                { name: application_version_schema_1.ApplicationVersion.name, schema: application_version_schema_1.ApplicationVersionSchema },
            ]),
        ],
        exports: [mongoose_1.MongooseModule],
    })
], MongodbModule);
//# sourceMappingURL=mongodb.module.js.map