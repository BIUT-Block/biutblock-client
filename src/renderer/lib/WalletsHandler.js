let WalletHandler = {
  getWalletKeys: function () {
    let keys = SECUtil.generateSecKeys()
    let privKey64 = keys.privKey
    this.privateKey = privKey64
    this.englishWords = SECUtil.entropyToMnemonic(privKey64)

    let pubKey128 = keys.publicKey
    this.pubKey128ToString = pubKey128.toString('hex')
    this.userAddressToString = keys.secAddress
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