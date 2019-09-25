const state = {
  wallets: {}
}

const getter = {
  wallets: state => state.wallets
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
      ownInvitationCode: wallet.invitationCode,
      mortgagePoolAddress: wallet.mortgagePoolAddress,
      mortgageValue: wallet.mortgageValue,
      ownPoolAddress: wallet.ownPoolAddress,
      role: wallet.role
    }
    console.log(state.wallets)
  },

  removeWallet (state, privateKey) {
    delete state.wallets[wallet.privateKey]
  }
}

const actions = {
  
}

export default {
  state,
  getter,
	mutations,
	actions
}