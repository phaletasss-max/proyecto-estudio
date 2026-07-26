import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const guidePath = 'g:/Proyectos/profile/public/downloads/GUIA_TU_PRIMERA_WEB_VERCEL.txt';
const guideText = fs.readFileSync(guidePath, 'utf8');

const secretFlag = '200.48.225.14';

function deriveKey(flagStr) {
  let clean = flagStr.trim();
  const match = clean.match(/HTB\{([^}]+)\}/i);
  if (match) {
    clean = match[1].trim();
  }
  return crypto.createHash('sha256').update(clean).digest();
}

function encrypt(text, flagStr) {
  const key = deriveKey(flagStr);
  const iv = crypto.randomBytes(12);
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

const payload = encrypt(guideText, secretFlag);

// Output to src/data/encryptedGuide.json
const outputDir = 'g:/Proyectos/profile/src/data';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(path.join(outputDir, 'encryptedGuide.json'), JSON.stringify(payload, null, 2));
console.log('Encrypted guide payload saved to src/data/encryptedGuide.json');
