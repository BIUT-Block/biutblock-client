import jayson from 'jayson/lib/client'
import WalletsHandler from './WalletsHandler'
import BufferHandler from './BufferHandler'

const moment = require('moment-timezone')
const fs = require('fs')

let sourceCode = 'ZnVuY3Rpb24gdHJhbnNmZXIoYWRkcmVzcywgYW1vdW50KSB7CiAgICB2YXIgdHJhbnNmZXJGbGFnID0gZmFsc2UKICAgIGlmKGFtb3VudD4wKXsKICAgICAgICB0cmFuc2ZlckZsYWcgPSB0cnVlCiAgICB9CiAgICByZXR1cm4geydBZGRyZXNzJzogYWRkcmVzcywgJ0Ftb3VudCc6IGFtb3VudCwgJ1RyYW5zZmVyRmxhZyc6IHRyYW5zZmVyRmxhZ30KfQoKZnVuY3Rpb24gbG9jayhiZW5lZml0QWRkcmVzcywgYW1vdW50LCB0aW1lKXsKICAgIHZhciBsb2NrRmxhZyA9IGZhbHNlCiAgICBpZihhbW91bnQ+MCl7CiAgICAgICAgbG9ja0ZsYWcgPSB0cnVlCiAgICB9CiAgICByZXR1cm4geydBZGRyZXNzJzogYmVuZWZpdEFkZHJlc3MsICdBbW91bnQnOiBhbW91bnQsICdUaW1lJzogdGltZSwgJ0xvY2tGbGFnJzogbG9ja0ZsYWd9Cn0KCmZ1bmN0aW9uIHJlbGVhc2VMb2NrKGJlbmVmaXRBZGRyZXNzLCBhbW91bnQpewogICAgdmFyIHJlbGVhc2VMb2NrRmxhZyA9IGZhbHNlCiAgICBpZihhbW91bnQ+MCl7CiAgICAgICAgcmVsZWFzZUxvY2tGbGFnID0gdHJ1ZQogICAgfQogICAgcmV0dXJuIHsnQWRkcmVzcyc6IGJlbmVmaXRBZGRyZXNzLCAnQW1vdW50JzogYW1vdW50LCAnUmVsZWFzZUxvY2tGbGFnJzogcmVsZWFzZUxvY2tGbGFnfQp9'

export default {
  install: function (Vue, options) {
    let externalServerAddress = 'scan.biut.io'
    let externalServerAddressTest = 'test.biut.io'
    let externalServerPort = '3002'
    let externalServerPortSEN = '3003'
    let localhostAddress = '127.0.0.1'
    let localhostPort = '3002'
    let localhostPortSEN = '3003'

    let jsonRPC = {
      target: '',
      client: '',
      localClient: '',
      clientSEN: '',
      switchToLocalHost: function () {
        this.client = jayson.http(`http://${localhostAddress}:${localhostPort}`)
        this.clientSEN = jayson.http(`http://${localhostAddress}:${localhostPortSEN}`)
      },
      switchToExternalServer: function () {
        //let isTestEnv = window.localStorage.getItem('secTest')
        //if (isTestEnv === 'true') {
          // process.env.netType = 'test'
          // this.client = jayson.http(`http://${externalServerAddressTest}:${externalServerPort}`)
          // this.clientSEN = jayson.http(`http://${externalServerAddressTest}:${externalServerPortSEN}`)
        //} else {
         process.env.netType = 'main'
         this.client = jayson.http(`http://${externalServerAddress}:${externalServerPort}`)
         this.clientSEN = jayson.http(`http://${externalServerAddress}:${externalServerPortSEN}`)
       // }
      },

      _getBalance: function (client, walletAddress, tokenName, fnUpdateBalance) {
        client.request('sec_getBalance', [walletAddress, tokenName], (err, response) => {
          if (err) return
          if (response.result.status === '1') {
            fnUpdateBalance(response.result.value)
          }
        })
      },
      getWalletBalance: function (walletAddress, tokenName, fnUpdateBalance) {
        this._getBalance(this.client, walletAddress, tokenName, fnUpdateBalance)
      },
      getWalletBalanceSEN: function (walletAddress, tokenName, fnUpdateBalance) {
        this._getBalance(this.clientSEN, walletAddress, tokenName, fnUpdateBalance)
      },
      getWalletBalanceOfBothChains: function (walletAddress, fnUpdateBalanceSEC, fnUpdateBalanceSEN) {
        this.getWalletBalance(walletAddress, 'SEC', fnUpdateBalanceSEC)
        this.getWalletBalanceSEN(walletAddress, 'SEN', fnUpdateBalanceSEN)
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
              if (response.result.resultInPool[j].TxTo === walletAddress && response.result.resultInPool[j].Value !== '0' && response.result.resultInPool[j].TxFrom !== '0000000000000000000000000000000000000000') {
                continue
              } else if (response.result.resultInPool[j].TxTo === '0000000000000000000000000000000000000000') {
                moneyValue = '- ' + response.result.resultInPool[j].Value
                walletAddressTempInPool = 'Gas'
              } else if (response.result.resultInPool[j].TxFrom === '0000000000000000000000000000000000000000' && response.result.resultInPool[j].Value !== '0') {
                moneyValue = '+ ' + response.result.resultInPool[j].Value
                walletAddressTempInPool = 'Mined'
              } else if (response.result.resultInPool[j].TxFrom === '0000000000000000000000000000000000000000' && response.result.resultInPool[j].Value === '0') {
                continue
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
                listInputData: '',
                listMinerCost: response.result.resultInPool[j].TxFee,
                listState: 'Packed'
              })
            }
          }
          if (response.result.resultInChain) {
            for (let i = 0; i < response.result.resultInChain.length; i++) {
              if (response.result.resultInChain[i].TxTo === walletAddress && response.result.resultInChain[i].Value !== '0' && response.result.resultInChain[i].TxFrom !== '0000000000000000000000000000000000000000') {
                moneyValue = '+ ' + response.result.resultInChain[i].Value
                walletAddressTempInChain = response.result.resultInChain[i].TxFrom
              } else if (response.result.resultInChain[i].TxTo === '0000000000000000000000000000000000000000') {
                moneyValue = '- ' + response.result.resultInChain[i].Value
                walletAddressTempInChain = 'Gas'
              } else if (response.result.resultInChain[i].TxFrom === '0000000000000000000000000000000000000000' && response.result.resultInChain[i].Value !== '0') {
                moneyValue = '+ ' + (response.result.resultInChain[i].Value.length > 10 && response.result.resultInChain[i].Value.indexOf('.') > 0) ? Number(response.result.resultInChain[i].Value).toFixed(8) : response.result.resultInChain[i].Value
                walletAddressTempInChain = 'Mined'
              } else if (response.result.resultInChain[i].TxFrom === '0000000000000000000000000000000000000000' && response.result.resultInChain[i].Value === '0') {
                continue
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
                listInputData: response.result.resultInChain[i].InputData,
                listState: response.result.resultInChain[i].TxFrom === '0000000000000000000000000000000000000000' ? 'Mining' : 'Successful'
              })
            }
          }
          fnFillWalletList(walletList)
        })
      },

      _getTransactionsOfBothChains: function (walletAddress, page, skip, fnFillWalletList) {
        let walletList = []
        let walletAddressTempInPool = ''
        let walletAddressTempInChain = ''
        let moneyValue = ''
        this.client.request('sec_getTransactions', [walletAddress, page, Math.floor(skip / 2)], (err, response) => {
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
                listUnit: 'BIUT',
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
                listUnit: 'BIUT',
                listMinerCost: response.result.resultInChain[i].TxFee,
                listState: walletAddressTempInChain === '0000000000000000000000000000000000000000' ? 'Mining' : 'Successful'
              })
            }
          }
          this.clientSEN.request('sec_getTransactions', [walletAddress, page, Math.floor(skip / 2)], (err, response) => {
            if (err) return
            if (response.result.resultInPool) {
              for (let j = 0; j < response.result.resultInPool.length; j++) {
                if (response.result.resultInPool[j].TxTo === walletAddress && response.result.resultInPool[j].Value !== '0' && response.result.resultInPool[j].TxFrom !== '0000000000000000000000000000000000000000') {
                  continue
                } else if (response.result.resultInPool[j].TxTo === '0000000000000000000000000000000000000000') {
                  moneyValue = '- ' + response.result.resultInPool[j].Value
                  walletAddressTempInPool = 'Gas'
                } else if (response.result.resultInPool[j].TxFrom === '0000000000000000000000000000000000000000' && response.result.resultInPool[j].Value !== '0') {
                  moneyValue = '+ ' + (response.result.resultInPool[j].Value.length > 10 && response.result.resultInPool[j].Value.indexOf('.') > 0) ? Number(response.result.resultInPool[j].Value).toFixed(8) : response.result.resultInPool[j].Value
                  walletAddressTempInPool = 'Mined'
                } else if (response.result.resultInPool[j].TxFrom === '0000000000000000000000000000000000000000' && response.result.resultInPool[j].Value === '0') {
                  continue
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
                  listUnit: 'BIU',
                  listInputData: '',
                  listMinerCost: response.result.resultInPool[j].TxFee,
                  listState: 'Packed'
                })
              }
            }
            if (response.result.resultInChain) {
              for (let i = 0; i < response.result.resultInChain.length; i++) {
                if (response.result.resultInChain[i].TxTo === walletAddress && response.result.resultInChain[i].Value !== '0' && response.result.resultInChain[i].TxFrom !== '0000000000000000000000000000000000000000') {
                  moneyValue = '+ ' + response.result.resultInChain[i].Value
                  walletAddressTempInChain = response.result.resultInChain[i].TxFrom
                } else if (response.result.resultInChain[i].TxTo === '0000000000000000000000000000000000000000') {
                  moneyValue = '- ' + response.result.resultInChain[i].Value
                  walletAddressTempInChain = 'Gas'
                } else if (response.result.resultInChain[i].TxFrom === '0000000000000000000000000000000000000000' && response.result.resultInChain[i].Value !== '0') {
                  moneyValue = '+ ' + (response.result.resultInChain[i].Value.length > 10 && response.result.resultInChain[i].Value.indexOf('.') > 0) ? Number(response.result.resultInChain[i].Value).toFixed(8) : response.result.resultInChain[i].Value
                  walletAddressTempInChain = 'Mined'
                } else if (response.result.resultInChain[i].TxFrom === '0000000000000000000000000000000000000000' && response.result.resultInChain[i].Value === '0') {
                  continue
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
                  listUnit: 'BIU',
                  listMinerCost: response.result.resultInChain[i].TxFee,
                  listInputData: response.result.resultInChain[i].InputData,
                  listState: response.result.resultInChain[i].TxFrom === '0000000000000000000000000000000000000000' ? 'Mining' : 'Successful'
                })
              }
            }
            fnFillWalletList(walletList)
          })
        })
      },

      getWalletTransactions: function (walletAddress, fnFillWalletList) {
        this._getTransactions(this.client, 'BIUT', walletAddress, fnFillWalletList)
      },
      getWalletTransactionsSEN: function (walletAddress, fnFillWalletList) {
        this._getTransactions(this.clientSEN, 'BIU', walletAddress, fnFillWalletList)
      },
      getWalletTransactionsBothChains: function (walletAddress, page, skip, fnFillWalletList) {
        // this.getWalletTransactions(walletAddress, fnFillWalletListSEC)
        // this.getWalletTransactionsSEN(walletAddress, fnFillWalletListSEN)
        this._getTransactionsOfBothChains(walletAddress, page, skip, fnFillWalletList)
      },

      /** 获取挖矿收益 */
      getMiningTransactions: function (params, fnFillWalletList) {
        this.clientSEN.request('sec_getMiningTransactions', params, (err, response) => {
          let walletList = []
          let walletAddressTempInChain = ''
          let moneyValue = ''
          if (response.result.resultInChain) {
            for (let i = 0; i < response.result.resultInChain.length; i++) {
              if (response.result.resultInChain[i].TxTo === params[0] && response.result.resultInChain[i].Value !== '0' && response.result.resultInChain[i].TxFrom !== '0000000000000000000000000000000000000000') {
                moneyValue = '+ ' + response.result.resultInChain[i].Value
                walletAddressTempInChain = response.result.resultInChain[i].TxFrom
              } else if (response.result.resultInChain[i].TxTo === '0000000000000000000000000000000000000000') {
                moneyValue = '- ' + response.result.resultInChain[i].Value
                walletAddressTempInChain = 'Gas'
              } else if (response.result.resultInChain[i].TxFrom === '0000000000000000000000000000000000000000' && response.result.resultInChain[i].Value !== '0') {
                moneyValue = '+ ' + (response.result.resultInChain[i].Value.length > 10 && response.result.resultInChain[i].Value.indexOf('.') > 0) ? Number(response.result.resultInChain[i].Value).toFixed(8) : response.result.resultInChain[i].Value
                walletAddressTempInChain = 'Mined'
              } else if (response.result.resultInChain[i].TxFrom === '0000000000000000000000000000000000000000' && response.result.resultInChain[i].Value === '0') {
                continue
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
                listUnit: 'BIU',
                listMinerCost: response.result.resultInChain[i].TxFee,
                listInputData: response.result.resultInChain[i].InputData,
                listState: response.result.resultInChain[i].TxFrom === '0000000000000000000000000000000000000000' ? 'Mining' : 'Successful'
              })
            }
          }
          fnFillWalletList(walletList)
        })
      },

      /** 获取所有挖矿历史记录 */

      _sendTransactions: function (client, walletAddress, transferData, fnAfterTransactionSEC, fnAfterTransactionSEN) {
        client.request('sec_sendRawTransaction', transferData, (err, response) => {
          if (err) return
          if (response.result.status === '1') {
            this.getWalletBalanceOfBothChains(walletAddress, fnAfterTransactionSEC, fnAfterTransactionSEN)
          }
        })
      },
      sendTransactions: function (walletAddress, privateKey, transferData, fnAfterTransactionSEC, fnAfterTransactionSEN) {
        this.getNonce(walletAddress, (nonce) => {
          transferData.nonce = nonce
          let signedTransfer = WalletsHandler.encryptTransaction(privateKey, transferData)
          this._sendTransactions(this.client, walletAddress, signedTransfer, fnAfterTransactionSEC, fnAfterTransactionSEN)
        })
      },
      sendTransactionsSEN: function (walletAddress, privateKey, transferData, fnAfterTransactionSEC, fnAfterTransactionSEN) {
        this.getNonce(walletAddress, (nonce) => {
          transferData.nonce = nonce
          let signedTransfer = WalletsHandler.encryptTransaction(privateKey, transferData)
          this._sendTransactions(this.clientSEN, walletAddress, signedTransfer, fnAfterTransactionSEC, fnAfterTransactionSEN)
        })
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
      getWalletTotalReward: function (fnAfterGetReward) {
        this.clientSEN.request('sec_getTotalReward', [], (err, response) => {
          if (err) return
          fnAfterGetReward(response.result.info)
        })
      },
      getHeightAndLastBlock: function (fnGetBlock) {
        this.getBlockHeight((height) => {
          this.getLastBlock(height, (height, block) => {
            fnGetBlock(height, block)
          })
        })
      },
      getSyncStatus: function (fnSECSyncStatus) {
        this._getSECSyncStatus(fnSECSyncStatus)
        // this._getSENSyncStatus(fnSENSyncStatus)
      },
      _getSECSyncStatus: function (fnSECSyncStatus) {
        jayson.http(`http://${localhostAddress}:${localhostPort}`).request('sec_getSyncInfo', [], (err, response) => {
          if (err) return
          fnSECSyncStatus(response)
        })
      },
      _getSENSyncStatus: function (fnSENSyncStatus) {
        jayson.http(`http://${localhostAddress}:${localhostPortSEN}`).request('sec_getSyncInfo', [], (err, response) => {
          if (err) return
          fnSENSyncStatus(response)
        })
      },
      checkRlpConnections: function (fnCheckPeers) {
        this.localClient.request('sec_getRLPPeersNumber', [], (err, response) => {
          if (err){
            fnCheckPeers(err, null)
          } else {
            fnCheckPeers(null, response)
          }
        })
      },

      getNonce: function (walletAddress, fnAfterGetNonce) {
        this.client.request('sec_getNonce', [walletAddress], (err, response) => {
          if (err) return
          fnAfterGetNonce(response.result.Nonce)
        })
      },

      getNoncePromise: function (walletAddress) {
        return new Promise((resolve, reject) => {
          this.client.request('sec_getNonce', [walletAddress], (err, response) => {
            if (err) {
              reject(err)
            } else {
              resolve(response.result.Nonce)
            }
          })
        })
      },

      getTimeLock: function (walletAddress, contractAddress, fnAfterGet) {
        let history = []
        this.client.request('sec_getTimeLock', [walletAddress, contractAddress], (err, response) => {
          if (err) return
          for (let i = 0; i < response.result.timeLock.length; i++) {
            let unlockTime = WalletsHandler.formatDate(moment(response.result.timeLock[i].unlocktime).format('YYYY/MM/DD HH:mm:ss'), new Date().getTimezoneOffset())
            let lockTime = WalletsHandler.formatDate(moment(response.result.timeLock[i].locktime).format('YYYY/MM/DD HH:mm:ss'), new Date().getTimezoneOffset())
            history.push({
              lockTime: lockTime,
              unlockTime: unlockTime,
              lockMoney: response.result.timeLock[i].amount
            })
          }
          fnAfterGet(history)
        })
      },

      getContractInfo: function (contractAddress, fnAfterGetInfo) {
        this.client.request('sec_getContractInfo', [contractAddress], (err, response) => {
          if (err) return
          fnAfterGetInfo(response.result.contractInfo)
        })
      },

      getContractInfoSync: function (contractAddress) {
        return new Promise((resolve, reject) => {
          this.client.request('sec_getContractInfo', [contractAddress], (err, response) => {
            if (err) {
              reject(err)
            } else {
              resolve(response.result.contractInfo)
            }
          })
        })
      },

      createContractTransaction: function (walletAddress, privateKey, contractName, transfer, fnAfterCreate) {
        // let sourceCode = fs.readFileSync('./smart_contract_test.js').toString('base64')
        let contractAddress = WalletsHandler.generateContractAddress(privateKey)
        let tokenName = `SEC-${contractAddress}-${contractName}`
        transfer.inputData = JSON.stringify({
          sourceCode: sourceCode,
          totalSupply: 100000000,
          tokenName: tokenName
        })
        transfer.sendToAddress = contractAddress
        this.getNonce(walletAddress, (nonce) => {
          transfer.nonce = nonce
          let signedTransfer = WalletsHandler.encryptTransaction(privateKey, transfer)
          this.client.request('sec_createContractTransaction', [signedTransfer[0], tokenName], (err, response) => {
            if (err) return
            fnAfterCreate(contractAddress, response)
          })
        })
      },

      createContractTransactionPromise: function (privateKey, contractName, transfer) {
        return new Promise((resolve, reject) => {
          let contractAddress = WalletsHandler.generateContractAddress(privateKey)
          let tokenName = `SEC-${contractAddress}-${contractName}`
          transfer.inputData = JSON.stringify({
            sourceCode: sourceCode,
            totalSupply: 100000000,
            tokenName: tokenName
          })
          transfer.sendToAddress = contractAddress
          let signedTransfer = WalletsHandler.encryptTransaction(privateKey, transfer)
          this.client.request('sec_createContractTransaction', [signedTransfer[0], tokenName], (err, response) => {
            if (err) {
              reject(err)
            } else {
              resolve(contractAddress)
            }
          })
        })
      },

      sendContractTransaction: function (walletAddress, privateKey, lockTime, transfer, fnAfterContract) {
        let sourceCode = `lock( "${walletAddress}", ${transfer.amount}, ${lockTime})`.toString('base64')
        sourceCode = JSON.stringify({callCode: Buffer.from(sourceCode).toString('base64')})
        transfer.inputData = sourceCode
        this.getNonce(walletAddress, (nonce) => {
          transfer.nonce = nonce
          let signedTransfer = WalletsHandler.encryptTransaction(privateKey, transfer)
          this.client.request('sec_sendContractTransaction', signedTransfer, (err, response) => {
            if (err) return
            fnAfterContract(response)
          })
        })
      },

      releaseContractLock: function (walletAddress, privateKey, transfer, fnAfterRelease) {
        let sourceCode = `releaseLock("${walletAddress}", ${transfer.value})`.toString('base64')
        sourceCode = JSON.stringify({callCode: Buffer.from(sourceCode).toString('base64')})
        transfer.inputData = sourceCode

        this.getNonce(walletAddress, (nonce) => {
          transfer.nonce = nonce
          let signedTransfer = WalletsHandler.encryptTransaction(privateKey, transfer)
          this.client.request('sec_sendContractTransaction', signedTransfer, (err, response) => {
            if (err) return
            fnAfterRelease(response)
          })
        })
      },

      getCreatorContract: function (walletAddress, fnAfterGetContract) {
        this.client.request('sec_getCreatorContract', [walletAddress], (err, response) => {
          if (err) return
          fnAfterGetContract(response.result.contractAddress)
        })
      },

      isTestNetwork: function () {
        if (process.env.netType === 'test') {
          return true
        } else {
          return false
        }
      }
    }

    console.log('Start jayson client with main network')
    process.env.netType = 'main'
    jsonRPC.client = jayson.http(`http://${externalServerAddress}:${externalServerPort}`)
    jsonRPC.clientSEN = jayson.http(`http://${externalServerAddress}:${externalServerPortSEN}`)
    jsonRPC.localClient = jayson.http(`http://${localhostAddress}:${localhostPort}`)
    // if (process.env.netType === 'test') {
    //   console.log('Start jayson client with test network')
    //   process.env.netType = 'test'
    //   jsonRPC.client = jayson.http(`http://${externalServerAddressTest}:${externalServerPort}`)
    //   jsonRPC.clientSEN = jayson.http(`http://${externalServerAddressTest}:${externalServerPortSEN}`)
    // } else {

    // }

    Object.defineProperty(Vue.prototype, '$JsonRPCClient', {
      value: jsonRPC
    })
  }
}
