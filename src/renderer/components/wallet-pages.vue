<template>
  <main class="pages-list">
    <p>
      {{ total }} {{ $t('page.pageTotal') }}
    </p>
    <section>
      <span @click="prev">{{ $t('page.pagePrev') }}</span>
      <input type="text" v-model="pagesIpt" placeholder="1" @blur="goPages" /> / {{ pageSum }}
      <span @click="next">{{ $t('page.pageNext') }}</span>
    </section>
  </main>
</template>

<script>
export default {
  name: '',
  props: {
    total: Number,
    pageSum: Number
  },
  data () {
    return {
      pagesIpt: 1,
    }
  },
  created () {

  },
  methods: {
    prev () {
      this.pagesIpt = this.pagesIpt > 2 ? this.pagesIpt - 1 : this.pagesIpt
      this.$emit('prev', this.pagesIpt)
    },

    next () {
      this.pagesIpt = this.pagesIpt < this.pageSum ? this.pagesIpt + 1 : this.pageSum
      this.$emit('next', this.pagesIpt)
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
    color: #99A1A6;text-align: center;line-height: 32px;cursor: pointer;}
  span:last-child {margin-left: 8px;}

  section {color: #99A1A6;}
  input {width:32px;height:32px;background:#f5f5f5;border-radius:4px;border: 0;margin: 0 3px 0 8px;text-align: center;}
</style>