const crypto = require("crypto");

// MUST MATCH your encryption.ts logic
function getKey(secret) {
  return crypto.createHash("sha256").update(secret).digest();
}

function encryptValue(value) {
  const secret = process.env.ENCRYPTION_SECRET;
  if (!secret) throw new Error("ENCRYPTION_SECRET not set in environment");

  const key = getKey(secret);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

  let encrypted = cipher.update(value, "utf8", "hex");
  encrypted += cipher.final("hex");

  return `${iv.toString("hex")}:${encrypted}:${key.toString("hex")}`;
}

const password = process.argv[2];
if (!password) {
  console.log("Usage: node scripts/encrypt-password.js <password>");
  process.exit(1);
}

console.log("\n🔐 Encrypted Password:\n");
console.log(encryptValue(password));
console.log("\nCopy this value into PROFILE_PASSWORD_ENCRYPTED\n");
