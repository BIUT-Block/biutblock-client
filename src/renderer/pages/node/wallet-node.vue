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
      addressText: "13.209.3.183", //ip
      localTime: "Local Time",
      localTimeText: "2019-01-19 16:00:00 GMT+8", //本地时间
      node: "Connected Node",
      nodeText: "35.158.171.46", //连接的节点
      nodeTime: "Node Time",
      nodeTimeText: "", //节点时间
      nodeList: [
        {
          id: '01',
          nodeIp: '35.158.171.46',
          nodeCountry: 'Japan',
          nodeCity: 'Tokyo',
          nodeTime: '2019-01-19 10:00:00 ',
        },
        {
          id: '01',
          nodeIp: '35.158.171.46',
          nodeCountry: 'Japan',
          nodeCity: 'Tokyo',
          nodeTime: '2019-01-19 10:00:00 ',
        },
        {
          id: '01',
          nodeIp: '35.158.171.46',
          nodeCountry: 'Japan',
          nodeCity: 'Tokyo',
          nodeTime: '2019-01-19 10:00:00 ',
        },
        {
          id: '01',
          nodeIp: '35.158.171.46',
          nodeCountry: 'Japan',
          nodeCity: 'Tokyo',
          nodeTime: '2019-01-19 10:00:00 ',
        },
        {
          id: '01',
          nodeIp: '35.158.171.46',
          nodeCountry: 'Japan',
          nodeCity: 'Tokyo',
          nodeTime: '2019-01-19 10:00:00 ',
        },
        {
          id: '01',
          nodeIp: '35.158.171.46',
          nodeCountry: 'Japan',
          nodeCity: 'Tokyo',
          nodeTime: '2019-01-19 10:00:00 ',
        },
        {
          id: '01',
          nodeIp: '35.158.171.46',
          nodeCountry: 'Japan',
          nodeCity: 'Tokyo',
          nodeTime: '2019-01-19 10:00:00 ',
        },
        {
          id: '01',
          nodeIp: '35.158.171.46',
          nodeCountry: 'Japan',
          nodeCity: 'Tokyo',
          nodeTime: '2019-01-19 10:00:00 ',
        }
      ]
    }
  },
  computed: {

  },
  created () {

  },
  mounted () {

  },
  destroyed () {},
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
  .node-header .node-header-list {display: flex;}
  .node-header .node-header-list section {margin-left: 70px;}
  .node-header .node-header-list section:first-child {margin-left: 0px;}

  .node-body {border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;
    overflow: auto;padding: 58px 32px 24px;}
  .node-body h3 {font-size: 14px;color: #839299;font-weight: 600;padding: 24px 0 30px;margin: 0;
    font-family: Montserrat-SemiBold;position: fixed;top: 192px;background: #fff;
    right: 56px;left: 126px}
</style>