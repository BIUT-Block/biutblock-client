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
          <li
            v-for="(item, index) in navList"
            v-if="item.navShow"
            :key="index"
            :title="item.title"
            :class="idx == index ? 'active-nav' : ''"
            @click="istab(index, item.routeLink)"
          >
            <img :src="idx == index ? item.imgUrls : item.imgUrl" alt="" />
          </li>
        </ul>
        <section class="wallet-index-version">
          <span>{{ $t(networkContent) }}</span>
          <span>V {{ versionNumber }}</span>
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
          <h3>{{ $t("homeSet.hsTit") }}</h3>
          <img
            src="../assets/images/closeMask.png"
            alt=""
            title="close"
            @click="cloasMask"
          />
        </section>
        <section class="setting-mask-body">
          <section class="setting-mask-body-left">
            <ul>
              <li
                v-for="(item, index) in settingList"
                :class="settingIdex == index ? 'check-li' : ''"
                @click="tabSetting(index)"
              >
                {{ $t(item.cnt) }}
              </li>
            </ul>
          </section>
          <section class="setting-mask-body-right">
            <!-- 切换语言 maskPages == 0 -->
            <section
              class="setting-mask-body-right-language"
              v-show="maskPages == 0"
            >
              <p>{{ $t("homeSet.hsTxt1") }}</p>
              <section @click="languageMethon">
                <span>{{ languageTxt }}</span>
                <img src="../assets/images/moreDown.png" alt="" />
              </section>

              <ul class="language-list" v-show="languageShow">
                <li
                  v-for="(item, index) in languageList"
                  class="flex-between"
                  @click="languageTab(index, item.txt)"
                >
                  <span
                    :class="languageIdx === index ? 'language-active' : ''"
                    >{{ item.txt }}</span
                  >
                  <img
                    v-show="languageIdx === index"
                    src="../assets/images/amountChecked.png"
                    alt=""
                  />
                </li>
              </ul>
            </section>

            <!-- 切换正式与测试网络 maskPages == 1 -->
            <section
              class="setting-mask-body-right-network"
              v-show="maskPages == 1"
            >
              <p>{{ $t("homeSet.hsTxt3") }}</p>
              <section :class="networkIdx === 1 ? 'drop' : ''">
                <img
                  :src="networkIdx === 1 ? agreements : agreement"
                  :class="networkIdx === 1 ? 'drop' : ''"
                  alt=""
                  @click="isNetwork(1)"
                />
                <span>{{ $t("homeSet.hsTxt4") }}</span>
              </section>
              <!-- 主网暂时不提供选择 -->
              <section :class="networkIdx === 2 ? 'drop' : ''">
                <img
                  :src="networkIdx === 2 ? agreements : agreement"
                  :class="networkIdx === 2 ? 'drop' : ''"
                  alt=""
                  @click="isNetwork(2)"
                />
                <span>{{ $t("homeSet.hsTxt5") }}</span>
              </section>
            </section>
            <!-- 版本 maskPages == 2 -->
            <section
              class="setting-mask-body-right-version"
              v-show="maskPages == 2"
            >
              <p>{{ $t("homeSet.hsTxt6") }}</p>
              <span>PC Miner V {{ versionNumber }}</span>
            </section>
          </section>
        </section>
      </section>
    </section>

    <!-- 切换主网测试 网络弹窗提示 -->
    <section class="mask" v-show="maskIndexShow">
      <section class="mask-container index-mask">
        <section>
          <img
            src="../assets/images/closeMask.png"
            alt=""
            title="close"
            @click="maskIndexShow = false"
          />
        </section>
        <p>
          {{ $t("homeSet.hsNetwork1") }}{{ $t(tabNetworkContent) }}
          {{ $t("homeSet.hsNetwork2") }}
        </p>
        <section>
          <span @click="maskIndexShow = false">{{
            $t("publicBtn.cancelBtn")
          }}</span>
          <span class="passCorrect" @click="confirmNetwork">{{
            $t("publicBtn.confirmBtn")
          }}</span>
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
import { setInterval, setTimeout } from 'timers'

const { ipcRenderer, remote } = require('electron')
const packageJSON = require('../../../package.json')
const fs = require('fs')
export default {
  name: '',
  components: {
    walletNav,
  },
  props: {},
  data() {
    return {
      wallets: {},
      invitationShow: true,//邀请 侧栏导航 判断是否显示 参考需求文档  方便调试 先true显示
      idx: 0,
      settingList: [
        {
          id: '01',
          cnt: "homeSet.hsTit1"
        },
        {
          id: '02',
          cnt: "homeSet.hsTit2"
        },
        {
          id: '03',
          cnt: "homeSet.hsTit3"
        }
      ],
      languageList: [
        {
          id: '0',
          txt: '中文'
        },
        {
          id: '0',
          txt: 'English'
        }
      ],
      languageTxt: '中文',
      languageIdx: 0,
      languageShow: false,
      versionNumber: '',
      maskPages: 0, //setting
      settingIdex: 0,
      networkIdx: 1,
      newNetworkIdx: 1,//默认新的网络下标为0
      networkContent: 'homeSet.hsText',
      tabNetworkContent: '',
      agreement,
      agreements,
      maskShow: false, //关闭遮罩层
      syncBusy: false,
      maskIndexShow: false
    }
  },
  computed: {
    navList() {
      return [
        {
          id: "01",
          navShow: true,
          title: "wallet",
          imgUrl: wallet,
          imgUrls: wallets,
          routeLink: '/index'
        },
        {
          id: "02",
          navShow: true,
          title: "node",
          imgUrl: node,
          imgUrls: nodes,
          routeLink: '/walletNode'
        },
        {
          id: "03",
          navShow: true,
          title: "mining",
          imgUrl: dig,
          imgUrls: digs,
          routeLink: '/walletDig'
        },
        {
          id: "04",
          navShow: true,
          title: "setting",
          imgUrl: setting,
          imgUrls: settings,
          routeLink: ''
        },
        {
          id: "05",
          navShow: this.invitationShow,
          title: "invitation",
          imgUrl: invitation,
          imgUrls: invitations,
          routeLink: '/invitation'
        }
      ]
    }
  },
  created() {
    this.versionNumber = pkg.version
    this.wallets = this.$route.query.wallets
    this.selectedPrivateKey = window.sessionStorage.getItem("selectedPrivateKey")
    if (process.env.netType === 'test') {
      this.networkIdx = 1
      this.networkContent = 'homeSet.hsText'
    } else {
      this.networkIdx = 2
      this.networkContent = 'homeSet.hsMain'
    }
    let flg = this.$i18n.locale
    if (flg === 'zh') {
      this.languageIdx = 0
      this.languageTxt = '中文'
    } else {
      this.languageIdx = 1
      this.languageTxt = 'English'
    }
    // let selectedWallet = this.wallets[this.selectedPrivateKey]
    // if (selectedWallet.mortgageValue > 0) {
    //   this.invitationShow = true
    // } else {
    //   this.invitationShow = false
    // }
  },
  mounted() {

  },
  destroyed() { },
  methods: {
    //左侧菜单切换
    istab(index, url) {
      this.idx = index
      this.selectedPrivateKey = window.sessionStorage.getItem("selectedPrivateKey")

      WalletsHandler.getAllWalletsFromFile((wallets) => {
        let firstKey = Object.keys(wallets)[0]
        if (wallets.hasOwnProperty(this.selectedPrivateKey)) {
          this.$router.push({ path: "" + url + "", query: { wallets: wallets, selectedPrivateKey: this.selectedPrivateKey, firstKey: firstKey } })
        } else {
          this.$router.push({ path: "" + url + "", query: { wallets: wallets, selectedPrivateKey: firstKey, firstKey: firstKey } })
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
    tabSetting(index) {
      this.settingIdex = index
      this.maskPages = index
    },

    //切换网络切换
    isNetwork(index) {
      if (index == this.networkIdx) {
        return
      } else {
        this.cloasMask()
        this.maskIndexShow = true
        this.newNetworkIdx = index //从新创建一个下标判断
        if (index == 1) {
          this.tabNetworkContent = "homeSet.hsText"
        } else {
          this.tabNetworkContent = "homeSet.hsMain"
        }
      }
    },

    //确认切换网络
    confirmNetwork() {
      let index = this.newNetworkIdx
      let settingPath = remote.app.getPath('appData') + '/' + packageJSON.name + '/BIUT_Wallet_setting.json'
      this.networkIdx = index //赋值给旧的网络切换下标
      if (index === 1) {
        this.networkContent = "homeSet.hsText"
        window.localStorage.setItem('secTest', true)
        fs.writeFileSync(settingPath, JSON.stringify({
          netType: "test"
        }))
      } else {
        this.networkContent = "homeSet.hsMain"
        window.localStorage.setItem('secTest', false)
        fs.writeFileSync(settingPath, JSON.stringify({
          netType: "main"
        }))
      }
      ipcRenderer.send('relaunch')
    },

    //关闭遮罩层
    cloasMask() {
      this.maskShow = false
      this.$nextTick(() => {
        this.idx = sessionStorage.getItem("asideIdx")
      })
    },

    languageTab(idx, txt) {
      this.languageTxt = txt
      this.languageIdx = idx
      this.languageShow = false

      if (idx === 0) {
        this.$i18n.locale = 'zh'
      } else {
        this.$i18n.locale = 'en'
      }
    },

    languageMethon() {
      this.languageShow = !this.languageShow
    },

    _closeSyncBusy() {
      this.syncBusy = false
    }
  },
}
</script>

<style scoped>
.wallet-index {
  display: flex;
  flex-direction: column;
}
.wallet-index nav {
  height: 30px;
  background: rgba(255, 255, 255, 1);
  display: flex;
  align-items: center;
  box-shadow: 0px 1px 3px rgba(37, 47, 51, 0.16);
  justify-content: space-between;
  padding-left: 10px;
}
.wallet-index nav section {
  display: flex;
  align-items: center;
  color: #42535b;
}
.wallet-index nav section img {
  margin-right: 10px;
}

.wallet-index .wallet-index-content {
  display: flex;
  height: calc(100vh - 30px);
  box-shadow: 0px 1px 3px rgba(37, 47, 51, 0.16) inset;
}
.wallet-index .wallet-index-content aside {
  width: 70px;
  text-align: center;
}
.wallet-index .wallet-index-content aside .wallet-aside-list li {
  padding-top: 51px;
  position: relative;
}
.wallet-index .wallet-index-content aside .wallet-aside-list li:first-child {
  padding-top: 57px;
}
.wallet-index .wallet-index-content aside .wallet-index-version {
  position: fixed;
  bottom: 24px;
  width: 70px;
  color: #839299;
}
.wallet-index .wallet-index-content aside .wallet-index-version span {
  display: block;
}
.wallet-index
  .wallet-index-content
  aside
  .wallet-index-version
  span:first-child {
  margin-bottom: 4px;
  font-weight: bold;
}
.wallet-index
  .wallet-index-content
  aside
  .wallet-index-version
  span:last-child {
  font-family: Lato-Light;
}
.en
  .wallet-index
  .wallet-index-content
  aside
  .wallet-index-version
  span:last-child {
  font-family: Lato-Regular;
}

.wallet-index .wallet-index-content .wallet-index-content-home {
  flex: 1;
}

.active-nav::after {
  border-bottom: 7px solid transparent;
  border-top: 7px solid transparent;
  border-right: 7px solid #edf2f1;
  content: "";
  position: absolute;
  width: 0;
  right: 0;
  bottom: 2px;
}

.setting-mask-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 54px;
  border-bottom: 1px solid #e5e5e5;
  padding: 0 24px 0 32px;
}
.setting-mask-header h3 {
  font-size: 18px;
  margin: 0;
  color: #252f33;
  font-family: Lato-Bold;
}
.en .setting-mask-header h3 {
  font-family: Source-Medium;
  font-weight: 500;
}
.setting-mask-header img {
  width: 16px;
  height: 16px;
}

.setting-mask-body {
  height: 334px;
  display: flex;
}
.setting-mask-body-right-language,
.setting-mask-body-right-version,
.setting-mask-body-right-network {
  padding: 28px 0 0 18px;
  font-size: 14px;
}
.setting-mask-body-right-language p,
.setting-mask-body-right-version p,
.setting-mask-body-right-network p {
  color: #839299;
  font-weight: 500;
  font-family: Lato-Medium;
}

.en .setting-mask-body-right-language p,
.en .setting-mask-body-right-version p,
.en .setting-mask-body-right-network p {
  font-weight: 500;
  font-family: Source-Regular;
}

.setting-mask-body-right-language section {
  display: flex;
  align-items: center;
  font-weight: 400;
  box-sizing: border-box;
  color: #252f33;
  height: 32px;
  border-bottom: 1px solid #e5e5e5;
  width: 215px;
  margin-top: 8px;
  justify-content: space-between;
  cursor: pointer;
}

.setting-mask-body-right-network section {
  color: #252f33;
  font-weight: 400;
  margin-top: 18px;
}
.en .setting-mask-body-right-network section {
  color: #42535b;
}
.setting-mask-body-right-network section img {
  margin-right: 10px;
  vertical-align: top;
  width: 14px;
  height: 14px;
}
.setting-mask-body-right-network section:last-child {
  margin-top: 10px;
}

.setting-mask-body-right-version span {
  color: #252f33;
  margin-top: 16px;
  display: block;
  font-family: Lato-Regular;
}

.setting-mask-body-left {
  width: 137px;
  height: 308px;
  border-right: 1px solid #e5e5e5;
  padding: 26px 0 0 32px;
}
.en .setting-mask-body-left {
  color: #99a1a6;
}
.setting-mask-body-left ul li {
  display: block;
  margin-top: 36px;
}
.en .setting-mask-body-left ul li {
  font-size: 14px;
}
.setting-mask-body-left ul li:first-child {
  margin-top: 0;
}
.setting-mask-body-left ul .check-li {
  color: #29d893;
  border-right: 4px solid #29d893;
  margin-right: -2px;
}

.index-mask {
  display: flex;
  flex-direction: column;
  padding: 20px 20px 16px 24px;
}
.index-mask img {
  width: 12px;
  height: 12px;
}
.index-mask p {
  line-height: 1.5;
  padding: 20px 0 18px;
  color: #576066;
  font-size: 14px;
}
.index-mask section {
  display: flex;
  justify-content: flex-end;
}
.index-mask section span {
  display: inline-block;
  width: 108px;
  height: 32px;
  text-align: center;
  line-height: 32px;
  font-size: 14px;
  color: #388ed9;
  box-sizing: border-box;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
}
.index-mask section span:last-child {
  margin-left: 12px;
  border: 0;
  color: #fff;
}
.index-mask section span:hover,
.index-mask img {
  cursor: pointer;
}

.drop {
  cursor: no-drop !important;
}

.language-list {
  flex-direction: column;
  width: 216px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 1px 6px rgba(37, 47, 51, 0.16);
  opacity: 1;
  border-radius: 4px;
}
.language-list li {
  padding: 0 20px;
  cursor: pointer;
  height: 46px;
}
.language-list li:first-child {
  font-family: Source-Regular;
}
.language-list li:last-child {
  font-family: Lato-Regular;
}
.language-active {
  color: #29d893;
}
</style>