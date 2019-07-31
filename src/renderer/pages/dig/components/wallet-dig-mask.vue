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
            v-model="firstBeginIpt"
          />
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
        <section class="confrim-content" v-show="confrimContent">
          <section class="flexBetween">
            <p class="first-dig-txt">Invitation Code <span class="color-red">*</span></p>
            <p class="color-red" v-show="codeError">Invitation code does not exist or is wrong</p>
          </section>
          <section class="ipt-list flexBetween">
            <input
              type="text"
              placeholder="Please enter the invitation code"
              v-model="confirmBeginIpt"
            />
            <img src="../../../assets/images/clearAddress.png" v-show="clearConfirmImg" alt="" @click="clearConfirmIpt"/>
          </section>
        </section>
        
        <button type="button" @click="confirmFrom" class="confrimBtn">{{ firstBeginBtn }}</button>
      </section>

      <!-- 不是首次开启挖矿 -->
      <section class="begin-dig" v-show="pages == 1">
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
          />
          <section>
            <img src="../../../assets/images/clearAddress.png" v-show="clearBeginImg" alt="" @click="clearBeginIpt"/>
            <span>BIUT</span>
          </section>
        </section>
        <p class="first-dig-txt-all begin-padding">
          Available：{{ availableMoney.toLocaleString("en-US") }} BIUT <span @click="allBeginAmount">All</span>
        </p>

        <!-- 确认挖矿 -->
        <section class="confrim-content begin-content" v-show="confrimBeginContent">
          <section class="flexBetween">
            <p class="first-dig-txt">Invitation Code <span class="color-red">*</span></p>
            <p class="color-red" v-show="codeError2">Invitation code does not exist or is wrong</p>
          </section>
          <section class="ipt-list flexBetween">
            <input
              type="text"
              placeholder="Please enter the invitation code"
              v-model="beginCodeIpt"
            />
            <img src="../../../assets/images/clearAddress.png" v-show="clearBeginConfirmImg" alt="" @click="clearBeginConfirmIpt"/>
          </section>
        </section>

        <button type="button" class="confrimBtn" @click="confirmBeginFrom">{{ firstBeginBtn }}</button>
      </section>

      <!-- 断网 -->
      <section v-show="pages == 2">
        <p>{{ networkErrorText }}</p>
          <button type="button" class="continue" @click="onContinue">Continue</button>
          <button type="button" class="exit"  @click="onAppExit">Exit</button>
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
    availableMoney: String,
    freezeMoney: String,
  },
  data() {
    return {
      confrimContent: false,//第一次确认挖矿邀请码
      firstBeginBtn: 'Open mining',
      firstBeginIpt: '',//第一次开启挖矿的input
      confirmBeginIpt: '',//第一次开启挖矿邀请码的input
      clearConfirmImg: false,
      clearImg: false,
      codeError: false, //邀请码输入错误的时候显示

      confrimBeginContent: false,
      beginIpt: '',//不是第一次挖矿的input
      beginCodeIpt: '',//不是第一次开启挖矿邀请码的input
      codeError2: false,//不是第一次挖矿邀请码输入错误显示
      clearBeginImg: false,
      clearBeginConfirmImg: false,

      pageIdx: 1,
      agreement,
      agreements
    }
  },
  methods: {
    closeMask () {
      this.$emit('close')
      this.confrimContent = false
      this.firstBeginBtn = 'Open mining'
      this.firstBeginIpt = ''
      this.clearImg = false
      this.confirmBeginIpt = ''
      this.clearConfirmImg = false

      this.beginIpt = ''
      this.clearBeginImg = false
      this.beginCodeIpt = ''
      this.clearBeginConfirmImg = false
      this.confrimBeginContent = false

      this.pageIdx = 1
    },

    clearFirstIpt () {
      this.firstBeginIpt = ''
      this.clearImg = false
    },

    clearConfirmIpt () {
      this.confirmBeginIpt = ''
      this.clearConfirmImg = false
    },

    allAmount () {
     this.firstBeginIpt = this.availableMoney
    },

    confirmFrom () {
      this.confrimBeginContent = true
      if (this.firstBeginBtn == 'Open mining') {
        this.$nextTick(()=>{
          this.firstBeginBtn = 'Start invitation mining'
        })
      } else {
        this.submitFrom()
      }
    },

    submitFrom () {
      alert('点击了确认挖矿')
      this.closeMask ()
    },

    onContinue () {
      this.$emit('continue')
    },

    onAppExit () {
      this.$emit('exit')
    },

    checkRadio () {
      this.pageIdx = !this.pageIdx
    },

    clearBeginIpt () {
      this.beginIpt = ''
      this.clearBeginImg = false
    },

    clearBeginConfirmIpt () {
      this.beginCodeIpt = ''
      this.clearBeginConfirmImg = false
    },

    allBeginAmount () {
      this.beginIpt = this.availableMoney
    },

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

    submitBeginFrom () {
      alert('点击了确认挖矿')
      this.closeMask ()
    },
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
      if (confirmNew.length > 0) {
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
      if (codeNew.length > 0) {
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
  h2 {margin: 0;}
  .color-red {color: #EE1C39;}
  .closeImg {width: 16px;height: 16px;position: absolute;top: 12px;right: 20px;}
  
  .flexBetween {display: flex;align-items: center;justify-content: space-between;}

  .first-dig {color: #99A1A6;}
  .ipt-list {height: 40px;border-bottom: 1px solid #E6E6E6;box-sizing: border-box;}
  .ipt-list input {flex: 1;border: 0;}
  .ipt-list section {display: flex;align-items: center;}
  .ipt-list img,.ipt-list section span {margin-left: 8px;cursor: pointer;}
  .first-dig-txt {padding-top: 36px;font-size: 16px;}
  .first-dig-txt-all {padding: 8px 0 12px;}
  .first-dig-txt-all span {color: #29D893;padding-left: 8px;cursor: pointer;}
  .first-dig-txt-tips {line-height: 1.2;padding-bottom: 28px;}
  
  .first-dig .flexBetween .first-dig-txt {padding: 0;}
  .confrim-content {padding: 8px 0 38px;}

  .begin-dig-txt {font-size: 14px;color: #99A1A6;padding: 32px 0 2px;line-height: 1.2;}
  .begin-dig-txt span {color: #252F33;}
  .begin-dig .first-dig-txt {padding-top: 0;}

  .tips-list {padding: 24px 0 16px;}
  .tips-list p {display: flex;color: #99A1A6;}
  .tips-list p:first-child {font-size: 14px;padding-bottom: 2px;}
  .tips-list p:last-child {font-size: 12px;}
  .tips-list p img {display: flex;align-items: center;width: 16px;height: 16px;margin-right: 12px;cursor: pointer;}
  .tips-list p label {width: 28px;}

  .confrimBtn {width:372px;height:48px;background:linear-gradient(90deg,#16d88b 0%,#0cbccc 100%);
    border-radius:4px;color: #F7FBFA;font-size: 14px;border: 0;}

  .exit {background:linear-gradient(90deg,#ee1c39 0%,#d91949 100%);}
  .continue {background:linear-gradient(90deg,#29d893 0%,#29d893 100%);}

  .border-bottom {border-bottom:1px solid #e6e6e6;height: 40px;}
  .begin-padding {padding-bottom: 32px;}
  .confrim-content {margin: -12px 0 24px;padding: 0;}
</style>