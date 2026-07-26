import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// Plaintext guide location
const guidePath = 'g:/Proyectos/profile/public/downloads/GUIA_TU_PRIMERA_WEB_VERCEL.txt';
const guideText = fs.readFileSync(guidePath, 'utf8');

// The secret key (canonical flag)
const secretFlag = '200.48.225.14';

// Helper to derive AES-256 key from flag string using SHA-256
function deriveKey(flagStr) {
  // Normalize flag string: trim, remove HTB{}, lower/upper case handling
  let clean = flagStr.trim();
  const match = clean.match(/HTB\{([^}]+)\}/i);
  if (match) {
    clean = match[1].trim();
  }
  return crypto.createHash('sha256').update(clean).digest();
}

// Encrypt using AES-256-GCM
function encrypt(text, flagStr) {
  const key = deriveKey(flagStr);
  const iv = crypto.randomBytes(12); // 96-bit IV for GCM
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  
  return {
    iv: iv.toString('hex'),
    authTag: authTag,
    ciphertext: encrypted
  };
}

const encryptedData = encrypt(guideText, secretFlag);

console.log('Encrypted Payload generated successfully!');
console.log('IV:', encryptedData.iv);
console.log('AuthTag:', encryptedData.authTag);
console.log('Ciphertext length:', encryptedData.ciphertext.length);

// Verify decryption works
function decrypt(payload, flagCandidate) {
  try {
    const key = deriveKey(flagCandidate);
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(payload.iv, 'hex'));
    decipher.setAuthTag(Buffer.from(payload.authTag, 'hex'));
    
    let decrypted = decipher.update(payload.ciphertext, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (err) {
    return null;
  }
}

console.log('\n--- Decryption Test ---');
console.log('Test 1 (Correct flag "HTB{200.48.225.14}"):', decrypt(encryptedData, 'HTB{200.48.225.14}') !== null ? 'SUCCESS ✅' : 'FAILED ❌');
console.log('Test 2 (Correct flag "200.48.225.14"):', decrypt(encryptedData, '200.48.225.14') !== null ? 'SUCCESS ✅' : 'FAILED ❌');
console.log('Test 3 (Wrong flag "192.168.1.1"):', decrypt(encryptedData, '192.168.1.1') === null ? 'BLOCKED ✅' : 'FAILED ❌');
