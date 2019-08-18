<template>
  <section>
    <p>{{ $t(title) }}</p>
    <p>{{ $t(text) || nodeText}}</p>
  </section>
</template>

<script>
export default {
  name: '',
  components: {

  },
  props: ["title","text"],
  data () {
    return {
      nodeText: "-"
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
  section p:first-child {color: #839299;font-family: Lato-Bold;padding-bottom: 5px;}
  section p:last-child {color: #839299;font-weight: 500;padding-top: 5px;font-size: 14px;
    color: #252F33;font-family: Lato-Medium;}
</style>