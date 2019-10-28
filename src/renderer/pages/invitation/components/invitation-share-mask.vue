<template>
  <section class="share-mask">
    <section class="share-content" v-show="sharePage === 0">
      <figure>
        <img src="../../../assets/images/closeMask.png" alt="" @click="close" />
      </figure>
      <h2>{{ $t("homeInvitationMask.hiMaskShareTit1") }}</h2>
      <h3>{{ $t("homeInvitationMask.hiMaskShareTit2") }}</h3>

      <qrcode :value="qrcodeWalletLink" :options="{ size: 128 }"></qrcode>

      <p class="share-txt1">{{ $t("homeWallet.hwCode") }}</p>

      <p class="share-cnt flex-center">{{ invitationCode }}</p>
      <p class="share-address" id="address">{{ qrcodeWalletLink }}</p>
      <button
        type="button"
        class="copyButton"
        :class="copyTimeShow ? 'copySuccessBg' : ''"
        data-clipboard-target="#address"
        @click="copyLink">
        {{ $t(copyButtonText) }}
        <span v-show="copyTimeShow">（{{ copyTimeShowTxt }}s）</span>
      </button>

      <p class="share-txt2">{{ $t("homeInvitationMask.hiMaskShareTxt2") }}</p>
    </section>

    <section class="share-content2"  v-show="sharePage === 1">
      <figure>
        <img src="../../../assets/images/closeMask.png" alt="" @click="close" />
      </figure>
      
      <p class="share-txt2">{{ $t("homeInvitationMask.hiMaskShareTxt3") }}</p>

      <section>
        <button type="button" @click="close">{{ $t("publicBtn.myKnowBtn") }}</button>
        <button type="button" @click="goShare">{{ $t("publicBtn.myGoShowBtn") }}</button>
      </section>
    </section>
  </section>
</template>

<script>
import Qrcode from '@xkeshi/vue-qrcode'
import Clipboard from 'clipboard'
export default {
  name: '',
  components: {
    qrcode: Qrcode,
  },
  props: {
    invitationCode: String,
    sharePage: Number
  },
  data() {
    return {
      copyButtonText: 'homeInvitationMask.hiMaskShareTxt1',
      qrcodeWalletLink: '',
      copyTimeShow: false,
      copyTime: 3,
      copyTimeShowTxt: 3,
    }
  },
  mounted(){
    this.qrcodeWalletLink = "https://mining.biut.io/?code=" + this.invitationCode
  },
  methods: {
    close() {
      this.$emit('close')
    },

    goShare () {
      this.close ()
    },

    //复制私钥
    copyLink() {
      var clipboard = new Clipboard('.copyButton')
      clipboard.on('success', e => {
        clipboard.destroy()
        let clock = window.setInterval(() => {
          var x = this.copyTime--
          this.copyButtonText = "tips.copySuccess"
          this.copyTimeShow = true
          this.copyTimeShowTxt = x
          if (this.copyTime < 0) { // = 0 就停止
            this.copyTime = 3  //恢复默认值
            this.copyTimeShow = false
            this.copyButtonText = "homeInvitationMask.hiMaskShareTxt1"
            window.clearInterval(clock) //清空计时器
          }
        }, 1000)
      })
      clipboard.on('error', e => {
        this.copyButtonText = "tips.copyFailure"
        this.copyTimeShow = true
        let clock = window.setInterval(() => {
          var x = this.copyTime--

          this.copyTimeShowTxt = x
          if (this.copyTime < 0) { // = 0 就停止
            this.copyTime = 5  //恢复默认值
            this.copyTimeShow = false
            this.copyButtonText = "homeInvitationMask.hiMaskShareTxt1"
            window.clearInterval(clock) //清空计时器
          }
        }, 1000)
        clipboard.destroy()
      })
    },
  },
}
</script>

<style scoped>
.share-mask {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 99;
  background: rgba(0, 0, 0, 0.2);
}
.share-content {
  width: 290px;
  height: 445px;
  background: #ffffff;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.16);
  border-radius: 4px;
  padding: 16px 0 20px;
  text-align: center;
}

figure {
  margin: 0;
  text-align: right;
  padding-right: 18px;
  cursor: pointer;
}
h2,
h3 {
  margin: 0;
  color: #42535b;
  font-size: 16px;
  line-height: 1.5;
}
.en h2,h3 {font-family: Source-Medium;font-weight: 500;}

button {
  width: 226px;
  height: 48px;
  font-size: 14px;
  color: #fff;
  border: 0;
  background: linear-gradient(
    90deg,
    rgba(41, 216, 147, 1) 0%,
    rgba(12, 197, 183, 1) 100%
  );
  border-radius: 4px;
}
.en button {font-family: Source-Regular;}

.share-address {
  height: 32px;
}

.share-txt1 {
  padding: 32px 0 10px;
  color: #99a1a6;
  font-size: 13px;
}
.share-txt2 {
  color: #99a1a6;
  font-size: 12px;
  padding-top: 10px;
}

canvas {
  margin-top: 30px;
}

.share-address {
  opacity: 0;
}

.share-cnt {
  width: 226px;
  height: 55px;
  background: #f7fbfa;
  color: #252f33;
  font-size: 24px;
  margin: 0 auto;
}

.copySuccessBg {
  background: linear-gradient(
    90deg,
    rgba(194, 194, 194, 1) 0%,
    rgba(165, 165, 165, 1) 100%
  ) !important;
  pointer-events: none;
}

.share-content2 {
  width:408px;
  height:136px;
  background: #ffffff;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.16);
  border-radius: 4px;
  padding: 16px 20px 20px;
}
.share-content2 figure {
  padding-right: 0;
}
.share-content2 p {
  color: #6D7880;
  font-size: 14px;
}
.share-content2 section {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 55px;
}
.share-content2 section button {
  width:96px;
  height:32px;
  border:1px solid rgba(230,230,230,1);
  background:#fff;
  border-radius:4px;
  color: #99A1A6;
  font-size: 13px;
}
.share-content2 section button:last-child {
  width:96px;
  height:32px;
  border: 0;
  background:linear-gradient(90deg,rgba(41,216,147,1) 0%,rgba(12,197,183,1) 100%);
  opacity:1;
  border-radius:4px;
  color: #fff;
  font-size: 13px;
  margin-left: 8px;
}
</style>