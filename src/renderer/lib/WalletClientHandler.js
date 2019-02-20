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

      _selectStorageTransaction: function (walletAddress) {
        let sessionStorageTransactions = window.sessionStorage.getItem('transaction') || '[]'
        let allTransactionsStorage = JSON.parse(sessionStorageTransactions)
        return allTransactionsStorage.filter(transaction => {
          return transaction.from === walletAddress
        })
      },

      _getTransactionNotExist: function (localSavedTrans, packedTrans, successTrans) {
        let allTransFromServer = []
        let notRepeatTransactions = []
        let isRepeat = false

        packedTrans.forEach((trans) => {
          allTransFromServer.push(trans)
        })
        successTrans.forEach((trans) => {
          allTransFromServer.push(trans)
        })

        for (let i = 0; i < localSavedTrans.length; i++) {
          for (let j = 0; j < allTransFromServer.length; j++) {
            if (localSavedTrans[i].txHash === allTransFromServer[j].TxHash) {
              isRepeat = true
              break
            } else {
              isRepeat = false
            }
          }
          if (!isRepeat) {
            notRepeatTransactions.push(localSavedTrans[i])
          }
        }

        return this._changeTransJsonFormatt(notRepeatTransactions)
      },

      _changeTransJsonFormatt: function (transactions) {
        let formattedTrans = []
        let tempTrans = {}
        for (let i = 0; i < transactions.length; i++) {
          tempTrans.TxHash = transactions[i].txHash
          tempTrans.TimeStamp = transactions[i].TimeStamp
          tempTrans.ContractAddress = transactions[i].ContractAddress
          tempTrans.GasLimit = transactions[i].gasLimit
          tempTrans.GasPrice = transactions[i].gasPrice
          tempTrans.GasUsedByTxn = ''
          tempTrans.InputData = transactions[i].inputData
          tempTrans.Nonce = '0'
          tempTrans.Signature = transactions[i].data
          tempTrans.TxFee = transactions[i].gas
          tempTrans.TxFrom = transactions[i].from
          tempTrans.TxTo = transactions[i].to
          tempTrans.TxHeight = 0
          tempTrans.TxReceiptStatus = 'pending'
          tempTrans.Value = transactions[i].value
          tempTrans.Version = '0.1'
          formattedTrans.push(tempTrans)
        }
        return formattedTrans
      },

      _getWalletList: function (walletAddress, excludedTransactions, packedTrans, successTrans) {
        let walletList = []
        let walletAddressTempInPool = ''
        let walletAddressTempInChain = ''
        let moneyValue = ''

        for (let k = 0; k < excludedTransactions.length; k++) {
          if (excludedTransactions[k].TxTo === walletAddress) {
            continue
          } else {
            moneyValue = '- ' + excludedTransactions[k].Value
            walletAddressTempInPool = excludedTransactions[k].TxTo
          }
          walletList.push({
            id: excludedTransactions[k].TxHash,
            blockNumber: 'Not in Block yet',
            listAddress: walletAddressTempInPool === '0000000000000000000000000000000000000000' ? 'Mined' : `0x${walletAddressTempInPool}`,
            listFrom: excludedTransactions[k].TxFrom,
            listTo: excludedTransactions[k].TxTo,
            listTime: new Date(excludedTransactions[k].TimeStamp).toUTCString(),
            listMoney: moneyValue,
            listMinerCost: excludedTransactions[k].TxFee,
            listState: 'Packed'
          })
        }

        for (let j = 0; j < packedTrans.length; j++) {
          if (packedTrans[j].TxTo === walletAddress) {
            continue
          } else {
            moneyValue = '- ' + packedTrans[j].Value
            walletAddressTempInPool = packedTrans[j].TxTo
          }
          walletList.push({
            id: packedTrans[j].TxHash,
            blockNumber: 'Not in Block yet',
            listAddress: walletAddressTempInPool === '0000000000000000000000000000000000000000' ? 'Mined' : `0x${walletAddressTempInPool}`,
            listFrom: packedTrans[j].TxFrom,
            listTo: packedTrans[j].TxTo,
            listTime: new Date(packedTrans[j].TimeStamp).toUTCString(),
            listMoney: moneyValue,
            listMinerCost: packedTrans[j].TxFee,
            listState: 'Packed'
          })
        }

        for (let i = 0; i < successTrans.length; i++) {
          if (successTrans[i].TxTo === walletAddress) {
            moneyValue = '+ ' + successTrans[i].Value
            walletAddressTempInChain = successTrans[i].TxFrom
          } else {
            moneyValue = '- ' + successTrans[i].Value
            walletAddressTempInChain = successTrans[i].TxTo
          }
          walletList.push({
            id: successTrans[i].TxHash,
            blockNumber: successTrans[i].BlockNumber,
            listAddress: walletAddressTempInChain === '0000000000000000000000000000000000000000' ? 'Mined' : `0x${walletAddressTempInChain}`,
            listFrom: successTrans[i].TxFrom,
            listTo: successTrans[i].TxTo,
            listTime: new Date(successTrans[i].TimeStamp).toUTCString(),
            listMoney: moneyValue,
            listMinerCost: successTrans[i].TxFee,
            listState: 'Successful'
          })
        }
        return walletList
      },

      sendTransactions: function (walletAddress, transferData, fnWalletBalance) {
        rpc.sendTransactions(transferData, (txHash) => {
          this._insertTransactionToStorage(transferData, txHash)
          rpc.getWalletBalance(walletAddress, fnWalletBalance)
        })
      },

      getTransactions: function (walletAddress, fnFillWalletList) {
        let walletTransactionInStorage = this._selectStorageTransaction(walletAddress)
        let excludedTransactions = []
        let walletList = []
        rpc.getWalletTransactions(walletAddress, (packedTrans, successTrans) => {
          excludedTransactions = this._getTransactionNotExist(walletTransactionInStorage, packedTrans, successTrans)
          walletList = this._getWalletList(walletAddress, excludedTransactions, packedTrans, successTrans)
          fnFillWalletList(walletList)
        })
      },

      switchToLocalHost: function () {
        rpc.switchToLocalHost()
      },

      switchToExternalServer: function () {
        rpc.switchToExternalServer()
      },

      getRpcClientInstance: function () {
        return rpc.client
      }

    }

    Object.defineProperty(Vue.prototype, '$WalletHandlerHandler', {
      value: wallet
    })
  }
}
