const config = require('config')
const crypto = require('crypto')
const path = require('path')
const mkdirp = require('mkdirp')

// -------------------------------  SEC LIBRARIES  -------------------------------
const SECDatahandler = require('@sec-block/secjs-datahandler')

const dbconfig = {
  DBPath: process.cwd() + config.get('SECBlock.dbConfig').Path,
  ID: [
    '1897984547',
    '1897984548'
    // '1897984549',
    // '1897984550'
  ]
}

const Account = require('./account/account')
const APIs = require('./apis/apis')
const CenterController = require('./controller/center-controller.js')

// -----------------------------  CREATE SEC LOGGER  -----------------------------
const loggerConfig = config.get('SECBlock.logConfig')
const loggerPath = process.cwd() + loggerConfig.Path
const loggerFile = path.join(loggerPath, loggerConfig.Name)
mkdirp.sync(loggerPath)
const logger = require('@sec-block/secjs-logger').createLogger(loggerFile) // logs to a file

class Main {
  constructor () {
    // -------------------------------  SEC LOGGER CONFIG  ------------------------------- //
    logger.format = (level, date, message) => {
      return date.getTime().toString() + '; ' + message
    }
    logger.setLevel(loggerConfig.Level)

    // -------------------------------  SEC DATAHANDLER  ------------------------------- //
    let TokenBlockchainDataHandler = new SECDatahandler.TokenBlockChainDB(dbconfig)
    let AccountDataHandler = new SECDatahandler.AccountDB(dbconfig)
    let txDbDict = {}
    dbconfig.ID.forEach((TxChainID) => {
      let TxBlockchainDataHandler = new SECDatahandler.TxBlockChainDB({
        DBPath: dbconfig.DBPath,
        ID: TxChainID
      })
      txDbDict[TxChainID] = TxBlockchainDataHandler
    })

    // -------------------------------  OTHER SEC OBJECTS  ------------------------------- //
    let PowEnableFlag = false

    this.Account = new Account({
      AccountDataHandler: AccountDataHandler,
      SECLogger: logger
    })
    this.CenterController = new CenterController({
      PRIVATE_KEY: crypto.randomBytes(32),
      SECTokenDataHandler: TokenBlockchainDataHandler,
      SECTxDbDict: txDbDict,
      SECAccount: this.Account,
      SECLogger: logger,
      PowEnableFlag: PowEnableFlag
    })

    this.APIs = new APIs({
      SECTokenDataHandler: TokenBlockchainDataHandler,
      SECTxDbDict: txDbDict,
      SECAccountDataHandler: AccountDataHandler,
      CenterController: this.CenterController,
      SECLogger: logger,
      PowEnableFlag: PowEnableFlag
    })
  }

  run () {
  }
}

const _Main = new Main()
module.exports = _Main
