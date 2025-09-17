import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class EncryptionService {
  private static readonly ALGORITHM = 'aes-256-gcm';
  private static readonly IV_LENGTH = 16;
  private static readonly SALT_ROUNDS = 10;
  private readonly secretKey: string;

  constructor() {
    this.secretKey = process.env.ENCRYPTION_KEY || 'default-secret-key-change-in-production';
  }

  async encrypt(text: string): Promise<string> {
    try {
      const iv = crypto.randomBytes(EncryptionService.IV_LENGTH);
      const cipher = crypto.createCipher(EncryptionService.ALGORITHM, this.secretKey);
      
      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      const authTag = cipher.getAuthTag();
      
      return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
    } catch (error) {
      throw new Error(`Encryption failed: ${error.message}`);
    }
  }

  async decrypt(encryptedText: string): Promise<string> {
    try {
      const parts = encryptedText.split(':');
      if (parts.length !== 3) {
        throw new Error('Invalid encrypted text format');
      }

      const iv = Buffer.from(parts[0], 'hex');
      const authTag = Buffer.from(parts[1], 'hex');
      const encrypted = parts[2];

      const decipher = crypto.createDecipher(EncryptionService.ALGORITHM, this.secretKey);
      decipher.setAuthTag(authTag);

      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      throw new Error(`Decryption failed: ${error.message}`);
    }
  }

  async hashPassword(password: string): Promise<string> {
    try {
      const bcrypt = require('bcrypt');
      return await bcrypt.hash(password, EncryptionService.SALT_ROUNDS);
    } catch (error) {
      throw new Error(`Password hashing failed: ${error.message}`);
    }
  }

  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    try {
      const bcrypt = require('bcrypt');
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      throw new Error(`Password comparison failed: ${error.message}`);
    }
  }

  generateApiKey(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }
}
