<template>
  <section class="mask">
    <section class="mask-container pool-mask">
      <header class="record-head">
        <h2>Create the mining pool</h2>
        <img src="../../../assets/images/closeMask.png" alt="" title="close" @click="cloasMask">
      </header>

      <section>
        <p class="pool-txt1">Congratulations on getting the opportunity to creat mining pool. You can get more mining profit by completing the following operations.</p>
        <section class="flexBetween">
          <p class="pool-txt2">Guarantee Amount<span class="color-red">*</span></p>
          <p class="color-red" v-show="nameError">Duplicate mine name</p>
        </section>
        
        <section class="ipt-list flexBetween" :class="nameError ? 'border-red' : ''">
          <input
            type="text"
            placeholder="10.0"
            v-model="poolName"
            maxlength="15"
            @input="poolNameIpt" />
          <img src="../../../assets/images/clearAddress.png" v-show="clearImg" alt="" @click="clearIpt"/>
        </section>
      </section>

      <button 
        type="button"
        :class="updateIpt ? 'passCorrect' : ''"
        :disabled="!updateIpt"
        @click="submitFrom">
        Apply for opening a mining pool
      </button>
    </section>
  </section>
</template>

<script>
import WalletHandler from '../../../lib/WalletsHandler';
export default {
  name: '',
  props: {walletAddress: String, privateKey: String},
  data() {
    return {
      poolName: '',
      clearImg: false,
      nameError: false
    }
  },
  computed: {
    updateIpt () {
      let name = this.poolName.trim()
      if (name > 0 && this.poolNameIpt()) {
        return true
      }
    }
  },
  methods: {
    clearIpt () {
      this.poolName = ''
      this.clearImg = false
    },

    cloasMask () {
      this.$emit('close')
      this.clearIpt()
    },

    submitFrom() {
      let transfer = {
        nonce: 1,
        timestamp: new Date().getTime(),
        walletAddress: this.walletAddress,
        amount: '0',
        gasLimit: '0',
        gasPrice: '0',
        txFee: '0',
        chainName: 'SEC'
      }
      this.$JsonRPCClient.createContractTransaction(this.walletAddress, this.privateKey, transfer, (contractAddress, response) => {
        let transferTimeLock = {
          timestamp: new Date().getTime(),
          walletAddress: this.walletAddress,
          sendToAddress: contractAddress,
          amount: '100000',
          gasLimit: '0',
          gasPrice: '0',
          txFee: '0',
          chainName: 'SEC'
        }
        this.$JsonRPCClient.sendContractTransaction(this.walletAddress, this.privateKey, new Date().getTime() + 60 * 1000, transferTimeLock, (response) => {
          if (response.result.status === '1') {
            this.$emit('appendContract', this.privateKey, contractAddress)
          } 
        })
      })

      alert("点击了提交按钮")
      this.cloasMask()
    },

    //input开始不能输入空格、检测名称是否相同
    poolNameIpt () {
      this.$nextTick(()=> {
        this.poolName = this.poolName.replace(/(^\s*)/g, '')
      })

      let name = this.poolName.trim()
      /**
       * 判断名称重复 
       * this.nameError = true
       * 
       * 否则按钮可以点击状态
       */
      if (name === "1") {
        this.nameError = true
        return false
      } else {
        this.nameError = false
        return true
      }
    }
  },
  watch: {
    poolName(newVal, oldVal) {
      let xReg = /[^\x00-\xff]/g
      if (newVal.length > 0) {
        this.clearImg = true
      } else {
        this.clearImg = false
      }

      if (this.getBLen(newVal) > 15 && xReg.test(newVal)) {
        this.$nextTick(()=> {
          this.poolName = newVal.slice(0, 7)
        })
      }
    }
  },
}
</script>

<style scoped>
  .pool-mask {width: 372px;padding: 30px 32px 28px;}
  .record-head {position: relative;}
  .record-head h2 {margin: 0;font-size: 24px;font-family: Montserrat-SemiBold;}
  .record-head img {position: absolute;top: -10px;right: -12px;cursor: pointer;}

  .flexBetween {display: flex;align-items: center;justify-content: space-between;}

  .ipt-list {height: 40px;border-bottom: 1px solid #E6E6E6;box-sizing: border-box;}
  .ipt-list input {flex: 1;border: 0;}
  .ipt-list section {display: flex;align-items: center;}
  .ipt-list img,.ipt-list section span {margin-left: 8px;cursor: pointer;}

  .pool-txt1 {color: #99A1A6;line-height: 1.2;padding: 32px 0 16px;}
  .pool-txt2 {color: #99A1A6;font-size: 16px;font-family: Lato-Bold;}

  input,button {font-family: Lato-Regular;}
  button {width:372px;height:48px;background:#d8d8d8;border-radius:4px;border: 0;color: #F7FBFA;font-size: 14px;
    margin-top: 32px;}

  .color-red {color: #EE1C39;}
</style>