class BufferHandler {
  constructor () {}

  insertTransaction (transaction, txHash) {
    let transactions = JSON.parse(window.sessionStorage.getItem('transaction')) || []
    transaction[0].txHash = txHash
    transactions.push(transaction[0])
    window.sessionStorage.setItem('transaction', JSON.stringify(transactions))
  }

  selectPackedTransactions (walletAddress) {
    let transactions = JSON.parse(window.sessionStorage.getItem('transaction'))
    let selectedTransactions = !transactions ? [] : transactions.filter((transaction) => {
      return transaction.from === walletAddress
    })
    return selectedTransactions
  }

  filterOutPackedTransactions (selectedTransactions, transactionsInChain) {
    let packedTransactions = []
    for (let i = 0; i < selectedTransactions.length; i++) {
      for (let j = 0; j < transactionsInChain.length; j++) {
        if (selectedTransactions[i].txHash !== transactionsInChain[j].TxHash) {
          packedTransactions.push({
            timestamp: selectedTransactions[i].timestamp,
            from: selectedTransactions[i].from,
            to: selectedTransactions[i].to,
            value: selectedTransactions[i].value,
            contractAddress: '',
            gasLimit: selectedTransactions[i].gasLimit,
            gas: selectedTransactions[i].gas,
            gasPrice: selectedTransactions[i].gasPrice,
            data: selectedTransactions[i].data,
            inputData: selectedTransactions[i].inputData
          })
        }
      }
    }
    return packedTransactions
  }
}

module.exports = BufferHandler
