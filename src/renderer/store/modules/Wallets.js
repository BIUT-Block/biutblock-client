function _checkValueFormat(value) {
  let splitValue = value.split("e-")
  if (splitValue.length > 1) {
    return Number(value).toFixed(Number(splitValue[1])).toString()
  } else {
    return Number(value).toString()
  }
}

const state = {
  wallets: {},
  walletsList: [],
  selectedPrivateKey: '',
  selectedWallet: {},
  netTotalReward: '-',
  chainHeight: '-',
  lastBlock: {}
}

const getters = {
  wallets: state => state.walletsList,
  selectedWallet: state => state.selectedWallet,
  walletName: state => state.selectedWallet.walletName,
  walletBalance: state => state.selectedWallet.walletBalance,
  availibleMoney: state => state.selectedWallet.availibleMoney,
  freezeMoney: state => state.selectedWallet.freezeMoney,
  walletBalanceSEN: state => state.selectedWallet.walletBalanceSEN,
  transactionList: state => state.selectedWallet.transactionHistory,
  transactionListPage: state => state.selectedWallet.transListPage,
  transactionListPageSize: state => state.selectedWallet.transListPageSize,

  miningWallet: state => state.wallets[state.walletsList[0].privateKey], // 挖矿钱包
  miningWalletBalance: state => state.wallets[state.walletsList[0].privateKey].walletBalance, // 挖矿钱包余额 
  miningWalletAvailibleMoney: state => state.wallets[state.walletsList[0].privateKey].availibleMoney, // 挖矿钱包可用余额
  miningWalletFreezeMoney: state => state.wallets[state.walletsList[0].privateKey].freezeMoney, // 挖矿钱包冻结
  miningWalletDigNumber: state => state.wallets[state.walletsList[0].privateKey].digNumber,
  miningWalletDigIncome: state => state.wallets[state.walletsList[0].privateKey].digIncome,
  miningWalletHistory: state => state.wallets[state.walletsList[0].privateKey].miningHistory,
  miningWalletHistoryAll: state => state.wallets[state.walletsList[0].privateKey].miningHistoryAll,
  miningWalletPageSize: sate => state.wallets[state.walletsList[0].privateKey].miningListPageSize,

  lastBlock: state => state.lastBlock,
  netTotalReward: state => state.netTotalReward,
  chainHeight: state => state.chainHeight
}

const mutations = {
  addWallet (state, wallet) {
    state.wallets[wallet.privateKey] = {
      walletName: wallet.walletName,
      privateKey: wallet.privateKey,
      publicKey: wallet.publicKey,
      walletAddress: wallet.walletAddress,
      englishWords: wallet.englishWords,
      invitationCode: wallet.invitationCode,
      ownInvitationCode: wallet.ownInvitationCode,
      mortgagePoolAddress: wallet.mortgagePoolAddress,
      mortgageValue: wallet.mortgageValue,
      ownPoolAddress: wallet.ownPoolAddress,
      role: wallet.role,
      walletBalance: '-',
      availibleMoney: '-',
      freezeMoney: '-',
      walletBalanceSEN: '-',
      transactionHistory: [],
      transListPage: 0,
      transListPageSize: 5,
      miningHistory: [],
      miningHistoryAll: [],
      digNumber: '-',
      digIncome: '-',
      miningListPage: 1,
      miningListPageSize: 7
    }
    state.walletsList.push({
      id: '01',
      name: wallet.walletName,
      address: `0x${wallet.walletAddress.substring(0, 6)}......${wallet.walletAddress.substring(32, 41)}`,
      privateKey: wallet.privateKey,
      publicKey: wallet.publicKey,
      walletAddress: wallet.walletAddress,
      englishWords: wallet.englishWords,
      invitationCode: wallet.invitationCode,
      ownInvitationCode: wallet.ownInvitationCode,
      mortgagePoolAddress: wallet.mortgagePoolAddress,
      mortgageValue: wallet.mortgageValue,
      ownPoolAddress: wallet.ownPoolAddress,
      role: wallet.role
    })
    state.selectedWallet = state.wallets[wallet.privateKey]
  },

  removeWallet (state, wallet) {
    delete state.wallets[wallet.privateKey]
    state.walletsList = state.walletsList.filter( item => item.walletAddress !== wallet.walletAddress)
    if (state.walletsList.length > 0) {
      state.selectedWallet = state.wallets[Object.keys(state.wallets)[0]] // set selected wallet to the first
    }
  },

  changeSelectedWallet (state, privateKey) {
    state.selectedPrivateKey = privateKey
    state.selectedWallet = state.wallets[privateKey]
  },

  updateWalletName (state, params) {
    state.selectedWallet.walletName = params.newName
    state.wallets[params.privateKey].walletName = params.newName
    state.walletsList.map(item => {
      if (item.privateKey === params.privateKey) {
        item.name = params.newName
      }
    })
  },

  updateWalletBalanceSEC (state, params) {
    if (state.selectedWallet.privateKey === params.privateKey) {     
      state.selectedWallet.walletBalance = _checkValueFormat(params.walletBalance) || state.selectedWallet.walletBalance
      state.selectedWallet.availibleMoney = _checkValueFormat(params.availibleMoney) || state.selectedWallet.availibleMoney
      state.selectedWallet.freezeMoney = _checkValueFormat(params.freezeMoney) || state.selectedWallet.freezeMoney
    } else {
      state.wallets[params.privateKey].walletBalance = _checkValueFormat(params.walletBalance) || state.wallets[params.privateKey].walletBalance
      state.wallets[params.privateKey].availibleMoney = _checkValueFormat(params.availibleMoney) || state.wallets[params.privateKey].availibleMoney
      state.wallets[params.privateKey].freezeMoney = _checkValueFormat(params.freezeMoney) || state.wallets[params.privateKey].freezeMoney
    }

  },

  updateWalletBalanceSEN (state, params) {
    if (state.selectedWallet.privateKey === params.privateKey) {
      state.selectedWallet.walletBalanceSEN = _checkValueFormat(params.walletBalanceSEN) || state.selectedWallet.walletBalanceSEN
    } else {
      state.wallets[params.privateKey].walletBalanceSEN = _checkValueFormat(params.walletBalanceSEN) || state.wallets[params.privateKey].walletBalanceSEN
    }
    
  },

  updateTransList (state, params) {
    if (state.selectedWallet.privateKey === params.privateKey) {
      params.trans.forEach(item => {
        state.selectedWallet.transactionHistory.push(item)
      })
    }
    // state.wallets[params.privateKey].transactionHistory = params.transHistory
  },

  updateMiningAmount (state, params) {
    if (state.selectedWallet.privateKey === params.privateKey) {
      state.selectedWallet.digNumber = params.digNumber
      state.selectedWallet.digIncome = params.digIncome
    } else {
      state.wallets[params.privateKey].digNumber = params.digNumber
      state.wallets[params.privateKey].digIncome = params.digIncome
    }
  },

  updateTransPage (state, params) {
    if (state.selectedWallet.privateKey === params.privateKey) {
      state.selectedWallet.transListPage = params.page
    }
    // state.wallets[params].transListPage = params.page
  },

  updateLastBlock (state, block) {
    state.lastBlock = block
  },

  updateChainHeight (state, height) {
    state.chainHeight = height
  },

  updateNetAllReward (state, reward) {
    state.netTotalReward = reward
  },

  updateMiningHistory (state, params) {
    if (state.selectedWallet.privateKey === params.privateKey) {
      state.selectedWallet.miningHistory = params.miningHistory
    } else {
      state.wallets[params.privateKey].miningHistory = params.miningHistory
    }
  },

  updateMiningHistoryAll (state, params) {
    if (state.selectedWallet.privateKey === params.privateKey) {
      state.selectedWallet.miningHistoryAll = params.miningHistory
    } else {
      state.wallets[params.privateKey].miningHistoryAll = params.miningHistory
    }
  },
  
  updateMiningListPageSize (state, params) {
    if (state.selectedWallet.privateKey === params.privateKey) {
      state.selectedWallet.miningListPageSize = params.pageSize
    } else {
      state.wallets[params.privateKey].miningListPageSize = params.pageSize
    }
  }
}

const actions = {
  
}

export default {
  state,
  getters,
	mutations,
	actions
}