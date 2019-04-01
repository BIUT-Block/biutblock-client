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
import { clearInterval } from 'timers';
const ipify = require('ipify')
let jobId
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
    this.localTimeText = new Date().toString()
    this.$JsonRPCClient.getNodesTable((nodestable)=>{
      nodestable.forEach( (node, index) => {
        this.nodeList.push({
          id: index,
          nodeIp: node.location.traits.ipAddress,
          nodeCountry: node.location.country.names.en,
          nodeCity: node.location.city.names ? node.location.city.names.en : '',
          nodeTime: new Date(node.node.TimeStamp).toString().replace(/\(.+\)/, '')
        })
      })
    })
    jobId = setInterval(() => {
      this.$JsonRPCClient.getNodeInfo({timeServer: this.ntcServer}, (response) => {
        this.nodeTimeText = new Date(response.result.time * 1000).toString().replace(/\(.+\)/, '')
        this.localTimeText = new Date().toString().replace(/\(.+\)/, '')
        this.nodeText = response.result.ipv4
      })
    }, 2500)
  },
  mounted () {

  },
  destroyed () {
    clearInterval(jobId)
  },
  methods: {

  },
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
  .node-header .node-header-list {display: flex;justify-content: space-between;}

  .node-body {border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;
    padding: 24px 0 24px 32px;}
  .node-body h3 {font-size: 14px;color: #839299;font-weight: 600;margin: 0;
    font-family: Montserrat-SemiBold;background: #fff;padding-bottom: 16px;}
</style>