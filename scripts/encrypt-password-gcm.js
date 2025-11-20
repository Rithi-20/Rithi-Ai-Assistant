
// require("dotenv").config({ path: ".env.local" });
// const crypto = require("crypto");

// function encryptValue(value) {
//   const keyBase64 = process.env.ENCRYPTION_SECRET;

//   if (!keyBase64) {
//     console.error("\n❌ ENCRYPTION_SECRET is missing in .env.local");
//     process.exit(1);
//   }

//   // Base64 decoding (correct)
//   const key = Buffer.from(keyBase64, "base64");

//   const iv = crypto.randomBytes(12);
//   const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

//   const encrypted = Buffer.concat([
//     cipher.update(value, "utf8"),
//     cipher.final(),
//   ]);

//   const tag = cipher.getAuthTag();

//   return `${encrypted.toString("hex")}:${iv.toString("hex")}:${tag.toString("hex")}`;
// }

// (async () => {
//   const readline = require("readline").createInterface({
//     input: process.stdin,
//     output: process.stdout,
//   });

//   // Correct debug line
//   console.log("ENV CHECK:", process.env.ENCRYPTION_SECRET);

//   readline.question("Enter password to encrypt: ", (password) => {
//     const encrypted = encryptValue(password.trim());

//     console.log("\n🔐 Encrypted Password:");
//     console.log(encrypted);

//     readline.close();
//   });
// })();

require("dotenv").config({ path: ".env.local" });
const crypto = require("crypto");

const ENCRYPTION_ALGORITHM = "aes-256-gcm";
const ENCRYPTION_KEY_LENGTH = 32;
const IV_LENGTH = 16; // 128-bit IV (same as encryption.ts)

/**
 * Derive AES key using SHA-256 (MUST MATCH encryption.ts)
 */
function getEncryptionKey() {
  const secretBase64 = process.env.ENCRYPTION_SECRET;
  if (!secretBase64) {
    console.error("❌ ENCRYPTION_SECRET is missing");
    process.exit(1);
  }

  // Convert Base64 -> Buffer -> SHA256 -> 32 bytes
  return crypto
    .createHash("sha256")
    .update(secretBase64)
    .digest()
    .slice(0, ENCRYPTION_KEY_LENGTH);
}

/**
 * Encrypt password (MUST MATCH encryption.ts)
 * Output format: iv:authTag:ciphertext
 */
function encryptValue(value) {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(value, "utf8"),
    cipher.final()
  ]);

  const authTag = cipher.getAuthTag();

  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted.toString("hex")}`;
}

(async () => {
  const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log("ENV CHECK:", process.env.ENCRYPTION_SECRET);

  readline.question("Enter password to encrypt: ", (password) => {
    const encrypted = encryptValue(password.trim());
    console.log("\n🔐 Encrypted Password:");
    console.log(encrypted);
    readline.close();
  });
})();
