<template>
  <el-container>
    <el-row>
      <el-col :span="24">
        <left-nav :wallet-address="walletAddress" wallet-name="wallet 01"></left-nav>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24" class="publicWalletP"> 
        <section class="publicWalletH publicWalletHF">

          <section class="publicWalletHList">
            <router-link :to="{name: 'wallet', query: {walletAddress: this.walletAddress, walletPrivateKey: this.privateKey, walletPublicKey: this.publicKey, walletBalance: this.walletMoney}}" class="publicWalletHListIcon">
              <i class="el-icon-arrow-left icon_nav"></i>
            </router-link>
            <span class="publicWalletHTit">Transfer</span>
          </section>
          
          <section class="transferCnt">

            <input class="ipt" v-model="address" maxlength="64" placeholder="Payee wallet address"></input>

            <el-input v-model="amount"  maxlength="10" placeholder="transfer amount" class="ipt">
              <template slot="append">SEC</template>
            </el-input>

            <p class="transferCntTxt">Balance : {{allMoney}} <span @click="allMoneyFrom" class="TxtColor pointerTxt">All out</span></p>

            <input class="ipt" maxlength="20" v-model="remarks" placeholder="Remarks"></input>

            <p class="transferCntTxt2">Miner cost</p>

            <section class="transferSlider">
              <div class="block">
                <el-slider v-model="cost"></el-slider>
              </div>
            </section>

            <section class="costCnt">
              <span class="TxtColor3">Slow</span>
              <span class="TxtColor3">0 sec</span>
              <span class="TxtColor3">Fast</span>
            </section>
            
            <button class="publicBtn" :disabled="!publicBtnAcitve" 
              :class="publicBtnAcitve?'publicBtnAcitve':''" @click="transferFrom">Transfer</button>
          </section>
        </section>
        <el-dialog
          title="Please confirm your transfer information"
          :visible.sync="centerDialogVisible"
          width="512px"
          :show-close=false
          center>
          <section class="transferMockList">
            <section>
              <span class="transferMockTxt">order information </span>
              Transfer
            </section>
            <section>
              <span class="transferMockTxt">Collection address</span>
              {{address.replace(/(.{10}).+(.{10})/,'$1...$2')}}
            </section>

            <section>
              <span class="transferMockTxt">Payment address</span>
              {{oneselfAddress.replace(/(.{10}).+(.{10})/,'$1...$2')}}
            </section>

            <section>
              <span class="transferMockTxt">Miner fee</span>
              0 SEC
            </section>

            <section>
              <span class="transferMockTxt">Amount</span>
              {{amount}} SEC
            </section>
          </section>
          <span slot="footer" class="dialog-footer">
            <button class="publicBtn publicBtnAcitve" @click="dialogVisible = true">determine</button>
            <button class="publicBtn publicBtnAcitve" @click="centerDialogVisible = false">cancel</button>
          </span>
        </el-dialog>

       <el-dialog
          title=""
          :visible.sync="dialogVisible"
          width="432px"
          :show-close=false
          center>
          <section class="transferMockList">
            <p style="word-break:break-all;">{{address}}</p>
            <input type="password" v-model="password" class="passwordIpt">
          </section>
          <span slot="footer" class="dialog-footer">
            <button class="publicBtn publicBtnAcitve" @click="determineTransfer">determine</button>
            <button class="publicBtn publicBtnAcitve" @click="dialogVisible = false">cancel</button>
          </span>
        </el-dialog>

      </el-col>
    </el-row>
  </el-container>

</template>

<script>
import leftNav from './components/leftNav'
const SECUtil = require('@sec-block/secjs-util')
const jwt = require('jsonwebtoken')

export default {
  name: '',
  data () {
    return {
      address: '',
      oneselfAddress: this.$route.query.walletAddress, //点击跳转的时候 带地址  或者存入缓存种
      amount: '',
      remarks: '',
      cost: 50,
      allMoney: this.$route.query.walletMoney,
      centerDialogVisible: false,
      dialogVisible: false,
      privateKey: this.$route.query.privateKey,
      publicKey: this.$route.query.publicKey,
      walletAddress: this.$route.query.walletAddress,
      walletMoney: this.$route.query.walletMoney,
      password: ''

    }
  },
  created() {
    console.log(this.$route.query)
  },
  methods: {
    allMoneyFrom () {
      this.amount = this.allMoney
    },
    transferFrom () {
      if (Number(this.amount) >= Number(this.allMoney)) {
        alert("转账金额不能超过总金额")
        return
      } else {
        this.centerDialogVisible = true
      }
    },
    determineTransfer () {
      //转账功能
      let determineTransfer = false
      if(parseFloat(this.amount) > parseFloat(this.walletMoney)) {
        
      } else {
        let passwordToken = window.localStorage.getItem('userToken')
        jwt.verify(passwordToken, 'MongoX-Block', (err, decode) => {
          if (err) {
            determineTransfer = false
          }
          if (decode && decode.password === this.password) {
            determineTransfer = true
          }
        })
        if (determineTransfer){
          let timeStamp = new Date().getTime()
          let transferData = [{
            timestamp: timeStamp,
            from: this.walletAddress,
            to: this.address,
            value: this.amount,
            gasLimit: '0',
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
              this.dialogVisible = false
              this.centerDialogVisible = false
            }
          })
        }
      }
    }
  },
  computed: {
    publicBtnAcitve () {
      return (this.address.length > 39 && this.amount > 0 && this.remarks.length > 0) ? true : false
    }
  },
  components: {
    leftNav
  }
}
</script>

<style scoped>
.passwordIpt {width: 300px;height: 36px;color: #C8D1DA;border:1px solid #C8D1DA;outline: none;}
.ipt {width:300px;height:36px;margin-bottom: 8px;border-radius: 2px;
  border: 1px solid #C8D1DA;outline: none;padding-left:8px;}

.transferCnt {display: flex;justify-content: center;flex-direction: column;align-items: center;flex: 1;}
.transferCntTxt {text-align: left;width: 300px;margin: 7px 0 12px;color: #939CB2;}
.transferCntTxt2 {color: #657292;text-align: left;width: 300px;margin: 22px 0;}

.transferSlider {width: 300px;}

.costCnt {display: flex;justify-content: space-between;width: 300px;margin: 12px 0 70px;}


.transferMockList {height: 110px;display: flex;justify-content:space-between;flex-direction: column;
  color: #657292;}
.transferMockTxt {display:inline-block;width: 120px;color:#C8D1DA;text-align:right;margin-right:20px;} 


section >>> .el-slider__bar {background-color: #00D6B2}
section >>> .el-slider__button {border-color: #00D6B2;}

section >>> .el-input-group__append {background: #fff;color: #657292;border:none;}
section >>> .el-input__inner {border: none;padding-left:0;}
</style>