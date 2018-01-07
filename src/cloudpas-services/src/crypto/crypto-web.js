const { toArrayBuffer, fromArrayBuffer } = require('cloudpas-utils')

const crypto = window && window.crypto

const DERIVE_ALG = 'PBKDF2'
const DERIVE_HASH_ALG = 'SHA-256'
const DERIVE_ITERATIONS = 100
const IV_BYTES_COUNT = 16
const ENC_ALG = 'AES-CBC'
const ENC_KEY_SIZE = 256

async function encrypt (data, key) {
  const text = toArrayBuffer(data)
  const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES_COUNT))

  const chipher = await crypto.subtle.encrypt({ name: ENC_ALG, iv }, key, text)

  return Buffer.concat([Buffer.from(iv), Buffer.from(chipher)]).toString(
    'base64'
  )
}

async function decrypt (data, key) {
  const chipher = Buffer.from(data, 'base64')
  const iv = new Uint8Array(chipher.buffer, 0, IV_BYTES_COUNT)
  const text = new Uint8Array(chipher.buffer, IV_BYTES_COUNT)

  return fromArrayBuffer(
    await crypto.subtle.decrypt({ name: ENC_ALG, iv }, key, text)
  )
}

async function deriveKey (secret, nonce) {
  const secretBuffer = toArrayBuffer(secret)
  const nonceBuffer = toArrayBuffer(nonce)

  const key = await crypto.subtle.importKey(
    'raw',
    secretBuffer,
    { name: DERIVE_ALG },
    false,
    ['deriveKey']
  )

  return crypto.subtle.deriveKey(
    {
      name: DERIVE_ALG,
      salt: nonceBuffer,
      iterations: DERIVE_ITERATIONS,
      hash: DERIVE_HASH_ALG
    },
    key,
    { name: ENC_ALG, length: ENC_KEY_SIZE },
    process.env.NODE_ENV === 'development',
    ['encrypt', 'decrypt']
  )
}

async function inspectKey (cryptoKey) {
  const key = await crypto.subtle.exportKey('raw', cryptoKey)
  return fromArrayBuffer(key, 'hex')
}

module.exports = {
  encrypt,
  decrypt,
  deriveKey,
  inspectKey
}
