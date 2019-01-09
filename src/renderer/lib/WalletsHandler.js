const SECUtil = require('@sec-block/secjs-util')
const CryptoJS = require('crypto-js')

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

  fillUpWalletsBalance: function (walletsArr, walletsBalanceJS) {
    if (Object.keys(walletsBalanceJS).length === walletsArr.length) {
      for (let wallet of walletsArr) {
        wallet['walletBalance'] = walletsBalanceJS[wallet.walletName]
      }
    }
  },

  getWalletNamesFromEncrypt: function (encryptedData) {
    let keyData = CryptoJS.AES.decrypt(encryptedData.toString(), this.walletPwd).toString(CryptoJS.enc.Utf8)
    let keyDataJSON = JSON.parse(keyData)
    let walletNamesArr = Object.keys(keyDataJSON)
    return walletNamesArr
  }
}

export default WalletHandler
