import jayson from 'jayson/lib/client'
import WalletsHandler from './WalletsHandler'

export default {
  install: function (Vue, options) {
    let externalServerAddress = '54.250.166.137'
    let externalServerPort = '3002'
    let localhostAddress = '127.0.0.1'
    let localhostPort = '3002'

    let jsonRPC = {
      target: '',
      client: '',
      switchToLocalHost: function () {
        this.client = jayson.http(`http://${localhostAddress}:${localhostPort}`)
      },
      switchToExternalServer: function () {
        this.client = jayson.http(`http://${externalServerAddress}:${externalServerPort}`)
      },
      getAllWalletsBalance: function (walletsArray) {
        let walletsBalanceJS = {}
        for (let wallet of walletsArray) {
          this.client.request('sec_getBalance', [wallet.walletAddress], (err, response) => {
            if (err) {
              return false
            }
            if (response.result.status === 'false') {
              return false
            } else if (response.result.status === '1' || response.result.status === '0') {
              walletsBalanceJS[wallet.walletName] = response.result.value.toString()
            }
          })
        }
        return walletsBalanceJS
      },
      getWalletBalance: function (walletAddress, fnUpdateBalance) {
        this.client.request('sec_getBalance', [walletAddress], (err, response) => {
          if (err) return
          if (response.result.status === '1') {
            fnUpdateBalance(response.result.value)
          }
        })
      },
      getWalletTransactions: function (walletAddress, fnFillWalletList) {
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
                listTime: WalletsHandler.formatDate(new Date(response.result.resultInPool[j].TimeStamp), new Date().getTimezoneOffset()),
                listMoney: moneyValue,
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
                listTime: WalletsHandler.formatDate(new Date(response.result.resultInChain[i].TimeStamp), new Date().getTimezoneOffset()),
                listMoney: moneyValue,
                listMinerCost: response.result.resultInChain[i].TxFee,
                listState: 'Successful'
              })
            }
          }
          fnFillWalletList(walletList)
        })
      },
      sendTransactions: function (walletAddress, transferData, fnAfterTransaction) {
        this.client.request('sec_sendRawTransaction', transferData, (err, response) => {
          if (err) return
          if (response.result.status === '1') {
            this.getWalletBalance(walletAddress, fnAfterTransaction)
          }
        })
      },
      chargeWallet: function (args, fnAfterCharging) {
        this.client.request('sec_freeCharge', args, (err, response) => {
          if (err) return
          fnAfterCharging()
        })
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
        this.client.request('sec_getChainHeight', [], (err, response) => {
          if (err) return
          fnGetBlockHeight(response.result.ChainHeight)
        })
      }
    }

    jsonRPC.client = jayson.http(`http://${externalServerAddress}:${externalServerPort}`)

    Object.defineProperty(Vue.prototype, '$JsonRPCClient', {
      value: jsonRPC
    })
  }
}
