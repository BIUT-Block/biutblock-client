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
                    <v-list-tile-sub-title>{{ infoLoad(item.title) }}</v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-card>
          </v-flex>
        </v-layout>
      </v-layout>
    </v-container>
    <v-btn fab bottom right fixed dark color="red accent-3" @click= "userLogOut">
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
  name: "user-info",
  props: ['userName', 'userID', 'telefon', 'email'],
  data() {
    return {
        aDetails: [
          { icon: 'perm_identity', iconClass: 'grey lighten-1 white--text', title: 'Account Name', subtitle: '' },
          { icon: 'security', iconClass: 'grey lighten-1 white--text', title: 'UserID', subtitle: '' },
          { icon: 'phone', iconClass: 'grey lighten-1 white--text', title: 'Telephone', subtitle: '' },
          { icon: 'email', iconClass: 'grey lighten-1 white--text', title: 'Email', subtitle: '' }
        ]
    }
  },
  computed: {   

  },
  created() {

  },

  methods: {
    userLogOut() {
      window.localStorage.removeItem('userToken')
      this.$router.go(-2);
    },
    infoLoad (title) {
      var oMap = {
        'Account Name': this.userName,
        'UserID': this.userID,
        'Telephone': this.telefon,
        'Email': this.email 
      }
      return oMap[title]
    }
  }
}
</script>

