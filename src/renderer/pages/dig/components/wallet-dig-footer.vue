<template>
  <ul>
    <li>
      <span>Whole Network Mining：</span>
      <span>{{totalMining}} SEC</span>
    </li>
    <li>
      <span>Blocks：</span>
      <span>{{totalBlockHeight}}</span>
    </li>
    <li>
      <span class="dig-round"></span>
      <span>{{timeOfLastBlock}}</span>
    </li>
    <li>
      <span>Mined by：</span>
      <span>0x{{walletAddress.replace(/(.{6}).+(.{8})/,'$1...$2')}}</span>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'walletDigFooter',
  components: {

  },
  props: {walletAddress: String, totalBlockHeight: String, totalMining: String, timeDiff: String},
  data() {
    return {

    }
  },
  computed: {
    timeOfLastBlock () {
      if (Math.ceil(Number(this.timeDiff) / 1000) < 60) {
        return `${Math.ceil(Number(this.timeDiff) / 1000)} seconds ago`
      } else if (Math.ceil(Number(this.timeDiff) / 1000) >= 60 && Math.ceil(Number(this.timeDiff) / 1000) < 3600) {
        return `${Math.ceil(Number(this.timeDiff) / (60*1000))} minutes ago`
      } else if (Math.ceil(Number(this.timeDiff) / 1000) >= 3600 && Math.ceil(Number(this.timeDiff) / 1000) < 86400) {
        return `${Math.ceil(Number(this.timeDiff) / (3600*1000))} hours ago`
      } else if (Math.ceil(Number(this.timeDiff) / 1000) >= 86400) {
        return `${Math.ceil(Number(this.timeDiff) / (86400*1000))} days ago`
      }
    }
  },
  created() {

  },
  mounted() {

  },
  destroyed() { },
  methods: {

  },
}
</script>

<style scoped>
  ul {display: flex;justify-content: space-between;align-items: center;height: 46px;}
  ul li .dig-round {width:6px;height:6px;background:rgba(41,216,147,1);border-radius:50%;
      display: inline-block;margin-right: 8px;}
  ul li span:first-child {color: #839299;font-family: Montserrat-Light;font-weight:300;}
  ul li span:last-child {color: #252F33;font-weight: 500;font-family: Lato-Medium;}
</style>