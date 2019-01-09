import jayson from 'jayson/lib/client'
import Telnet from 'telnet-client'
let connection = new Telnet()

export default {
  install: function (Vue, options) {
    let timeOut = 1500
    let externalServerAddress = '13.209.3.183'
    let externalServerPort = '3002'
    let localhostAddress = '127.0.0.1'
    let localhostPort = '3002'
    let localHostParam = {
      host: localhostAddress,
      port: localhostPort,
      shellPrompt: '/ # ',
      timeout: timeOut
    }
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
      }
    }

    jsonRPC.client = jayson.http(`http://${externalServerAddress}:${externalServerPort}`)

    Object.defineProperty(Vue.prototype, '$JsonRPCClient', {
      value: jsonRPC
    })
  }
}