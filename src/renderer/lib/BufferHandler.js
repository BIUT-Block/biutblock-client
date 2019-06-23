class BufferHandler {
  constructor () {}

  insertTransaction (transaction, txHash) {
    let transactions = JSON.parse(window.sessionStorage.getItem('transaction')) || []
    transaction[0].txHash = txHash
    transactions.push(transaction[0])
    window.sessionStorage.setItem('transaction', JSON.stringify(transactions))
  }

  selectPackedTransactions (walletAddress) {
    let transactions
    if (window.sessionStorage.getItem('transaction')) {
      transactions = JSON.parse(window.sessionStorage.getItem('transaction'))
    } else {
      transactions = []
    }

    let selectedTransactions = !transactions ? [] : transactions.filter((transaction) => {
      return transaction.from === walletAddress
    })
    return selectedTransactions
  }

  filterOutPackedTransactions (selectedTransactions, transactionsInChain) {
    let packedTransactions = []
    if (transactionsInChain.length === 0) {
      if (selectedTransactions && selectedTransactions.length === 0) {
        selectedTransactions.forEach((trans) => {
          packedTransactions.push({
            timestamp: trans.timestamp,
            from: trans.from,
            to: trans.to,
            value: trans.value,
            contractAddress: '',
            gasLimit: trans.gasLimit,
            gas: trans.gas,
            gasPrice: trans.gasPrice,
            data: trans.data,
            inputData: trans.inputData,
            txHash: trans.txHash
          })
        })
      }
      // selectedTransactions = []
      // window.sessionStorage.setItem('transaction', JSON.stringify(selectedTransactions))
    } else {
      let packedTransHashArray = []
      let newTransStorage = []
      for (let i = 0; i < selectedTransactions.length; i++) {
        for (let j = 0; j < transactionsInChain.length; j++) {
          if (selectedTransactions[i].txHash !== transactionsInChain[j].TxHash) {
            packedTransHashArray.push(selectedTransactions[i].txHash)
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

      for (let i = 0; i < selectedTransactions.length; i++) {
        for (let j = 0; j < packedTransHashArray.length; j++) {
          if (selectedTransactions[i].txHash !== packedTransHashArray[j]) {
            newTransStorage.push(selectedTransactions[i])
          }
        }
      }
      if (newTransStorage.length !== 0) {
        window.sessionStorage.setItem('transaction', JSON.stringify(newTransStorage))
      }
    }
    return packedTransactions
  }
}

module.exports = BufferHandler
