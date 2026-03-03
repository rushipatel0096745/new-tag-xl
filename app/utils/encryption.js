// lib/encryption.js
import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
// Key must be 32 bytes (256 bits)
// Expects a 64-character hex string from environment variable
// const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY
// ? Buffer.from(process.env.ENCRYPTION_KEY, "hex")
// : crypto.randomBytes(32); // Fallback for development only

// Use a Buffer of 32 bytes (hex -> 64 chars) for AES-256-GCM key
const ENCRYPTION_KEY = Buffer.from("04281a0580535d32b8329dccc33fc7cdedcbe29ceb6c25d8d5e960bf781fb989", "hex");

export function encryptData(dataObject) {
    const iv = crypto.randomBytes(12); // GCM recommends 12 bytes IV
    const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);

    // Encrypt the data
    const jsonString = JSON.stringify(dataObject);
    let encrypted = cipher.update(jsonString, "utf8", "hex");
    encrypted += cipher.final("hex");

    // Get the authentication tag
    const authTag = cipher.getAuthTag();

    // Concatenate IV, authTag, and encrypted data for storage/transmission
    // Store them all as they are needed for decryption
    return JSON.stringify({
        iv: iv.toString("hex"),
        encryptedData: encrypted,
        authTag: authTag.toString("hex"),
    });
}

export function decryptData(encryptedString) {
    const { iv, encryptedData, authTag } = JSON.parse(encryptedString);

    const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, Buffer.from(iv, "hex"));

    decipher.setAuthTag(Buffer.from(authTag, "hex"));

    // Decrypt the data
    let decrypted = decipher.update(encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return JSON.parse(decrypted);
}
