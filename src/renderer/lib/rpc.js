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
    this.client.request('sec_getTransactions', [walletAddress], (err, response) => {
      if (err) return
      fnFillWalletList(response.result.resultInPool, response.result.resultInChain)
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
}

export default RPC
