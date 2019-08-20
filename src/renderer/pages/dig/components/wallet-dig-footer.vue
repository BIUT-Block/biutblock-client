<template>
  <ul>
    <li>
      <span>{{ $t('homeDig.hdFootTit1') }}：</span>
      <span>{{totalMining}} BIU</span>
    </li>
    <li>
      <span>{{ $t('homeDig.hdFootTit2') }}：</span>
      <span>{{totalBlockHeight}}</span>
    </li>
    <li>
      <span class="dig-round"></span>
      <span>
        {{ timeOfLastBlock }}
        <span v-show="timeIdx === 1">{{ $t('homeDig.hdFootTimeTxt1') }}</span>
        <span v-show="timeIdx === 2">{{ $t('homeDig.hdFootTimeTxt2') }}</span>
        <span v-show="timeIdx === 3">{{ $t('homeDig.hdFootTimeTxt3') }}</span>
      </span>
    </li>
    <li>
      <span>{{ $t('homeDig.hdFootTit3') }}：</span>
      <span>
        {{ textText }}
      </span>
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
      timeIdx: ""
    }
  },
  computed: {
    textText () {
      if (this.walletAddress == "") {
        return '-'
      } else {
        return '0x' + this.walletAddress.replace(/(.{6}).+(.{8})/,'$1...$2')
      }
    },

    timeOfLastBlock () {
      if (!navigator.onLine) {
        return '-'
      }
      if (Math.ceil(Number(this.timeDiff) / 1000) < 60) {
        this.timeIdx = 1
        return `${Math.ceil(Number(this.timeDiff) / 1000)}`
      } else if (Math.ceil(Number(this.timeDiff) / 1000) >= 60 && Math.ceil(Number(this.timeDiff) / 1000) < 3600) {
        this.timeIdx = 2
        return `${Math.ceil(Number(this.timeDiff) / (60*1000))}`
      } else if (Math.ceil(Number(this.timeDiff) / 1000) >= 3600 && Math.ceil(Number(this.timeDiff) / 1000) < 86400) {
        this.timeIdx = 3
        return `${Math.ceil(Number(this.timeDiff) / (3600*1000))}`
      } else {
        this.timeIdx = 0
        return '-'
      }
      //  else if (Math.ceil(Number(this.timeDiff) / 1000) >= 86400) {
      //   console.log("4-" + `${Math.ceil(Number(this.timeDiff) / (86400*1000))} days ago`)
      //   return `${Math.ceil(Number(this.timeDiff) / (86400*1000))} days ago`
      // }
    }
  },
  created() {

  },
  mounted() {
    if (!navigator.onLine) {
      this.navigatorAddress = false
    } else {
      this.navigatorAddress = true
    }
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
  .en ul li span:first-child {font-family: Source-Regular;}
  ul li span:last-child {color: #252F33;font-weight: 500;font-family: Lato-Medium;}
</style>