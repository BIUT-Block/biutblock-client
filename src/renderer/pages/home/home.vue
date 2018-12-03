<template>
  <el-container class="home">
    <el-row class="publicNav">
      <el-col :span="4">
        <router-link to="/">
          <span class="homeHNav">
            <img src="../../assets/image/logo.png" alt="">
          </span>
        </router-link>
      </el-col>
      <el-col :span="16" class="navTit">
      </el-col>
      <el-col :span="4" class="windowsCnt">
          <i class="el-icon-minus icon_nav" @click="minimizeApp"></i>
          <span class="publicBtn amplification" @click="maximizeApp"></span>
          <i class="el-icon-close icon_nav" @click="exitApp"></i>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24" class="homeList">
        <section class="homeLeft">
          
          <router-link 
            :to="{name: 'wallet', query: {walletAddress: this.walletAddress, walletPrivateKey: this.privateKey, walletName:this.walletName, walletsArr: this.walletsArr, walletPwd: this.walletPwd, walletPublicKey: this.publicKey, walletBalance: this.walletMoney}}" 
            tag="p" class="mt50 pointerTxt">
            <img src="../../assets/image/icon_wallet.png" alt="">
          </router-link>

          <router-link to="/nodeSec" tag="p"  class="mt50 pointerTxt">
            <img src="../../assets/image/icon_node.png" alt="">
          </router-link>

          <p class="mt50 pointerTxt" @click="dialogVisible = true">
            <img src="../../assets/image/icon_set.png" alt="">
          </p>
          <p class="copyright">V1 . 0 . 0</p>
        </section>
        
        <section class="containerCnt" >
          <router-view></router-view>
        </section>
      </el-col>

      <el-dialog
        title="Setting"
        :visible.sync="dialogVisible"
        width="432px"
        >
        <section class="setBtn">
          <el-tabs :tab-position="tabPosition" style="height: 200px;">
            <el-tab-pane label="Switch language">
              <section class="languageCnt">
                <p style="margin-right:10px;">Language</p>
                <el-select v-model="value4" clearable 
                size="214px">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </section>
            </el-tab-pane>
            <el-tab-pane label="About wallet">
              <section class="versionCnt">
                <p>Version Information</p>
                <p>|</p>
                <p>SEC wallet 1.0.0</p>
              </section>
            </el-tab-pane>
          </el-tabs>

        </section>
      </el-dialog>

    </el-row>
  </el-container>
</template>

<script>
const {ipcRenderer: ipc} = require('electron')
export default {
  name: '',
  data () {
    return {
      tabPosition: 'left',
      dialogVisible: false,
      options: [{
          value: 'system',
          label: 'Follow system'
        }, {
          value: 'cn',
          label: '中文'
        }, {
          value: 'English',
          label: 'English'
        }],
      value4: '',
      walletAddress: this.$route.query.walletAddress,
      privateKey: this.$route.query.walletPrivateKey,
      publicKey: this.$route.query.walletPublicKey,
      walletMoney: this.$route.query.walletBalance,
      walletsArr: this.$route.query.walletsArr,
      walletPwd: this.$route.query.walletPwd,
      walletName: this.$route.query.walletName
    }
  },
  created () {
    console.log(this.$route.query)
  },
  methods: {
    exitApp: function() {
      ipc.send('close')
    },
    minimizeApp: function() {
      ipc.send('min')
    },
    maximizeApp: function() {
      ipc.send('max')
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
  flex-direction: column;background: #fff;}


.setBtn {width: 400px;margin: 0 auto;height: 218px;border-top: 1px solid #ccc;}
.languageCnt {flex:1;display: flex;justify-content:start;padding:23px;line-height: 2;}
.versionCnt {flex:1;display: flex;justify-content:space-between;padding:23px 10px;line-height: 2;}




section >>> .el-dialog__body {padding-top: 0;color: #939CB2;font-size: 12px;}
section >>> .el-dialog__title {font-size: 12px;color: #939CB2}


section >>> .popper__arrow {display: none;}
section >>> .el-select-dropdown__list {padding: 0;}


section >>> .el-tabs__item.is-active,section >>> .el-tabs__item:hover {color: #00D6B2} 
section >>> .el-tabs__active-bar {background-color: #00D6B2}
</style>