import jayson from 'jayson/lib/client'

class RPC {
  constructor () {
    this.externalServerAddress = '13.209.3.183'
    this.externalServerPort = '3002'
    this.localhostAddress = '127.0.0.1'
    this.localhostPort = '3002'

    this.client = jayson.http(`http://${this.externalServerAddress}:${this.externalServerPort}`)
  }

  switchToLocalHost () {
    this.client = jayson.http(`http://${this.localhostAddress}:${this.localhostPort}`)
  }

  switchToExternalServer () {
    this.client = jayson.http(`http://${this.externalServerAddress}:${this.externalServerPort}`)
  }

  getWalletTransactions (walletAddress, fnFillWalletList) {
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
            listAddress: walletAddressTempInPool === '0000000000000000000000000000000000000000' ? 'Mined' : `0x${walletAddressTempInPool}`,
            listFrom: response.result.resultInPool[j].TxFrom,
            listTo: response.result.resultInPool[j].TxTo,
            listTime: new Date(response.result.resultInPool[j].TimeStamp).toUTCString(),
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
            listAddress: walletAddressTempInChain === '0000000000000000000000000000000000000000' ? 'Mined' : `0x${walletAddressTempInChain}`,
            listFrom: response.result.resultInChain[i].TxFrom,
            listTo: response.result.resultInChain[i].TxTo,
            listTime: new Date(response.result.resultInChain[i].TimeStamp).toUTCString(),
            listMoney: moneyValue,
            listMinerCost: response.result.resultInChain[i].TxFee,
            listState: 'Successful'
          })
        }
      }
      fnFillWalletList(walletList)
    })
  }

  getWalletBalance (walletAddress, fnUpdateBalance) {
    this.client.request('sec_getBalance', [walletAddress], (err, response) => {
      if (err) return
      if (response.result.status === '1') {
        fnUpdateBalance(response.result.value)
      }
    })
  }

  sendTransactions (transferData, fnSendAfterTransaction) {
    this.client.request('sec_sendRawTransaction', transferData, (err, response) => {
      if (err) return
      if (response.result.status === '1') {
        fnSendAfterTransaction(response.result.txHash)
      }
    })
  }

  getTransactions (walletAddress, fnUpdateList) {
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
            listAddress: walletAddressTempInPool === '0000000000000000000000000000000000000000' ? 'Mined' : `0x${walletAddressTempInPool}`,
            listFrom: response.result.resultInPool[j].TxFrom,
            listTo: response.result.resultInPool[j].TxTo,
            listTime: new Date(response.result.resultInPool[j].TimeStamp).toUTCString(),
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
            listAddress: walletAddressTempInChain === '0000000000000000000000000000000000000000' ? 'Mined' : `0x${walletAddressTempInChain}`,
            listFrom: response.result.resultInChain[i].TxFrom,
            listTo: response.result.resultInChain[i].TxTo,
            listTime: new Date(response.result.resultInChain[i].TimeStamp).toUTCString(),
            listMoney: moneyValue,
            listMinerCost: response.result.resultInChain[i].TxFee,
            listState: 'Successful'
          })
        }
      }
    })
  }
}

export default RPC
