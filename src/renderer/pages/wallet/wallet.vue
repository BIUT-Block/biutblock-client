<template>
  <el-container class="walletCnt">
    <el-row>
      <el-col :span="24">
        <left-nav :wallet-name="walletName" :wallet-address="walletAddress"></left-nav>
      </el-col>
    </el-row>

    <el-row >
      <el-col :span="24" class="publicWalletP">
        <section class="walletMaginT">
          
          <section class="walletHeader">
            <section class="walletHeaderList">
              <p>
                <img src="../../assets/image/walletLogo.png" alt="" class="walletLogoImg">
                {{walletName}}
              </p>

              <section style="position: relative"  class="pointerTxt">
                <img src="../../assets/image/deleteBtn.png" alt="" @click="positionFrom">
                <section v-show="positionBtnH" class="positionBtn">
                  <el-button @click="dialogVisible" class="deleteBtn">Delete wallet</el-button>
                  <el-button @click="detailsWallet" class="detailsBtn">Wallet details</el-button>
                </section>
              </section>

            </section>

            <p class="walletMoneyTxt">{{walletMoney}} SEC Token</p>
            <p class="walletAddressTxt">{{walletAddress}}</p>
          </section>

          <section class="walletListCnt">
            <router-link :to="{name: 'receipt', query: {privateKey: this.privateKey, publicKey: this.publicKey, walletAddress: this.walletAddress, walletMoney: this.walletMoney}}" tag="button" class="pointerTxt walletListBtn">
              <img src="../../assets/image/walletReceipt.png" alt="" class="walletListTxt">
              Receipt
            </router-link>
            <router-link :to="{name: 'transfer', query: {privateKey: this.privateKey, publicKey: this.publicKey, walletAddress: this.walletAddress, walletMoney: this.walletMoney}}" tag="button" class="pointerTxt walletListBtn">
               <img src="../../assets/image/walletTransfer.png" alt="" class="walletListTxt">
              Transfer
            </router-link>
          </section>
        </section>

        <section class="walletRecordCnt">
          <section class="walletRecordTxt">
            <span>Transaction Record</span>
          </section>

          <section v-show="tradingCnt" class="walletNoneCnt">
              <p>
                <img src="../../assets/image/moneyNo.png" alt="">
              </p>
              <p style="color:#939CB2;margin: 16px 0 46px;">No transaction data</p>
              <p>
                <img src="../../assets/image/refresh.png" alt="">
              </p>
          </section>

          <section v-show="!tradingCnt" class="walletCntList">
              <ul>
                <li v-for="item in walletList" :index="item.id">
                    <section class="radiusCnt">
                      <span class="radiusIcon" :class="item.listState | radiusColor"> </span>
                    </section>
                    <section class="addressCnt">
                      <p>{{item.listAddress}}</p>
                      <p class="addressMt">{{item.listTime}}</p>
                    </section>
                    <section class="moneyCnt">
                      <p><span :class="item.listState | statusColor">{{item.listMoney}}</span> SEC</p>
                      <p class="addressMt">{{item.listState}}</p>
                    </section>
                </li>
              </ul>
          </section>
        </section>

        <el-dialog
          title=""
          :visible.sync="centerDialogVisible"
          width="432px"
          :show-close=false
          center>
          <p style="color: #657292;text-align: center;">
            Whether to delete the wallet
          </p>
          <span slot="footer" class="dialog-footer">
            <button class="publicBtn publicBtnAcitve" @click="deleteWallet">determine</button>
            <button class="publicBtn publicBtnAcitve" @click="centerDialogVisible = false">cancel</button>
          </span>
        </el-dialog>
      </el-col>
    </el-row>
  </el-container>
</template>

<script>
import leftNav from "./components/leftNav";
export default {
  name: "",
  data() {
    return {
      tradingCnt: false,
      positionBtnH: false,
      centerDialogVisible: false,
      publicKey: "",
      privateKey: "",
      walletAddress: "",
      walletName: "wallet 01",
      walletMoney: "1,000.2345678 SEC",
      walletAddress: "",
      //   walletList: [{
      //     id: '01',
      //     listAddress: '0x75f04e06b80b4b249a878000714e038fcc746ac54f56a49fabba5f1cb9449828',
      //     listTime: '16:23 12 dec 2018',
      //     listMoney: '+ 100',
      //     listState: 'Packed'
      //   },
      //   {
      //     id: '02',
      //     listAddress: '0x75f04e06b80b4b249a878000714e038fcc746ac54f56a49fabba5f1cb9449828',
      //     listTime: '16:23 12 dec 2018',
      //     listMoney: '+ 100',
      //     listState: 'Failed'
      //   },
      //   {
      //     id: '03',
      //     listAddress: '0x75f04e06b80b4b249a878000714e038fcc746ac54f56a49fabba5f1cb9449828',
      //     listTime: '16:23 12 dec 2018',
      //     listMoney: '+ 100',
      //     listState: 'Successful'
      //   },
      //   {
      //     id: '04',
      //     listAddress: '0x75f04e06b80b4b249a878000714e038fcc746ac54f56a49fabba5f1cb9449828',
      //     listTime: '16:23 12 dec 2018',
      //     listMoney: '+ 100',
      //     listState: 'Failed'
      //   }]
      // }
      walletList: []
    };
  },
  created() {
    let moneyValue = ''
    this.privateKey = this.$route.query.walletPrivateKey;
    this.publicKey = this.$route.query.walletPublicKey;
    this.walletAddress = this.$route.query.walletAddress;
    this.walletMoney = this.$route.query.walletBalance;
    this.$JsonRPCClient.client.request('sec_getBalance', [this.walletAddress], (err, response) => {
      if(response.result.status === '1'){
        this.walletMoney = response.result.value
      }
    })

    this.$JsonRPCClient.client.request("sec_getTransactions", [this.walletAddress], (err, response) => {
        if (response.result.resultInPool) {
            for (let j = 0; j < response.result.resultInPool.length; j++) {
              if (response.result.resultInPool[j].TxTo === this.walletAddress) {
                moneyValue = "+ " + response.result.resultInPool[j].Value
              } else {
                moneyValue = "- " + response.result.resultInPool[j].Value
              }
              this.walletList.push({
                id: response.result.resultInPool[j].TxHeight,
                listAddress: response.result.resultInPool[j].TxTo,
                listTime: new Date(response.result.resultInPool[j].TimeStamp).toUTCString(),
                listMoney: moneyValue,
                listState: "Packed"
            });
          }
        }
        if (response.result.resultInChain) {
          for (let i = 0; i < response.result.resultInChain.length; i++) {
            if (response.result.resultInChain[i].TxTo === this.walletAddress) {
                moneyValue = "+ " + response.result.resultInChain[i].Value
              } else {
                moneyValue = "- " + response.result.resultInChain[i].Value
              }
            this.walletList.push({
              id: response.result.resultInChain[i].TxHeight,
              listAddress: response.result.resultInChain[i].TxTo,
              listTime: new Date(response.result.resultInChain[i].TimeStamp).toUTCString(),
              listMoney: moneyValue,
              listState: "Successful"
            });
          }
        }
        
      }
    );
  },

  methods: {
    positionFrom() {
      this.positionBtnH = true;
    },
    dialogVisible() {
      this.centerDialogVisible = true;
      this.positionBtnH = false;
    },
    detailsWallet() {
      //钱包详情  可传对应的参数
      this.$router.push({ path: "/recordsDetails" });
    },
    deleteWallet() {
      //删除钱包
      this.positionBtnH = false;
      this.centerDialogVisible = false;
    },
    tradingListCnt() {
      //获取钱包列表
      //有列表  直接 加载
      //无数据 this.tradingCnt = true
    }
  },
  components: {
    leftNav
  },
  filters: {
    statusColor(status) {
      const statusMap = {
        Packed: "TxtColor",
        Successful: "TxtColor2"
      };
      return statusMap[status];
    },
    radiusColor(status) {
      const statusMap = {
        Packed: "bgColor1",
        Successful: "bgColor2",
        Failed: "bgColor3"
      };
      return statusMap[status];
    }
  }
};
</script>

<style scoped>
.bgColor1 {
  background: #f5a623;
}
.bgColor2 {
  background: #56b2c9;
}
.bgColor3 {
  background: #ff8db2;
}

.walletCnt {
  display: flex;
}

.walletRecordCnt {
  width: 606px;
  height: 384px;
  display: flex;
  flex-direction: column;
  background: #fff;
  margin-top: 16px;
}
.walletRecordTxt {
  width: 560px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  height: 55px;
  border-bottom: 1px solid #c8d1da;
}

.walletListCnt {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 16px;
}
.walletListBtn {
  outline: none;
  color: #657292;
  border: none;
  width: 130px;
  height: 58px;
  margin: 0;
  background: #fff;
}
.walletListTxt {
  vertical-align: middle;
  margin-right: 8px;
}

.walletMoneyTxt {
  margin-left: 24px;
  color: #00d6b2;
  font-size: 28px;
}
.walletAddressTxt {
  margin-left: 24px;
  color: #657292;
}

.deleteBtn {
  width: 100%;
  border: none;
  background: #242e49;
  color: #fff;
  border-radius: 0;
}
.detailsBtn {
  width: 100%;
  border: none;
  border-top: 1px solid #fff;
  border-radius: 0;
  margin-left: 0;
  color: #fff;
  background: #242e49;
}

.walletMaginT {
  display: flex;
  justify-content: space-between;
  height: 132px;
  margin-top: 24px;
}

.walletLogoImg {
  vertical-align: middle;
  margin-right: 11px;
}

.walletHeader {
  width: 460px;
  height: 132px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  background: #fff;
}
.walletHeaderList {
  display: flex;
  justify-content: space-between;
  margin: 0 24px;
}

.walletNoneCnt {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.walletCntList {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: start;
}

ul {
  width: 560px;
  margin: 0 auto;
}
ul li {
  height: 80px;
  width: 100%;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #c8d1da;
  color: #657292;
}

ul li .radiusCnt {
  display: flex;
  align-items: center;
  width: 20px;
}
.radiusIcon {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: block;
}

ul li .addressCnt {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  flex: 1;
}
ul li .addressMt {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  flex: 1;
}

ul li .moneyCnt {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: flex-end;
  width: 100px;
}

.positionBtn {
  position: absolute;
  bottom: -72px;
  right: 0;
  width: 138px;
  height: 72px;
  border-radius: 0;
  background: #242e49;
}
</style>