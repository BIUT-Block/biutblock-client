<template>
  <!-- <ul>
    <li>
      <img src="../assets/images/min.png" alt="" 
           title="minximize"
           @click="isNav(0)">
    </li>
    <li>
      <img :src="navMaxImg" alt="" 
           title="maximize"
           @click="isNav(1)">
    </li>
    <li>
      <img src="../assets/images/navClost.png" alt="" 
           title="close"
           @click="isNav(2)">
    </li>
  </ul> -->
</template>

<script>
// import navMaxImg from '../assets/images/max.png'
// import navMaxImgs from '../assets/images/maxs.png'
export default {
  name: '',
  components: {

  },
  props: {},
  data () {
    return {
      idx: 1,
      //navMaxImg: navMaxImg
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
    //导航条方法
    // isNav (index) {
    //   if (index == 0) {
    //     this.navMin()
    //   } else if (index == 1) {
    //     this.navMax()
    //     this.idx = !this.idx
    //     if (this.idx == 1) {
    //       this.navMaxImg = navMaxImgs
    //     } else {
    //       this.navMaxImg = navMaxImg
    //     }
    //   } else {
    //     this.navClose()
    //   }
    // }
  },
}
</script>

<style scoped>
  ul {display: flex;align-items: center;justify-content: flex-end;height: 30px;padding-right: 16px;}
  ul li {margin-left: 36px;}
  ul li:first-child {margin-left: 0;}
  ul li img:hover {cursor: pointer;}
</style>