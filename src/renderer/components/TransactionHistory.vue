<template>
  <v-content>
    <v-container>
      <v-data-table :headers= "headers" :items= "transactions" class="elevation-1">
        <template slot="items" slot-scope="props">
          <td>{{ props.item.Value }}</td>
          <td class="text-xs-center">{{ props.item.TxFrom }}</td>
          <td class="text-xs-center">{{ props.item.TxTo }}</td>
          <td class="text-xs-center" v-bind:style = "{color: props.item.statusColor}">{{ props.item.Status }}</td>
        </template>
      </v-data-table>
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
  name: "transaction-history",
  props: {
    walletid: String
  },
  data() {
    return {
      headers: [
        { text: "Amount", sortable: false, value: "name"},
        { text: "From",value: "from" },
        { text: "To", value: "to" },
        { text: "Status", value: "status" }
      ],
      transactions: [],
      statusColor: null
    }
  },

  created() {
    let userToken = window.localStorage.getItem('userToken')
    let txHistory = window.localStorage.getItem('tokenTransactions')
    if (txHistory === null) {
      txHistory = []
    } else {
      txHistory = JSON.parse(txHistory)
    }
    this.$JsonRPCClient.client.request('getTokenTxStatusByTxHash', {token: userToken, TxHash: txHistory}, (err, response) => {
      for (let txInPool in response.result.transactionsInPool){
        response.result.transactionsInPool[txInPool].Status = 'pending'
        response.result.transactionsInPool[txInPool].statusColor = 'orange'
        this.transactions.push(response.result.transactionsInPool[txInPool])
      }
      for (let txInChain in response.result.transactionsInChain) {
        response.result.transactionsInChain[txInChain].Status = 'success'
        response.result.transactionsInChain[txInChain].statusColor = 'green'
        this.transactions.push(response.result.transactionsInChain[txInChain])
      }
    })
  },

  methods: {
    navBack() {
      this.$router.go(-1)
    }
  }
}
</script>

