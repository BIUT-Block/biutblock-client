<template>
  <main>
    <h2>My Level</h2>
    <section class="header-list">
      <section class="header-img">
        <img src="../../../assets/images/level.png" alt="">
      </section>
      
      <section class="header-text">
        <h3>Bronze partner</h3>
        <p class="header-txt">Gold medal</p>
        <p class="look-list">
          <span>8/9</span>
          <span @click="lookRules" class="rules-btn">View rules</span>
        </p>
      </section>
    </section>
    <section class="line"></section>
  </main>
</template>

<script>
export default {
  name: '',
  props: {},
  data () {
    return {

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
  h2 {margin: 0;color: #252F33;font-size: 18px;padding: 0 32px;}

  .header-list {display: flex;align-items: center;padding: 20px 32px 16px;height: 64px;}

  .header-img {width:64px;height:64px;background:#eef2f1;border-radius:50%;display: flex;align-items: center;justify-content: center;
    margin-right: 20px;}

  .header-text h3 {margin: 0;}
  .header-text .header-txt {padding: 6px 0;}

  .look-list {display: flex;align-items: center;justify-content: space-between;}

  .rules-btn {width:98px;height:32px;background:#f7fbfa;border-radius:4px;color: #29D893;font-size: 12px;
    text-align: center;line-height: 32px;margin-left: 50px;cursor: pointer;}

  .line {width: 100%;height: 6px;background: #F4F5F5;}
</style>