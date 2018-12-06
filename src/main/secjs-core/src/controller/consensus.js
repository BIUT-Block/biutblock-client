const _ = require('lodash')
const chalk = require('chalk')
const cp = require('child_process')
const SECConfig = require('config')

const SECUtil = require('@sec-block/secjs-util')
const SECBlockChain = require('@sec-block/secjs-blockchain')
const SECRandomData = require('@sec-block/secjs-randomdatagenerator')
const SECCircle = require('./circle')
// const SECGroup = require('@sec-block/secjs-group')

class SECConsensus {
  constructor (config) {
    // -------------------------------  Init class global variables  -------------------------------
    this.rlp = config.rlp
    this.BlockChain = config.BlockChain
    this.logger = config.SECLogger
    this.isTokenChain = config.isTokenChain
    this.powEnableFlag = config.PowEnableFlag

    // -------------------------------  Check block chain type  -------------------------------
    if (this.isTokenChain) {
      this.powWorker = cp.fork('./src/controller/pow-worker')
      this.isPowRunning = false

      // create an secCircle object
      let configGroup = SECConfig.get('SECBlock.groupConfig')
      let configCircle = SECConfig.get('SECBlock.circleConfig')
      configCircle.minGroup = configGroup.minGroupId
      configCircle.maxGroup = configGroup.maxGroupId
      this.secCircle = new SECCircle(configCircle)

      // init variables
      this.myGroupId = 0
      this.groupIdBuffer = 0
    } else {
      // init variables
      this.ID = config.ID
      this.txChainMinGenPeriod = SECConfig.get('SECBlock.txChainConfig').minGenPeriod
      this.txChainMaxGenPeriod = SECConfig.get('SECBlock.txChainConfig').maxGenPeriod
    }
  }

  runPOW () {
    let blockBuffer = {}
    // Calculate pow difficulty
    let parentPOWCalcTime = 0
    if (this.BlockChain.SECTokenBlockChain.getCurrentHeight() > 2) {
      let lastBlockTimestamp = this.BlockChain.SECTokenBlockChain.getLastBlock().TimeStamp
      let secondLastBlockTimestamp = this.BlockChain.SECTokenBlockChain.getSecondLastBlock().TimeStamp
      parentPOWCalcTime = this.BlockChain.SECTokenBlockChain.getLastBlock().TimeStamp - this.secCircle.getGroupStartTime(this.BlockChain.SECTokenBlockChain.getLastBlock().TimeStamp)
      parentPOWCalcTime += this.secCircle.getGroupStartTime(lastBlockTimestamp) - this.secCircle.getGroupStartTime(secondLastBlockTimestamp) - SECConfig.get('SECBlock.circleConfig').intervalTime
    }
    blockBuffer = SECRandomData.generateTokenBlock(this.BlockChain.SECTokenBlockChain)
    blockBuffer.Number = this.BlockChain.SECTokenBlockChain.getCurrentHeight() + 1
    blockBuffer.Beneficiary = this.BlockChain.SECAccount.getAddress()
    blockBuffer.Transactions = []
    let blockHeader = new SECBlockChain.SECTokenBlock(blockBuffer)

    let blockForPOW = {
      Number: blockBuffer.Number,
      Difficulty: this.BlockChain.SECTokenBlockChain.getLastBlock().Difficulty < 2048 ? 2048 : this.BlockChain.SECTokenBlockChain.getLastBlock().Difficulty,
      parentPOWCalcTime: parentPOWCalcTime,
      Header: blockHeader.getBlockHeaderPOWHashBuffer().toString('hex')
    }
    console.log(chalk.magenta(`Starting POW with Difficulty ${blockForPOW.Difficulty} ...`))
    this.logger.debug(`DEBUG: Starting POW with Difficulty ${blockForPOW.Difficulty} ...`)
    this.powWorker.send(blockForPOW)
    this.isPowRunning = true
    this.powWorker.on('message', (result) => {
      this.logger.debug('DEBUG: pow result is: ', result)
      this.logger.debug('DEBUG: generated block height is: ', blockBuffer.Number)
      if (result.result) {
        blockBuffer.MixHash = result.MixHash
        blockBuffer.Nonce = result.Nonce
        let TxsInPoll = this.BlockChain.TokenPool.getAllTxFromPool()
        let txHeight = 0
        TxsInPoll.forEach((tx, index, TxsInPoll) => {
          if (typeof TxsInPoll[index] !== 'object') {
            TxsInPoll[index] = JSON.parse(TxsInPoll[index])
          }
          TxsInPoll[index].TxReceiptStatus = 'success'
          TxsInPoll[index].TxHeight = txHeight
          txHeight = txHeight + 1
        })
        blockBuffer.Transactions = TxsInPoll
        blockBuffer.TimeStamp = SECUtil.currentUnixTimeInMillisecond()
        let newSECTokenBlock = new SECBlockChain.SECTokenBlock(blockBuffer)
        try {
          this.BlockChain.SECTokenBlockChain.putBlockToDB(newSECTokenBlock.getBlock(), () => {
            console.log(chalk.green(`Token Blockchain | New Block generated, ${blockBuffer.Transactions.length} Transactions saved in the new Block, Current Token Blockchain Height: ${this.BlockChain.SECTokenBlockChain.getCurrentHeight()}`))
            this.BlockChain.sendNewTokenBlockHash(newSECTokenBlock)
            this.BlockChain.TokenPool.clear()
            this.resetPOW()
          })
        } catch (error) {
          this.logger.error('ERROR: pow child process something wrong when writing new block to DB: ', error)
          console.error(error)
          this.resetPOW()
        }
      } else {
        this.logger.error('ERROR: pow child process POW result verification failed')
        this.resetPOW()
      }
    })
  }

  resetPOW () {
    console.log(chalk.magenta('Reset POW'))
    this.logger.debug('reset POW')
    this.powWorker.kill()
    this.powWorker = cp.fork('./src/controller/pow-worker')
  }

  restartPOW () {
    this.logger.debug('restart POW')
    this.resetPOW()
    if (process.env.pow || this.PowEnableFlag) {
      this.runPOW()
    }
  }

  runCircle () {
    let accAddress = this.BlockChain.SECAccount.getAddress()
    this.myGroupId = this.secCircle.getHostGroupId(accAddress)

    let lockFlag = false
    this.circleInterval = setInterval(() => {
      let groupId = this.secCircle.getWorkingGroupId()
      if (this.currentGroup !== groupId && !lockFlag) {
        let isNextPeriod = this.secCircle.isNextPeriod()
        if (isNextPeriod) {
          lockFlag = true
          this.secCircle.resetCircle((err) => {
            if (err) {
              this.logger.error('ERROR: error when running this.secCircle.resetCircle function, err: ', err)
            }
            lockFlag = false
          })
          this.myGroupId = this.secCircle.getHostGroupId(accAddress)
        }

        if ((process.env.pow || this.PowEnableFlag) && groupId === this.myGroupId) {
          this.resetPOW()
          this.runPOW()
        } else if (this.isPowRunning) {
          this.resetPOW()
          this.isPowRunning = false
        }

        this.currentGroup = groupId
      }
    }, this.secCircle.timeResolution)
  }

  resetCircle () {
    console.log(chalk.magenta('Reset Circle'))
    clearInterval(this.circleInterval)
  }

  runTxBlockChain (delay = _.random(this.txChainMinGenPeriod, this.txChainMaxGenPeriod)) {
    this.TxTimer = setTimeout(() => {
      this.BlockChain.generateTxBlock(this.ID)
      this.runTxBlockChain()
    }, delay)
  }

  run () {
    setTimeout(() => {
      if (this.isTokenChain) {
        // token chain consensus
        this.runCircle()
        this.BlockChain.run()
      } else {
        // transaction chain consensus
        this.runTxBlockChain()
      }
    }, 2000)
  }
}

module.exports = SECConsensus
