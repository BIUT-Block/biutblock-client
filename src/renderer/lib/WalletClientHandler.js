import jayson from 'jayson/lib/client'
import RpcHandler from './rpc'

export default {
  install: function (Vue) {
    let rpc = new RpcHandler()

    let wallet = {
      _insertTransactionToStorage: function (transaction, txHash) {
        let transactions = JSON.parse(window.sessionStorage.getItem('transaction')) || []
        transaction[0].txHash = txHash
        transactions.push(transaction[0])
        window.sessionStorage.setItem('transaction', JSON.stringify(transactions))
      },

      _getTransactionFromStorage: function () {
        return JSON.parse(window.sessionStorage.getItem('transaction'))
      },

      sendTransactions: function (walletAddress, transferData, fnWalletBalance) {
        rpc.sendTransactions(walletAddress, transferData, (txHash) => {
          this._insertTransactionToStorage(transferData, txHash)
          rpc.getWalletBalance(walletAddress, fnWalletBalance)
        })
      },

      getTransactions: function (walletAddress) {
        //let localStorageTransactions = 
      }
    }

    Object.defineProperty(Vue.prototype, '$wallet', {
      value: wallet
    })
  }
}
