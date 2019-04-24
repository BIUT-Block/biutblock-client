import jayson from 'jayson/lib/client'
import WalletsHandler from './WalletsHandler'
const moment = require('moment-timezone')
export default {
  install: function (Vue, options) {
    let externalServerAddress = '35.158.171.46' //'54.250.166.137'  //'18.197.120.79' Test node
    let externalServerPort = '3002'
    let externalServerPortSEN = '3003'
    let localhostAddress = '127.0.0.1'
    let localhostPort = '3002'
    let localhostPortSEN = '3003'

    let jsonRPC = {
      target: '',
      client: '',
      clientSEN: '',
      switchToLocalHost: function () {
        this.client = jayson.http(`http://${localhostAddress}:${localhostPort}`)
        this.clientSEN = jayson.http(`http://${localhostAddress}:${localhostPortSEN}`)
      },
      switchToExternalServer: function () {
        this.client = jayson.http(`http://${externalServerAddress}:${externalServerPort}`)
        this.clientSEN = jayson.http(`http://${externalServerAddress}:${externalServerPortSEN}`)
      },

      _getBalance: function (client, walletAddress, fnUpdateBalance) {
        client.request('sec_getBalance', [walletAddress], (err, response) => {
          if (err) return
          if (response.result.status === '1') {
            fnUpdateBalance(response.result.value)
          }
        })
      },
      getWalletBalance: function (walletAddress, fnUpdateBalance) {
        this._getBalance(this.client, walletAddress, fnUpdateBalance)
      },
      getWalletBalanceSEN: function (walletAddress, fnUpdateBalance) {
        this._getBalance(this.clientSEN, walletAddress, fnUpdateBalance)
      },
      getWalletBalanceOfBothChains: function (walletAddress, fnUpdateBalanceSEC, fnUpdateBalanceSEN) {
        this.getWalletBalance(walletAddress, fnUpdateBalanceSEC)
        this.getWalletBalanceSEN(walletAddress, fnUpdateBalanceSEN)
      },

      _getTransactions: function (client, tokenUnit, walletAddress, fnFillWalletList) {
        let walletList = []
        let walletAddressTempInPool = ''
        let walletAddressTempInChain = ''
        let moneyValue = ''
        client.request('sec_getTransactions', [walletAddress], (err, response) => {
          if (err) return
          if (response.result.resultInPool) {
            for (let j = 0; j < response.result.resultInPool.length; j++) {
              if (response.result.resultInPool[j].TxTo === walletAddress) {
                continue
              } else if (response.result.resultInPool[j].TxTo === '0000000000000000000000000000000000000000') {
                moneyValue = '- ' + response.result.resultInPool[j].Value
                walletAddressTempInPool = 'Gas'
              } else if (response.result.resultInPool[j].TxFrom === '0000000000000000000000000000000000000000') {
                moneyValue = '- ' + response.result.resultInPool[j].Value
                walletAddressTempInPool = 'Mined'
              } else {
                moneyValue = '- ' + response.result.resultInPool[j].Value
                walletAddressTempInPool = `0x${response.result.resultInPool[j].TxTo}`
              }
              walletList.push({
                id: response.result.resultInPool[j].TxHash,
                blockNumber: 'Not in Block yet',
                blockHash: '',
                listAddress: walletAddressTempInPool === '0000000000000000000000000000000000000000' ? 'Mined' : `0x${walletAddressTempInPool}`,
                listFrom: response.result.resultInPool[j].TxFrom,
                listTo: response.result.resultInPool[j].TxTo,
                listTime: WalletsHandler.formatDate(moment(response.result.resultInPool[j].TimeStamp).format('YYYY/MM/DD HH:mm:ss'), new Date().getTimezoneOffset()),
                listMoney: moneyValue,
                listUnit: tokenUnit,
                listMinerCost: response.result.resultInPool[j].TxFee,
                listState: 'Packed'
              })
            }
          }
          if (response.result.resultInChain) {
            for (let i = 0; i < response.result.resultInChain.length; i++) {
              if (response.result.resultInChain[i].TxTo === walletAddress) {
                moneyValue = '+ ' + response.result.resultInChain[i].Value
                walletAddressTempInChain = response.result.resultInChain[i].TxFrom
              } else if (response.result.resultInChain[i].TxTo === '0000000000000000000000000000000000000000') {
                moneyValue = '- ' + response.result.resultInChain[i].Value
                walletAddressTempInChain = 'Gas'
              } else if (response.result.resultInChain[i].TxFrom === '0000000000000000000000000000000000000000') {
                moneyValue = '- ' + response.result.resultInChain[i].Value
                walletAddressTempInChain = 'Mined'
              } else {
                moneyValue = '- ' + response.result.resultInChain[i].Value
                walletAddressTempInChain = `0x${response.result.resultInChain[i].TxTo}`
              }
              walletList.push({
                id: response.result.resultInChain[i].TxHash,
                blockNumber: response.result.resultInChain[i].BlockNumber,
                blockHash: `0x${response.result.resultInChain[i].BlockHash}`,
                listAddress: walletAddressTempInChain,
                listFrom: response.result.resultInChain[i].TxFrom,
                listTo: response.result.resultInChain[i].TxTo,
                listTime: WalletsHandler.formatDate(moment(response.result.resultInChain[i].TimeStamp).format('YYYY/MM/DD HH:mm:ss'), new Date().getTimezoneOffset()),
                listMoney: moneyValue,
                listUnit: tokenUnit,
                listMinerCost: response.result.resultInChain[i].TxFee,
                listState: response.result.resultInChain[i].TxFrom === '0000000000000000000000000000000000000000' ? 'Mining' : 'Successful'
              })
            }
          }
          fnFillWalletList(walletList)
        })
      },

      _getTransactionsOfBothChains: function (walletAddress, fnFillWalletList) {
        let walletList = []
        let walletAddressTempInPool = ''
        let walletAddressTempInChain = ''
        let moneyValue = ''
        this.client.request('sec_getTransactions', [walletAddress], (err, response) => {
          if (err) return
          if (response.result.resultInPool) {
            for (let j = 0; j < response.result.resultInPool.length; j++) {
              if (response.result.resultInPool[j].TxTo === walletAddress) {
                continue
              } else {
                moneyValue = '- ' + response.result.resultInPool[j].Value
                walletAddressTempInPool = response.result.resultInPool[j].TxTo
              }
              walletList.push({
                id: response.result.resultInPool[j].TxHash,
                blockNumber: 'Not in Block yet',
                blockHash: '',
                listAddress: walletAddressTempInPool === '0000000000000000000000000000000000000000' ? 'Mined' : `0x${walletAddressTempInPool}`,
                listFrom: response.result.resultInPool[j].TxFrom,
                listTo: response.result.resultInPool[j].TxTo,
                listTime: WalletsHandler.formatDate(moment(response.result.resultInPool[j].TimeStamp).format('YYYY/MM/DD HH:mm:ss'), new Date().getTimezoneOffset()),
                listMoney: moneyValue,
                listUnit: 'SEC',
                listMinerCost: response.result.resultInPool[j].TxFee,
                listState: 'Packed'
              })
            }
          }
          if (response.result.resultInChain) {
            for (let i = 0; i < response.result.resultInChain.length; i++) {
              if (response.result.resultInChain[i].TxTo === walletAddress) {
                moneyValue = '+ ' + response.result.resultInChain[i].Value
                walletAddressTempInChain = response.result.resultInChain[i].TxFrom
              } else {
                moneyValue = '- ' + response.result.resultInChain[i].Value
                walletAddressTempInChain = response.result.resultInChain[i].TxTo
              }
              walletList.push({
                id: response.result.resultInChain[i].TxHash,
                blockNumber: response.result.resultInChain[i].BlockNumber,
                blockHash: `0x${response.result.resultInChain[i].BlockHash}`,
                listAddress: walletAddressTempInChain === '0000000000000000000000000000000000000000' ? 'Mined' : `0x${walletAddressTempInChain}`,
                listFrom: response.result.resultInChain[i].TxFrom,
                listTo: response.result.resultInChain[i].TxTo,
                listTime: WalletsHandler.formatDate(moment(response.result.resultInChain[i].TimeStamp).format('YYYY/MM/DD HH:mm:ss'), new Date().getTimezoneOffset()),
                listMoney: moneyValue,
                listUnit: 'SEC',
                listMinerCost: response.result.resultInChain[i].TxFee,
                listState: walletAddressTempInChain === '0000000000000000000000000000000000000000' ? 'Mining' : 'Successful'
              })
            }
          }
          this.clientSEN.request('sec_getTransactions', [walletAddress], (err, response) => {
            if (err) return
            if (response.result.resultInPool) {
              for (let j = 0; j < response.result.resultInPool.length; j++) {
                if (response.result.resultInPool[j].TxTo === walletAddress) {
                  continue
                } else if (response.result.resultInPool[j].TxTo === '0000000000000000000000000000000000000000') {
                  moneyValue = '- ' + response.result.resultInPool[j].Value
                  walletAddressTempInPool = 'Gas'
                } else if (response.result.resultInPool[j].TxFrom === '0000000000000000000000000000000000000000') {
                  moneyValue = '- ' + response.result.resultInPool[j].Value
                  walletAddressTempInPool = 'Mined'
                } else {
                  moneyValue = '- ' + response.result.resultInPool[j].Value
                  walletAddressTempInPool = `0x${response.result.resultInPool[j].TxTo}`
                }
   
                walletList.push({
                  id: response.result.resultInPool[j].TxHash,
                  blockNumber: 'Not in Block yet',
                  blockHash: '',
                  listAddress: walletAddressTempInPool,
                  listFrom: response.result.resultInPool[j].TxFrom,
                  listTo: response.result.resultInPool[j].TxTo,
                  listTime: WalletsHandler.formatDate(moment(response.result.resultInPool[j].TimeStamp).format('YYYY/MM/DD HH:mm:ss'), new Date().getTimezoneOffset()),
                  listMoney: moneyValue,
                  listUnit: 'SEN',
                  listMinerCost: response.result.resultInPool[j].TxFee,
                  listState: 'Packed'
                })
              }
            }
            if (response.result.resultInChain) {
              for (let i = 0; i < response.result.resultInChain.length; i++) {
                if (response.result.resultInChain[i].TxTo === walletAddress) {
                  moneyValue = '+ ' + response.result.resultInChain[i].Value
                  walletAddressTempInChain = response.result.resultInChain[i].TxFrom
                } else if (response.result.resultInChain[i].TxTo === '0000000000000000000000000000000000000000') {
                  moneyValue = '- ' + response.result.resultInChain[i].Value
                  walletAddressTempInChain = 'Gas'
                } else if (response.result.resultInChain[i].TxFrom === '0000000000000000000000000000000000000000') {
                  moneyValue = '- ' + response.result.resultInChain[i].Value
                  walletAddressTempInChain = 'Mined'
                } else {
                  moneyValue = '- ' + response.result.resultInChain[i].Value
                  walletAddressTempInChain = `0x${response.result.resultInChain[i].TxTo}`
                }
                walletList.push({
                  id: response.result.resultInChain[i].TxHash,
                  blockNumber: response.result.resultInChain[i].BlockNumber,
                  blockHash: `0x${response.result.resultInChain[i].BlockHash}`,
                  listAddress: walletAddressTempInChain,
                  listFrom: response.result.resultInChain[i].TxFrom,
                  listTo: response.result.resultInChain[i].TxTo,
                  listTime: WalletsHandler.formatDate(moment(response.result.resultInChain[i].TimeStamp).format('YYYY/MM/DD HH:mm:ss'), new Date().getTimezoneOffset()),
                  listMoney: moneyValue,
                  listUnit: 'SEN',
                  listMinerCost: response.result.resultInChain[i].TxFee,
                  listState: response.result.resultInChain[i].TxFrom === '0000000000000000000000000000000000000000' ? 'Mining' : 'Successful'
                })
              }
            }
            fnFillWalletList(walletList)
          })
        })
      },

      getWalletTransactions: function (walletAddress, fnFillWalletList) {
        this._getTransactions(this.client, 'SEC', walletAddress, fnFillWalletList)
      },
      getWalletTransactionsSEN: function (walletAddress, fnFillWalletList) {
        this._getTransactions(this.clientSEN, 'SEN', walletAddress, fnFillWalletList)
      },
      getWalletTransactionsBothChains: function (walletAddress, fnFillWalletList) {
        // this.getWalletTransactions(walletAddress, fnFillWalletListSEC)
        // this.getWalletTransactionsSEN(walletAddress, fnFillWalletListSEN)
        this._getTransactionsOfBothChains(walletAddress, fnFillWalletList)
      },

      _sendTransactions: function (client, walletAddress, transferData, fnAfterTransactionSEC, fnAfterTransactionSEN) {
        client.request('sec_sendRawTransaction', transferData, (err, response) => {
          if (err) return
          if (response.result.status === '1') {
            this.getWalletBalanceOfBothChains(walletAddress, fnAfterTransactionSEC, fnAfterTransactionSEN)
          }
        })
      },
      sendTransactions: function (walletAddress, transferData, fnAfterTransactionSEC, fnAfterTransactionSEN) {
        this._sendTransactions(this.client, walletAddress, transferData, fnAfterTransactionSEC, fnAfterTransactionSEN)
      },
      sendTransactionsSEN: function (walletAddress, transferData, fnAfterTransactionSEC, fnAfterTransactionSEN) {
        this._sendTransactions(this.clientSEN, walletAddress, transferData, fnAfterTransactionSEC, fnAfterTransactionSEN)
      },

      _chargeWallet: function (client, args, fnAfterCharging) {
        client.request('sec_freeCharge', args, fnAfterCharging)
      },
      chargeWalletSEC: function (args, fnAfterCharging) {
        this._chargeWallet(this.client, args, fnAfterCharging)
      },
      chargeWalletSEN: function (args, fnAfterCharging) {
        this._chargeWallet(this.clientSEN, args, fnAfterCharging)
      },
      chargeWalletOfBothChains: function (args, fnAfterChargingSEC, fnAfterChargingSEN) {
        this.chargeWalletSEC(args, fnAfterChargingSEC)
        this.chargeWalletSEN(args, fnAfterChargingSEN)
      },

      getNodeInfo: function (timeServer, fnAfterGetInfo) {
        this.client.request('sec_getNodeInfo', [timeServer], (err, response) => {
          if (err) return
          fnAfterGetInfo(response)
        })
      },
      getNodesTable: function (fnAfterGetNodes) {
        this.client.request('sec_getNodesTable', [], (err, response) => {
          if (err) return
          fnAfterGetNodes(response.result.NodesTable)
        })
      },
      getBlockHeight: function (fnGetBlockHeight) {
        this.clientSEN.request('sec_getChainHeight', [], (err, response) => {
          if (err) return
          fnGetBlockHeight(response.result.ChainHeight)
        })
      },
      getLastBlock: function (height, fnGetLastBlock) {
        this.clientSEN.request('sec_getBlockByHeight', [height], (err, response) => {
          if (err) return
          if (response.result.blockInfo) {
            fnGetLastBlock(height, response.result.blockInfo)
          }
        })
      },
      getHeightAndLastBlock: function (fnGetBlock) {
        this.getBlockHeight((height) => {
          this.getLastBlock(height, (height, block) => {
            fnGetBlock(height, block)
          })
        })
      }
    }

    jsonRPC.client = jayson.http(`http://${externalServerAddress}:${externalServerPort}`)
    jsonRPC.clientSEN = jayson.http(`http://${externalServerAddress}:${externalServerPortSEN}`)

    Object.defineProperty(Vue.prototype, '$JsonRPCClient', {
      value: jsonRPC
    })
  }
}
