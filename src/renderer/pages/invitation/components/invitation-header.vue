<template>
  <main>
    <h2>My Level</h2>
    <section class="header-list">
      <section class="header-img">
        <img :src="headerImg" alt="" />
      </section>
      
      <section class="header-text">
        <h3>{{ headerLevel }}</h3>
        <p class="header-txt">Gold medal</p>
        <p class="look-list">
          <section class="progress-list clearfix">
            <el-progress :percentage="progress" color="#29D893" /> 
            <span>{{ progress }} / {{ levelNumber }}</span>
          </section>
          <span @click="lookRules" class="rules-btn">View rules</span>
        </p>
      </section>
    </section>
    <section class="line"></section>
  </main>
</template>

<script>
import level1 from '../../../assets/images/levels1.png'
import level2 from '../../../assets/images/levels2.png'
import level3 from '../../../assets/images/levels3.png'
import level4 from '../../../assets/images/levels4.png'
export default {
  name: '',
  props: {
    level: Number,
    progress: Number
  },
  data () {
    return {
      level1,
      level2,
      level3,
      level4
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
      if (this.level == 1) {
        return 'Bronze partner'
      } else if (this.level == 2) {
        return 'Silver partner'
      } else if (this.level == 3) {
        return 'Gold partner'
      } else {
        return 'Super partner'
      }
    },

    levelNumber () {
      if (this.level == 1) {
        return 9
      } else if (this.level == 2) {
        return 99
      } else if (this.level == 3) {
        return 999
      } else {
        return 1000
      }
    }
  },
  methods: {
    //查看规则
    lookRules () {
      this.$emit('rules')
    }
  },
}
</script>

<style scoped>
  main {padding-top: 20px;}
  h2 {margin: 0;color: #252F33;font-size: 18px;padding: 0 32px;font-family: Montserrat-SemiBold;}

  .header-list {display: flex;align-items: center;padding: 20px 32px 16px;height: 64px;}

  .header-img {width:64px;height:64px;background:#eef2f1;border-radius:50%;display: flex;align-items: center;justify-content: center;
    margin-right: 20px;}

  .header-text {flex: 1;}
  .header-text h3 {margin: 0;font-family: Lato-Bold;}
  .header-text .header-txt {padding-top: 6px;}

  .look-list {display: flex;align-items: center;justify-content: space-between;width: 100%;}

  .rules-btn {width:98px;height:32px;background:#f7fbfa;border-radius:4px;color: #29D893;
    text-align: center;line-height: 32px;margin-left: 28px;cursor: pointer;}

  .progress-list {flex: 1;height: 10px;line-height: 6px;}
  .progress-list span {float: left;vertical-align: middle;margin-left: 12px;color: #252F33;}
  .progress-list >>> .el-progress-bar {width: 94%;float: left;vertical-align: middle;}
  .progress-list >>> .el-progress__text {display: none!important;} 
  .line {width: 100%;height: 6px;background: #F4F5F5;}
</style>