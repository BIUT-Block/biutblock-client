<template>
  <main class="invitation-content">
    <main class="content">
      <invitation-header
        :level="userLevel"
        :progress="userprogress"
        :walletAddress="walletAddress"
        :invitationCode="invitationCode"
        @rules = "rules"/>

      <invitation-list
        :walletAddress="walletAddress"
        @details = "details"/>

      <invitation-mask 
        :pagesIdx = idx
        :maskAddress = maskAddress
        :maskLevel = userLevel
        :maskMoney = maskMoney
        v-show = "maskShow"
        @close = 'closeMask' />
    </main>
  </main>
</template>

<script>
import invitationHeader from './components/invitation-header'
import invitationList from './components/invitation-list'
import invitationMask from './components/invitation-mask'
const dataCenterHandler = require('../../lib/DataCenterHandler')
export default {
  name: '',
  components: {
    invitationHeader,
    invitationList,
    invitationMask
  },
  props: {},
  data () {
    return {
      maskShow: false,
      idx: 1,
      userLevel: 1, //用户等级 invitation-header 里面需要的参数判断显示 1 - Bronze partner  2 - Silver partner 3 - Gold partner  4 - Super partner
      userprogress: 2, //进度条升级
      walletAddress: '',
      maskMoney: "-",
      maskAddress: '-',
      invitationCode: ''
    }
  },
  computed: {

  },
  created () {
    let privateKey = this.$route.query.firstKey
    this.walletAddress = this.$route.query.wallets[privateKey].walletAddress
    this.invitationCode = this.$route.query.wallets[privateKey].ownInvitationCode

    dataCenterHandler.getMinerLevel({
      address: this.walletAddress
    }, (body) => {
      if (body.status) {
        this.userprogress = body.amount || 0
        switch (body.minerType) {
          case '1':
            this.userLevel = 4
            break
          case '2':
            this.userLevel = 3
            break
          case '3':
            this.userLevel = 2
            break
          case '4':
            this.userLevel = 1
            break
        }
      }
    })
  },
  mounted () {

  },
  destroyed () {},
  methods: {
    //查看详情 idx 参数 从子组件获取
    details (idx) {
      this.maskShow = true
      this.idx = 2

      this.maskMoney = 1000
      this.maskAddress = "0xc4be3c8093fd7acdcdf415331040fc974f8b2ad5"
    },

    //查看规则
    rules () {
      this.maskShow = true
      this.idx = 1
    },

    //关闭弹窗
    closeMask () {
      this.maskShow = false
    }
  },
}
</script>

<style scoped>
  .invitation-content {padding: 24px 24px 0;background: #F4F5F5;height: calc(100vh - 24px);display: flex;}
  .content {background: #fff;flex: 1;box-shadow: 0px 0px 3px rgba(0,0,0,0.16);border-radius: 4px;
    }
</style>