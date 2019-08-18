<template>
  <section class="button">
    <img :src="imgUrl" alt="">
    <p>{{ $t(text) }}</p>
  </section>
</template>

<script>
export default {
  name: 'walletBbuttonImg',
  components: {

  },
  props: {
    text: String,
    imgUrl: String
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
  .button {height:64px;border-radius:4px;display: flex;align-items: center;justify-content: center;
    background: #fff;}
  .button p {padding-left: 10px;color: #576066;}
</style>