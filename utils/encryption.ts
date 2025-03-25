import CryptoJS from 'crypto-js'

const key = process.env.ENCRYPTION_KEY

export const encryptData = (data: unknown) => {
  if (!key) {
    console.error('Encryption key is not defined.')
    return null
  }
  return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString()
}

export const decryptData = (encryptedData: string) => {
  if (!key) {
    console.error('Encryption key is not defined.')
    return null
  }

  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, key)

    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
  } catch (error) {
    console.error('Decryption error:', error)
    return null
  }
}
