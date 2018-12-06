const secTransaction = require('@sec-block/secjs-tx')
const secUtils = require('@sec-block/secjs-util')
const nodeData = require('../node/node-data')
const getSize = require('get-folder-size')

class APIs {
  constructor (config) {
    this.SECTokenDataHandler = config.SECTokenDataHandler
    this.SECTxDbDict = config.SECTxDbDict
    this.SECAccountDataHandler = config.SECAccountDataHandler
    this.CenterController = config.CenterController
    this.SECLogger = config.SECLogger
    this.PowEnableFlag = config.PowEnableFlag
  }

  // ----------------------------  TOKEN CHAIN  ---------------------------
  getTokenBlock (hash, callback) {
    this.SECTokenDataHandler.getTokenBlockFromDB(hash, (err, data) => {
      if (err) {
        callback(err, null)
      } else {
        callback(null, data[0])
      }
    })
  }

  getTokenBlockchain (minHeight, maxHeight, callback) {
    this.SECTokenDataHandler.getTokenChain(minHeight, maxHeight, callback)
  }

  getWholeTokenBlockchain (callback) {
    this.SECTokenDataHandler.getTokenBlockChainDB(callback)
  }

  getTokenTx (TxHash, callback) {
    this.SECTokenDataHandler.getTokenBlockChainDB((err, wholechain) => {
      if (err) {
        throw new Error(`Can not Token Transaction from database`)
      }
      wholechain.forEach(block => {
        let transaction = block.Transactions.filter(tx => {
          return tx.TxHash === TxHash
        })
        if (transaction.length) {
          callback(transaction[0])
        }
      })
    })
  }

  getTokenTxForUser (userAddress, callback) {
    this.SECTokenDataHandler.findTxForUser(userAddress, callback)
  }

  getTokenTxInPool (txHash, callback) {
    let tokenPool = this.CenterController.getBlockchain().TokenPool
    let transaction = tokenPool.getAllTxFromPool().filter(tx => {
      return tx.TxHash === txHash
    })
    callback(transaction[0])
  }

  getTokenTxInPoolByAddress (userAddress) {
    let tokenPool = this.CenterController.getBlockchain().TokenPool
    return tokenPool.getAllTxFromPool().filter(tx => (tx.TxFrom === userAddress || tx.TxTo === userAddress))
  }

  // -------------------------  TRANSACTION CHAIN  ------------------------
  getTransactionBlock (ID, hash, callback) {
    this.SECTxDbDict[ID].getTxBlockFromDB(hash, (err, data) => {
      if (err) {
        callback(err, null)
      } else {
        callback(null, data[0])
      }
    })
  }

  getTransactionBlockchain (ID, minHeight, maxHeight, callback) {
    this.SECTxDbDict[ID].getTxChain(minHeight, maxHeight, callback)
  }

  getWholeTransactionBlockchain (ID, callback) {
    this.SECTxDbDict[ID].getTxBlockChainDB(callback)
  }

  getTxforUser (ID, userAddress, callback) {
    this.SECTxDbDict[ID].findTxForUser(userAddress, callback)
  }

  getTransactionTx (ID, txHash, callback) {
    this.SECTxDbDict[ID].getTxBlockChainDB((err, wholechain) => {
      if (err) {
        throw new Error(`Can not Token Transaction from database`)
      }
      wholechain.forEach(block => {
        let transaction = block.Transactions.filter(tx => {
          return tx.TxHash === txHash
        })
        if (transaction.length) {
          callback(transaction[0])
        }
      })
    })
  }

  getTransactionTxInPool (ID, txHash) {
    let txPoolDict = this.CenterController.getBlockchain().TxPoolDict
    return txPoolDict[ID].getAllTxFromPool().filter(tx => { return tx.TxHash === txHash })
  }

  // -------------------------  ACCOUNT DATABASE  -------------------------
  getAccountDB (callback) {
    this.SECAccountDataHandler.getAccountDB(callback)
  }

  writeUserInfoToAccountDB (accDataList, callback) {
    this.SECAccountDataHandler.writeUserInfoToAccountDB(accDataList, callback)
  }

  readUserInfofromAccountDB (accNameList) {
    return this.SECAccountDataHandler.readUserInfofromAccountDB(accNameList)
  }

  // ---------------------------  secjs libs  --------------------------
  asyncGetUTCTimeFromServer (timeServer) {
    return secUtils.asyncGetUTCTimeFromServer(timeServer)
  }

  createSecTxObject (tokenTx) {
    return new secTransaction.SECTokenTx(tokenTx)
  }

  getNodeIpv4 (callback) {
    nodeData.PublicIPV4(callback)
  }

  // -------------------------  Other functions  ------------------------
  /**
   * Calculate user account balance
   * @param  {String} userAddress - user account address
   * @return {None}
   */
  calAccBalance (userAddress, callback) {
    this.SECTokenDataHandler.findTxForUser(userAddress, (err, transactions) => {
      if (err) {
        callback(err, null)
      } else {
        // find transactions in token pool
        let tokenPool = this.CenterController.getBlockchain().TokenPool
        let txArray = tokenPool.getAllTxFromPool().filter(tx => (tx.TxFrom === userAddress || tx.TxTo === userAddress))
        // if (transactions.length === 0 && txArray.length === 0) {
        //   err = new Error('transactions not found')
        //   return callback(err, null)
        // }

        let bnUserBalance = 10 // TODO: for testing
        transactions.forEach((tx) => {
          if (tx.TxFrom === userAddress) {
            bnUserBalance = bnUserBalance - parseFloat(tx.Value) - parseFloat(tx.TxFee)
          }
          if (tx.TxTo === userAddress) {
            bnUserBalance = bnUserBalance + parseFloat(tx.Value)
          }
        })

        txArray.forEach((tx) => {
          if (tx.TxFrom === userAddress) {
            bnUserBalance = bnUserBalance - parseFloat(tx.Value) - parseFloat(tx.TxFee)
          }
          if (tx.TxTo === userAddress) {
            bnUserBalance = bnUserBalance + parseFloat(tx.Value)
          }
        })
        bnUserBalance = bnUserBalance.toString()

        if (isNaN(bnUserBalance)) {
          err = new Error('invalid userBalance calculated, check input argument for more info')
          callback(err, null)
        } else {
          callback(null, bnUserBalance)
        }
      }
    })
  }

  getUserTxNonce (userAddress, callback) {
    let nonce = 0
    this.getTokenTxForUser(userAddress, (err, dbTxArray) => {
      if (err) {
        callback(err, null)
      } else {
        let poolTxArray = this.getTokenTxInPoolByAddress(userAddress)
        nonce = dbTxArray.length + poolTxArray.length

        let Nonce = nonce.toString()
        callback(null, Nonce)
      }
    })
  }

  getTokenChainSize (callback) {
    getSize('./data/tokenBlockChain', (err, size) => {
      if (err) {
        callback(err, null)
      } else {
        callback(null, size)
      }
    })
  }

  enablePOW () {
    this.PowEnableFlag = true
  }

  disablePOW () {
    this.PowEnableFlag = false
  }

  startNetworkEvent (callback) {
    if (this.CenterController.runningFlag) {
      callback('network event is already running')
    } else {
      try {
        this.CenterController.initNetwork(() => {
          callback(true)
        })
      } catch (err) {
        callback(err)
      }
    }
  }
}

module.exports = APIs
