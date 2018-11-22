<template>
<v-content>
      <v-container grid-list-xs>
        <v-layout column>
          <v-layout row v-for= "(wallet, item) in userWallets" :key= "item" justify-center>
            <v-flex xs10>
              <v-card color="primary">
                <v-list>
                    <v-list-group prepend-icon="local_activity" class="text-truncate" no-action>
                      <v-list-tile avatar slot="activator">
                        <v-list-tile-content>
                          <v-list-tile-title>Balance: {{walletBalance}}</v-list-tile-title>
                          <v-list-tile-sub-title>{{wallet.walletName}}</v-list-tile-sub-title>
                        </v-list-tile-content>                    
                      </v-list-tile>
                      <v-list-tile v-for= "(tile, i) in wallet.subListTiles" :key= "i" @click= "clicktransactions(tile, wallet, $event)">
                        <v-list-tile-title v-text= "tile[0]"></v-list-tile-title>
                        <v-list-tile-action v-if= "tile[1] === 'account_circle' "><v-icon dark color="blue">{{tile[1]}}</v-icon></v-list-tile-action>
                        <v-list-tile-action v-if= "tile[1] === 'history' "><v-icon dark color="green">{{tile[1]}}</v-icon></v-list-tile-action>
                        <v-list-tile-action v-if= "tile[1] === 'remove' "><v-icon dark color="red">{{tile[1]}}</v-icon></v-list-tile-action>
                      </v-list-tile>
                    </v-list-group>
                </v-list>
              </v-card>
            </v-flex>
          </v-layout>
        </v-layout>
      </v-container>
      <v-btn fab bottom right fixed dark color="red accent-3" @click= "userLogOut">
        <v-icon>chevron_left</v-icon>
      </v-btn>
      <v-btn  fab bottom left fixed dark color="indigo" @click= "addNewWallet">
          <v-icon dark>add</v-icon>
        </v-btn>
      <v-dialog v-model= "dialogProgress" persistent max-width="500px">   
        <v-card>
          <v-card-title>
            <span class="headline">Add Wallet</span>
          </v-card-title>
          <v-card-text>
            <div class="text-xs-center">
            <v-progress-circular :size="50" :width="7" color="purple" indeterminate></v-progress-circular>
            </div>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog v-model= "dialogSuccess" persistent max-width="500px">   
        <v-card>
          <v-card-title>
            <span class="headline">Add Success</span>
          </v-card-title>
          <v-card-text>
            <div class="text-xs-center">
              <v-textarea v-model="walletPrivateKey" auto-grow box label="Private Key" rows="1" readonly success></v-textarea>
              <v-textarea v-model="walletPublicKey" auto-grow box label="Pubilic Key" rows="1" readonly success></v-textarea>
              <v-textarea v-model="walletAdress" auto-grow box label="Wallet Adress" rows="1" readonly success></v-textarea>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn flat color= "primary" @click= "confirmAddWallet">Confirm</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model= "dialogError" persistent max-width="500px">   
        <v-card>
          <v-card-title>
            <span class="headline">Error</span>
          </v-card-title>
          <v-card-text>
            <div class="text-xs-center">
              <v-textarea v-model="errorMessage" auto-grow box label="Can't Add Wallet" rows="1" readonly error></v-textarea>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn flat color= "error" @click= "closeError">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
</v-content>

</template>

<script>
import Vue from "vue";
import Vuetify from "vuetify";
import {EventBus} from "../lib/EventBus.js"

Vue.use(Vuetify, {
  iconfont: "mdi"
});



export default {
  name: 'user-account',
  data: () => ({
    dialogProgress: false,
    dialogSuccess: false,
    dialogError: false,
    walletPrivateKey: '',
    walletPublicKey: '',
    walletBalance: '',
    walletAdress: '',
    errorMessage: '',
    userID: '',
    subListTiles: [
      ["Wallet Details", "account_circle"],
      ["Transaction History", "history"],
      ["Remove Wallet", "remove"]
    ],
    userWallets: []
  }),

  mounted() {
    EventBus.$on('updateUserBalance', function (userBalance) {
      this.walletBalance = this.walletBalance - userBalance
      console.log(userBalance)
    }.bind(this))
  },

  created() {
    this.userID = this.$route.params.userID
    this.walletBalance = this.$route.params.walletBalance
    this.userWallets.push({
      walletID: this.userID,
      walletName: `Wallet: ${this.$route.params.userAddress}`,
      walletBalance: `Balance: ${this.walletBalance}`,
      subListTiles: this.subListTiles
    })
  },

  computed: {
    iconColor() {
      return "red"
    }
  },

  methods: {
    clicktransactions(tile, wallet, event) {
      let walletID = wallet.walletID
      let walletName = wallet.walletName.split(': ')[1]
      let walletBalance = wallet.walletBalance.split(': ')[1]
      if (tile[0] === "Transaction History") {
       this.$router.push({name: "transaction-history", params: {walletid: walletID}})
      } else if (tile[0] === "Remove Wallet") {
        console.log("click" + index)
        this.userWallets.splice(index, 1)
      } else if (tile[0] === "Wallet Details") {
        this.$router.push({name: "wallet-details", params: {walletid: walletID}})
      }
    },
    userLogOut() {
      window.localStorage.removeItem('userToken')
      this.$router.go(-1);
    },
    addNewWallet() {
      this.dialogProgress = true
      setTimeout(() => {
        this.dialogProgress = false
        this.dialogError = true
      }, 100)
    },
    confirmAddWallet() {
      this.dialogSuccess = false
      this.dialogProgress = false
    },
    closeError() {
      this.dialogError = false
    }
  }
};
</script>