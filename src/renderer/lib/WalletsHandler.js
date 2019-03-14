const SECUtil = require('@sec-block/secjs-util')
const CryptoJS = require('crypto-js')
const fs = require('fs')

let WalletHandler = {
  getWalletKeys: function () {
    let keys = SECUtil.generateSecKeys()
    let privKey64 = keys.privKey
    let privateKey = privKey64
    let englishWords = SECUtil.entropyToMnemonic(privKey64)
    let pubKey128 = keys.publicKey
    let pubKey128ToString = pubKey128.toString('hex')
    let userAddressToString = keys.secAddress

    return {
      privateKey: privateKey,
      publicKey: pubKey128ToString,
      englishWords: englishWords,
      userAddress: userAddressToString
    }
  },

  backUpWalletIntoFile: function (wallet) {
    this._backupAllWallets(wallet)
  },

  _backupAllWallets: function (wallet) {
    let dirPath = require('os').homedir() + '/secwallet'
    let filePath = dirPath + '/default.data'
    let keyFileDataJS = {}

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath)
    }
    keyFileDataJS = {
      [wallet.privateKey]: {
        walletName: wallet.walletName,
        privateKey: wallet.privateKey,
        publicKey: wallet.publicKey,
        walletAddress: wallet.walletAddress
      }
    }

    if (fs.existsSync(filePath)) {
      fs.readFile(filePath, 'utf-8', this._appendWalletIntoFile.bind(this, filePath, wallet))
    } else {
      let keyFileData = JSON.stringify(keyFileDataJS)
      fs.writeFile(dirPath + '/default.data', keyFileData, (err) => {
        if (err) {
          return
        }
      })
    }
  },

  _appendWalletIntoFile: function (filePath, wallet, err, data) {
    if (err) {
      return
    }
    try {
      let keyDataJSON = JSON.parse(data)
      keyDataJSON[wallet.privateKey] = {
        walletName: wallet.walletName,
        privateKey: wallet.privateKey,
        publicKey: wallet.publicKey,
        walletAddress: wallet.walletAddress
      }
      let keyFileData = JSON.stringify(keyDataJSON)
      fs.writeFile(filePath, keyFileData, (err) => {
        if (err) {
          return
        }
      })
    } catch (e) {
      return
    }
  },

  fillUpWalletsBalance: function (walletsArr, walletsBalanceJS) {
    if (Object.keys(walletsBalanceJS).length === walletsArr.length) {
      for (let wallet of walletsArr) {
        wallet['walletBalance'] = walletsBalanceJS[wallet.walletName]
      }
    }
  },

  getWalletNamesFromEncrypt: function (encryptedData, pwd) {
    let keyData = CryptoJS.AES.decrypt(encryptedData.toString(), pwd).toString(CryptoJS.enc.Utf8)
    let keyDataJSON = JSON.parse(keyData)
    let walletNamesArr = Object.keys(keyDataJSON)
    return walletNamesArr
  },

  getWalletEncryptedKeys: function (encryptedData, pwd) {
    let keyData = CryptoJS.AES.decrypt(encryptedData.toString(), pwd).toString(CryptoJS.enc.Utf8)
    let keyDataJSON = JSON.parse(keyData)
    return keyDataJSON
  }
}

export default WalletHandler