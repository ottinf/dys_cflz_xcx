// src/utils/crypt.js
import CryptoJS from 'crypto-js'
import settings from '../settings'

// 配置项（建议通过环境变量注入）

const CRYPTO_CONFIG = {
  key: CryptoJS.enc.Hex.parse(CryptoJS.SHA256(settings.appId).toString()), // 32字节，AES-256需要32字节
  iv: CryptoJS.enc.Hex.parse(CryptoJS.SHA256(settings.appSecret).toString().substring(0, 32)), // 16字节（32 hex字符）
  mode: CryptoJS.mode.CBC,
  padding: CryptoJS.pad.Pkcs7
}

class CryptoHelper {
  /**
   * 字符串加密 (en -> encrypt string)
   * @param {string} plainText 明文
   * @returns {string} Base64格式密文
   */
  static en(plainText) {
    if (!plainText) return ''
    const encrypted = CryptoJS.AES.encrypt(
      CryptoJS.enc.Utf8.parse(plainText.toString()),
      CRYPTO_CONFIG.key,
      {
        iv: CRYPTO_CONFIG.iv,
        mode: CRYPTO_CONFIG.mode,
        padding: CRYPTO_CONFIG.padding
      }
    )
    return encrypted.toString()
  }

  /**
   * 字符串解密 (de -> decrypt string)
   * @param {string} cipherText 密文
   * @returns {string} UTF-8格式明文
   */
  static de(cipherText) {
    if (!cipherText) return ''
    const decrypted = CryptoJS.AES.decrypt(
      cipherText,
      CRYPTO_CONFIG.key,
      {
        iv: CRYPTO_CONFIG.iv,
        mode: CRYPTO_CONFIG.mode,
        padding: CRYPTO_CONFIG.padding
      }
    )
    return decrypted.toString(CryptoJS.enc.Utf8)
  }

  /**
   * 对象加密
   * @param {Object} obj 明文对象
   * @returns {string} Base64格式密文
   */
  static encrypt(obj) {
    if (!obj) return ''
    return this.en(JSON.stringify(obj))
  }

  /**
   * 对象解密
   * @param {string} cipherText 密文
   * @returns {Object} 解密后的对象
   */
  static decrypt(cipherText) {
    try {
      const decrypted = this.de(cipherText)
      return decrypted ? JSON.parse(decrypted) : null
    } catch (e) {
      console.error('解密失败:', e)
      return null
    }
  }

  /**
   * 链式调用入口
   */
  static get chain() {
    return new CryptoChain()
  }
}

// 链式调用类
class CryptoChain {
  constructor() {
    this._value = ''
  }

  en(plainText) {
    this._value = CryptoHelper.en(plainText)
    return this
  }

  de(cipherText) {
    this._value = CryptoHelper.de(cipherText)
    return this
  }

  encrypt(obj) {
    this._value = CryptoHelper.encrypt(obj)
    return this
  }

  decrypt(cipherText) {
    this._value = CryptoHelper.decrypt(cipherText)
    return this
  }

  value() {
    return this._value
  }
}

export default CryptoHelper
