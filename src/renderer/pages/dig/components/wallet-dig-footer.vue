<template>
  <ul>
    <li>
      <span>Whole Network Mining：</span>
      <span>123456789.1234 SEC</span>
    </li>
    <li>
      <span>Blocks：</span>
      <span>1117</span>
    </li>
    <li>
      <span class="dig-round"></span>
      <span>5 seconds ago</span>
    </li>
    <li>
      <span>Mined by：</span>
      <span>0xe84ccc49...56a9bbf952</span>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'walletDigFooter',
  components: {

  },
  props: {},
  data() {
    return {

    }
  },
  computed: {

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