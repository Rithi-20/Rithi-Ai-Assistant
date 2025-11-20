import crypto from "crypto";

const ENCRYPTION_ALGORITHM = "aes-256-gcm";
const ENCRYPTION_KEY_LENGTH = 32;
const IV_LENGTH = 16;

/**
 * Get AES key using Base64 secret → SHA-256 → 32 bytes
 */
function getEncryptionKey(): Buffer {
  const secretBase64 = process.env.ENCRYPTION_SECRET;
  if (!secretBase64) throw new Error("ENCRYPTION_SECRET not set");

  return crypto
    .createHash("sha256")
    .update(secretBase64)
    .digest()
    .slice(0, ENCRYPTION_KEY_LENGTH);
}

/**
 * Decrypt value matching format: iv:authTag:ciphertext
 */
export function decryptValue(encrypted: string): string {
  try {
    const key = getEncryptionKey();

    const parts = encrypted.split(":");
    if (parts.length !== 3) throw new Error("Invalid encrypted format");

    const iv = Buffer.from(parts[0], "hex");
    const authTag = Buffer.from(parts[1], "hex");
    const ciphertext = Buffer.from(parts[2], "hex");

    const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([
      decipher.update(ciphertext),
      decipher.final()
    ]);

    return decrypted.toString("utf8");
  } catch (error) {
    console.error("Decryption failed:", error);
    throw new Error("Failed to decrypt value");
  }
}
