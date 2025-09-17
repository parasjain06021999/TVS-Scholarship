"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var EncryptionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncryptionService = void 0;
const common_1 = require("@nestjs/common");
const crypto = __importStar(require("crypto"));
let EncryptionService = EncryptionService_1 = class EncryptionService {
    constructor() {
        this.secretKey = process.env.ENCRYPTION_KEY || 'default-secret-key-change-in-production';
    }
    async encrypt(text) {
        try {
            const iv = crypto.randomBytes(EncryptionService_1.IV_LENGTH);
            const cipher = crypto.createCipher(EncryptionService_1.ALGORITHM, this.secretKey);
            let encrypted = cipher.update(text, 'utf8', 'hex');
            encrypted += cipher.final('hex');
            const authTag = cipher.getAuthTag();
            return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
        }
        catch (error) {
            throw new Error(`Encryption failed: ${error.message}`);
        }
    }
    async decrypt(encryptedText) {
        try {
            const parts = encryptedText.split(':');
            if (parts.length !== 3) {
                throw new Error('Invalid encrypted text format');
            }
            const iv = Buffer.from(parts[0], 'hex');
            const authTag = Buffer.from(parts[1], 'hex');
            const encrypted = parts[2];
            const decipher = crypto.createDecipher(EncryptionService_1.ALGORITHM, this.secretKey);
            decipher.setAuthTag(authTag);
            let decrypted = decipher.update(encrypted, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            return decrypted;
        }
        catch (error) {
            throw new Error(`Decryption failed: ${error.message}`);
        }
    }
    async hashPassword(password) {
        try {
            const bcrypt = require('bcrypt');
            return await bcrypt.hash(password, EncryptionService_1.SALT_ROUNDS);
        }
        catch (error) {
            throw new Error(`Password hashing failed: ${error.message}`);
        }
    }
    async comparePassword(password, hashedPassword) {
        try {
            const bcrypt = require('bcrypt');
            return await bcrypt.compare(password, hashedPassword);
        }
        catch (error) {
            throw new Error(`Password comparison failed: ${error.message}`);
        }
    }
    generateApiKey() {
        return crypto.randomBytes(32).toString('hex');
    }
    generateSecureToken(length = 32) {
        return crypto.randomBytes(length).toString('hex');
    }
};
exports.EncryptionService = EncryptionService;
EncryptionService.ALGORITHM = 'aes-256-gcm';
EncryptionService.IV_LENGTH = 16;
EncryptionService.SALT_ROUNDS = 10;
exports.EncryptionService = EncryptionService = EncryptionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], EncryptionService);
//# sourceMappingURL=encryption.service.js.map