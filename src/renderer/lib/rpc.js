import jayson from 'jayson/lib/client'

class RPC {
  constructor () {
    this.externalServerAddress = '13.209.3.183'
    this.externalServerPort = '3002'
    this.localhostAddress = '127.0.0.1'
    this.localhostPort = '3002'

    this.client = jayson.http(`http://${externalServerAddress}:${externalServerPort}`)
  }

  switchToLocalHost () {
    this.client = jayson.http(`http://${localhostAddress}:${localhostPort}`)
  }

  switchToExternalServer () {
    this.client = jayson.http(`http://${externalServerAddress}:${externalServerPort}`)
  }

  sendTransactions (walletAddress, transferData, fnAfterTransaction) {
    this.client.request('sec_sendRawTransaction', transferData, (err, response) => {
      if (err) return
      if (response.result.status === '1') {
        this.getWalletBalance(walletAddress, fnAfterTransaction)
      }
    })
  }

  
}

export default RPC
