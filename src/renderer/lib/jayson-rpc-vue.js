import jayson from 'jayson/lib/client'
import Telnet from 'telnet-client'

let connection = new Telnet()

export default {
  install: function (Vue, options) {
    let jsonRPC = {
      target: '',
      client: ''
    }

    let timeOut = 1500
    let externalServerAddress = '35.158.171.46'
    let externalServerPort = '3000'
    let localhostAddress = '127.0.0.1'
    let localhostPort = '3000'
    let localHostParam = {
      host: localhostAddress,
      port: localhostPort,
      shellPrompt: '/ # ',
      timeout: timeOut
    }

    let externalServerParam = {
      host: externalServerAddress,
      port: externalServerPort,
      shellPrompt: '/ # ',
      timeout: timeOut
    }

    connection.connect(localHostParam)

    connection.on('connect', () => {
      jsonRPC.client = jayson.http(`http://${localhostAddress}:${localhostPort}`)
    })

    connection.on('error', (err) => {
      console.log(err)
      jsonRPC.client = jayson.http(`http://${externalServerAddress}:${externalServerPort}`)
    })

    Object.defineProperty(Vue.prototype, '$JsonRPCClient', {value: jsonRPC})
  }
}
