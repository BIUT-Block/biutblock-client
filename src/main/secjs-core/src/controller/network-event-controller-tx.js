const chalk = require('chalk')
const ms = require('ms')
const LRUCache = require('lru-cache')
const SECConfig = require('config')
const util = require('util')

// -------------------------------  SEC LIBRARY  -------------------------------
const SECDEVP2P = require('@sec-block/secjs-devp2p')
const SECBlockChain = require('@sec-block/secjs-blockchain')
const SECTransaction = require('@sec-block/secjs-tx')

const MainUtils = require('../utils/utils')
const txCache = new LRUCache({ max: SECConfig.get('SECBlock.devp2pConfig').txCache })
const blocksCache = new LRUCache({ max: SECConfig.get('SECBlock.devp2pConfig').blocksCache })

class NetworkEventTx {
  constructor (config) {
    this.ID = config.ID
    this.BlockChain = config.BlockChain
    this.Consensus = config.Consensus
    this.NDP = config.NDP
    this.logger = config.SECLogger

    // ---------------------------  CHECK PARAMETERS  ---------------------------
    this.CHAIN_ID = SECConfig.get('SECBlock.checkConfig').CHAIN_ID
    this.CHECK_BLOCK_TITLE = SECConfig.get('SECBlock.checkConfig').CHECK_BLOCK_TITLE
    this.CHECK_BLOCK_NR = SECConfig.get('SECBlock.checkConfig').CHECK_BLOCK_NR

    // ------------------------------  Parameters  ------------------------------
    this.forkDrop = null
    this.forkVerified = false
    this.peer = {}
    this.addr = {}
    this.sec = {}
  }

  getInstanceID () {
    return this.ID
  }

  PeerCommunication (peer, addr, sec) {
    this.peer = peer
    this.addr = addr
    this.sec = sec

    const requests = {
      headers: [],
      bodies: [],
      msgTypes: {}
    }
    let status = {
      networkId: this.CHAIN_ID,
      td: 0, // transaction block chain does not have difficulty
      bestHash: Buffer.from(this.BlockChain.SECTransactionBlockChainDict[this.ID].getLastBlockHash(), 'hex'),
      genesisHash: Buffer.from(this.BlockChain.SECTransactionBlockChainDict[this.ID].getGenesisBlockHash(), 'hex')
    }
    this.sec.sendStatus(status)
    console.log(chalk.bold.yellowBright('Sending Local Status to Peer...'))
    console.log(status)

    // ------------------------------  CHECK FORK  -----------------------------
    this.sec.once('status', () => {
      console.log('Running first time Status Check...')
      this.sec.sendMessage(SECDEVP2P.SEC.MESSAGE_CODES.GET_BLOCK_HEADERS, [Buffer.from(this.ID, 'utf-8'), [this.CHECK_BLOCK_NR, 1, 0, 0]])
      this.forkDrop = setTimeout(() => {
        peer.disconnect(SECDEVP2P.RLPx.DISCONNECT_REASONS.USELESS_PEER)
      }, ms('15s'))
      peer.once('close', () => clearTimeout(this.forkDrop))
    })

    this.sec.on('message', async (code, payload) => {
      if (code in requests.msgTypes) {
        requests.msgTypes[code] += 1
      } else {
        requests.msgTypes[code] = 1
      }
      let chainID = payload[0].toString('utf-8')
      if (chainID !== this.ID) {
        return
      }
      payload = payload[1]
      console.log(chalk.bold.greenBright(`==================== On Message from ${this.addr} ====================`))
      console.log('Requests: ')
      console.log(requests)
      console.log('Code: ' + code)
      switch (code) {
        case SECDEVP2P.SEC.MESSAGE_CODES.STATUS:
          this.STATUS(payload, requests)
          break

        case SECDEVP2P.SEC.MESSAGE_CODES.NEW_BLOCK_HASHES:
          this.NEW_BLOCK_HASHES(payload, requests)
          break

        case SECDEVP2P.SEC.MESSAGE_CODES.GET_BLOCK_HEADERS:
          this.GET_BLOCK_HEADERS(payload, requests)
          break

        case SECDEVP2P.SEC.MESSAGE_CODES.BLOCK_HEADERS:
          this.BLOCK_HEADERS(payload, requests)
          break

        case SECDEVP2P.SEC.MESSAGE_CODES.GET_BLOCK_BODIES:
          this.GET_BLOCK_BODIES(payload, requests)
          break

        case SECDEVP2P.SEC.MESSAGE_CODES.BLOCK_BODIES:
          this.BLOCK_BODIES(payload, requests)
          break

        case SECDEVP2P.SEC.MESSAGE_CODES.NEW_BLOCK:
          this.NEW_BLOCK(payload, requests)
          break

        case SECDEVP2P.SEC.MESSAGE_CODES.TX:
          this.TX(payload, requests)
          break

        case SECDEVP2P.SEC.MESSAGE_CODES.GET_NODE_DATA:
          this.GET_NODE_DATA(payload, requests)
          break

        case SECDEVP2P.SEC.MESSAGE_CODES.NODE_DATA:
          this.NODE_DATA(payload, requests)
          break

        case SECDEVP2P.SEC.MESSAGE_CODES.GET_RECEIPTS:
          this.GET_RECEIPTS(payload, requests)
          break

        case SECDEVP2P.SEC.MESSAGE_CODES.RECEIPTS:
          this.RECEIPTS(payload, requests)
          break
      }
      console.log(chalk.bold.greenBright(`==================== End On Message from ${this.addr} ====================\n\n`))
    })
  }

  STATUS (payload, requests) {
    console.log(chalk.bold.yellow(`===== STATUS =====`))
    console.log(`Remote Status: `)
    console.log(MainUtils.toStringArray(payload))
    console.log(chalk.bold.yellow(`===== End STATUS =====`))
  }

  NEW_BLOCK_HASHES (payload, requests) {
    console.log(chalk.bold.yellow(`===== NEW_BLOCK_HASHES =====`))
    if (!this.forkVerified) return
    for (let blockHash of payload) {
      console.log(`New Block Hash from Remote: ${blockHash.toString('hex')}`)
      if (blocksCache.has(blockHash.toString('hex'))) {
        console.log('Block Hash already existed in Cache')
        continue
      }
      setTimeout(() => {
        console.log('Send GET_BLOCK_HEADERS Message')
        this.sec.sendMessage(SECDEVP2P.SEC.MESSAGE_CODES.GET_BLOCK_HEADERS, [Buffer.from(this.ID, 'utf-8'), [blockHash, 1, 0, 0]])
        requests.headers.push(blockHash)
      }, ms('0.1s'))
    }
    console.log(chalk.bold.yellow(`===== End NEW_BLOCK_HASHES End =====`))
  }

  GET_BLOCK_HEADERS (payload, requests) {
    console.log(chalk.bold.yellow(`===== GET_BLOCK_HEADERS =====`))
    let headers = []
    if (this.forkVerified) {
      let blockHeaderHash = payload[0].toString('hex')
      let localTxBlockchain = this.BlockChain.SECTransactionBlockChainDict[this.ID].getBlockChain()
      let _block = localTxBlockchain.filter(_block => _block.Hash === blockHeaderHash)[0]
      if (_block) {
        let localTxBlock = new SECBlockChain.SECTransactionBlock(_block)
        headers.push([localTxBlock.getBlockHeaderBuffer(), Buffer.from(_block.Beneficiary)])
      }
    } else {
      console.log('REMOTE CHECK_BLOCK_NR: ' + SECDEVP2P._util.buffer2int(payload[0]))
      if (SECDEVP2P._util.buffer2int(payload[0]) === this.CHECK_BLOCK_NR) {
        let block = this.BlockChain.SECTransactionBlockChainDict[this.ID].getBlockChain()[this.CHECK_BLOCK_NR - 1]
        let checkBlock = new SECBlockChain.SECTransactionBlock(block)
        headers.push([checkBlock.getBlockHeaderBuffer(), Buffer.from(checkBlock.getBlock().Beneficiary)])
        console.log('REMOTE CHECK_BLOCK_HEADER: ')
        console.log(util.inspect(checkBlock.getBlockHeaderBuffer(), false, null))
      }
    }
    console.log('SEC Send Message: BLOCK_HEADERS')
    this.sec.sendMessage(SECDEVP2P.SEC.MESSAGE_CODES.BLOCK_HEADERS, [Buffer.from(this.ID, 'utf-8'), headers])
    console.log(chalk.bold.yellow(`===== End GET_BLOCK_HEADERS =====`))
  }

  BLOCK_HEADERS (payload, requests) {
    console.log(chalk.bold.yellow(`===== BLOCK_HEADERS =====`))
    if (!this.forkVerified) {
      if (payload.length !== 1) {
        console.log(`${this.addr} expected one header for ${this.CHECK_BLOCK_TITLE} verify (received: ${payload.length})`)
        this.peer.disconnect(SECDEVP2P.RLPx.DISCONNECT_REASONS.USELESS_PEER)
        return
      }
      let expectedHash = this.BlockChain.SECTransactionBlockChainDict[this.ID].getGenesisBlockHash()
      console.log(`Expected Hash: ${expectedHash}`)
      let block = new SECBlockChain.SECTransactionBlock()
      block.setBlockHeaderFromBuffer(payload[0][0])
      console.log(`Remote Header Hash: ${block.getBlockHeaderHash()}`)
      if (block.getBlockHeaderHash() === expectedHash) {
        console.log(`${this.addr} verified to be on the same side of the ${this.CHECK_BLOCK_TITLE}`)
        clearTimeout(this.forkDrop)
        this.forkVerified = true
        console.log(`forkVerified: ${this.forkVerified}`)
        this.sec.sendMessage(SECDEVP2P.SEC.MESSAGE_CODES.GET_NODE_DATA, [Buffer.from(this.ID, 'utf-8'), []])
        this._addPeerToNDP()
      }
    } else {
      if (payload.length > 1) {
        console.log(`${this.addr} not more than one block header expected (received: ${payload.length})`)
        return
      }
      let isValidPayload = false
      let block = new SECBlockChain.SECTransactionBlock()
      block.setBlockHeaderFromBuffer(payload[0][0])
      while (requests.headers.length > 0) {
        const blockHash = requests.headers.shift()
        console.log('Remote Block Header: ' + blockHash.toString('hex'))
        if (block.getBlockHeaderHash() === blockHash.toString('hex')) {
          isValidPayload = true
          setTimeout(() => {
            this.sec.sendMessage(SECDEVP2P.SEC.MESSAGE_CODES.GET_BLOCK_BODIES, [Buffer.from(this.ID, 'utf-8'), [blockHash]])
            console.log('block headers block: ', block)
            requests.bodies.push(block)
          }, ms('0.1s'))
          break
        }
      }
      if (!isValidPayload) {
        console.log(`${this.addr} received wrong block header ${block.getBlockHeaderHash()}`)
      }
    }
    console.log(chalk.bold.yellow(`===== End BLOCK_HEADERS =====`))
  }

  GET_BLOCK_BODIES (payload, requests) {
    console.log(chalk.bold.yellow(`===== GET_BLOCK_BODIES =====`))

    let bodies = []
    let blockHeaderHash = payload[0].toString('hex')
    let localTxBlockchain = this.BlockChain.SECTransactionBlockChainDict[this.ID].getBlockChain()
    let _block = localTxBlockchain.filter(_block => _block.Hash === blockHeaderHash)[0]
    if (_block) {
      let localTxBlock = new SECBlockChain.SECTransactionBlock(_block)
      console.log('Beneficiary: ' + _block.Beneficiary)
      bodies.push([localTxBlock.getBlockBodyBuffer(), Buffer.from(_block.Beneficiary)])
    }
    this.sec.sendMessage(SECDEVP2P.SEC.MESSAGE_CODES.BLOCK_BODIES, [Buffer.from(this.ID, 'utf-8'), bodies])

    console.log(chalk.bold.yellow(`===== End GET_BLOCK_BODIES =====`))
  }

  BLOCK_BODIES (payload, requests) {
    console.log(chalk.bold.yellow(`===== BLOCK_BODIES =====`))
    if (!this.forkVerified) return
    if (payload.length !== 1) {
      console.log(`${this.addr} not more than one block body expected (received: ${payload.length})`)
      return
    }
    let isValidPayload = false
    console.log('block body requests.bodies: ', requests.bodies)
    while (requests.bodies.length > 0) {
      const block = requests.bodies.shift()
      block.setBlockBodyFromBuffer(payload[0][0])
      let _block = block.getBlock()
      console.log('Remote Beneficiary: ' + payload[0][1].toString())
      _block.Beneficiary = payload[0][1].toString()
      let NewSECBlock = new SECBlockChain.SECTransactionBlock(_block)
      let secblock = NewSECBlock.getBlock()
      secblock.Transactions = JSON.parse(JSON.stringify(secblock.Transactions))
      isValidPayload = true
      if (secblock.Number === this.BlockChain.SECTransactionBlockChainDict[this.ID].getCurrentHeight() + 1) {
        try {
          this.BlockChain.SECTransactionBlockChainDict[this.ID].putBlockToDB(secblock, () => {
            console.log(chalk.green(`Get New Transaction Block from: ${this.addr} and saved in local Blockchain`))
            let newSECTxBlock = new SECBlockChain.SECTransactionBlock(secblock)
            this._onNewBlock(newSECTxBlock)
            this.logger.debug(`DEBUG: Get New Transaction Block from: ${this.addr} and saved in local Blockchain ${this.ID}, block height is ${newSECTxBlock.getBlock().Number}`)
          })
        } catch (error) {
          this.logger.error('ERROR: tx chain, BLOCK_BODIES state, error occurs when writing new block to DB: ', error)
          // TODO: to be tested
          let NodeData = [
            1,
            SECDEVP2P._util.int2buffer(this.BlockChain.SECTransactionBlockChainDict[this.ID].getCurrentHeight()),
            Buffer.from(this.BlockChain.SECTransactionBlockChainDict[this.ID].getLastBlockHash(), 'hex'),
            Buffer.from(this.BlockChain.SECTransactionBlockChainDict[this.ID].getGenesisBlockHash(), 'hex'),
            Buffer.from(JSON.stringify(this.BlockChain.SECTransactionBlockChainDict[this.ID].getHashList()))
          ]
          this.sec.sendMessage(SECDEVP2P.SEC.MESSAGE_CODES.NODE_DATA, [Buffer.from(this.ID, 'utf-8'), NodeData])
        }
      } else if (secblock.Number > this.BlockChain.SECTransactionBlockChainDict[this.ID].getCurrentHeight() + 1) {
        let NodeData = [
          1,
          SECDEVP2P._util.int2buffer(this.BlockChain.SECTransactionBlockChainDict[this.ID].getCurrentHeight()),
          Buffer.from(this.BlockChain.SECTransactionBlockChainDict[this.ID].getLastBlockHash(), 'hex'),
          Buffer.from(this.BlockChain.SECTransactionBlockChainDict[this.ID].getGenesisBlockHash(), 'hex'),
          Buffer.from(JSON.stringify(this.BlockChain.SECTransactionBlockChainDict[this.ID].getHashList()))
        ]
        this.sec.sendMessage(SECDEVP2P.SEC.MESSAGE_CODES.NODE_DATA, [Buffer.from(this.ID, 'utf-8'), NodeData])
      } else {
        this.sec.sendMessage(SECDEVP2P.SEC.MESSAGE_CODES.GET_NODE_DATA, [Buffer.from(this.ID, 'utf-8'), []])
      }
      // const isValid = await this._isValidBlock(block)
      // if (isValid) {
      //   isValidPayload = true
      //   this._onNewBlock(block, this.peer)
      //   break
      // }
    }
    if (!isValidPayload) {
      console.log(`${this.addr} received wrong block body`)
    }
    console.log(chalk.bold.yellow(`===== End BLOCK_BODIES =====`))
  }

  NEW_BLOCK (payload, requests) {
    console.log(chalk.bold.yellow(`===== NEW_BLOCK =====`))
    if (!this.forkVerified) return
    let blockArray = []
    payload.forEach(_payload => {
      let newTxBlock = new SECBlockChain.SECTransactionBlock()
      newTxBlock.setBlockFromBuffer(_payload)
      if (!blocksCache.has(newTxBlock.getBlockHeaderHash())) {
        let block = Object.assign({}, newTxBlock.getBlock())
        blockArray.push(block)
        blocksCache.set(newTxBlock.getBlockHeaderHash(), true)
      }
    })
    if (blockArray.length !== 0) {
      this.BlockChain.SECTransactionBlockChainDict[this.ID].updateBlockchain(blockArray[0].Number, blockArray, (err) => {
        if (err) {
          this.logger.error('ERROR: tx chain, NEW_BLOCK state, updateBlockchain function callback error: ', err)
        }
        console.log(blockArray.length + ' Blocks updated')
        console.log('Update Transaction Blockchain Finished!')
        this.logger.debug(`DEBUG: Update Transaction Blockchain ${this.ID} Finished! starting block number is ${blockArray[0].Number}, update length is ${blockArray.length}`)
        this.BlockChain.TxPoolDict[this.ID].updateByBlockChain(this.BlockChain.SECTransactionBlockChainDict[this.ID])
        console.log(chalk.bold.yellow(`===== NEW_BLOCK End =====`))
      })
    }
    // const isValidNewBlock = await this._isValidBlock(newTxBlock)
    // if (isValidNewBlock) this._onNewBlock(newBlock, this.peer)
  }

  TX (payload, requests) {
    console.log(chalk.bold.yellow(`===== TX =====`))
    if (!this.forkVerified) return
    for (let txBuffer of payload) {
      let TransactionTx = new SECTransaction.SECTransactionTx(txBuffer)
      if (this._isValidTx(TransactionTx)) this._onNewTx(TransactionTx)
    }
    console.log(chalk.bold.yellow(`===== End TX =====`))
  }

  GET_NODE_DATA (payload, requests) {
    console.log(chalk.bold.yellow(`===== GET_NODE_DATA =====`))
    let NodeData = [
      1,
      SECDEVP2P._util.int2buffer(this.BlockChain.SECTransactionBlockChainDict[this.ID].getCurrentHeight()),
      Buffer.from(this.BlockChain.SECTransactionBlockChainDict[this.ID].getLastBlockHash(), 'hex'),
      Buffer.from(this.BlockChain.SECTransactionBlockChainDict[this.ID].getGenesisBlockHash(), 'hex'),
      Buffer.from(JSON.stringify(this.BlockChain.SECTransactionBlockChainDict[this.ID].getHashList()))
    ]
    this.sec.sendMessage(SECDEVP2P.SEC.MESSAGE_CODES.NODE_DATA, [Buffer.from(this.ID, 'utf-8'), NodeData])
    console.log(chalk.bold.yellow(`===== End GET_NODE_DATA =====`))
  }

  NODE_DATA (payload, requests) {
    console.log(chalk.bold.yellow(`===== NODE_DATA =====`))
    let localHeight = this.BlockChain.SECTransactionBlockChainDict[this.ID].getCurrentHeight()
    let localLastHash = this.BlockChain.SECTransactionBlockChainDict[this.ID].getLastBlockHash()
    let localHashList = this.BlockChain.SECTransactionBlockChainDict[this.ID].getHashList()
    let remoteHeight = SECDEVP2P._util.buffer2int(payload[1])
    let remoteLastHash = payload[2].toString('hex')
    let remoteHashList = JSON.parse(payload[4].toString())
    console.log('local Height: ' + localHeight)
    console.log('local Lasthash: ' + localLastHash)
    console.log('remote Height: ' + remoteHeight)
    console.log('remote Lasthash: ' + remoteLastHash)

    if (localHeight > remoteHeight) {
      console.log('Local Transaction Blockchain Length longer than remote Node')
      let blockPosition = localHashList.filter(block => (block.Hash === remoteLastHash && block.Number === remoteHeight))
      if (blockPosition.length > 0) {
        console.log('No Fork founded!')
        let newBlocks = this.BlockChain.SECTransactionBlockChainDict[this.ID].getBlockChain().slice(remoteHeight + 1)
        let newBlockBuffers = newBlocks.map(_block => {
          return new SECBlockChain.SECTransactionBlock(_block).getBlockBuffer()
        })
        this.sec.sendMessage(SECDEVP2P.SEC.MESSAGE_CODES.NEW_BLOCK, [Buffer.from(this.ID, 'utf-8'), newBlockBuffers])
      } else {
        console.log('Fork founded!')
        let forkPosition = 0
        for (let i = remoteHeight - 1; i >= 0; i--) {
          if (localHashList.filter(block => (block.Hash === remoteHashList[i].Hash)).length > 0) {
            forkPosition = i + 1
            console.log('Fork Position: ' + forkPosition)
            break
          }
        }
        let newBlocks = this.BlockChain.SECTransactionBlockChainDict[this.ID].getBlockChain().slice(forkPosition)
        let newBlockBuffers = newBlocks.map(_block => {
          return new SECBlockChain.SECTransactionBlock(_block).getBlockBuffer()
        })
        this.sec.sendMessage(SECDEVP2P.SEC.MESSAGE_CODES.NEW_BLOCK, [Buffer.from(this.ID, 'utf-8'), newBlockBuffers])
      }
    }
    console.log(chalk.bold.yellow(`===== End NODE_DATA =====`))
  }

  GET_RECEIPTS (payload, requests) {
    console.log(chalk.bold.yellow(`===== GET_RECEIPTS =====`))
    this.sec.sendMessage(SECDEVP2P.SEC.MESSAGE_CODES.RECEIPTS, [Buffer.from(this.ID, 'utf-8'), []])
    console.log(chalk.bold.yellow(`===== End GET_RECEIPTS =====`))
  }

  RECEIPTS (payload, requests) {
    console.log(chalk.bold.yellow(`===== RECEIPTS =====`))
    console.log(chalk.bold.yellow(`===== End RECEIPTS =====`))
  }

  _onNewTx (tx) {
    const txHashHex = tx.getTxHash()
    if (txCache.has(txHashHex)) return
    txCache.set(txHashHex, true)
    this.BlockChain.TxPoolDict[this.ID].addTxIntoPool(tx.getTx())
    console.log(tx.getTx())
    this.BlockChain.sendNewTxTx(tx, this.ID, this.peer)
    console.log(`New tx: ${tx.getTx().TxHash} (from ${MainUtils.getPeerAddr(this.peer)})`)
  }

  _onNewBlock (newSECTxBlock) {
    blocksCache.set(newSECTxBlock.getBlockHeaderHash(), true)
    this.BlockChain.sendNewTxBlockHash(newSECTxBlock, this.ID, this.peer)
    console.log('----------------------------------------------------------------------------------------------------------')
    console.log(`New block ${newSECTxBlock.getBlock().Number}: ${newSECTxBlock.getBlock().Hash} (from ${MainUtils.getPeerAddr(this.peer)})`)
    console.log('----------------------------------------------------------------------------------------------------------')
    this.BlockChain.TxPoolDict[this.ID].updateByBlockChain(this.BlockChain.SECTransactionBlockChainDict[this.ID])
  }

  // TODO: must be reimplemented
  _isValidTx (tx) {
    return true
    // return tx.validate(false)
  }

  _addPeerToNDP () {
    console.log('Adding Node to NDP Service...')
    this.NDP.addPeer({ address: this.peer._socket.remoteAddress, udpPort: require('config').get('SECBlock.devp2pConfig').ndp.endpoint.udpPort, tcpPort: require('config').get('SECBlock.devp2pConfig').ndp.endpoint.tcpPort }).then((peer) => {
      console.log('Added Node to NDP Service successful')
      console.log('NDP Node Info: ')
      console.log(peer)
    }).catch((err) => {
      console.log(`error on connection to node: ${err.stack || err}`)
      this.logger.error(`ERROR: tx chain, error on connection to node: ${err.stack || err}`)
    })
  }

  // TODO: must be reimplement
  async _isValidBlock (block) {
    // if (!block.validateUnclesHash()) return false
    // if (!block.transactions.every(this._isValidTx)) return false
    // return new Promise((resolve, reject) => {
    //   block.genTxTrie(() => {
    //     try {
    //       resolve(block.validateTransactionsTrie())
    //     } catch (err) {
    //       reject(err)
    //     }
    //   })
    // })
    return true
  }
}

module.exports = NetworkEventTx
