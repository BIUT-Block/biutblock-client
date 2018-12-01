<template>
  <div>
  <v-app>
      <v-content fill-height>
      <v-flex xs12 md12 sm12>
        <v-tabs
  color="primary"
  dark
  slider-color="yellow"
  centered
  height="80%"
>
  <v-tab ripple>
    Wallet
  </v-tab>
  <v-tab ripple>
    Send Fund
  </v-tab>
  <v-tab ripple>
    UserInfo
  </v-tab>
  <v-tab-item>
    <router-view></router-view>
  </v-tab-item>
  <v-tab-item>
    <send-fund :userID = "userID" :myWalletAddress = "walletAddress" :walletBalance = "walletBalance"></send-fund>
  </v-tab-item>
    <v-tab-item>
    <user-info :userName = "userName" :userID = "userID" :telefon = "telefon" :email = "email"></user-info>
  </v-tab-item>
</v-tabs>
      </v-flex>
      </v-content>
  </v-app>
  </div>
</template>

<script>
import Vue from 'vue'
import UserAccount from './UserAccount'
import SendFund from './SendFund'
import UserInfo from './UserInfo'
import Vuetify from "vuetify"
import "vuetify/dist/vuetify.min.css"

Vue.use(Vuetify, {
  iconfont: "mdi"
})

export default {
  name: "menu-header",
  components: {
    UserAccount,
    SendFund,
    UserInfo
  },
  data() {
    return {
      activeTab: 0,
      activeSubTab: 1,
      showBooks: false,
      userName: '',
      userID: '',
      telefon: '',
      email: '',
      walletAddress: '',
      walletBalance: ''
    }
  },
  created() {
    this.userID = this.$route.params.userID
    this.userName = this.$route.query.username
    this.email = this.$route.query.email
    this.telefon = this.$route.query.telefon
    this.walletAddress = this.$route.query.walletAddress
    this.walletBalance = this.$route.query.walletBalance
  },
  methods: {
  }
}
</script>

<style>
/* CSS */
</style>
