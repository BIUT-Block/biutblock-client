<template>
  <!-- 遮罩层 -->
  <section class="mask">
    <!-- 首次开启挖矿 0-->
    <section class="mask-container dig-mask dig-mask1" v-show="pages == 0">
      <img
        src="../../../assets/images/closeMask.png"
        alt=""
        class="closeImg"
        title="close"
        @click="closeMask"
      />
      <section class="begin-dig">
        <p class="first-dig-tips" v-show="!nameShow">
          {{ $t("homeDigMask.hdMaskBeginTxt1") }}
          <span>{{ poolName }}</span>
          {{ $t("homeDigMask.hdMaskBeginTxt2") }}
        </p>

        <p class="first-dig-tips" v-show="nameShow">
          {{ $t('homeDigMask.hdMaskBeginTxt3') }}
        </p>

        <button
          type="button"
          class="first-dig-btn passCorrect"
          @click="confirmFrom"
        >
          {{ $t("publicBtn.openBtn") }}
        </button>
      </section>
    </section>

    <!-- 断网 2-->
    <section class="mask-container dig-mask dig-mask2" v-show="pages == 2">
      <img
        src="../../../assets/images/closeMask.png"
        alt=""
        class="closeImg"
        title="close"
        @click="closeMask"
      />
      <section>
        <section class="network-list">
          <img src="../../../assets/images/errorImg.png" alt="" />
          <span>{{ $t(networkErrorText) }}</span>
        </section>
        <section class="network-btn">
          <button type="button" class="exit" @click="onAppExit">
            {{ $t("homeDigMask.hdMaskNetworkExit") }}
          </button>
          <!-- <button type="button" class="continue" @click="onContinue">
            {{ $t("homeDigMask.hdMaskNetworkContinue") }}
          </button> -->
        </section>
      </section>
    </section>

    <!-- 抵押更多 3-->
    <section class="mask-container dig-mask dig-mask3" v-show="pages == 3">
      <img
        src="../../../assets/images/closeMask.png"
        alt=""
        class="closeImg"
        title="close"
        @click="closeMask"
      />
      <section class="first-dig">
        <h2>{{ $t("homeDigMask.hdMaskMortgageTit") }}</h2>
        <p class="first-dig-txt">
          {{ $t("homeDigMask.hdMaskMortgageTxt1") }}
          <span class="color-red">*</span>
        </p>

        <section class="ipt-list flexBetween">
          <input
            type="text"
            maxlength="19"
            v-model="mortgageIpt"
            @input="clearMortgage"
            onpaste="return false"
          />
          <section>
            <img
              src="../../../assets/images/clearAddress.png"
              v-show="mortgageImg"
              alt=""
              @click="clearMortgageIpt"
            />
            <span>BIUT</span>
          </section>
        </section>
        <section class="first-dig-txt-all">
          {{ $t("homeWallet.hwBiutTxt1") }}：
          <p>{{ getPointNum(availableMoney) }} BIUT</p>
          <span @click="allAmountMortgage">{{
            $t("homeWalletMask.hwmSentTxt3All")
          }}</span>
        </section>
        <p class="first-dig-txt-tips">{{ $t("homeDig.hdEnteryTxt4") }}</p>

        <button
          type="button"
          class="confrimBtn"
          :class="[mortgageActive ? 'passCorrect' : '',appednReadonly?'cantClick':'']"
          :disabled="!mortgageActive"
          @click="mortgageFrom"
        >
          {{ $t("publicBtn.mortgageBtn1") }}
        </button>
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

      pageIdx: 1,
      nameShow: false,
      appednReadonly: false
    }
  },
  created() {
    if (this.poolName === "" || this.poolName === null) {
      this.nameShow = true
    }
  },
  computed: {
    mortgageActive() {
      let ipt1 = this.mortgageIpt
      if (this.mortgageIpt.length > 10 && this.mortgageIpt.indexOf(".") < 0) {
        //只能输入10位整数
        this.mortgageIpt = String(this.mortgageIpt).substring(0, 10)
      } else if (this.mortgageIpt.indexOf(".") == 0) {
        this.mortgageIpt = String(this.mortgageIpt).substring(0, 9)
      } else {
        this.mortgageIpt = this.mortgageIpt.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符
        this.mortgageIpt = this.mortgageIpt.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
        this.mortgageIpt = this.mortgageIpt.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
        this.mortgageIpt = this.mortgageIpt.replace(/^(\-)*(\d+)\.(\d\d\d\d\d\d\d\d).*$/, '$1$2.$3');//只能输入两个小数  
      }
      return ipt1 > 0 && Number(ipt1) <= Number(this.availableMoney) ? true : false
    }
  },
  methods: {
    //关闭弹窗
    closeMask() {
      this.$emit('close')

      this.mortgageIpt = ''
      this.mortgageImg = false

      this.pageIdx = 1
    },

    clearMortgage() {
      this.$nextTick(() => {
        this.mortgageIpt = this.inputNull(this.mortgageIpt)
      })
    },

    clearMortgageIpt() {
      this.mortgageIpt = ''
      this.mortgageImg = false
    },

    allAmountMortgage() {
      this.mortgageIpt = this.availableMoney
    },

    //确认提交
    confirmFrom() {
      if (!navigator.onLine) {
        this.pages = 2
      } else {
        this.closeMask()
        this.$emit('beginMining')
      }
    },

    //断网的方法处理
    onContinue() {
      this.$emit('exit')
    },

    //断网的方法处理
    onAppExit() {
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
    
    mortgageFrom() {
      this.$emit('addMoreMortgage', this.mortgageIpt)
      this.closeMask()
    }
  },
  watch: {

  },
}
</script>

<style scoped>
.dig-mask {
  position: relative;
  font-size: 14px;
  font-weight: 400;
  color: #576066;
  width: 372px;
}
.dig-mask1 {
  padding: 12px 20px 16px 24px;
  width:400px;height:136px;
}
.dig-mask2 {
  padding: 12px 20px 16px 24px;
  width:400px;height:136px;
}
.dig-mask3 {
  padding: 30px 32px 32px;
}


.en .dig-mask {
  color: #99a1a6;
}
h2 {
  margin: 0;
  font-family: Montserrat-SemiBold;
  color: #252f33;
  font-size: 24px;
}
.en h2 {
  font-family: Source-Medium;
  font-size: 22px;
  font-weight: 500;
}
.color-red {
  color: #ee1c39;
}
.closeImg {
  width: 16px;
  height: 16px;
  position: absolute;
  top: 12px;
  right: 20px;
}

.flexBetween {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.begin-dig {
  height: 110px;
  text-align: right;
}
.begin-dig .first-dig-tips {
  font-size: 14px;
  padding-top: 32px;
  text-align: left;
  color: #576066;
}
.begin-dig .first-dig-tips span {
  font-family: Lato-Regular;
}
.first-dig-btn {
  width: 97px;
  border: 0;
  color: #fff;
  height: 32px;
  margin-top: 58px;
  background: linear-gradient(
    90deg,
    rgba(41, 216, 147, 1) 0%,
    rgba(12, 197, 183, 1) 100%
  );
  border-radius: 4px;
}

.ipt-list {
  height: 40px;
  border-bottom: 1px solid #e6e6e6;
  box-sizing: border-box;
}
.ipt-list input {
  flex: 1;
  border: 0;
}
.ipt-list section {
  display: flex;
  align-items: center;
}
.ipt-list img,
.ipt-list section span {
  margin-left: 8px;
  cursor: pointer;
  font-family: Lato-Medium;
}
.first-dig-txt {
  padding-top: 36px;
  font-size: 16px;
  font-family: Lato-Bold;
  color: #99a1a6;
}
.en .first-dig-txt {
  font-family: Source-Medium;
}
.first-dig-txt-all {
  padding: 8px 0 12px;
  font-size: 12px;
  display: flex;
}
.first-dig-txt-all p {
  font-family: Lato-Regular;
}
.first-dig-txt-all span {
  color: #29d893;
  padding-left: 8px;
  cursor: pointer;
}
.first-dig-txt-tips {
  line-height: 1.2;
  padding-bottom: 28px;
}

.first-dig .flexBetween .first-dig-txt {
  padding: 0;
}
.confrim-content {
  padding: 8px 0 38px;
}

.begin-dig-txt {
  font-size: 14px;
  color: #99a1a6;
  padding: 32px 0 2px;
  line-height: 1.5;
}
.begin-dig-txt span {
  color: #252f33;
  font-family: Lato-Medium;
}
.begin-dig .first-dig-txt {
  padding-top: 0;
}

.tips-list {
  padding: 24px 0 16px;
}
.tips-list p {
  display: flex;
  color: #99a1a6;
}
.tips-list p:first-child {
  font-size: 14px;
  padding-bottom: 2px;
}
.tips-list p:last-child {
  font-size: 12px;
}
.tips-list p img {
  display: flex;
  align-items: center;
  width: 16px;
  height: 16px;
  margin-right: 12px;
  cursor: pointer;
}
.tips-list p label {
  width: 28px;
}

.confrimBtn {
  width: 372px;
  height: 48px;
  background: #d8d8d8;
  border-radius: 4px;
  color: #f7fbfa;
  font-size: 14px;
  border: 0;
  font-family: Lato-Regular;
}

.network-list {
  display: flex;
  align-items: center;
  color: #576066;
  font-size: 14px;
}
.network-list img {
  margin-right: 10px;
}
.network-btn {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-top: 80px;
}
.network-btn button {
  width: 96px;
  height: 32px;
  border-radius: 4px;
  font-size: 14px;
}
.exit {
  border: 1px solid #e6e6e6;
  color: #ee1c39;
  background: #fff;
}
.continue {
  background: linear-gradient(90deg, #29d893 0%, #0cc5b7 100%);
  color: #fff;
  border: 0;
  margin-left: 8px;
}

.border-bottom {
  border-bottom: 1px solid #e6e6e6;
  height: 40px;
}
.border-bottom span:first-child {
  font-family: Lato-Bold;
  color: #99a1a6;
}
.begin-padding {
  padding-bottom: 32px;
}
.confrim-content {
  margin: -12px 0 24px;
  padding: 0;
}
</style>