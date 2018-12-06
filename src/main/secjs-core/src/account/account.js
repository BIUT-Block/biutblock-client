const SECUtil = require('@sec-block/secjs-util')
const debug = require('debug')('secjs:account')

class Account {
  constructor (config = {}) {
    this.AccountDataHandler = config.AccountDataHandler
    this.checkAccountExisting('NodeDefaultAccount', (err, accountInfo) => {
      if (err) {
        let userInfo = SECUtil.generateKeys()
        this.privateKey = config.privateKey || userInfo.privKey
        this.publicKey = config.publicKey || userInfo.publicKey
        this.Address = config.Address || userInfo.secAddress
        this.saveAccount()
      } else {
        this.privateKey = accountInfo.privateKey
        this.publicKey = accountInfo.publicKey
        this.Address = accountInfo.Address
      }
    })
  }

  getPrivateKey () {
    return this.privateKey
  }

  getPublicKey () {
    return this.publicKey
  }

  getAddress () {
    return this.Address
  }

  getAccount () {
    return {
      privateKey: this.privateKey,
      publicKey: this.publicKey,
      Address: this.Address
    }
  }

  checkAccountExisting (accName, callback) {
    /**
     * emptyFlag = true => empty
     * emptyFlag = false => not empty
     */
    this.AccountDataHandler.isAccountInAccountDB(accName, (err, value) => {
      if (err) {
        callback(err, null)
      } else {
        callback(null, value)
      }
    })
  }

  saveAccount () {
    let accountData = {
      account: 'NodeDefaultAccount',
      privateKey: this.privateKey,
      publicKey: this.publicKey,
      Address: this.Address
    }
    this.AccountDataHandler.writeUserInfoToAccountDB(accountData, (err) => {
      if (err) {
        throw err
      } else {
        debug(`New Account generated ==> PublicKey: ${this.privateKey} | Address: ${this.publicKey}`)
      }
    })
  }
}

module.exports = Account
