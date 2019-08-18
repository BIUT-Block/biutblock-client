<template>
  <section>
    {{ $t(text) }}
  </section>
</template>

<script>
export default {
  name: 'walletTranslucent',
  components: {

  },
  props: {
    text: String,
  },
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
 section {position: fixed;top: 50%;left: 50%;margin-top: -32px;margin-left: -48px;
    padding: 24px;background:rgba(66,83,91,.92);color: #F7FBFA;font-size: 14px;
    border-radius: 4px;}
</style>