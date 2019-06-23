<template>
  <button :type="type">{{this.text}}</button>
</template>

<script>
export default {
  name: 'walletButton',
  components: {

  },
  props: ["type","text"],
  data () {
    return {
      
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
  button {height:48px;background:linear-gradient(90deg,rgba(144,151,199,1) 0%,rgba(103,113,170,1) 100%);
    border-radius:4px;border: none;color: #BDC4F7;font-size: 14px;font-weight: 400;}
</style>