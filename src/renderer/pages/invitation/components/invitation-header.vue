<template>
  <main>
    <h2>我的等级</h2>
    <p>铜牌合伙人</p>
    <p @click="lookRules">查看规则</p>
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
  p {cursor: pointer;margin-top: 20px;}
</style>