<template>
  <section>
    <p>{{this.title}}</p>
    <p>{{this.text || nodeText}}</p>
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
  section p:first-child {color: #9097C7;font-family: Lato-Bold;padding-bottom: 5px;}
  section p:last-child {color: #fff;font-weight: 500;padding-top: 5px;font-size: 14px;font-family: Lato-Medium;}
</style>