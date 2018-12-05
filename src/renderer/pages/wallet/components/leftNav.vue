<template>
  <el-container style="background: #FAFAFA">
    <el-row>
      <el-col :span="24">
        <section class="leftNavCnt">
          <ul>
            <li v-for="(item,index) in walletsArr" 
              :index="item.id"
              :class="[colorArr[index]?'color'+index%2:'',colorBorderArr[index%4]]"
              @click="tabWallet(item,index)">
                <p>{{item.walletName}}</p>
                <p style="margin-top:5px">{{item.walletAddress.replace(/(.{10}).+(.{10})/,'$1...$2')}}</p>
            </li>
            <!-- <li class="borderColor1" @click="tabWallet(index)">
                <p>{{walletName}}</p>
                <p style="margin-top:5px">{{walletAddress.replace(/(.{10}).+(.{10})/,'$1...$2')}}</p>
            </li> -->
          </ul>
          <button class="btn pointerTxt" @click="createWallet">+ Create a wallet</button>
        </section>
      </el-col>
    </el-row>
  </el-container>  
</template>

<script>
import {EventBus} from "../../../lib/EventBus.js"
export default {
  name: '',
  props: ['walletName', 'walletAddress', 'walletsArr', 'walletPwd', 'walletPrivateKey', 'walletPublicKey', 'walletBalance'],
  data () {
    return {
      colorArr: [true, false],
      colorBorderArr: ['borderColor1','borderColor2','borderColor3','borderColor4'],
    }
  },
  methods: {
    createWallet () {
      this.$router.push({ 
        name: 'create',
        query: {
          id: "3",
          walletPwd: this.walletPwd,
          walletAddress: this.walletAddress, 
          walletPrivateKey: this.privateKey, 
          walletPublicKey: this.publicKey, 
          walletBalance: this.walletBalance,
          walletsArr: this.walletsArr,
          walletName: this.walletName
        }
      })
    },
    tabWallet (item,index) {
      const res = [false, false]
      res[index] = !res[index]
      this.colorArr = res
      
      console.log(item) //需要的参数可以通过方法 拿
      if (this.$route.name === 'wallet') {
        EventBus.$emit('updateWalletInfo', {
          walletPwd: this.walletPwd, 
          walletAddress: item.walletAddress, 
          walletPrivateKey: item.privateKey, 
          walletPublicKey: item.publicKey, 
          walletBalance: item.walletBalance,
          walletsArr: this.walletsArr,
          walletName: item.walletName 
        })
      } else {
        this.$router.push({
          name: 'wallet',
          query: {
            walletPwd: this.walletPwd, 
            walletAddress: item.walletAddress, 
            walletPrivateKey: item.privateKey, 
            walletPublicKey: item.publicKey, 
            walletBalance: item.walletBalance,
            walletsArr: this.walletsArr,
            walletName: item.walletName 
          }
        })
      }
    }
  },
  filters: {
    statusColor (status) {
        const statusMap = {
          0: 'testColor1',
          1: 'testColor2',
          2: 'testColor3',
          3: 'testColor4'
        }
        return statusMap[status]
    }
  }
}
</script>

<style scoped>
.btn {width: 160px;height: 58px;background: #fff;color: #657292;
  border:1px solid #657292;outline: none;position:fixed;bottom:24px;left: 90px;border-radius:2px;}


.leftNavCnt {width: 200px;background: #EDF5F4;height:580px;}
ul {display: flex;flex-direction:column;align-items:center;padding-top:8px;justify-content: center;}
li {width: 160px;height: 58px;display: flex;justify-content:center;margin-top: 16px;
    flex-direction: column;border:1px solid #fff;background: #fff;color:#657292;padding-left:20px;}


li:hover {cursor: pointer;background:#00D6B2;color:#fff;border-left: none;}


.borderColor1 {border-left: 2px solid #98A9D2;}
.borderColor2 {border-left: 2px solid #F5A623;}
.borderColor3 {border-left: 2px solid #FF8DB2;}
.borderColor4 {border-left: 2px solid #7498FB;}

.color0 {background:#00D6B2;color:#fff;border-left: none;}
.color1 {background:#00D6B2;color:#fff;border-left: none;}
</style>