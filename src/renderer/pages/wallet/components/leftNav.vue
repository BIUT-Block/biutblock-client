<template>
  <el-container style="background: #FAFAFA">
    <el-row>
      <el-col :span="24">
        <section class="leftNavCnt">
          <ul>
            <li v-for="(item,index) in walletsArr" 
              :index="item.id"
              :class="[colorArr[index]?'color0':'',colorBorderArr[index%4]]"
              @click="tabWallet(item,index)">
                <p>{{item.walletName}}</p>
                <p style="margin-top:5px">{{item.walletAddress.replace(/(.{8}).+(.{8})/,'$1...$2')}}</p>
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
  props: ['walletName', 'walletAddress', 'walletsArr', 'walletPwd', 'walletPrivateKey', 'walletPublicKey', 'walletBalance', 'colorArr'],
  data () {
    return {
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
          walletPrivateKey: this.walletPrivateKey, 
          walletPublicKey: this.walletPublicKey, 
          walletBalance: this.walletBalance,
          walletsArr: this.walletsArr,
          walletName: this.walletName,
          colorArr: this.colorArr
        }
      })
    },
    tabWallet (item,index) {
      //this.colorArr.fill(false)
      //this.colorArr[index] = true
      console.log(item) //需要的参数可以通过方法 拿
      let res = new Array(this.colorArr.length).fill(false)
      res[index] = !res[index]
      EventBus.$emit('updateQuery', {
        walletPwd: this.walletPwd, 
        walletAddress: item.walletAddress, 
        walletPrivateKey: item.privateKey, 
        walletPublicKey: item.publicKey, 
        walletBalance: item.walletBalance,
        walletsArr: this.walletsArr,
        walletName: item.walletName ,
        colorArr: res
      })
      if (this.$route.name === 'wallet') {
        EventBus.$emit('updateWalletInfo', {
          walletPwd: this.walletPwd, 
          walletAddress: item.walletAddress, 
          walletPrivateKey: item.privateKey, 
          walletPublicKey: item.publicKey, 
          walletBalance: item.walletBalance,
          walletsArr: this.walletsArr,
          walletName: item.walletName ,
          walletIndex: index
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
            walletName: item.walletName,
            walletIndex: index,
            colorArr: res 
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
.btn {width: 160px;height: 58px;background: #fff;color: #657292;outline: none;position:fixed;
  bottom:24px;left: 90px;border-radius:2px;border: none;}


.leftNavCnt {width: 200px;background: #EDF5F4;height:580px;}
ul {padding-top:8px;overflow: hidden;margin-left: 20px;overflow-y: scroll;height: 484px;}
li {width: 139px;height: 58px;display: flex;justify-content:center;margin-top: 16px;
    flex-direction: column;border:1px none;background: #fff;color:#657292;padding-left:20px;}
ul::-webkit-scrollbar {/*滚动条整体样式*/
            width: 2px;    
            height: 2px;
        }
        ul::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
            -webkit-box-shadow: inset 0 0 1px #00D6B2;
            background: #00D6B2;
            border-radius: 1px;
           
        }
        ul::-webkit-scrollbar-track {/*滚动条里面轨道*/
            -webkit-box-shadow: inset 0 0 1px #EDF5F4;
            border-radius: 0;
            
            background: #EDF5F4;
        }

li:hover {cursor: pointer;background:#00D6B2;color:#fff;border-left: none;}


.borderColor1 {border-left: 2px solid #98A9D2;}
.borderColor2 {border-left: 2px solid #F5A623;}
.borderColor3 {border-left: 2px solid #FF8DB2;}
.borderColor4 {border-left: 2px solid #7498FB;}

.color0 {background:#00D6B2;color:#fff;border-left: none;}
</style>