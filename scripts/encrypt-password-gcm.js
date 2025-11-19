const crypto = require("crypto");

// AES-GCM settings from encryption.ts
const ENCRYPTION_ALGORITHM = "aes-256-gcm";
const ENCRYPTION_KEY_LENGTH = 32;
const IV_LENGTH = 16;

// Derive encryption key exactly like encryption.ts
function getEncryptionKey() {
  const secret = process.env.ENCRYPTION_SECRET;
  if (!secret) {
    throw new Error("ENCRYPTION_SECRET not set");
  }

  return crypto
    .createHash("sha256")
    .update(secret)
    .digest()
    .slice(0, ENCRYPTION_KEY_LENGTH);
}

// Encrypt the password exactly the same way as encryption.ts
function encryptValue(value) {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, key, iv);
  let encrypted = cipher.update(value, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag();

  // Format: iv:authTag:encryptedData
  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
}

const password = process.argv[2];

if (!password) {
  console.log("Usage: node scripts/encrypt-password-gcm.js <password>");
  process.exit(1);
}

console.log("\n🔐 Encrypted Value:");
console.log(encryptValue(password));
console.log("\nCopy this string into PROFILE_PASSWORD_ENCRYPTED in your .env.local file.\n");
