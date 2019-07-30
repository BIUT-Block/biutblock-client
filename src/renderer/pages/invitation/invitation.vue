<template>
  <main class="invitation-content">
    <main class="content">
      <invitation-header 
        @rules = "rules"/>

      <invitation-list 
        @details = "details"/>

      <invitation-mask 
        :pagesIdx = idx
        :maskAddress = maskAddress
        :maskLevel = maskLevel
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
      maskMoney: "100",
      maskLevel: '二级',
      maskAddress: '0xc4be3c8093fd7acdcdf415331040fc974f8b2ad5'
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
    //查看详情
    details (idx) {
      this.maskShow = true
      this.idx = 2
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