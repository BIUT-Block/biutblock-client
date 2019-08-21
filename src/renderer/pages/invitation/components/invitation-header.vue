<template>
  <main>
    <header class="flex-between">
      <h2>{{ $t('homeInvitation.hiTit') }}</h2>
      <button type="button" class="rules-btn" @click="shareShow = true">{{ $t('homeInvitation.hiShare') }}</button>
    </header>

    <section class="header-list">
      <section class="header-img">
        <img :src="headerImg" alt="" />
      </section>
      
      <section class="header-text">
        <h3>{{ $t(headerLevel) }}</h3>
        <p class="header-txt">{{ $t('homeInvitation.hiTxt') }}</p>
        <p class="look-list">
          <section class="progress-list clearfix">
            <el-progress :percentage="progress" color="#29D893" /> 
            <span>{{ progress }} / {{ levelNumber }}</span>
          </section>
          <span @click="lookRules" class="rules-btn">{{ $t('homeInvitation.hiBtn') }}</span>
        </p>
      </section>
    </section>
    <section class="line"></section>

    <!-- 分享弹窗 -->
    <share-mask 
      :invitationCode="invitationCode"
      v-show="shareShow"
      @close = 'closeMask'/>
  </main>
</template>

<script>
import level1 from '../../../assets/images/levels1.png'
import level2 from '../../../assets/images/levels2.png'
import level3 from '../../../assets/images/levels3.png'
import level4 from '../../../assets/images/levels4.png'

import shareMask from './invitation-share-mask'
const dataCenterHandler = require('../../../lib/DataCenterHandler')
export default {
  name: '',
  components: {
    shareMask
  },  
  props: {
    level: Number,
    progress: Number,
    walletAddress: String,
    invitationCode: String
  },
  data () {
    return {
      level1,
      level2,
      level3,
      level4,
      shareShow: false
    }
  },
  computed: {
    headerImg () {
      if (this.level == 1) {
        return level1
      } else if (this.level == 2) {
        return level2
      } else if (this.level == 3) {
        return level3
      } else {
        return level4
      }
    },

    headerLevel () {
      if (this.level === 1) {
        return 'homeInvitationMask.hiMaskRulesListLevel1'
      } else if (this.level === 2) {
        return 'homeInvitationMask.hiMaskRulesListLevel2'
      } else if (this.level === 3) {
        return 'homeInvitationMask.hiMaskRulesListLevel3'
      } else {
        return 'homeInvitationMask.hiMaskRulesListLevel4'
      }
    },

    levelNumber () {
      if (this.level === 1) {
        return 10
      } else if (this.level === 2) {
        return 32
      } else if (this.level === 3) {
        return 64
      } else {
        return 100
      }
    }
  },
  created () {
    
  },
  methods: {
    //查看规则
    lookRules () {
      this.$emit('rules')
    },
    
    closeMask () {
      this.shareShow = false
    }
  },
}
</script>

<style scoped>
  main {padding-top: 20px;}
  header {padding: 0 32px;}
  header button {border: 0;margin-left: 0!important;}
  .en header button {font-family: Source-Medium;font-size: 13px;}
  h2 {margin: 0;color: #252F33;font-size: 18px;font-family: Montserrat-SemiBold;}
  .en h2 {color: #576066;font-family: Source-Medium;font-weight: 500;}


  .header-list {display: flex;align-items: center;padding: 20px 32px 16px;height: 64px;}

  .header-img {width:64px;height:64px;background:#eef2f1;border-radius:50%;display: flex;align-items: center;justify-content: center;
    margin-right: 20px;}

  .header-text {flex: 1;}
  .header-text h3 {margin: 0;font-family: Lato-Bold;}
  .en .header-text h3 {font-family: Source-Medium;font-weight: 500;color: #576066;}
  .header-text .header-txt {padding-top: 6px;}
  .en .header-text .header-txt {color: #6D7880;}

  .look-list {display: flex;align-items: center;justify-content: space-between;width: 100%;}

  .rules-btn {width:98px;height:32px;background:#f7fbfa;border-radius:4px;color: #29D893;
    text-align: center;line-height: 32px;margin-left: 28px;cursor: pointer;}

  .progress-list {flex: 1;height: 10px;line-height: 6px;}
  .progress-list span {float: left;vertical-align: middle;margin-left: 12px;color: #252F33;}
  .progress-list >>> .el-progress-bar {width: 94%;float: left;vertical-align: middle;}
  .progress-list >>> .el-progress__text {display: none!important;} 
  .line {width: 100%;height: 6px;background: #F4F5F5;}
</style>