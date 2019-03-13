<template>
  <ul>
    <li v-for="item in itemList" class="contant">{{item.cnt}}</li>
  </ul>
</template>

<script>
export default {
  name: '',
  components: {

  },
  props: {
    itemList: Array
  },
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
   ul {display: flex;flex-wrap: wrap;}
   ul li {padding: 8px 6px;margin-right: 10px;background:rgba(242,242,242,1);border-radius:4px;color: #252F33;font-size: 14px;
    margin-top: 10px;}
</style>