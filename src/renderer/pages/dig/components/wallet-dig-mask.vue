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
      <section class="first-dig" v-show="pages == 0">
        <h2>Start Mining</h2>
        <p class="first-dig-txt">Mortgage amount <span class="color-red">*</span></p>

        <section class="ipt-list flexBetween">
          <input
            type="text"
            placeholder="10.0"
            maxlength="16"
            v-model="firstBeginIpt"
            @input="clearFirstAmount"
            onpaste="return false" />
          <section>
            <img src="../../../assets/images/clearAddress.png" v-show="clearImg" alt="" @click="clearFirstIpt"/>
            <span>BIUT</span>
          </section>
        </section>
        <p class="first-dig-txt-all">
          Available：{{ availableMoney.toLocaleString("en-US") }} BIUT <span @click="allAmount">All</span>
        </p>
        <p class="first-dig-txt-tips">This BIUT will be locked  for one year. The more BIUT locked, the greater the chance of digging BIU!</p>

        <!-- 确认挖矿 -->
        <!-- <section class="confrim-content" v-show="confrimContent">
          <section class="flexBetween">
            <p class="first-dig-txt">Invitation Code <span class="color-red">*</span></p>
            <p class="color-red" v-show="codeError">Invitation code does not exist or is wrong</p>
          </section>
          <section class="ipt-list flexBetween" :class="codeError ? 'border-red' : ''">
            <input
              type="text"
              placeholder="Enter invitation code"
              v-model="confirmBeginIpt"
              maxlength="8"
              @input="clearConfirmCode" />
            <img src="../../../assets/images/clearAddress.png" v-show="clearConfirmImg" alt="" @click="clearConfirmIpt"/>
          </section>
        </section> -->
        
        <button type="button" 
          class="confrimBtn" 
          :class="firstBtn ? 'passCorrect' : ''"
          :disabled="!firstBtn"
          @click="confirmFrom">{{ firstBeginBtn }}</button>
      </section>

     

      <!-- 不是首次开启挖矿 -->
      <!-- <section class="begin-dig" v-show="pages == 1">
        <h2>Start Mining</h2>
        <p class="begin-dig-txt">
          You will start mining with "<span>mining wallet<br/> 0x{{ selectedWalletAddress.replace(/(.{6}).+(.{8})/,'$1...$2') }}</span>"
        </p>
        <section class="flexBetween border-bottom">
          <span>Guarantee:</span>
          <span>{{ freezeMoney }} BIUT</span>
        </section>

        <section class="flexBetween border-bottom">
          <span>Available:</span>
          <span>{{ availableMoney }} BIUT</span>
        </section>

        <section class="tips-list">
          <p>
            <img :src="pageIdx == 1 ? agreement : agreements" alt="" @click="checkRadio"/>
            <span>Increase the number of frozen.</span>
          </p>
          <p>
            <label></label>
            <span>Higer of the Mortgage amount, and higher the profit of BIU token </span>
          </p>
        </section>

        <p class="first-dig-txt">Guarantee Amount<span class="color-red">*</span></p>

        <section class="ipt-list flexBetween">
          <input
            type="text"
            placeholder="10.0"
            v-model="beginIpt"
            maxlength="16"
            @input="clearBeginAmount"
            onpaste="return false" />
          <section>
            <img src="../../../assets/images/clearAddress.png" v-show="clearBeginImg" alt="" @click="clearBeginIpt"/>
            <span>BIUT</span>
          </section>
        </section>
        <p class="first-dig-txt-all begin-padding">
          Available：{{ availableMoney }} BIUT <span @click="allBeginAmount">All</span>
        </p>

        <!-- 确认挖矿 -->
        <section class="confrim-content begin-content" v-show="confrimBeginContent">
          <section class="flexBetween">
            <p class="first-dig-txt">Invitation Code <span class="color-red">*</span></p>
            <p class="color-red" v-show="codeError2">Invitation code does not exist or is wrong</p>
          </section>
          <section class="ipt-list flexBetween" :class="codeError2 ? 'border-red' : ''">
            <input
              type="text"
              placeholder="Enter invitation code"
              v-model="beginCodeIpt"
              maxlength="8"
              @input="clearBeginCode" />
            <img src="../../../assets/images/clearAddress.png" v-show="clearBeginConfirmImg" alt="" @click="clearBeginConfirmIpt"/>
          </section>
        </section>

        <button type="button" 
          class="confrimBtn"
          :class="beginBtn ? 'passCorrect' : ''"
          :disabled="!beginBtn"
          @click="confirmBeginFrom">{{ firstBeginBtn }}</button>
      </section> -->

      <!-- 断网 -->
      <section v-show="pages == 2">
        <section class="network-list">
          <img src="../../../assets/images/errorImg.png" alt="">
          <span>{{ networkErrorText }}</span>
        </section>
        <section class="network-btn">
          <button type="button" class="exit"  @click="onAppExit">Exit</button>
          <button type="button" class="continue" @click="onContinue">Continue</button>
        </section>
      </section>

       <!-- 抵押更多 -->
      <section class="first-dig" v-show="pages == 3">
        <h2>Mortgage</h2>
        <p class="first-dig-txt">Mortgage amount <span class="color-red">*</span></p>

        <section class="ipt-list flexBetween">
          <input
            type="text"
            placeholder="10.0"
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
          Available：{{ availableMoney.toLocaleString("en-US") }} BIUT <span @click="allAmountMortgage">All</span>
        </p>
        <p class="first-dig-txt-tips">This BIUT will be locked  for one year. The more BIUT locked, the greater the chance of digging BIU!</p>
        
        <button type="button" 
          class="confrimBtn" 
          :class="mortgageActive ? 'passCorrect' : ''"
          :disabled="!mortgageActive"
          @click="mortgageFrom">{{ mortgageBtn }}</button>
      </section>

    </section>
  </section>
</template>

<script>
import agreement from '../../../assets/images/agreement.png'
import agreements from '../../../assets/images/agreements.png'
export default {
  name: '',
  props: {
    pages: Number,
    networkErrorText: String,
    selectedWalletAddress: String,
    availableMoney: Number,
    freezeMoney: Number,
  },
  data() {
    return {
      confrimContent: false,//第一次确认挖矿邀请码
      firstBeginBtn: 'Open mining',
      firstBeginIpt: '',//第一次开启挖矿的input
      //confirmBeginIpt: '',//第一次开启挖矿邀请码的input
      clearConfirmImg: false,
      clearImg: false,
      codeError: false, //邀请码输入错误的时候显示

      confrimBeginContent: false,
      beginIpt: '',//不是第一次挖矿的input
      beginCodeIpt: '',//不是第一次开启挖矿邀请码的input
      codeError2: false,//不是第一次挖矿邀请码输入错误显示
      clearBeginImg: false,
      clearBeginConfirmImg: false,

      mortgageIpt: '',
      mortgageImg: false,
      mortgageBtn: 'Mortgage',

      pageIdx: 1,
      agreement,
      agreements
    }
  },
  computed: {
    firstBtn () {
      let ipt1 = this.firstBeginIpt
      //let ipt2 = this.confirmBeginIpt.replace(/\s+/g, "")

      return ipt1 > 0 && ipt < this.availableMoney ? true : false
      // if (txt == "Open mining" && ipt1 > 0) {
      //   return true
      // } else if (txt == "Start invitation mining" && ipt2.length === 8) {
      //   return true
      // } else {
      //   return false
      // }
    },

    beginBtn () {
      let txt = this.firstBeginBtn
      let ipt1 = this.beginIpt
      let ipt2 = this.beginCodeIpt.replace(/\s+/g, "")
      let pageIdx = this.pageIdx
      if (txt == "Open mining" && ipt1 > 0 && pageIdx != 1) {
        return true
      } else if (txt == "Start invitation mining" && ipt2.length === 8 && pageIdx != 1) {
        return true
      } else {
        return false
      }
    },

    mortgageActive () {
      let ipt1 = this.mortgageIpt
      return ipt1 > 0 && ipt1 < this.availableMoney ? true : false
    }
  },
  methods: {
    //关闭弹窗
    closeMask () {
      this.$emit('close')
      this.firstBeginBtn = 'Open mining'

      this.confrimContent = false
      this.firstBeginIpt = ''
      this.clearImg = false
      this.confirmBeginIpt = ''
      this.clearConfirmImg = false

      this.confrimBeginContent = false
      this.beginIpt = ''
      this.clearBeginImg = false
      this.beginCodeIpt = ''
      this.clearBeginConfirmImg = false

      this.mortgageIpt = ''
      this.mortgageImg = false
      
      this.pageIdx = 1
      this.codeError = false
      this.codeError2 = false
    },

    //清除第一次挖矿的金额输入框
    clearFirstIpt () {
      this.firstBeginIpt = ''
      this.clearImg = false
    },

    //清除第一次转账确认邀请码输入框
    clearConfirmIpt () {
      this.confirmBeginIpt = ''
      this.clearConfirmImg = false
    },
    
    //第一次转账转出全部金额
    allAmount () {
     this.firstBeginIpt = this.availableMoney
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
    
    //确认提交弹出输入邀请码
    confirmFrom () {
      // this.confrimContent = true
      // if (this.firstBeginBtn == 'Open mining') {
      //   this.$nextTick(()=>{
      //     this.firstBeginBtn = 'Start invitation mining'
      //   })
      // } else {
      //   this.submitFrom()
      // }
      this.submitFrom()
    },

    //确认提交挖矿
    submitFrom () {
      /**
       * 判断邀请码是否正确 或者 无效
       * this.codeError = true
       * this.confirmBeginIpt = ''
       */
      // if (this.confirmBeginIpt != 12345678) {
      //   this.codeError = true
      //   this.confirmBeginIpt = ''
      //   return
      // } else {
      //    this.closeMask ()
      // }

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

    //单选按钮选择
    checkRadio () {
      this.pageIdx = !this.pageIdx
    },

    //清除不是第一次挖矿的金额输入框
    clearBeginIpt () {
      this.beginIpt = ''
      this.clearBeginImg = false
    },

    //清除不是第一次挖矿的邀请码输入框
    clearBeginConfirmIpt () {
      this.beginCodeIpt = ''
      this.clearBeginConfirmImg = false
    },

    //不是首次挖矿转出全部金额
    allBeginAmount () {
      this.beginIpt = this.availableMoney
    },

    //不是首次挖矿确认输入邀请码
    confirmBeginFrom () {
      this.confrimBeginContent = true
      if (this.firstBeginBtn == 'Open mining') {
        this.$nextTick(()=>{
          this.firstBeginBtn = 'Start invitation mining'
        })
      } else {
        this.submitBeginFrom()
      }
    },

    //不是首次挖矿的确认挖矿方法
    submitBeginFrom () {
      /**
       * 判断邀请码是否正确 或者 无效
       * this.codeError2 = true
       * this.beginIpt = ''
       */
      if (this.beginCodeIpt != 12345678) {
        this.codeError2 = true
        this.beginCodeIpt = ''
        return
      } else {
        this.closeMask ()
      }
    },

    //挖矿只能输入金额
    clearFirstAmount () {
      let beginIpt = this.firstBeginIpt.toString()
      if (beginIpt.length > 7 && beginIpt.indexOf(".") < 0) {
        this.firstBeginIpt = String(beginIpt).substring(0,7)
      } else if (beginIpt.indexOf(".") == 0) {
        this.firstBeginIpt = String(beginIpt).substring(0,9)
      } else {
        this.firstBeginIpt =  beginIpt.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符
        this.firstBeginIpt =  beginIpt.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
        this.firstBeginIpt =  beginIpt.replace(".","$#$").replace(/\./g,"").replace("$#$","."); 
        this.firstBeginIpt =  beginIpt.replace(/^(\-)*(\d+)\.(\d\d\d\d\d\d\d\d).*$/,'$1$2.$3');//只能输入两个小数  
      }
    },

    //挖矿只能输入金额
    clearBeginAmount () {
      if (this.beginIpt.length > 7 && this.beginIpt.indexOf(".") < 0) {
        //只能输入7位整数
        this.beginIpt = String(this.beginIpt).substring(0,7)
      } else if (this.beginIpt.indexOf(".") == 0) {
        this.beginIpt = String(this.beginIpt).substring(0,9)
      } else {
        this.beginIpt =  this.beginIpt.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符
        this.beginIpt =  this.beginIpt.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
        this.beginIpt =  this.beginIpt.replace(".","$#$").replace(/\./g,"").replace("$#$","."); 
        this.beginIpt =  this.beginIpt.replace(/^(\-)*(\d+)\.(\d\d\d\d\d\d\d\d).*$/,'$1$2.$3');//只能输入两个小数  
      }
    },

    //不是首次挖矿的邀请码不能输入空格中文
    clearBeginCode () {
      this.$nextTick(()=> {
        this.beginCodeIpt = this.inputNull(this.beginCodeIpt)
      })
    },

    //首次挖矿的邀请码不能输入空格中文
    clearConfirmCode () {
      this.$nextTick(()=> {
        this.confirmBeginIpt = this.inputNull(this.confirmBeginIpt)
      })
    },

    mortgageFrom () {
      this.closeMask ()
    }
  },
  watch: {
    firstBeginIpt(newIpt, oldIpt) {
      if (newIpt.length > 0) {
        this.clearImg = true
      } else {
        this.clearImg = false
      }
    },

    confirmBeginIpt (confirmNew, confirmOld) {
      if (confirmNew.length == 8) {
        this.codeError = false
      } else if ( confirmNew.length > 0) {
        this.clearConfirmImg = true
      } else {
        this.clearConfirmImg = false
      }
    },

    beginIpt(beginNew, beginOld) {
      if (beginNew.length > 0) {
        this.clearBeginImg = true
      } else {
        this.clearBeginImg = false
      }
    },

    beginCodeIpt (codeNew, codeOld) {
      if (codeNew.length == 8) {
        this.codeError2 = false
      } else if (codeNew.length > 0) {
        this.clearBeginConfirmImg = true
      } else {
        this.clearBeginConfirmImg = false
      }
    }
  },
}
</script>

<style scoped>
  .dig-mask {position: relative;font-size: 14px;font-weight: 400;color: #576066;width: 372px;padding: 30px 32px 32px;}
  h2 {margin: 0;font-family: Montserrat-SemiBold;color: #252F33;font-size: 24px;}
  .color-red {color: #EE1C39;}
  .closeImg {width: 16px;height: 16px;position: absolute;top: 12px;right: 20px;}
  
  .flexBetween {display: flex;align-items: center;justify-content: space-between;}

  .first-dig {color: #99A1A6;}
  .ipt-list {height: 40px;border-bottom: 1px solid #E6E6E6;box-sizing: border-box;}
  .ipt-list input {flex: 1;border: 0;}
  .ipt-list section {display: flex;align-items: center;}
  .ipt-list img,.ipt-list section span {margin-left: 8px;cursor: pointer;}
  .first-dig-txt {padding-top: 36px;font-size: 16px;font-family: Lato-Bold;color: #99A1A6;}
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