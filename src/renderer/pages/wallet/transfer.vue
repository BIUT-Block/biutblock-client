<template>
  <el-container>
    <el-row>
      <el-col :span="24">
        <left-nav :wallet-address="walletAddress" :wallet-name="walletName" :wallets-arr="walletsArr" :wallet-pwd="walletPwd"
        :wallet-private-key="privateKey" :wallet-public-key="publicKey" :wallet-balance="walletMoney" :color-arr="colorArr"></left-nav>
      </el-col>
    </el-row>

    <el-row style="margin-left: 32px;">
      <el-col :span="24" class="publicWalletP"> 
        <section class="publicWalletH publicWalletHF">

          <section class="publicWalletHList">
            <router-link :to="{name: 'wallet', 
            query: {walletAddress: this.walletAddress, walletPrivateKey: this.privateKey, walletName:this.walletName, walletsArr: this.walletsArr, 
            walletPwd: this.walletPwd, walletPublicKey: this.publicKey, walletBalance: this.walletMoney, colorArr: this.colorArr,pageId: 1}}" 
            class="publicWalletHListIcon">
              <i class="el-icon-arrow-left icon_nav"></i>
            </router-link>
            <span class="publicWalletHTit">Transfer</span>
          </section>
          
          <section class="transferCnt">

            <input class="ipt" v-model="address" maxlength="64" placeholder="Payee wallet address" @focusout="isAddress"></input>

            <el-input v-model="amount"  maxlength="10" placeholder="transfer amount" class="ipt" @focusout.native="isNumber">
              <template slot="append">SEC</template>
            </el-input>

            <p class="transferCntTxt">Balance : {{allMoney}} <span @click="allMoneyFrom" class="TxtColor pointerTxt">All out</span></p>

            <input class="ipt" maxlength="20" v-model="remarks" placeholder="Remarks" />

            <!-- <p class="transferCntTxt2">Miner cost</p>

            <section class="transferSlider">
              <div class="block">
                <el-slider v-model="cost"></el-slider>
              </div>
            </section> -->

            <!-- <section class="costCnt">
              <span class="TxtColor3">Slow</span>
              <span class="TxtColor3">{{cost}} sec</span>
              <span class="TxtColor3">Fast</span>
            </section>
             -->
            <button class="publicBtn" :disabled="!publicBtnAcitve" 
              :class="publicBtnAcitve?'publicBtnAcitve':''" @click="transferFrom" style="margin-top:40px">Transfer</button>
          </section>
        </section>
        <el-dialog
          title="Please confirm your transfer information"
          :visible.sync="centerDialogVisible"
          width="432px"
          top="30vh"
          center>
          <section class="transferMockList">
            <section>
              <span class="transferMockTxt">order information </span>
              Transfer
            </section>
            <section>
              <span class="transferMockTxt">Collection address</span>
              {{address}}
            </section>

            <section>
              <span class="transferMockTxt">Payment address</span>
              {{oneselfAddress.replace(/(.{10}).+(.{10})/,'$1...$2')}}
            </section>

            <!-- <section>
              <span class="transferMockTxt">Miner fee</span>
              {{cost}} SEC
            </section> -->

            <section>
              <span class="transferMockTxt">Amount</span>
              {{amount}} SEC
            </section>
          </section>
          <span slot="footer" class="dialog-footer" style="margin-top:28px">
            <button class="publicBtn" :class="isDetermineClick?'':'publicBtnAcitve'" :disabled="isDetermineClick" @click="determineTransfer">Confirm</button>
            <button class="publicBtn publicBtnAcitve"  @click="centerDialogVisible = false">Cancel</button>
          </span>
        </el-dialog>

       <!-- <el-dialog
          title="wallet 01"
          :visible.sync="dialogVisible"
          width="432px"
          top="30vh"
          center>
          <section class="transferMockList">
            <p style="word-break:break-all;">{{address}}</p>
            <input type="password" v-model="password" placeholder="Please enter your password" class="passwordIpt">
          </section>
          <span slot="footer" class="dialog-footer">
            <button class="publicBtn" :disabled="determineBtn" :class="determineBtn?'publicBtnAcitve':''" @click="determineTransfer">Confirm</button>
            <button class="publicBtn publicBtnAcitve" @click="dialogVisible = false">cancel</button>
          </span>
        </el-dialog> -->

      </el-col>
    </el-row>
  </el-container>

</template>

<script>
import leftNav from './components/leftNav'
import {EventBus} from "../../lib/EventBus.js"
const SECUtil = require('@sec-block/secjs-util')
const jwt = require('jsonwebtoken')

export default {
  name: '',
  data () {
    return {
      transferBtn: false,
      address: '',
      oneselfAddress: this.$route.query.walletAddress, //点击跳转的时候 带地址  或者存入缓存种
      amount: '',
      remarks: '',
      //cost: 0,
      allMoney: this.$route.query.walletMoney,
      centerDialogVisible: false,
      dialogVisible: false,
      privateKey: this.$route.query.privateKey,
      publicKey: this.$route.query.publicKey,
      walletAddress: this.$route.query.walletAddress,
      walletMoney: this.$route.query.walletMoney,
      walletsArr: this.$route.query.walletsArr,
      walletPwd: this.$route.query.walletPwd,
      walletName: this.$route.query.walletName,
      colorArr: this.$route.query.colorArr,
      password: '', //转账密码,
      isDetermineClick: false
    }
  },
  created() {
    EventBus.$emit('changeSetVisibil', {
        isVisible: false,
        from: 'wallet'
      })
  },
  methods: {
    isNumber (evt) {
      evt = (evt) ? evt : window.event;
      var charCode = (evt.which) ? evt.which : evt.keyCode;
      if(this.amount === "") {
        return true
      }
      if (!/^[0-9.]+$/i.test(this.amount)) {
        this.$alert('Wrong input formatt', 'prompt', {
                confirmButtonText: 'Confirm',
          });
      } else if (parseFloat(this.amount)>this.walletMoney) {
        this.$alert("You don't have enough balance.", 'prompt', {
                confirmButtonText: 'Confirm',
          });
      } else {
        return true;
      }
    },
    isAddress (evt) {
      if(this.address === "") {
        return true
      }
      if (!/^[a-z0-9]+$/.test(this.address) && this.address.length !== 40 ) {
        this.$alert('Invalid wallet address formatt', 'prompt', {
                confirmButtonText: 'Confirm',
          });
        this.address = ""
      } else {
        return true;
      }
    },
    allMoneyFrom () {
      this.amount = this.allMoney.toString()
    },
    transferFrom () {
      if (Number(this.amount) > Number(this.walletMoney)) {
        this.$alert("You don't have enough balance.", 'prompt', {
                confirmButtonText: 'Confirm',
          });
        return
      } else {
        this.centerDialogVisible = true
      }
    },
    // determineTransferGo () {
    //   this.centerDialogVisible = false
    //   this.dialogVisible = true
    // },
    determineTransfer () {
      this.transferBtn = true
      //转账功能   转账的结果 给个 alert提示
      this.isDetermineClick = true
      let determineTransfer = false
      if(parseFloat(this.amount) > parseFloat(this.walletMoney)) {
        this.$alert("You don't have enough balance.", 'prompt', {
                confirmButtonText: 'Confirm',
          });
      } else {
          let timeStamp = new Date().getTime()
          let transferData = [{
            timestamp: timeStamp,
            from: this.walletAddress,
            to: this.address,
            value: this.amount,
            gasLimit: '0',
            //gas: this.cost.toString(),
            gas: '0',
            gasPrice: '0',
            data: this.remarks,
            inputData: this.remarks
          }]
          const tokenTxBuffer = [
            SECUtil.bufferToInt(transferData[0].timestamp),
            Buffer.from(transferData[0].from, 'hex'),
            Buffer.from(transferData[0].to, 'hex'),
            Buffer.from(transferData[0].value),
            Buffer.from(transferData[0].gasLimit),
            Buffer.from(transferData[0].gas),
            Buffer.from(transferData[0].gasPrice),
            Buffer.from(transferData[0].inputData)
          ]
          let txSigHash = Buffer.from(SECUtil.rlphash(tokenTxBuffer).toString('hex'), 'hex')
          let signature = SECUtil.ecsign(txSigHash, Buffer.from(this.privateKey, 'hex'))
          transferData[0].data = {
            v: signature.v,
            r: signature.r.toString('hex'),
            s: signature.s.toString('hex')
          }

          this.$JsonRPCClient.client.request('sec_sendRawTransaction', transferData, (err, response) => {
            if(response.result.status === '1') {
              //this.dialogVisible = false
              this.centerDialogVisible = false
              this.$JsonRPCClient.client.request('sec_getBalance', [this.walletAddress], (err, responseBalance) => {
                if(responseBalance.result.status === '1'){
                  this.allMoney = responseBalance.result.value
                }
              })
              this.$alert('Your transfer is now in pending.', 'prompt', {
                confirmButtonText: 'Confirm',
              });
              this.$router.push(
                {
                  name: 'wallet', 
                  query: {
                    walletAddress: this.walletAddress, 
                    walletPrivateKey: this.privateKey, 
                    walletName:this.walletName, 
                    walletsArr: this.walletsArr, 
                    walletPwd: this.walletPwd, 
                    walletPublicKey: this.publicKey, 
                    walletBalance: this.walletMoney, 
                    colorArr: this.colorArr}
              })
            }
          })

          
      }
    }
  },
  computed: {
    publicBtnAcitve () {
      return (this.address.length > 39 && this.amount > 0 && Number(this.amount) <= Number(this.allMoney)) ? true : false
    },
    determineBtn () {
      return this.password.length > 7 ? true : false
    }
  },
  components: {
    leftNav
  }
}
</script>

<style scoped>
.passwordIpt {width: 300px;height: 36px;color: #C8D1DA;border:1px solid #C8D1DA;outline: none;
margin:20px;text-indent: 8px;}

.ipt {width:300px;height:32px;margin-bottom: 8px;border-radius: 2px;
  border: 1px solid #C8D1DA;outline: none;padding-left:8px;}

.transferCnt {display: flex;justify-content: center;flex-direction: column;align-items: center;flex: 1;}
.transferCntTxt {text-align: left;width: 300px;margin: 0px 0 12px;color: #939CB2;}
.transferCntTxt2 {color: #657292;text-align: left;width: 300px;margin: 14px 0 5px;}

.transferSlider {width: 300px;}

.costCnt {display: flex;justify-content: space-between;width: 300px;margin-bottom:50px;}


.transferMockList {height: 110px;display: flex;justify-content:space-between;flex-direction: column;
  color: #657292;margin-top:20px;}
.transferDetermine {display: flex;justify-content:center;flex-direction: column;align-items: center;}
.transferMockTxt {display:inline-block;width: 120px;color:#C8D1DA;text-align:right;margin-right:20px;} 


section >>> .el-slider__button-wrapper {width: 12px;height: 12px;top: -5px;}

section >>> .el-slider__bar {background-color: #00D6B2}
section >>> .el-slider__button {border-color: #00D6B2;width: 12px;height: 12px;}

section >>> .el-input-group__append {background: #fff;color: #657292;border:none;}
section >>> .el-input__inner {border: none;padding-left:0px;}


section >>> .el-dialog__title {color: #939CB2;font-size: 16px;padding-left: 0;}
section >>> .el-dialog__header {height: 47px;line-height: 47px;padding: 0;border-bottom:1px solid rgba(200,209,218,0.5);}
section >>> .el-dialog--center {height: 288px;}
section >>> .el-dialog__body {padding:15px 0 35px;}
section >>> .el-dialog__footer {padding: 0;}
section >>> .el-dialog__headerbtn {top: 15px!important;right: 16px!important;}
</style>