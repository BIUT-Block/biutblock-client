<template>
  <v-app id="inspire">
    <v-content>
      <v-container fluid fill-height v-if= "!busy">
        <v-layout justify-center align-center>
          <v-flex xs12 sm10 md4>
            <v-card class="elevation-12">   
              <v-card-text>
                <v-form>
                  <v-text-field id="username" v-model = "username" prepend-icon="person" name="login" label="Login" type="text"></v-text-field>
                  <v-text-field id="password" v-model = "password" prepend-icon="lock" name="password" label="Password" type="password"></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-text v-if = "loginError">
                <v-alert :value="loginError" type="error" transition="scale-transition">
                  Password or username is false.
                </v-alert>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" v-on:click = "onLoginClick">Login</v-btn>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
                  <v-btn slot="activator" dark color="primary">Create Account</v-btn>
                  <v-card>
                    <v-toolbar dark color="primary">
                      <v-btn icon dark @click="dialog = false">
                        <v-icon>close</v-icon>
                      </v-btn>
                      <v-toolbar-title>Build your Account</v-toolbar-title>
                      <v-spacer></v-spacer>
                      <v-toolbar-items>
                        <v-btn dark flat @click.native="onCreateAccount">Create</v-btn>
                      </v-toolbar-items>
                    </v-toolbar>
                    <v-card-text>
                      <v-container grid-list-md>
                        <v-layout wrap>
                          <v-flex xs12>
                            <v-text-field v-model= "newUserAccount.userName" label="User Name" required></v-text-field>
                          </v-flex>
                          <v-flex xs12>
                            <v-text-field v-model= "newUserAccount.userPassword" label="Password" type="password" required></v-text-field>
                          </v-flex>
                          <v-flex xs12 sm6 md4>
                            <v-text-field v-model= "newUserAccount.userFirstName" label="Legal first name"></v-text-field>
                          </v-flex>
                          <v-flex xs12 sm6 md4>
                            <v-text-field v-model= "newUserAccount.userLastName" label="Legal last name"></v-text-field>
                          </v-flex>
                        </v-layout>       
                        <v-flex xs12>
                          <v-text-field v-model= "newUserAccount.userEmail" label="Email Adress" required></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                          <v-text-field v-model= "newUserAccount.userTelefon" label="Mobil" required></v-text-field>
                        </v-flex>
                      </v-container>
                      <v-divider></v-divider>
                      <v-flex v-if= "createAccountError">Create Account failed. The Account already exists</v-flex>
                    </v-card-text>
                  </v-card>
                </v-dialog>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
      <v-dialog persistent v-model= "busy" max-width= "200px">
        <v-card>
          <v-card-text>
            <div class="text-xs-center">
            <v-progress-circular :size="50" :width="7" color="purple" indeterminate></v-progress-circular>
            </div>
            </v-card-text>
        </v-card>
      </v-dialog>
    </v-content>
  </v-app>
</template>


<script>
import Vue from 'vue'

export default {
  data: () => ({
    dialog: false,
    busy: false,
    drawer: null,
    username: '',
    password: '',
    loginError: false,
    createAccountError: false,
    newUserAccount: {
      userName: '',
      userPassword: '',
      userFirstName: '',
      userLastName: '',
      userEmail: '',
      userTelefon: ''
    }
  }),

  created() {
    this.busy = true
    let token = window.localStorage.getItem('userToken')
    let decoded

    // setTimeout(() => {
    //   if (token){
    //     decoded = this.$JWT.verifyToken(token)
    //     if (decoded !== '' && decoded !== 'InvalidToken') {
    //         this._navToAccountDetail({
    //         userID: decoded.userID
    //       })
    //     }        
    //   }
    //   this.busy = false
    // }, 500);
    setTimeout(() => {
      if(token) {
      // this.$JsonRPCClient.client.request('userLoginWithToken', {token: token}, (err, response) => {
      //   if(err || response.result.status === 'InvalidToken') {
      //     this.busy = false
      //   } else {
      //     this.busy = false
      //     this._navToAccountDetail({
      //       userID: response.result.account.userID,
      //       username: response.result.account.username,
      //       email: response.result.account.email,
      //       telefon: response.result.account.telefon,
      //       publicKey: response.result.wallet.publicKey,
      //       walletAddress: response.result.wallet.addressString,
      //       walletBalance: response.result.wallet.balance
      //       })
      //     }
      //   })
      }
      this.busy = false
    }, 500)
    
  },

  methods: {
    onLoginClick: function(oEvent){
      if (this.username !== "" && this.password !== "") {
        this._userAuthRequest()
      }
    },

    _userAuthRequest: function(){
      this.$JsonRPCClient.client.request('userLogin', { account: this.username, password: this.password }, (err, response) => {
          console.log(response)
          if (err) {
            this.loginError = true
            return
          }
          if (response.result.status === 'success') {
            window.localStorage.setItem('userToken', response.result.account.token)         
            this._navToAccountDetail({
              userID: response.result.account.userAddress,
              username: response.result.account.username,
              email: response.result.account.email,
              telefon: response.result.account.telefon,
              publicKey: response.result.wallet.publicKey,
              walletAddress: response.result.wallet.addressString,
              walletBalance: response.result.wallet.balance
            })
          } else {
            this.loginError = true
          }
        })
    },

    _navToAccountDetail: function(params) {
      this.$router.push({
        name: 'user-account',
        params: {userID: params.userID, userAddress: params.walletAddress, walletBalance: params.walletBalance},
        query: {username: params.username, email: params.email, telefon: params.telefon,
                publicKey: params.publicKey, walletAddress: params.walletAddress, walletBalance: params.walletBalance}
      })
    },

    onCreateAccount: function(oEvent) {
      let requestArgs = {
        account: this.newUserAccount.userName,
        password: this.newUserAccount.userPassword,
        email: this.newUserAccount.userEmail,
        telefon: this.newUserAccount.userTelefon
      }
      let decoded
      this.busy = true
      this.$JsonRPCClient.client.request('newAccount', requestArgs, (err, response) => {
        if (err) {
          this.busy = false
          this.createAccountError = true
        } else {
          this.busy = false
          decoded = this.$JWT.verifyToken(response.result.token)
          if (decoded === '') {
            this.createAccountError = true
          } else {
            //console.log(response)
            window.localStorage.setItem('userToken', response.result.token)
            this._navToAccountDetail({
              userID: decoded.userID,
              username: decoded.account,
              email: decoded.email,
              telefon: decoded.telefon,
              publicKey: response.result.wallet.publicKey,
              walletAddress: response.result.wallet.addressString,
              walletBalance: response.result.wallet.balance
            })
          }        
        }
      })
    }
  }
}
</script> 