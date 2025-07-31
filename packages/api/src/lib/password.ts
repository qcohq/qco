import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

/**
 * Хеширует пароль с помощью scrypt
 * @param password - пароль для хеширования
 * @returns хешированный пароль в формате "salt:hash"
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const hashedPassword = await scryptAsync(password, salt, 64) as Buffer;
  return salt + ':' + hashedPassword.toString('hex');
}

/**
 * Проверяет пароль против хеша
 * @param password - пароль для проверки
 * @param hash - хешированный пароль
 * @returns true если пароль верный
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const [salt, hashPart] = hash.split(':');
  if (!salt || !hashPart) {
    return false;
  }
  
  const hashedPassword = await scryptAsync(password, salt, 64) as Buffer;
  return hashedPassword.toString('hex') === hashPart;
} 
