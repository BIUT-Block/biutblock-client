<template>
  <main>
    <section class="node-container">
      <!-- 节点头部 -->
      <section class="node-header">
        <h3>Node</h3>
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
        <h3>All Nodes List</h3>
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
import { clearInterval } from 'timers';
const moment = require('moment-timezone')
const ipify = require('ipify')
let jobId
let nodeJob
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
      address: "IP Address",
      ntcServer: '0.de.pool.ntp.org',
      addressText: "-", //ip
      localTime: "Local Time",
      localTimeText: "-", //本地时间
      node: "Connected Node",
      nodeText: "-", //连接的节点
      nodeTime: "Node Time",
      nodeTimeText: "-", //节点时间
      nodeList: []
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

    nodeJob = setInterval(() => {
      this._getNodeLists()
    }, 2500)


    this.$JsonRPCClient.getNodeInfo({timeServer: this.ntcServer}, (response) => {
        this.nodeTimeText = WalletsHandler.formatDate(new Date(response.result.time * 1000), -120)
        this.localTimeText = WalletsHandler.formatDate(new Date(), new Date().getTimezoneOffset())
        this.nodeText = response.result.ipv4
    })
    jobId = setInterval(() => {
      this.$JsonRPCClient.getNodeInfo({timeServer: this.ntcServer}, (response) => {
        this.nodeTimeText = WalletsHandler.formatDate(new Date(response.result.time * 1000), -120)
        this.localTimeText = WalletsHandler.formatDate(new Date(), new Date().getTimezoneOffset())
        this.nodeText = response.result.ipv4
      })
    }, 2500)
  },
  mounted () {

  },
  destroyed () {
    clearInterval(jobId)
    clearInterval(nodeJob)
  },
  methods: {
    _getNodeLists () {
      this.$JsonRPCClient.getNodesTable((nodestable)=>{
        this.nodeList = []
        nodestable.forEach( (node, index) => {
          let date = moment(node.node.TimeStamp).tz(node.location.location.timeZone)
          let formatTime = WalletsHandler.formatDate(new Date(date.toString()), -date._offset)
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
    
  }
}
</script>

<style scoped>
  main {padding: 24px;background: #F4F5F5;height: calc(100vh - 78px);display: flex;
    align-content: stretch;display:-webkit-flex;}
  .node-container {display: flex;flex-direction: column;box-shadow:0px 0px 3px rgba(0,0,0,0.16);
    border-radius:4px;background: #fff;flex: 1;}
  .node-header {height: 141px;border-top-left-radius: 4px;border-top-right-radius: 4px;padding: 0 32px;}
  .node-header h3 {font-size: 18px;font-family: Montserrat-SemiBold;font-weight: 600;color: #252F33;
    margin: 22px 0 30px;}
  .node-header .node-header-list {display: flex;}
  .node-header .node-header-list section {margin-left: 70px;}
  .node-header .node-header-list section:first-child {margin-left: 0px;}

  .node-body {border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;
    overflow: auto;padding: 58px 32px 24px;}
  .node-body h3 {font-size: 14px;color: #839299;font-weight: 600;padding: 24px 0 30px;margin: 0;
    font-family: Montserrat-SemiBold;position: fixed;top: 192px;background: #fff;
    right: 56px;left: 126px}
</style>