// const crypto = require("crypto");

// // AES-GCM settings from encryption.ts
// const ENCRYPTION_ALGORITHM = "aes-256-gcm";
// const ENCRYPTION_KEY_LENGTH = 32;
// const IV_LENGTH = 16;

// // Derive encryption key exactly like encryption.ts
// function getEncryptionKey() {
//   const secret = process.env.ENCRYPTION_SECRET;
//   if (!secret) {
//     throw new Error("ENCRYPTION_SECRET not set");
//   }

//   return crypto
//     .createHash("sha256")
//     .update(secret)
//     .digest()
//     .slice(0, ENCRYPTION_KEY_LENGTH);
// }

// // Encrypt the password exactly the same way as encryption.ts
// function encryptValue(value) {
//   const key = getEncryptionKey();
//   const iv = crypto.randomBytes(IV_LENGTH);

//   const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, key, iv);
//   let encrypted = cipher.update(value, "utf8", "hex");
//   encrypted += cipher.final("hex");

//   const authTag = cipher.getAuthTag();

//   // Format: iv:authTag:encryptedData
//   return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
// }

// const password = process.argv[2];

// if (!password) {
//   console.log("Usage: node scripts/encrypt-password-gcm.js <password>");
//   process.exit(1);
// }

// console.log("\n🔐 Encrypted Value:");
// console.log(encryptValue(password));
// console.log("\nCopy this string into PROFILE_PASSWORD_ENCRYPTED in your .env.local file.\n");

require("dotenv").config({ path: ".env.local" });
const crypto = require("crypto");

function encryptValue(value) {
  const keyHex = process.env.ENCRYPTION_SECRET;

  if (!keyHex) {
    console.error("\n❌ ENCRYPTION_SECRET is missing in .env.local");
    process.exit(1);
  }

  const key = Buffer.from(keyHex, "hex");

  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

  const encrypted = Buffer.concat([
    cipher.update(value, "utf8"),
    cipher.final(),
  ]);

  const tag = cipher.getAuthTag();

  return `${encrypted.toString("hex")}:${iv.toString("hex")}:${tag.toString("hex")}`;
}

(async () => {
  const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // 🔍 DEBUG LINE YOU REQUESTED:
  console.log("ENV CHECK:", process.env.PROFILE_PASSWORD_ENCRYPTED);

  readline.question("Enter password to encrypt: ", (password) => {
    const encrypted = encryptValue(password.trim());

    console.log("\n🔐 Encrypted Password:");
    console.log(encrypted);
    
    readline.close();
  });
})();
