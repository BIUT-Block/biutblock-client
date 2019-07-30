<template>
  <main class="pages-list">
    <p>
      {{ total }} records in total
    </p>
    <section>
      <span @click="prev">Previous</span>
      <input type="text" v-model="pagesIpt" placeholder="0" @blur="goPages" /> / {{ total }}
      <span @click="next">Next</span>
    </section>
  </main>
</template>

<script>
export default {
  name: '',
  props: {
    total: Number
  },
  data () {
    return {
      pagesIpt: ''
    }
  },
  methods: {
    prev () {
      this.$emit('prev')
    },

    next () {
      this.$emit('next')
    },

    goPages () {
      let pages = this.pagesIpt
      this.$emit('goPage', pages)
    }
  },
}
</script>

<style scoped>
  .pages-list {display: flex;align-items: center;justify-content: space-between;padding: 0 0 20px 0;}
  p {color: #99A1A6;font-size: 13px;}
  span {width:86px;height:32px;border:1px solid #e6e6e6;border-radius:4px;display: inline-block;
    color: #99A1A6;font-size: 12px;text-align: center;line-height: 32px;cursor: pointer;}
  span:last-child {margin-left: 8px;}

  section {color: #99A1A6;}
  input {width:32px;height:32px;background:#f5f5f5;border-radius:4px;border: 0;margin: 0 3px 0 8px;text-align: center;}
</style>