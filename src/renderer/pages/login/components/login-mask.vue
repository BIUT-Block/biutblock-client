<template>
  <section class="mask">
    <section class="login-mask mask_cnt">
      <img src="../../../assets/images/closeMask.png" alt="" class="closeImg" @click="close">
      <figure>
        <img src="../../../assets/images/errorImg.png" alt="">
        <figcaption>
          {{ $t("loginMask.lgTxt") }}
        </figcaption>
      </figure>
      <button type="button" @click="close">{{ $t("publicBtn.knowBtn") }}</button>
    </section>
  </section>
</template>

<script>
export default {
  name: '',
  props: {},
  data () {
    return {

    }
  },
  methods: {
    close () {
      this.$emit('close')
    }
  },
}
</script>

<style scoped>
  .login-mask {width:448px;text-align: right;padding: 12px 20px;
    height:172px;
    background:rgba(255,255,255,1);
    box-shadow:0px 0px 10px rgba(0,0,0,0.16);
    border-radius:10px;}
  .closeImg {margin-right: -8px;}
  figure {margin: 0;display: flex;align-items: center;padding: 16px 0 72px;}
  figure figcaption {margin-left: 10px;color: #6D7880;font-size: 14px;}
  button {font-family: Lato-Regular;width:96px;color: #fff;border: 0;font-size: 14px;
height:32px;
background:linear-gradient(90deg,rgba(41,216,147,1) 0%,rgba(12,197,183,1) 100%);
border-radius:4px;}
  .en button {font-family: Source-Regular;}
</style>