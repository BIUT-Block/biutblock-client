import jayson from 'jayson/lib/client'

export default {
  install: function (Vue) {
    let wallet = {
      _insertTransactionToStorage: function (transaction, txHash) {
        let transactions = JSON.parse(window.sessionStorage.getItem('transaction')) || []
        transaction[0].txHash = txHash
        transactions.push(transaction[0])
        window.sessionStorage.setItem('transaction', JSON.stringify(transactions))
      }
    }

    Object.defineProperty(Vue.prototype, '$wallet', {
      value: wallet
    })
  }
}