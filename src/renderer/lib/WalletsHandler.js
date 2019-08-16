const SECUtil = require('@biut-block/biutjs-util')
const CryptoJS = require('crypto-js')
const fs = require('fs')
let FileSaver = require('file-saver')

const SECFileKey = 'SECKey'

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
    let dirPath = require('os').homedir() + '/.secwallet'
    let filePath = dirPath + '/wallets.data'
    fs.readFile(filePath, 'utf-8', this._modifyWalletFile.bind(this, filePath, wallet, fnAfterSave))
  },

  getAllWalletsFromFile: function (fnAfterReadFinish) {
    let dirPath = require('os').homedir() + '/.secwallet'
    let filePath = dirPath + '/wallets.data'
    if (fs.existsSync(dirPath)) {
      fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) return
        let decodeText = CryptoJS.AES.decrypt(data, SECFileKey).toString(CryptoJS.enc.Utf8)
        if (decodeText !== '{}') {
          let wallets = JSON.parse(decodeText)
          fnAfterReadFinish(wallets)
        }
      })
    }
  },

  deleteAllWalletsFromFile: function () {
    let dirPath = require('os').homedir() + '/.secwallet'
    let filePath = dirPath + '/wallets.data'
    fs.writeFile(filePath, '', () => {
      console.log('Remove all data')
    })
  },

  saveKeyStore: function (walletName, walletData, pwd) {
    let ciperData = this.ecryptWalletKeys(JSON.stringify(walletData), pwd)
    let blob = new Blob([ciperData], {
      type: 'text/plain;charset=utf-8'
    })
    FileSaver.saveAs(blob, `${walletName}.json`)
  },

  savePhrase: function (walletName, phrase) {
    let blob = new Blob([phrase], {
      type: 'text/plain;charset=utf-8'
    })
    FileSaver.saveAs(blob, `${walletName}_Phrase.data`)
  },

  savePrivteKey: function (walletName, privateKey) {
    let blob = new Blob([privateKey], {
      type: 'text/plain;charset=utf-8'
    })
    FileSaver.saveAs(blob, `${walletName}_PrivateKey.data`)
  },

  _backupAllWallets: function (wallet, fnAfterSave) {
    let dirPath = require('os').homedir() + '/.secwallet'
    let filePath = dirPath + '/wallets.data'
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
        englishWords: wallet.englishWords,
        invitationCode: wallet.invitationCode,
        ownInvitationCode: wallet.invitationCode,
        mortgagePoolAddress: wallet.mortgagePoolAddress,
        ownPoolAddress: wallet.ownPoolAddress,
        role: wallet.role
      }
    }

    if (fs.existsSync(filePath)) {
      fs.readFile(filePath, 'utf-8', this._appendWalletIntoFile.bind(this, filePath, wallet, fnAfterSave))
    } else {
      let keyFileData = JSON.stringify(keyFileDataJS)
      let cipherText = CryptoJS.AES.encrypt(keyFileData, SECFileKey).toString()
      fs.writeFile(dirPath + '/wallets.data', cipherText, (err) => {
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
    let keyDataJSON = {}
    if (data.length > 0) {
      let decodeText = CryptoJS.AES.decrypt(data, SECFileKey).toString(CryptoJS.enc.Utf8)
      keyDataJSON = JSON.parse(decodeText)
    }

    if (keyDataJSON.hasOwnProperty(wallet.privateKey)) {
      fnAfterSave('DuplicateKey')
    } else {
      keyDataJSON[wallet.privateKey] = {
        walletName: wallet.walletName,
        privateKey: wallet.privateKey,
        publicKey: wallet.publicKey,
        walletAddress: wallet.walletAddress,
        englishWords: wallet.englishWords,
        invitationCode: wallet.invitationCode,
        ownInvitationCode: wallet.invitationCode,
        mortgagePoolAddress: wallet.mortgagePoolAddress,
        ownPoolAddress: wallet.ownPoolAddress,
        role: wallet.role
      }
      let keyFileData = JSON.stringify(keyDataJSON)
      let cipherText = CryptoJS.AES.encrypt(keyFileData, SECFileKey).toString()
      fs.writeFile(filePath, cipherText, (err) => {
        if (err) {
          return
        }
        fnAfterSave(keyDataJSON, wallet.privateKey)
      })
    }
  },

  _modifyWalletFile: function (filePath, wallet, fnAfterSave, err, data) {
    if (err) return
    let decodeText = CryptoJS.AES.decrypt(data, SECFileKey).toString(CryptoJS.enc.Utf8)
    let keyDataJSON = JSON.parse(decodeText)
    keyDataJSON[wallet.privateKey] = wallet
    let keyDataText = JSON.stringify(keyDataJSON)
    let ciperText = CryptoJS.AES.encrypt(keyDataText, SECFileKey).toString()
    fs.writeFile(filePath, ciperText, (err) => {
      if (err) return
      fnAfterSave()
    })
  },

  removeWalletFromFile: function (walletData, fnAfterRemove) {
    let dirPath = require('os').homedir() + '/.secwallet'
    let filePath = dirPath + '/wallets.data'
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) return
      let decodeText = CryptoJS.AES.decrypt(data, SECFileKey).toString(CryptoJS.enc.Utf8)
      let allData = JSON.parse(decodeText)
      delete allData[walletData.privateKey]
      let cipherText = CryptoJS.AES.encrypt(JSON.stringify(allData), SECFileKey).toString()
      fs.writeFile(filePath, cipherText, (err) => {
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
    let dirPath = require('os').homedir() + '/.secwallet'
    let defaultFilePath = dirPath + '/wallets.data'
    let keyData = {}

    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) return
      try {
        keyData = JSON.parse(CryptoJS.AES.decrypt(data.toString(), pwd).toString(CryptoJS.enc.Utf8))
        fnAfterImport(keyData, keyData[Object.keys(keyData)[0]].privateKey)
        // this.backUpWalletIntoFile(keyData[Object.keys(keyData)[0]], fnAfterImport)
        // if (fs.existsSync(defaultFilePath)) {
        //   fs.readFile(defaultFilePath, 'utf-8', this._appendWalletIntoFile.bind(this, defaultFilePath, keyData[Object.keys(keyData)[0]], fnAfterImport))
        // } else {
        //   fs.writeFile(defaultFilePath, JSON.stringify(keyData), (err) => {
        //     if (err) return
        //     fnAfterImport(keyData, Object.keys(keyData)[0])
        //   })
        // }
      } catch (e) {
        fnAfterImport('error')
      }
    })
  },

  importWalletFromPrivateKey: function (privateKey, walletName, fnAfterImport) {
    let wallet = this._getKeysFromPrivateKey(privateKey, walletName, fnAfterImport)
    // this.backUpWalletIntoFile(wallet, fnAfterImport)
  },

  _getKeysFromPrivateKey: function (privateKey, walletName, fnAfterImport) {
    try {
      let privateKeyBuffer = SECUtil.privateToBuffer(privateKey)
      let extractAddress = SECUtil.privateToAddress(privateKeyBuffer).toString('hex')
      let extractPublicKey = SECUtil.privateToPublic(privateKeyBuffer).toString('hex')
      let extractPhrase = SECUtil.entropyToMnemonic(privateKeyBuffer)
      let wallet = {}
      wallet[privateKey] = {
        walletName: walletName,
        privateKey: privateKey,
        publicKey: extractPublicKey,
        englishWords: extractPhrase,
        walletAddress: extractAddress
      }
      fnAfterImport(wallet, privateKey)
      return wallet
    } catch (e) {
      fnAfterImport('error')
    }
  },

  importWalletFromPhrase: function (phrase, walletName, fnAfterImport) {
    let wallet = this._getKeysFromPhrase(phrase, walletName, fnAfterImport)
    // this.backUpWalletIntoFile(wallet, fnAfterImport)
  },

  _getKeysFromPhrase: function (phrase, walletName, fnAfterImport) {
    try {
      let privateKey = SECUtil.mnemonicToEntropy(phrase)
      let privKey64Buffer = Buffer.from(privateKey, 'hex')

      let pubKey128 = SECUtil.privateToPublic(privKey64Buffer)
      let pubKey128ToString = pubKey128.toString('hex')

      let userAddressBuffer = SECUtil.publicToAddress(pubKey128, true)
      let userAddressToString = SECUtil.bufferToHex(userAddressBuffer).substring(2)
      let wallet = {}
      wallet[privateKey] = {
        walletName: walletName,
        privateKey: privateKey,
        publicKey: pubKey128ToString,
        englishWords: phrase,
        walletAddress: userAddressToString
      }
      fnAfterImport(wallet, privateKey)
      return wallet
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
      txFee: transfer.txFee,
      nonce: transfer.nonce,
      gasLimit: '0',
      gas: '0',
      gasPrice: '0',
      data: '',
      inputData: transfer.inputData,
      chainName: transfer.chainName
    }]
    const tokenTxBuffer = [
      SECUtil.bufferToInt(transferData[0].timestamp),
      Buffer.from(transferData[0].from, 'hex'),
      Buffer.from(transferData[0].to, 'hex'),
      Buffer.from(transferData[0].value),
      Buffer.from(transferData[0].gasLimit),
      Buffer.from(transferData[0].gas),
      Buffer.from(transferData[0].gasPrice),
      Buffer.from(transferData[0].nonce),
      Buffer.from(transferData[0].inputData),
      Buffer.from(transferData[0].chainName)
    ]
    let txSigHash = Buffer.from(SECUtil.rlphash(tokenTxBuffer).toString('hex'), 'hex')
    let signature = SECUtil.ecsign(txSigHash, Buffer.from(privateKey, 'hex'))
    transferData[0].data = {
      v: signature.v,
      r: signature.r.toString('hex'),
      s: signature.s.toString('hex')
    }
    return transferData
  },

  generateContractAddress (walletAddress) {
    let contractAddress = SECUtil.generateContractAddressString(walletAddress)
    return contractAddress
  },

  formatDate (date, offset) {
    let timezone = 0
    if (offset / -60 >= 0) {
      timezone = `+${offset / -60}`
    } else {
      timezone = `${offset / -60}`
    }
    let time = `${date} GMT${timezone}`
    return time
  },

  checkNetworkStatus () {
    return navigator.onLine
  }
}

export default WalletHandler