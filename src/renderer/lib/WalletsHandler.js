const SECUtil = require('@sec-block/secjs-util')
const CryptoJS = require('crypto-js')
const fs = require('fs')
let FileSaver = require('file-saver')

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

  backUpWalletIntoFile: function (wallet, fnAfterSave) {
    this._backupAllWallets(wallet, fnAfterSave)
  },

  updateWalletFile: function (wallet, fnAfterSave) {
    let dirPath = require('os').homedir() + '/secwallet'
    let filePath = dirPath + '/default.data'
    fs.readFile(filePath, 'utf-8', this._modifyWalletFile.bind(this, filePath, wallet, fnAfterSave))
  },

  getAllWalletsFromFile: function (fnAfterReadFinish) {
    let dirPath = require('os').homedir() + '/secwallet'
    let filePath = dirPath + '/default.data'
    if (fs.existsSync(dirPath)) {
      fs.readFile(filePath, (err, data) => {
        if (err) return
        if (data !== '{}') {
          let wallets = JSON.parse(data)
          fnAfterReadFinish(wallets)
        }
      })
    }
  },

  saveKeyStore: function (walletData, pwd) {
    let ciperData = this.ecryptWalletKeys(JSON.stringify(walletData), pwd)
    let blob = new Blob([ciperData], {
      type: 'text/plain;charset=utf-8'
    })
    FileSaver.saveAs(blob, 'walletKeyStore.data')
  },

  savePhrase: function (phrase) {
    let blob = new Blob([phrase], {
      type: 'text/plain;charset=utf-8'
    })
    FileSaver.saveAs(blob, 'myPhrase.data')
  },

  savePrivteKey: function (privateKey) {
    let blob = new Blob([privateKey], {
      type: 'text/plain;charset=utf-8'
    })
    FileSaver.saveAs(blob, 'myPrivateKey.data')
  },

  _backupAllWallets: function (wallet, fnAfterSave) {
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
        walletAddress: wallet.walletAddress,
        englishWords: wallet.englishWords
      }
    }

    if (fs.existsSync(filePath)) {
      fs.readFile(filePath, 'utf-8', this._appendWalletIntoFile.bind(this, filePath, wallet, fnAfterSave))
    } else {
      let keyFileData = JSON.stringify(keyFileDataJS)
      fs.writeFile(dirPath + '/default.data', keyFileData, (err) => {
        if (err) {
          return
        }
        fnAfterSave(keyFileDataJS, wallet.privateKey)
      })
    }
  },

  _appendWalletIntoFile: function (filePath, wallet, fnAfterSave, err, data) {
    if (err) {
      return
    }
    let keyDataJSON = JSON.parse(data)
    if (keyDataJSON.hasOwnProperty(wallet.privateKey)) {
      fnAfterSave('DuplicateKey')
    } else {
      keyDataJSON[wallet.privateKey] = {
        walletName: wallet.walletName,
        privateKey: wallet.privateKey,
        publicKey: wallet.publicKey,
        walletAddress: wallet.walletAddress,
        englishWords: wallet.englishWords
      }
      let keyFileData = JSON.stringify(keyDataJSON)
      fs.writeFile(filePath, keyFileData, (err) => {
        if (err) {
          return
        }
        fnAfterSave(keyDataJSON, wallet.privateKey)
      })
    }
  },

  _modifyWalletFile: function (filePath, wallet, fnAfterSave, err, data) {
    if (err) return
    let keyDataJSON = JSON.parse(data)
    keyDataJSON[wallet.privateKey] = wallet
    fs.writeFile(filePath, JSON.stringify(keyDataJSON), (err) => {
      if (err) return
      fnAfterSave()
    })
  },

  removeWalletFromFile: function (walletData, fnAfterRemove) {
    let dirPath = require('os').homedir() + '/secwallet'
    let filePath = dirPath + '/default.data'
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) return
      let allData = JSON.parse(data)
      delete allData[walletData.privateKey]
      fs.writeFile(filePath, JSON.stringify(allData), (err) => {
        if (err) return
        fnAfterRemove(allData)
      })
    })
  },

  fillUpWalletsBalance: function (walletsArr, walletsBalanceJS) {
    if (Object.keys(walletsBalanceJS).length === walletsArr.length) {
      for (let wallet of walletsArr) {
        wallet['walletBalance'] = walletsBalanceJS[wallet.walletName]
      }
    }
  },

  ecryptWalletKeys: function (walletKeys, pwd) {
    return CryptoJS.AES.encrypt(walletKeys, pwd)
  },

  decryptKeyStoreFile: function (filePath, pwd, fnAfterImport) {
    let dirPath = require('os').homedir() + '/secwallet'
    let defaultFilePath = dirPath + '/default.data'
    let keyData = {}

    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) return
      try {
        keyData = JSON.parse(CryptoJS.AES.decrypt(data.toString(), pwd).toString(CryptoJS.enc.Utf8))
        if (fs.existsSync(defaultFilePath)) {
          fs.readFile(defaultFilePath, 'utf-8', this._appendWalletIntoFile.bind(this, defaultFilePath, keyData[Object.keys(keyData)[0]], fnAfterImport))
        } else {
          fs.writeFile(defaultFilePath, JSON.stringify(keyData), (err) => {
            if (err) return
            fnAfterImport(keyData, Object.keys(keyData)[0])
          })
        }
      } catch (e) {
        fnAfterImport('error')
      }
    })
  },

  importWalletFromPrivateKey: function (privateKey, walletName, fnAfterImport) {
    let wallet = this._getKeysFromPrivateKey(privateKey)
    this.backUpWalletIntoFile(wallet, fnAfterImport)
  },

  _getKeysFromPrivateKey: function (privateKey, walletName, fnAfterImport) {
    try {
      let privateKeyBuffer = SECUtil.privateToBuffer(privateKey)
      let extractAddress = SECUtil.privateToAddress(privateKeyBuffer).toString('hex')
      let extractPublicKey = SECUtil.privateToPublic(privateKeyBuffer).toString('hex')
      let extractPhrase = SECUtil.entropyToMnemonic(privateKeyBuffer)
      return {
        walletName: walletName,
        privateKey: privateKey,
        publicKey: extractPublicKey,
        englishWords: extractPhrase,
        userAddress: extractAddress
      }
    } catch (e) {
      fnAfterImport('error')
    }
  },

  importWalletFromPhrase: function (phrase, fnAfterImport) {
    let wallet = this._getKeysFromPhrase(phrase, fnAfterImport)
    this.backUpWalletIntoFile(wallet, fnAfterImport)
  },

  _getKeysFromPhrase: function (phrase, walletName, fnAfterImport) {
    try {
      let privateKey = SECUtil.mnemonicToEntropy(phrase)
      let privKey64Buffer = Buffer.from(privateKey, 'hex')

      let pubKey128 = SECUtil.privateToPublic(privKey64Buffer)
      let pubKey128ToString = pubKey128.toString('hex')

      let userAddressBuffer = SECUtil.publicToAddress(pubKey128, true)
      let userAddressToString = SECUtil.bufferToHex(userAddressBuffer).substring(2)
      return {
        walletName: walletName,
        privateKey: privKey64Buffer,
        publicKey: pubKey128ToString,
        englishWords: phrase,
        userAddress: userAddressToString
      }
    } catch (e) {
      fnAfterImport('error')
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
  },

  encryptTransaction: function (privateKey, transfer) {
    let timeStamp = new Date().getTime()
    let transferData = [{
      timestamp: timeStamp,
      from: transfer.walletAddress,
      to: transfer.sendToAddress,
      value: transfer.amount,
      contractAddress: '',
      gasLimit: '0',
      gas: '0',
      gasPrice: '0',
      data: '',
      inputData: ''
    }]
    const tokenTxBuffer = [
      SECUtil.bufferToInt(transferData[0].timestamp),
      Buffer.from(transferData[0].from, 'hex'),
      Buffer.from(transferData[0].to, 'hex'),
      Buffer.from(transferData[0].value),
      Buffer.from(transferData[0].contractAddress),
      Buffer.from(transferData[0].gasLimit),
      Buffer.from(transferData[0].gas),
      Buffer.from(transferData[0].gasPrice),
      Buffer.from(transferData[0].inputData)
    ]
    let txSigHash = Buffer.from(SECUtil.rlphash(tokenTxBuffer).toString('hex'), 'hex')
    let signature = SECUtil.ecsign(txSigHash, Buffer.from(privateKey, 'hex'))
    transferData[0].data = {
      v: signature.v,
      r: signature.r.toString('hex'),
      s: signature.s.toString('hex')
    }
    return transferData
  }
}

export default WalletHandler