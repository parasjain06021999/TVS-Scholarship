export declare class EncryptionService {
    private static readonly ALGORITHM;
    private static readonly IV_LENGTH;
    private static readonly SALT_ROUNDS;
    private readonly secretKey;
    constructor();
    encrypt(text: string): Promise<string>;
    decrypt(encryptedText: string): Promise<string>;
    hashPassword(password: string): Promise<string>;
    comparePassword(password: string, hashedPassword: string): Promise<boolean>;
    generateApiKey(): string;
    generateSecureToken(length?: number): string;
}
