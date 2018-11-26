<template>
  <v-container>
  <v-content>
    <v-card>
    <v-card-title>
      <v-icon medium color="green" v-if="showCheck">check_circle</v-icon>
      <v-icon medium color="red" v-if="showCancel">cancel</v-icon>
      <v-icon medium color="black" v-if="showPending">loop</v-icon>
      <v-spacer></v-spacer>
      <h4>交易详情</h4>
    </v-card-title>
    <v-divider></v-divider>
    <v-list dense>
      <v-list-tile>
        <v-list-tile-content>交易号:</v-list-tile-content>
        <v-list-tile-content class="align-end">{{txHash}}</v-list-tile-content>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-content>区块:</v-list-tile-content>
        <v-list-tile-content class="align-end">{{blockHeight}}</v-list-tile-content>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-content>创建时间:</v-list-tile-content>
        <v-list-tile-content class="align-end">{{timeStamp}}</v-list-tile-content>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-content>收款方:</v-list-tile-content>
        <v-list-tile-content class="align-end">{{txTo}}</v-list-tile-content>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-content>发款方:</v-list-tile-content>
        <v-list-tile-content class="align-end">{{txFrom}}</v-list-tile-content>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-content>矿工费用:</v-list-tile-content>
        <v-list-tile-content class="align-end">{{fee}}</v-list-tile-content>
      </v-list-tile>
      </v-list>

      <v-card-actions>
        <v-btn flat color="orange">点击查看更详细信息</v-btn>
      </v-card-actions>
    </v-card>

    <v-btn fab bottom right fixed dark color="red accent-3" @click= "navBack">
      <v-icon>chevron_left</v-icon>
    </v-btn>
  </v-content>
  </v-container>
</template>

<script>
  import Vue from 'vue'
  import Vuetify from "vuetify"

  Vue.use(Vuetify, {
    iconfont: "mdi"
  })

  export default {
    name: 'transaction-detail',
    data() {
      return {
        status: '',
        txHash: '',
        blockHeight: '',
        timeStamp: '',
        txFrom: '',
        txTo: '',
        fee: '',
        showCheck: false,
        showCancel: false,
        showPending: false
      }
    },
    created() {
      let utcTime = ''
      this.txHash = this.$route.query.txHash
      this.blockHeight = this.$route.query.blockHeight
      this.timeStamp = new Date(this.$route.query.timeStamp).toUTCString()
      this.txFrom = this.$route.query.txFrom
      this.txTo = this.$route.query.txTo
      this.fee = this.$route.query.fee

      switch(this.$route.query.status) {
        case 'success':
          this.showCheck = true
          break
        case 'pending':
          this.showPending = true
          break
        case 'error':
          this.showCancel = true
          break
      }
    },
    methods: {
      navBack() {
        this.$router.go(-1)
      }
    }
  }
</script>