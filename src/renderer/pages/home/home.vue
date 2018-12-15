<template>
  <el-container class="home" @click.native="closeSettingCnt">
    <!-- <el-row class="publicNav publicHomeNav">
      <el-col :span="4">
          <span class="homeHNav" title="SEC - Wallet">
            <img src="../../assets/image/logo.png" alt="SEC - Wallet">
          </span>
      </el-col>
      <el-col :span="16" class="navTit">
      </el-col>
      <el-col :span="4" class="windowsCnt">
          <i class="el-icon-minus icon_nav" @click="minimizeApp"></i>
          <span class="publicBtn amplification" @click="maximizeApp"></span>
          <i class="el-icon-close icon_nav" @click="exitApp"></i>
      </el-col>
    </el-row> -->

    <el-row>
      <el-col :span="24" class="homeList">
        <section class="homeLeft">
          
          <!-- <router-link 
            :to="{name: 'wallet', query: {walletAddress: this.walletAddress, walletPrivateKey: this.privateKey, walletName:this.walletName, walletsArr: this.walletsArr, walletPwd: this.walletPwd, walletPublicKey: this.publicKey, walletBalance: this.walletMoney}}" 
            tag="p" class="mt50 pointerTxt">
            <img src="../../assets/image/icon_wallet.png" alt="">
          </router-link>

          <router-link to="/nodeSec" tag="p"  class="mt50 pointerTxt">
            <img src="../../assets/image/icon_node.png" alt="">
          </router-link>

          <p class="mt50 pointerTxt" @click="dialogVisible = true">
            <img src="../../assets/image/icon_set.png" alt="">
          </p> -->

          <p  @click="walletListFrom" class="mt50 pointerTxt">
            <img :src="icon_wallet" alt="">
          </p>
          <p @click="nodeListFrom"  class="mt50 pointerTxt">
            <img :src="icon_node" alt="">
          </p>

          <p class="mt50 pointerTxt" @click="setListFrom">
            <img :src="icon_set" alt="">
          </p>
          <div id="settingContent" class="setListCnt pointerTxt" v-show="setList" @click="setListCnt">
            Setting
          </div>
          <p class="copyright">V{{appVersion}}</p>
        </section>
        
        <section class="containerCnt" >
          <router-view></router-view>
        </section>
      </el-col>

      <el-dialog
        title="Setting"
        :visible.sync="dialogVisible"
        width="432px"
        top="30vh"
        :before-close="handleClose"
        >
        <section class="homeMock">
         
         <section style="display:flex;flex-direction: column;flex-basis: 124px;border-right: 1px solid rgba(200,209,218,0.5);text-align:right;padding-top: 33px;">
           <span :class="mockActive1" @click="tapMock1">Switch language</span>

           <span style="margin-top: 21px;padding-right: 15px;" :class="mockActive2" @click="tapMock2">About wallet</span>
         </section>

         <section style="padding-top: 33px;padding-left: 12px;" v-show="homeMockCnt2">
            Version Information 
            <span style="margin: 0 24px">|</span>
            SEC wallet {{appVersion}}
         </section>

          <section style="padding-top: 22px;padding-left: 12px;" v-show="homeMockCnt1">
           Language
           <select class="homeSelect" disabled>
             <option value="">Follow system</option>
             <!-- <option value="">中文</option>
             <option value="">English</option> -->
           </select>
         </section>
     
        </section>
      </el-dialog>

    </el-row>
  </el-container>
</template>

<script>
const packageInfo = require("../../../../package.json")

import icon_wallet from '../../assets/image/icon_wallet.png'
import icon_node from '../../assets/image/icon_node.png'
import icon_set from '../../assets/image/icon_set.png'
import icon_wallet_active from '../../assets/image/icon_wallet_active.png'
import icon_node_active from '../../assets/image/icon_node_active.png'
import icon_set_active from '../../assets/image/icon_set_active.png'
import {EventBus} from "../../lib/EventBus.js"

export default {
  name: '',
  data () {
    return {
      setList: false,
      homeMockCnt1: true,
      homeMockCnt2: false,
      mockActive1: 'mockActive',
      mockActive2: '',
      tabPosition: 'left',
      dialogVisible: false,
      appVersion: '',
      walletAddress: this.$route.query.walletAddress,
      privateKey: this.$route.query.walletPrivateKey,
      publicKey: this.$route.query.walletPublicKey,
      walletMoney: this.$route.query.walletBalance,
      walletsArr: this.$route.query.walletsArr,
      walletPwd: this.$route.query.walletPwd,
      walletName: this.$route.query.walletName,
      colorArr: [true],
      icon_wallet: icon_wallet_active,
      icon_node: icon_node,
      icon_set: icon_set,
    }
  },
  created () {
    this.appVersion = packageInfo.version

  },

  mounted () {
    EventBus.$on('updateQuery', (queryParams) => {
      this.walletAddress = queryParams.walletAddress
      this.privateKey = queryParams.walletPrivateKey
      this.publicKey = queryParams.walletPublicKey
      this.walletMoney = queryParams.walletMoney
      this.walletsArr = queryParams.walletsArr
      this.walletPwd = queryParams.walletPwd
      this.walletName = queryParams.walletName
      this.colorArr = queryParams.colorArr
    })
  },
  methods: {
    walletListFrom () {
      this.$router.push({name: 'wallet', 
            query: {walletAddress: this.walletAddress, walletPrivateKey: this.privateKey, 
            walletName:this.walletName, walletsArr: this.walletsArr, walletPwd: this.walletPwd,
            walletPublicKey: this.publicKey, walletBalance: this.walletMoney, colorArr: this.colorArr, pageId: 1}})
      this.icon_wallet = icon_wallet_active
      this.icon_node = icon_node
      this.icon_set = icon_set
      this.setList = false
    },
    nodeListFrom () {
      this.$router.push({ path: '/nodeSec',
      query: {walletAddress: this.walletAddress, walletPrivateKey: this.privateKey, 
            walletName:this.walletName, walletsArr: this.walletsArr, walletPwd: this.walletPwd,
            walletPublicKey: this.publicKey, walletBalance: this.walletMoney, pageId: 2} })
      this.icon_wallet = icon_wallet
      this.icon_node = icon_node_active
      this.icon_set = icon_set
      this.setList = false
    },
    setListFrom () {
      this.icon_wallet = icon_wallet
      this.icon_node = icon_node
      this.icon_set = icon_set_active
      this.setList = !this.setList
    },
    handleClose (done) {
      done()
      this.setList = true
      if (this.$route.query.pageId == 1) {
        this.icon_wallet = icon_wallet_active
        this.icon_node = icon_node
        this.icon_set = icon_set
        this.setList = false
      } else {
        this.icon_wallet = icon_wallet
        this.icon_node = icon_node_active
        this.icon_set = icon_set
        this.setList = false
      }
    },
    tapMock1 () {
      this.mockActive1 = 'mockActive'
      this.mockActive2 = 'pr'
      this.homeMockCnt1 = true
      this.homeMockCnt2 = false
    },
    tapMock2 () {
      this.mockActive1 = 'pr'
      this.mockActive2 = 'mockActive'
      this.homeMockCnt1 = false
      this.homeMockCnt2 = true
    },
    closeSettingCnt (event) {
      let detailsList = document.getElementById('settingContent')
      console.log(!detailsList.contains(event.target))
      //console.log(this.setList)
      if (detailsList.contains(event.target) && this.setList) {
        //if (this.setList)
        this.setList = false
      }
    },
    setListCnt () {
      this.setList = false
      this.dialogVisible = true
    }
  }
}
</script>

<style scoped>
.home {display: flex;flex-direction: column;}

.containerCnt {background: #FAFAFA;width: 806px;display: flex;}

.copyright {position: fixed;bottom:24px;color:#C8D1DA;}

.homeList {display: flex;flex: 1;background: #FAFAFA;}
.homeLeft {width: 70px;height: 580px;display: flex;align-items: center;justify-content: start;
  flex-direction: column;background: #fff;position: relative;}

.setListCnt {width:122px;height:36px;background:rgba(147,156,178,1);border-radius:2px;color:rgba(255,255,255,.7);position: absolute;
  top: 203px;left: 70px;z-index: 999;line-height: 36px;padding-left: 16px;}

.homeMock {height: 218px;display: flex;border-top: 1px solid rgba(200,209,218,0.5);font-size: 12px;}
.homeSelect {-webkit-tap-highlight-color: rgba(0,0,0,0);-webkit-appearance:none;
  -webkit-tap-highlight-color: transparent;appearance:none;-moz-appearance:none;
  width: 214px;margin-left: 13px;height: 36px;background:#F9F9FA;border: none;padding-left: 8px;color: #ccc}

.languageCnt {flex:1;display: flex;justify-content:start;padding:23px;line-height: 2;}
.versionCnt {flex:1;display: flex;justify-content:space-between;padding:23px 10px;line-height: 2;}

.mockActive {border-right: 2px solid #00D6B2;color:#242E49;padding-right: 13px;}
.pr {padding-right: 15px;}


section >>> .el-dialog__header {height: 47px;line-height: 47px;padding: 0;}
section >>> .el-dialog__body {padding: 0;color: #939CB2;font-size: 12px;margin: 0;}
section >>> .el-dialog__title {font-size: 12px;color: #939CB2;padding-left: 25px;}

</style>