const SECUtil = require("@sec-block/secjs-util");

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
  }
}

export default WalletHandler