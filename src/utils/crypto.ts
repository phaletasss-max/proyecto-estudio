import encryptedPayload from '@/data/encryptedGuide.json';

// Helper to convert hex string to Uint8Array backed by standard ArrayBuffer
function hexToBytes(hex: string): Uint8Array {
  const buf = new ArrayBuffer(hex.length / 2);
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

// Clean flag candidate input
export function cleanFlagInput(input: string): string {
  let clean = input.trim();
  const match = clean.match(/HTB\{([^}]+)\}/i);
  if (match) {
    clean = match[1].trim();
  }
  return clean;
}

/**
 * Attempts to decrypt the guide using Web Crypto API.
 * If the user's flag is correct, returns the decrypted guide string.
 * If wrong, returns null.
 */
export async function decryptGuideWithFlag(flagCandidate: string): Promise<string | null> {
  try {
    const cleanFlag = cleanFlagInput(flagCandidate);
    if (!cleanFlag) return null;

    // 1. Derive SHA-256 key from clean flag string
    const encoder = new TextEncoder();
    const flagData = encoder.encode(cleanFlag);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', flagData);

    // 2. Import derived hash as AES-GCM Key
    const key = await window.crypto.subtle.importKey(
      'raw',
      hashBuffer,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );

    // 3. Prepare IV and Ciphertext + AuthTag
    const iv = hexToBytes(encryptedPayload.iv);
    const ciphertext = hexToBytes(encryptedPayload.ciphertext);
    const authTag = hexToBytes(encryptedPayload.authTag);

    // Combine ciphertext and authTag into a single ArrayBuffer
    const totalLen = ciphertext.length + authTag.length;
    const combinedBuf = new ArrayBuffer(totalLen);
    const combinedBytes = new Uint8Array(combinedBuf);
    combinedBytes.set(ciphertext, 0);
    combinedBytes.set(authTag, ciphertext.length);

    // 4. Decrypt using Web Crypto API
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv.buffer as ArrayBuffer,
        tagLength: 128,
      },
      key,
      combinedBuf
    );

    // 5. Decode UTF-8 plaintext
    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  } catch (err) {
    // Decryption failed (wrong key / invalid auth tag)
    return null;
  }
}
