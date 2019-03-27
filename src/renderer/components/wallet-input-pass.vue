<template>
  <section>
    <input :type="type" 
           :placeholder="placeholder" 
           :maxlength="maxlength" 
           :value="value" 
           ref="input"
           @blur="blue"
           @focus="focus"
           @input="$emit('input', $event.target.value)"
           onkeyup="this.value=this.value.replace(/\s+/g,'')"/>
    <img :src="imgUrl" @click="tabInputType">
  </section>
</template>

<script>
import passImg from '../assets/images/passImg.png'
import passImgs from '../assets/images/passImgs.png'
export default {
  name: 'walletInputPass',
  components: {

  },
  props: ['placeholder', 'value', 'maxlength'],
  data () {
    return {
      type: 'password',
      imgUrl: passImg,
      typeIdx: 1
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
    //失去焦点
    blue () {
      this.$emit('loseFocus')
    },
    //得到焦点
    focus () {
      this.$emit('getFocus')
    },
    //切换密码输入框
    tabInputType () {
      if (this.typeIdx === 1) {
        this.type = 'text'
        this.imgUrl = passImgs
        this.typeIdx = 0
      } else {
        this.type = 'password'
        this.imgUrl = passImg
        this.typeIdx = 1
      }
    }
  },
}
</script>

<style scoped>
  section {display: flex;align-items: center;justify-content: space-between;height: 35px;
    border-bottom: 1px solid #E6E6E6;}
  section input {font-size: 14px;color: #252F33;height: 30px;flex: 1;border:none;font-family: Lato-Medium;}
  section img {width: 17px;height: 17px;}
</style>