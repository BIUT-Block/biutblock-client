<template>
  <p>{{this.title}}<span v-if="choose">*</span></p>
</template>

<script>
export default {
  name: 'walletTitle',
  components: {
    
  },
  props: {
    title: String,
    choose: Boolean
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
  p {font-size: 16px;color: #BDC4F7;font-family: Lato-Bold;}
  p span {color: #F34860;}
</style>