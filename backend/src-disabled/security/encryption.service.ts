import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EncryptionService {
  private static readonly ALGORITHM = 'aes-256-gcm';
  private static readonly KEY_LENGTH = 32;
  private static readonly IV_LENGTH = 16;
  private static readonly TAG_LENGTH = 16;
  private static readonly SALT_ROUNDS = 12;

  private readonly encryptionKey: Buffer;

  constructor() {
    const key = process.env.ENCRYPTION_KEY;
    if (!key) {
      throw new Error('ENCRYPTION_KEY environment variable is required');
    }
    
    // Ensure key is exactly 32 bytes
    this.encryptionKey = Buffer.from(key.padEnd(32, '0').slice(0, 32));
  }

  /**
   * Encrypt sensitive data before database storage
   */
  encryptSensitive(data: string): { encrypted: string; iv: string; tag: string } {
    try {
      const iv = crypto.randomBytes(EncryptionService.IV_LENGTH);
      const cipher = crypto.createCipher(EncryptionService.ALGORITHM, this.encryptionKey);
      
      // Set additional authenticated data
      const aad = Buffer.from('TVS-SCHOLARSHIP', 'utf8');
      cipher.setAAD(aad);
      
      let encrypted = cipher.update(data, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      const tag = cipher.getAuthTag();
      
      return {
        encrypted,
        iv: iv.toString('hex'),
        tag: tag.toString('hex')
      };
    } catch (error) {
      throw new Error(`Encryption failed: ${error.message}`);
    }
  }

  /**
   * Decrypt sensitive data from database
   */
  decryptSensitive(encryptedData: string, iv: string, tag: string): string {
    try {
      const decipher = crypto.createDecipher(EncryptionService.ALGORITHM, this.encryptionKey);
      
      // Set additional authenticated data
      const aad = Buffer.from('TVS-SCHOLARSHIP', 'utf8');
      decipher.setAAD(aad);
      decipher.setAuthTag(Buffer.from(tag, 'hex'));
      
      let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      throw new Error(`Decryption failed: ${error.message}`);
    }
  }

  /**
   * Hash passwords with salt
   */
  async hashPassword(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, EncryptionService.SALT_ROUNDS);
    } catch (error) {
      throw new Error(`Password hashing failed: ${error.message}`);
    }
  }

  /**
   * Verify password against hash
   */
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      throw new Error(`Password verification failed: ${error.message}`);
    }
  }

  /**
   * Generate secure random token
   */
  generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Generate secure random string
   */
  generateSecureString(length: number = 16): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    return result;
  }

  /**
   * Create HMAC signature for data integrity
   */
  createHMAC(data: string, secret: string): string {
    return crypto.createHmac('sha256', secret).update(data).digest('hex');
  }

  /**
   * Verify HMAC signature
   */
  verifyHMAC(data: string, signature: string, secret: string): boolean {
    const expectedSignature = this.createHMAC(data, secret);
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  }

  /**
   * Encrypt file content
   */
  encryptFile(fileBuffer: Buffer): { encrypted: Buffer; iv: string; tag: string } {
    try {
      const iv = crypto.randomBytes(EncryptionService.IV_LENGTH);
      const cipher = crypto.createCipher(EncryptionService.ALGORITHM, this.encryptionKey);
      
      const aad = Buffer.from('TVS-FILE', 'utf8');
      cipher.setAAD(aad);
      
      let encrypted = cipher.update(fileBuffer);
      encrypted = Buffer.concat([encrypted, cipher.final()]);
      
      const tag = cipher.getAuthTag();
      
      return {
        encrypted,
        iv: iv.toString('hex'),
        tag: tag.toString('hex')
      };
    } catch (error) {
      throw new Error(`File encryption failed: ${error.message}`);
    }
  }

  /**
   * Decrypt file content
   */
  decryptFile(encryptedBuffer: Buffer, iv: string, tag: string): Buffer {
    try {
      const decipher = crypto.createDecipher(EncryptionService.ALGORITHM, this.encryptionKey);
      
      const aad = Buffer.from('TVS-FILE', 'utf8');
      decipher.setAAD(aad);
      decipher.setAuthTag(Buffer.from(tag, 'hex'));
      
      let decrypted = decipher.update(encryptedBuffer);
      decrypted = Buffer.concat([decrypted, decipher.final()]);
      
      return decrypted;
    } catch (error) {
      throw new Error(`File decryption failed: ${error.message}`);
    }
  }

  /**
   * Hash sensitive data for search (one-way)
   */
  hashForSearch(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  /**
   * Mask sensitive data for display
   */
  maskSensitiveData(data: string, visibleChars: number = 4): string {
    if (data.length <= visibleChars) {
      return '*'.repeat(data.length);
    }
    
    const visible = data.slice(-visibleChars);
    const masked = '*'.repeat(data.length - visibleChars);
    
    return masked + visible;
  }

  /**
   * Encrypt database fields before save
   */
  encryptFields(data: Record<string, any>, fieldsToEncrypt: string[]): Record<string, any> {
    const encrypted = { ...data };
    
    fieldsToEncrypt.forEach(field => {
      if (encrypted[field] && typeof encrypted[field] === 'string') {
        const encryptedData = this.encryptSensitive(encrypted[field]);
        encrypted[field] = JSON.stringify(encryptedData);
      }
    });
    
    return encrypted;
  }

  /**
   * Decrypt database fields after retrieval
   */
  decryptFields(data: Record<string, any>, fieldsToDecrypt: string[]): Record<string, any> {
    const decrypted = { ...data };
    
    fieldsToDecrypt.forEach(field => {
      if (decrypted[field] && typeof decrypted[field] === 'string') {
        try {
          const encryptedData = JSON.parse(decrypted[field]);
          decrypted[field] = this.decryptSensitive(
            encryptedData.encrypted,
            encryptedData.iv,
            encryptedData.tag
          );
        } catch (error) {
          // If decryption fails, return original value
          console.warn(`Failed to decrypt field ${field}:`, error.message);
        }
      }
    });
    
    return decrypted;
  }
}
