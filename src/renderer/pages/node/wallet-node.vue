<template>
  <main>
    <section class="node-container">
      <!-- 节点头部 -->
      <section class="node-header">
        <h3>{{ $t('homeNode.hnTit') }}</h3>
        <section class="node-header-list">
          <node-title :title="address" :text="addressText"/>
          <node-title :title="localTime" :text="localTimeText"/>
          <node-title :title="node" :text="nodeText"/>
          <node-title :title="nodeTime" :text="nodeTimeText"/>
        </section>
      </section>
      <wallet-margin/>
      <!-- 节点列表 -->
      <section class="node-body">
        <h3>{{ $t('homeNode.hnListTit') }}</h3>
        <node-list :nodeList="nodeList"/>
      </section>
    </section>
  </main>
</template>

<script>
import nodeTitle from './components/wallet-node-title'
import nodeList from './components/wallet-node-list'
import walletMargin from '../../components/wallet-margin'
import WalletsHandler from '../../lib/WalletsHandler';
import { setInterval, clearInterval } from 'timers';
const moment = require('moment-timezone')
const ipify = require('ipify')
const fetch = require('node-fetch')
let secAPI = 'http://scan.secblock.io/'

export default {
  name: 'walletNode',
  components: {
    nodeTitle,
    nodeList,
    walletMargin
  },
  props: {},
  data () {
    return {
      address: "homeNode.hnTxt1",
      ntcServer: '2.de.pool.ntp.org',
      addressText: "-", //ip
      localTime: "homeNode.hnTxt2",
      localTimeText: "-", //本地时间
      node: "homeNode.hnTxt3",
      nodeText: "-", //连接的节点
      nodeTime: "homeNode.hnTxt4",
      nodeTimeText: "-", //节点时间
      nodeList: [],
      updateNodeListJob: '',
      updateConnectedNodeJob: ''
    }
  },
  computed: {

  },
  created () {
    ipify().then(ip => {
      this.addressText = ip
    })
    let localDate = new Date()
    this.localTimeText = WalletsHandler.formatDate(localDate, localDate.getTimezoneOffset())
    
    this._getNodeLists()

    this.updateNodeListJob = setInterval(() => {
      this._getNodeLists()
    }, 5*60*1000)


    this._getNodeInfo()
    this.updateConnectedNodeJob = setInterval(() => {
      this._getNodeInfo()
    }, 5*60*1000)
  },
  mounted () {

  },
  destroyed () {
    clearInterval(this.updateNodeListJob)
    clearInterval(this.updateConnectedNodeJob)
  },
  methods: {
    _getNodeLists () {
      if (window.localStorage.getItem('secTest') && window.localStorage.getItem('secTest') === 'true') {
        secAPI = 'http://test.secblock.io/'
      } else {
        secAPI = 'http://scan.secblock.io/'
      }
      fetch(`${secAPI}nodeinfoapi`).then(response => response.json()).then((nodestable) => {
        this.nodeList = []
        nodestable.forEach( (node, index) => {
          let date = moment(node.node.TimeStamp).tz(node.location.location.timeZone)
          let formatTime = WalletsHandler.formatDate(date.format('YYYY/MM/DD HH:mm:ss'), -date._offset)
          this.nodeList.push({
            id: index,
            nodeIp: node.location.traits.ipAddress,
            nodeCountry: node.location.country.names.en,
            nodeCity: node.location.city.names ? node.location.city.names.en : '',
            nodeTime: formatTime
          })
        })
      })
    },
    
    _getNodeInfo () {
      this.$JsonRPCClient.getNodeInfo({timeServer: this.ntcServer}, (response) => {
        console.log(response)
        let nodeDate = moment(response.result.time).tz(response.result.timeZone)
        let localDate = moment(new Date().getTime()).format('YYYY/MM/DD HH:mm:ss')
        this.nodeTimeText = WalletsHandler.formatDate(nodeDate.format('YYYY/MM/DD HH:mm:ss'), -nodeDate._offset)
        this.localTimeText = WalletsHandler.formatDate(localDate, new Date().getTimezoneOffset())
        this.nodeText = response.result.ipv4
      })
    }
  }
}
</script>

<style scoped>
  main {padding: 24px;background: #F4F5F5;height: calc(100vh - 48px);display: flex;
    align-content: stretch;display:-webkit-flex;}
  .node-container {display: flex;flex-direction: column;box-shadow:0px 0px 3px rgba(0,0,0,0.16);
    border-radius:4px;background: #fff;flex: 1;}
  .node-header {height: 141px;border-top-left-radius: 4px;border-top-right-radius: 4px;padding: 0 32px;}
  .node-header h3 {font-size: 18px;font-family: Montserrat-SemiBold;font-weight: 600;color: #252F33;
    margin: 22px 0 30px;}
  .node-header .node-header-list {display: flex;justify-content: space-between;}

  .node-body {border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;
    padding: 24px 0 24px 32px;}
  .node-body h3 {font-size: 14px;color: #839299;font-weight: 600;margin: 0;
    font-family: Montserrat-SemiBold;background: #fff;padding-bottom: 16px;}

  .en .node-body h3,.en .node-header h3 {font-family: Source-Medium;color: #42535B;font-weight: 500;}
  .en .node-header h3 {color: #252F33;}
</style>