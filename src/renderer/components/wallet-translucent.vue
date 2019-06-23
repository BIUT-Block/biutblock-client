<template>
  <section>
    {{ this.text }}
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
    padding: 24px;background:rgba(189,196,247,1);color: #232851;font-size: 14px;
    border-radius: 4px;}
</style>