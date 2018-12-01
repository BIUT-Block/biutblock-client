<template>
  <v-content>
    <v-container grid-list-xs>
      <v-layout column>
        <v-layout row justify-center>
          <v-flex xs10>
            <v-card color="primary">
              <v-list two-line>
                <v-list-tile v-for="item in aDetails" :key="item.title" avatar>
                  <v-list-tile-avatar>
                    <v-icon :class="[item.iconClass]">{{ item.icon }}</v-icon>
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                    <v-list-tile-sub-title>{{ item.subtitle }}</v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-card>
          </v-flex>
        </v-layout>
      </v-layout>
    </v-container>
    <v-btn fab bottom right fixed dark color="red accent-3" @click= "navBack">
      <v-icon>chevron_left</v-icon>
    </v-btn>
  </v-content>
</template>


<script>
import Vue from "vue"
import Vuetify from "vuetify"
import "vuetify/dist/vuetify.min.css"
Vue.use(Vuetify, {
  iconfont: "mdi"
})

export default {
  name: "wallet-details",
  props: {
    walletaddress: String,
    walletbalance : String
  },
  data() {
    return {
        walletid: null,
        aDetails: [
          { icon: 'account_box', iconClass: 'grey lighten-1 white--text', title: 'Address', subtitle: '' },
          { icon: 'account_balance_wallet', iconClass: 'grey lighten-1 white--text', title: 'Balance', subtitle: '' },
          { icon: 'vpn_key', iconClass: 'grey lighten-1 white--text', title: 'Public Key', subtitle: '' },
          { icon: 'vpn_key', iconClass: 'grey lighten-1 white--text', title: 'Private Key', subtitle: '' }
        ]
    }
  },

  created() {
    let userToken = window.localStorage.getItem('userToken')
    console.log(this.$route.walletid)
    console.log(this.$route)
    this.walletid = this.$route.params.walletid
    this.$JsonRPCClient.client.request('getPublicKey', {token: userToken}, (err, response) => {
      this.aDetails[2].subtitle = response.result.publicKey
    })
    this.$JsonRPCClient.client.request('accountKey', {token: userToken}, (err, response) => {
      this.aDetails[3].subtitle = response.result.privateKey
    })
    this.$JsonRPCClient.client.request('getBalance', {token: userToken}, (err, response) => {
      if (err) {
        this.aDetails[1].subtitle = 'NAN'
      } else {
        this.aDetails[1].subtitle = response.result.userBalance
      }
    })

    this.aDetails[0].subtitle = this.walletid
    this.aDetails[1].subtitle = this.walletbalance
  },

  methods: {
    navBack() {
      this.$router.go(-1)
    }
  }
}
</script>

