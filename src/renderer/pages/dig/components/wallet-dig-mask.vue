<template>
  <!-- 遮罩层 -->
  <section class="mask">
    <section class="mask-container dig-mask">
      <img
        src="../../../assets/images/closeMask.png"
        alt=""
        class="closeImg"
        title="close"
        @click="closeMask"
      />
     <!-- 首次开启挖矿 -->
      <section class="begin-dig" v-show="pages == 0">
        
        <p class="first-dig-tips">{{ $t('homeDigMask.hdMaskBeginTxt1') }} {{ poolName }} {{ $t('homeDigMask.hdMaskBeginTxt2') }}</p>
        
        <button type="button" 
          class="first-dig-btn passCorrect"
          @click="confirmFrom">{{ $t('publicBtn.openBtn') }}</button>
      </section>

      <!-- 断网 -->
      <section v-show="pages == 2">
        <section class="network-list">
          <img src="../../../assets/images/errorImg.png" alt="">
          <span>{{ $t(networkErrorText) }}</span>
        </section>
        <section class="network-btn">
          <button type="button" class="exit"  @click="onAppExit">{{ $t('homeDigMask.hdMaskNetworkExit') }}</button>
          <button type="button" class="continue" @click="onContinue">{{ $t('homeDigMask.hdMaskNetworkContinue') }}</button>
        </section>
      </section>

       <!-- 抵押更多 -->
      <section class="first-dig" v-show="pages == 3">
        <h2>{{ $t('homeDigMask.hdMaskMortgageTit') }}</h2>
        <p class="first-dig-txt">{{ $t('homeDigMask.hdMaskMortgageTxt1') }} <span class="color-red">*</span></p>

        <section class="ipt-list flexBetween">
          <input
            type="text"
            placeholder="10000.0"
            maxlength="16"
            v-model="mortgageIpt"
            @input="clearMortgage"
            onpaste="return false" />
          <section>
            <img src="../../../assets/images/clearAddress.png" v-show="mortgageImg" alt="" @click="clearMortgageIpt"/>
            <span>BIUT</span>
          </section>
        </section>
        <p class="first-dig-txt-all">
          {{ $t('homeWallet.hwBiutTxt1') }}：{{ availableMoney.toLocaleString("en-US") }} BIUT <span @click="allAmountMortgage">All</span>
        </p>
        <p class="first-dig-txt-tips">{{ $t('homeDig.hdEnteryTxt4') }}</p>
        
        <button type="button" 
          class="confrimBtn" 
          :class="mortgageActive ? 'passCorrect' : ''"
          :disabled="!mortgageActive"
          @click="mortgageFrom">{{ $t('publicBtn.mortgageBtn1') }}</button>
      </section>

    </section>
  </section>
</template>

<script>
export default {
  name: '',
  props: {
    pages: Number,
    networkErrorText: String,
    selectedWalletAddress: String,
    availableMoney: String,
    freezeMoney: String,
    poolName: String, // 如果是矿池就启用框挖矿、没矿池就用钱包名称
  },
  data() {
    return {
      firstBeginIpt: '',//第一次开启挖矿的input

      mortgageIpt: '',
      mortgageImg: false,

      pageIdx: 1
    }
  },
  computed: {
    mortgageActive () {
      let ipt1 = this.mortgageIpt
      return ipt1 > 0 && ipt1 < this.availableMoney ? true : false
    }
  },
  methods: {
    //关闭弹窗
    closeMask () {
      this.$emit('close')

      this.mortgageIpt = ''
      this.mortgageImg = false
      
      this.pageIdx = 1
    },

    clearMortgage () {
      this.$nextTick(()=> {
        this.mortgageIpt = this.inputNull(this.mortgageIpt)
      })
    },

    clearMortgageIpt () {
      this.mortgageIpt = ''
      this.mortgageImg = false
    },

    allAmountMortgage () {
      this.mortgageIpt = this.availableMoney
    },
    
    //确认提交
    confirmFrom () {
      this.$emit('beginMining')
      this.closeMask ()
    },

    //断网的方法处理
    onContinue () {
      this.$emit('continue')
    },

    //断网的方法处理
    onAppExit () {
      this.$emit('exit')
    },

    //挖矿只能输入金额
    // clearFirstAmount () {
    //   let beginIpt = this.firstBeginIpt.toString()
    //   if (beginIpt.length > 7 && beginIpt.indexOf(".") < 0) {
    //     this.firstBeginIpt = String(beginIpt).substring(0,7)
    //   } else if (beginIpt.indexOf(".") == 0) {
    //     this.firstBeginIpt = String(beginIpt).substring(0,9)
    //   } else {
    //     this.firstBeginIpt =  beginIpt.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符
    //     this.firstBeginIpt =  beginIpt.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
    //     this.firstBeginIpt =  beginIpt.replace(".","$#$").replace(/\./g,"").replace("$#$","."); 
    //     this.firstBeginIpt =  beginIpt.replace(/^(\-)*(\d+)\.(\d\d\d\d\d\d\d\d).*$/,'$1$2.$3');//只能输入两个小数  
    //   }
    // },

    mortgageFrom () {
      this.$emit('addMoreMortgage', this.mortgageIpt)
      this.closeMask ()
    }
  },
  watch: {

  },
}
</script>

<style scoped>
  .dig-mask {position: relative;font-size: 14px;font-weight: 400;color: #576066;width: 372px;padding: 30px 32px 32px;}
  .en .dig-mask {color: #99A1A6;}
  h2 {margin: 0;font-family: Montserrat-SemiBold;color: #252F33;font-size: 24px;}
  .en h2 {font-family: Source-Medium;font-size: 22px;font-weight: 500;}
  .color-red {color: #EE1C39;}
  .closeImg {width: 16px;height: 16px;position: absolute;top: 12px;right: 20px;}
  
  .flexBetween {display: flex;align-items: center;justify-content: space-between;}

  .begin-dig {height: 110px;text-align: right;}
  .begin-dig .first-dig-tips {font-size: 14px;padding-top: 10px;text-align: left;color: #576066;}
  .first-dig-btn {width:97px;border:0;color: #fff;
    height:32px;margin-top: 58px;
    background:linear-gradient(90deg,rgba(41,216,147,1) 0%,rgba(12,197,183,1) 100%);
    border-radius:4px;}
  
  .ipt-list {height: 40px;border-bottom: 1px solid #E6E6E6;box-sizing: border-box;}
  .ipt-list input {flex: 1;border: 0;}
  .ipt-list section {display: flex;align-items: center;}
  .ipt-list img,.ipt-list section span {margin-left: 8px;cursor: pointer;}
  .first-dig-txt {padding-top: 36px;font-size: 16px;font-family: Lato-Bold;color: #99A1A6;}
  .en .first-dig-txt {font-family: Source-Medium;}
  .first-dig-txt-all {padding: 8px 0 12px;font-size: 12px;}
  .first-dig-txt-all span {color: #29D893;padding-left: 8px;cursor: pointer;}
  .first-dig-txt-tips {line-height: 1.2;padding-bottom: 28px;}
  
  .first-dig .flexBetween .first-dig-txt {padding: 0;}
  .confrim-content {padding: 8px 0 38px;}

  .begin-dig-txt {font-size: 14px;color: #99A1A6;padding: 32px 0 2px;line-height: 1.5;}
  .begin-dig-txt span {color: #252F33;font-family: Lato-Medium;}
  .begin-dig .first-dig-txt {padding-top: 0;}

  .tips-list {padding: 24px 0 16px;}
  .tips-list p {display: flex;color: #99A1A6;}
  .tips-list p:first-child {font-size: 14px;padding-bottom: 2px;}
  .tips-list p:last-child {font-size: 12px;}
  .tips-list p img {display: flex;align-items: center;width: 16px;height: 16px;margin-right: 12px;cursor: pointer;}
  .tips-list p label {width: 28px;}

  .confrimBtn {width:372px;height:48px;background:#D8D8D8;border-radius:4px;color: #F7FBFA;font-size: 14px;border: 0;
    font-family: Lato-Regular;}

  .network-list {display: flex;align-items: center;color: #576066;font-size: 14px;}
  .network-list img {margin-right: 10px;}
  .network-btn {display: flex;align-items: center;justify-content: flex-end;padding-top: 55px;}
  .network-btn button {width:96px;height:32px;border-radius:4px;font-size: 14px;}
  .exit {border:1px solid #e6e6e6;color: #EE1C39;background: #fff;}
  .continue {background:linear-gradient(90deg,#29d893 0%,#0cc5b7 100%);color: #fff;border: 0;margin-left: 8px;}

  .border-bottom {border-bottom:1px solid #e6e6e6;height: 40px;}
  .border-bottom span:first-child {font-family: Lato-Bold;color: #99A1A6;}
  .begin-padding {padding-bottom: 32px;}
  .confrim-content {margin: -12px 0 24px;padding: 0;}
</style>