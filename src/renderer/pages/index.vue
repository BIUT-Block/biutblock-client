<template>
  <main class="wallet-index">
    <!-- <nav>
      <section>
        <img src="../assets/images/logo.png" alt="">
        <span>BIUT Wallet</span>
      </section>
      <wallet-nav/>
    </nav> -->
    <section class="wallet-index-content">
      <aside>
        <ul class="wallet-aside-list">
          <li v-for="(item, index) in navList"
              :title="item.title"
              :class="idx == index ? 'active-nav' : ''"
              @click="istab(index, item.routeLink)">
              <img :src="idx == index?item.imgUrls:item.imgUrl" alt="">
          </li>
        </ul>
        <section class="wallet-index-version">
          <span>{{networkContent}}</span>
          <span>V {{versionNumber}}</span>
        </section>
      </aside>
      <main class="wallet-index-content-home">
        <router-view></router-view>
      </main>
    </section>
    
    <!-- 设置弹窗 -->
    <section v-show="maskShow" class="mask">
      <section class="mask-container setting-mask">
        <section class="setting-mask-header">
          <h3>Setting</h3>
          <img src="../assets/images/closeMask.png" alt="" title="close" @click="cloasMask">
        </section>
        <section class="setting-mask-body">
          <section class="setting-mask-body-left">
            <ul>
              <li v-for="(item, index) in settingList"
                  :class="settingIdex == index ? 'check-li': ''"
                  @click="tabSetting(index)">{{item.cnt}}</li>
            </ul>
          </section>
          <section class="setting-mask-body-right">
            <!-- 切换语言 maskPages == 0 -->
            <section class="setting-mask-body-right-language" v-show="maskPages == 0">
              <p>Language</p>
              <section>
                <span>Follow system</span>
                <img src="../assets/images/moreDown.png" alt="">
              </section>
            </section>

            <!-- 切换正式与测试网络 maskPages == 1 -->
            <section class="setting-mask-body-right-network" v-show="maskPages == 1">
              <p>Currently connected network</p>
              <section :class="networkIdx === 1 ? 'drop' :''">
                <img 
                  :src="networkIdx === 1 ? agreements : agreement" 
                  :class="networkIdx === 1 ? 'drop' :''"
                  alt="" 
                  @click="isNetwork(1)">
                <span>Test Network</span>
              </section>
              <!-- 主网暂时不提供选择 -->
              <section :class="networkIdx === 2 ? 'drop' :''">
                <img :src="networkIdx === 2 ? agreements : agreement" 
                :class="networkIdx === 2 ? 'drop' :''" 
                alt="" 
                @click="isNetwork(2)">
                <span>Main Network</span>
              </section>
            </section>
            <!-- 版本 maskPages == 2 -->
            <section class="setting-mask-body-right-version" v-show="maskPages == 2">
              <p>Version Information</p>
              <span>PC Miner V {{versionNumber}}</span>
            </section>
          </section>
        </section>
      </section>
    </section>

    <!-- 切换主网测试 网络弹窗提示 -->
    <section class="mask" v-show="maskIndexShow">
      <section class="mask-container index-mask">
        <section>
          <img src="../assets/images/closeMask.png" alt="" title="close" @click="maskIndexShow = false">
        </section>
        <p>
          You will switch to the {{ tabNetworkContent }}, this operation will restart the client and update the wallet data, 
          please confirm that the wallet information has been saved!
        </p>
        <section>
          <span @click="maskIndexShow = false">Cancel</span>
          <span class="passCorrect" @click="confirmNetwork">Confirm</span>
        </section>
      </section>
    </section>

  </main>
</template>

<script>
import wallet from '../assets/images/wallet.png'
import wallets from '../assets/images/wallets.png'

import node from '../assets/images/node.png'
import nodes from '../assets/images/nodes.png'

import dig from '../assets/images/dig.png'
import digs from '../assets/images/digs.png'

import setting from '../assets/images/setting.png'
import settings from '../assets/images/settings.png'

import invitation from '../assets/images/invitation.png'
import invitations from '../assets/images/invitations.png'

import agreement from '../assets/images/agreement.png'
import agreements from '../assets/images/agreements.png'

import walletNav from '../components/wallet-nav'
const pkg = require('../../../package.json')
import WalletsHandler from '../lib/WalletsHandler.js'
import {setInterval, setTimeout} from 'timers'

const {ipcRenderer, remote} = require('electron')
const packageJSON = require('../../../package.json')
const fs = require('fs')
export default {
  name: '',
  components: {
    walletNav,
  },
  props: {},
  data () {
    return {
      wallets: {},
      navList: [
        {
          id: "01",
          title: "wallet",
          imgUrl: wallet,
          imgUrls: wallets,
          routeLink: '/index'
        },
        {
          id: "02",
          title: "node",
          imgUrl: node,
          imgUrls: nodes,
          routeLink: '/walletNode'
        },
        {
          id: "03",
          title: "mining",
          imgUrl: dig,
          imgUrls: digs,
          routeLink: '/walletDig'
        },
        {
          id: "04",
          title: "setting",
          imgUrl: setting,
          imgUrls: settings,
          routeLink: ''
        },
        {
          id: "05",
          title: "invitation",
          imgUrl: invitation,
          imgUrls: invitations,
          routeLink: '/invitation'
        }
      ],
      idx: 0,
      settingList: [
        {
          id: '01',
          cnt: "Language"
        },
        {
          id: '02',
          cnt: "Switching Network"
        },
        {
          id: '03',
          cnt: "Version"
        }
      ],
      versionNumber: '',
      maskPages: 0, //setting
      settingIdex: 0,
      networkIdx: 1,
      newNetworkIdx: 1,//默认新的网络下标为0
      networkContent: 'Test Net',
      tabNetworkContent: '',
      agreement,
      agreements,
      maskShow: false, //关闭遮罩层
      syncBusy: false,
      maskIndexShow: false
    }
  },
  computed: {

  },
  created () {
    this.versionNumber = pkg.version
    this.wallets = this.$route.query.wallets
    this.selectedPrivateKey = window.sessionStorage.getItem("selectedPrivateKey")
    if (process.env.netType === 'test') {
      this.networkIdx = 1
      this.networkContent = 'Test Net'
    } else {
      this.networkIdx = 2
      this.networkContent = 'Main Net'
    }
  },
  mounted () {

  },
  destroyed () {},
  methods: {
    //左侧菜单切换
    istab (index,url) {
      this.idx = index
      this.selectedPrivateKey = window.sessionStorage.getItem("selectedPrivateKey")
      WalletsHandler.getAllWalletsFromFile( (wallets) => {
        if (wallets.hasOwnProperty(this.selectedPrivateKey)) {
          this.$router.push({ path: ""+url+"", query: {wallets: wallets, selectedPrivateKey: this.selectedPrivateKey }})
        } else {
          this.$router.push({ path: ""+url+"", query: {wallets: wallets, selectedPrivateKey: Object.keys(wallets)[0] }})
        }
      
        if (index === 3) {
          let asideIdx = sessionStorage.getItem("asideIdx")
          sessionStorage.setItem("asideIdx", asideIdx)
          this.maskShow = true
        } else {
          sessionStorage.setItem("asideIdx", this.idx)
        }
      })
    },

    //设置切换
    tabSetting (index) {
      this.settingIdex = index
      this.maskPages = index
    },

    //切换网络切换
    isNetwork (index) {
      if (index == this.networkIdx) {
        return
      } else {
        this.cloasMask ()
        this.maskIndexShow = true
        this.newNetworkIdx = index //从新创建一个下标判断
        if (index == 1) {
          this.tabNetworkContent = "Test Net"
        } else {
          this.tabNetworkContent = "Main Net"
        }
      }
    },

    //确认切换网络
    confirmNetwork () {
      let index = this.newNetworkIdx
      let settingPath = remote.app.getPath('appData') + '/' + packageJSON.name + '/BIUT_Wallet_setting.json'
      this.networkIdx = index //赋值给旧的网络切换下标
      if (index === 1 ) {
        this.networkContent = "Test Net"
        window.localStorage.setItem('secTest', true)
        fs.writeFileSync(settingPath, JSON.stringify({
          netType: "test"
        }))
      } else {
        this.networkContent = "Main Net"
        window.localStorage.setItem('secTest', false)
        fs.writeFileSync(settingPath, JSON.stringify({
          netType: "main"
        }))
      }
      ipcRenderer.send('relaunch')
    },

    //关闭遮罩层
    cloasMask () {
      this.maskShow = false
      this.$nextTick(()=> {
        this.idx = sessionStorage.getItem("asideIdx")
      })
    },
      
    _closeSyncBusy () {
      this.syncBusy = false
    }
  },
}
</script>

<style scoped>
  .wallet-index {display: flex;flex-direction: column;}
  .wallet-index nav {height: 30px;background:rgba(255,255,255,1);display: flex;align-items: center;
    box-shadow:0px 1px 3px rgba(37,47,51,0.16);justify-content: space-between;padding-left: 10px;}
  .wallet-index nav section {display: flex;align-items: center;color: #42535B;}
  .wallet-index nav section img {margin-right: 10px;}
  
  .wallet-index .wallet-index-content {display: flex;height: calc(100vh - 30px);box-shadow:0px 1px 3px rgba(37,47,51,0.16) inset;}
  .wallet-index .wallet-index-content aside {width: 70px;text-align: center;}
  .wallet-index .wallet-index-content aside .wallet-aside-list li {padding-top: 51px;position: relative;}
  .wallet-index .wallet-index-content aside .wallet-aside-list li:first-child {padding-top: 57px;}
  .wallet-index .wallet-index-content aside .wallet-index-version {position: fixed;bottom: 24px;width: 70px;color: #839299;}
  .wallet-index .wallet-index-content aside .wallet-index-version span {display: block;}
  .wallet-index .wallet-index-content aside .wallet-index-version span:first-child {margin-bottom: 4px;font-weight: bold;}
  .wallet-index .wallet-index-content aside .wallet-index-version span:last-child {font-family: Lato-Light;}

  .wallet-index .wallet-index-content .wallet-index-content-home {flex: 1;}
  
  .active-nav::after {border-bottom: 7px solid transparent;border-top: 7px solid transparent;
    border-right: 7px solid #EDF2F1;content: "";position: absolute;width: 0;right: 0;bottom: 2px;}

  .setting-mask-header {display: flex;justify-content: space-between;align-items: center;height: 54px;
    border-bottom: 1px solid #E5E5E5;padding: 0 24px 0 32px;}
  .setting-mask-header h3 {font-size: 18px;margin: 0;color: #252F33;font-family: Lato-Bold;}
  .setting-mask-header img {width: 16px;height: 16px;}

  .setting-mask-body {height: 334px;display: flex;}
  .setting-mask-body-right-language,.setting-mask-body-right-version,
  .setting-mask-body-right-network {padding: 28px 0 0 18px;font-size: 14px;}
  .setting-mask-body-right-language p,.setting-mask-body-right-version p,
  .setting-mask-body-right-network p {color: #839299;font-weight: 500;font-family: Lato-Medium;}
  .setting-mask-body-right-language section {display: flex;align-items: center;font-weight: 400;
    color: #252F33;height: 32px;border-bottom: 1px solid #E5E5E5;width: 215px;margin-top: 8px;
    justify-content: space-between;}
  .setting-mask-body-right-language:hover {cursor: no-drop;} 

  .setting-mask-body-right-network section {color: #252F33;font-weight: 400;margin-top: 18px;}
  .setting-mask-body-right-network section img {margin-right: 10px;vertical-align: top;width: 14px;height: 14px;}
  .setting-mask-body-right-network section:last-child {margin-top: 10px;}
  
  .setting-mask-body-right-version span {color: #252F33;margin-top: 16px;display: block;}

  .setting-mask-body-left {width: 137px;height: 308px;border-right:1px solid #E5E5E5;
    padding: 26px 0 0 32px;}
  .setting-mask-body-left ul li {display: block;margin-top: 36px;}
  .setting-mask-body-left ul li:first-child {margin-top: 0;}
  .setting-mask-body-left ul .check-li {color: #29D893;border-right: 4px solid #29D893;margin-right: -2px;}

  .index-mask {display: flex;flex-direction: column;padding: 20px 20px 16px 24px;}
  .index-mask img {width: 12px;height: 12px;}
  .index-mask p {line-height: 1.5;padding: 20px 0 18px;color: #576066;font-size: 14px;}
  .index-mask section {display: flex;justify-content: flex-end;}
  .index-mask section span {display: inline-block;width: 108px;height: 32px;text-align: center;line-height: 32px;
    font-size: 14px;color: #388ED9;box-sizing: border-box;border: 1px solid #E5E5E5;border-radius: 4px;}
  .index-mask section span:last-child {margin-left: 12px;border: 0;color: #fff;}
  .index-mask section span:hover,.index-mask img  {cursor: pointer;}


  .drop {cursor: no-drop!important;}
  
</style>