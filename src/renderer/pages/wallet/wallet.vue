<template>
  <el-container class="walletCnt" @click.native="closeDetailsList">
    <el-row>
      <el-col :span="24">
        <left-nav :wallet-name="walletName" :wallet-address="walletAddress" :wallets-arr="walletsArr" :wallet-pwd="walletPwd"
        :wallet-private-key="privateKey" :wallet-public-key="publicKey" :wallet-balance="walletMoney" :color-arr="colorArr"></left-nav>
      </el-col>
    </el-row>

    <el-row style="margin-left: 32px;">
      <el-col :span="24" class="publicWalletP">
        <section class="walletMaginT">
          <section class="walletHeader">
            <section class="walletHeaderList">
              <p style="font-weight:bold;">
                <img src="../../assets/image/walletLogo.png" alt="" class="walletLogoImg">
                {{walletName}}
              </p>
              <section id='detailsList' style="position: relative"  class="pointerTxt">
                <img src="../../assets/image/deleteBtn.png" alt="" @click="positionFrom">
                <section v-show="positionBtnH" class="positionBtn">
                  <el-button @click="dialogVisible" :disabled="walletsArr.length<=1" class="deleteBtn">
                    Delete wallet
                  </el-button>
                  <!-- <el-button @click="detailsWallet" class="detailsBtn">Wallet details</el-button> -->
                </section>
              </section>
            </section>

            <p class="walletMoneyTxt">{{walletMoney}} SEC Token</p>
            <p class="walletAddressTxt">{{walletAddress}}</p>
          </section>

          <section class="walletListCnt">
            <router-link :to="{name: 'receipt', 
              query: {privateKey: this.privateKey, publicKey: this.publicKey, walletsArr: this.walletsArr, walletName: this.walletName, walletPwd: this.walletPwd, walletAddress: this.walletAddress, walletMoney: this.walletMoney, colorArr: this.colorArr,pageId: 1}}" 
              tag="button" class="pointerTxt walletListBtn">
              <img src="../../assets/image/walletReceipt.png" alt="" class="walletListTxt">
              Receipt
            </router-link>
            <router-link :to="{name: 'transfer', 
              query: {privateKey: this.privateKey, publicKey: this.publicKey, walletsArr: this.walletsArr, walletName: this.walletName, walletPwd: this.walletPwd, walletAddress: this.walletAddress, walletMoney: this.walletMoney, colorArr: this.colorArr,pageId: 1}}" 
              tag="button" class="pointerTxt walletListBtn">
               <img src="../../assets/image/walletTransfer.png" alt="" class="walletListTxt">
              Transfer
            </router-link>
          </section>
        </section>

        <section class="walletRecordCnt">
          <section class="walletRecordTxt">
            <span>Transaction Record</span>
          </section>
          <section v-show="refresh" class="walletNoneCnt">
            <div class="lds-dual-ring" style="margin: 16px 0px;"></div>
          </section>
          <section v-show="tradingCnt&&!refresh" class="walletNoneCnt">
              <p>
                <img src="../../assets/image/moneyNo.png" alt="">
              </p>
              <p style="color:#939CB2;margin: 16px 0px;">No transaction data</p>
          </section>

          <section v-show="!tradingCnt&&!refresh" class="walletCntList">
              <ul class="tradingList" :class="tradingListAuto">
                <li v-for="item in showList" :index="item.id" @click="toTxDetails(item)" class="pointerTxt">
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
          <section class="clickMore pointerTxt" v-show="moreCnt&&!refresh" @click="showMore">
            <i class="el-icon-arrow-down" style="margin-right:5px;"></i>
            Click to load more
          </section>
        </section>

        
        <el-dialog
          title="prompt"
          :visible.sync="centerDialogVisible"
          width="432px"
          :show-close = true
          :closeOnClickModal = false
          top="30vh"
          center>
          <p style="color: #939CB2;font-size:14px;text-align: center;margin: 60px 0 93px;">
            Whether to delete the wallet
          </p>
          <span slot="footer" class="dialog-footer">
            <button class="publicBtn publicBtnAcitve" @click="deleteWallet">Confirm</button>
            <button class="publicBtn publicBtnAcitve" @click="centerDialogVisible = false">Cancel</button>
          </span>
        </el-dialog>

      </el-col>
    </el-row>
  </el-container>
</template>

<script>
import leftNav from "./components/leftNav";
const fs = require("fs")
const CryptoJS = require("crypto-js")
const jwt = require('jsonwebtoken')
import {EventBus} from "../../lib/EventBus.js"

export default {
  name: "",
  data() {
    return {
      tradingCnt: false, //如果没有交易记录的话 true  有交易数据就设置为 false
      moreCnt: false, //加载更多，交易记录大于四条就 设置为 true  然后点击就加载四条
      tradingListAuto: '',//加载更多的时候显示滚动条
      positionBtnH: false,
      centerDialogVisible: false,
      publicKey: "",
      privateKey: "",
      walletAddress: "",
      walletName: "wallet 01",
      walletMoney: "1,000.2345678 SEC",
      walletAddress: "",
      walletsArr: [],
      walletPwd: "",
      colorArr: [],
      walletList: [],
      showList: [],
      refresh: true
    };
  },
  created() {
    let moneyValue = ''
    let walletAddressTempInPool = ''
    let walletAddressTempInChain = ''
    this.privateKey = this.$route.query.walletPrivateKey;
    this.publicKey = this.$route.query.walletPublicKey;
    this.walletAddress = this.$route.query.walletAddress;
    this.walletMoney = this.$route.query.walletBalance;
    this.walletsArr = this.$route.query.walletsArr;
    this.walletPwd = this.$route.query.walletPwd;
    this.walletName = this.$route.query.walletName;
    
    if (this.$route.query.colorArr) {
      this.colorArr = this.$route.query.colorArr
    } else {
      this.colorArr = [true].concat(new Array(this.walletsArr.length-1).fill(false))
    }

    this.walletList = []
    this.$JsonRPCClient.client.request('sec_getBalance', [this.walletAddress], (err, response) => {
      if(response.result.status === '1'){
        this.walletMoney = response.result.value
      }
    })
    this.refresh = true
    this.$JsonRPCClient.client.request("sec_getTransactions", [this.walletAddress], (err, response) => {
        if (response.result.resultInPool) {
            for (let j = 0; j < response.result.resultInPool.length; j++) {
              if (response.result.resultInPool[j].TxTo === this.walletAddress) {
                moneyValue = "+ " + response.result.resultInPool[j].Value
                walletAddressTempInPool = response.result.resultInPool[j].TxFrom
              } else {
                moneyValue = "- " + response.result.resultInPool[j].Value
                walletAddressTempInPool = response.result.resultInPool[j].TxTo
              }
              this.walletList.push({
                id: response.result.resultInPool[j].TxHash,
                blockNumber: "Not in Block yet",
                listAddress: walletAddressTempInPool,
                listFrom: response.result.resultInPool[j].TxFrom, 
                listTo: response.result.resultInPool[j].TxTo,              
                listTime: new Date(response.result.resultInPool[j].TimeStamp).toUTCString(),
                listMoney: moneyValue,
                listMinerCost: response.result.resultInPool[j].TxFee, 
                listState: "Packed"
            });
          }
        }
        if (response.result.resultInChain) {
          for (let i = 0; i < response.result.resultInChain.length; i++) {
            if (response.result.resultInChain[i].TxTo === this.walletAddress) {
                moneyValue = "+ " + response.result.resultInChain[i].Value
                walletAddressTempInChain = response.result.resultInChain[i].TxFrom
              } else {
                moneyValue = "- " + response.result.resultInChain[i].Value
                walletAddressTempInChain = response.result.resultInChain[i].TxTo
              }
            this.walletList.push({
              id: response.result.resultInChain[i].TxHash,
              blockNumber: response.result.resultInChain[i].BlockNumber,
              listAddress: walletAddressTempInChain,
              listFrom: response.result.resultInChain[i].TxFrom,
              listTo: response.result.resultInChain[i].TxTo,    
              listTime: new Date(response.result.resultInChain[i].TimeStamp).toUTCString(),
              listMoney: moneyValue,
              listMinerCost: response.result.resultInChain[i].TxFee, 
              listState: "Successful"
            });
          }
        }
        if (this.walletList.length === 0) {
          this.tradingCnt = true
        } else {
          this.tradingCnt = false
        }
        if (this.walletList.length>4){
          this.moreCnt = true
          this.showList = this.walletList.slice(0, 4) 
        }
        else {
          this.showList = this.walletList
        }
        this.refresh = false
      }
    );
  },

  mounted() {
    
    EventBus.$on('updateWalletInfo', function (walletParams) {
      const res = new Array(this.walletsArr.length).fill(false)
      res[walletParams.walletIndex] = !res[walletParams.walletIndex]
      this.colorArr = res
      let moneyValue = ''
      let walletListTemp = []
      let walletAddressTempInPool = ''
      let walletAddressTempInChain = ''
      this.walletList = []
      this.privateKey = walletParams.walletPrivateKey;
      this.publicKey = walletParams.walletPublicKey;
      this.walletAddress = walletParams.walletAddress;
      this.walletMoney = walletParams.walletBalance;
      this.walletsArr = walletParams.walletsArr;
      this.walletPwd = walletParams.walletPwd;
      this.walletName = walletParams.walletName;
      this.$JsonRPCClient.client.request('sec_getBalance', [this.walletAddress], (err, response) => {
        if(response.result.status === '1'){
          this.walletMoney = response.result.value
        }
      })
      this.refresh = true
      this.$JsonRPCClient.client.request("sec_getTransactions", [this.walletAddress], (err, response) => {
        if (response.result.resultInPool) {
            for (let j = 0; j < response.result.resultInPool.length; j++) {
              if (response.result.resultInPool[j].TxTo === this.walletAddress) {
                moneyValue = "+ " + response.result.resultInPool[j].Value
                walletAddressTempInPool = response.result.resultInPool[j].TxFrom
              } else if (response.result.resultInPool[i].TxFrom === '0000000000000000000000000000000000000000') {
                moneyValue = "+ " + response.result.resultInPool[i].Value
                walletAddressTempInPool = 'mined'
              } else {
                moneyValue = "- " + response.result.resultInPool[j].Value
                walletAddressTempInPool = response.result.resultInPool[j].TxTo
              }
              walletListTemp.push({
                id: response.result.resultInPool[j].TxHash,
                blockNumber: "Not in Block yet",
                listAddress: walletAddressTempInPool,
                listFrom: response.result.resultInPool[j].TxFrom,
                listTo: response.result.resultInPool[j].TxTo,    
                listTime: new Date(response.result.resultInPool[j].TimeStamp).toUTCString(),
                listMoney: moneyValue,
                listMinerCost: response.result.resultInPool[j].TxFee,
                listState: "Packed"
            });
          }
        }
        if (response.result.resultInChain) {
          for (let i = 0; i < response.result.resultInChain.length; i++) {
            if (response.result.resultInChain[i].TxTo === this.walletAddress) {
                moneyValue = "+ " + response.result.resultInChain[i].Value
                walletAddressTempInChain = response.result.resultInChain[i].TxFrom
              } else if (response.result.resultInChain[i].TxFrom === '0000000000000000000000000000000000000000') {
                moneyValue = "+ " + response.result.resultInChain[i].Value
                walletAddressTempInChain = 'mined'
              }else {
                moneyValue = "- " + response.result.resultInChain[i].Value
                walletAddressTempInChain = response.result.resultInChain[i].TxTo
              }
            walletListTemp.push({
              id: response.result.resultInChain[i].TxHash,
              blockNumber: response.result.resultInChain[i].BlockNumber,
              listAddress: walletAddressTempInChain,
              listFrom: response.result.resultInChain[i].TxFrom,
              listTo: response.result.resultInChain[i].TxTo,
              listTime: new Date(response.result.resultInChain[i].TimeStamp).toUTCString(),
              listMoney: moneyValue,
              listMinerCost: response.result.resultInChain[i].TxFee,
              listState: "Successful"
            });
          }
        }
        this.walletList = walletListTemp
        if (this.walletList.length>4){
          this.moreCnt = true
          this.showList = this.walletList.slice(0, 4) 
        }
        else {
          this.showList = this.walletList
        }
        if (this.walletList.length === 0) {
          this.tradingCnt = true
        } else {
          this.tradingCnt = false
        }
        this.refresh = false
      }
    );
    }.bind(this))
  },

  methods: {
    showMore() {
      this.showList = this.walletList
      this.moreCnt = false
      this.tradingListAuto = 'tradingListAuto'
    },
    closeDetailsList(event) {
      let detailsList = document.getElementById('detailsList')
      if (!detailsList.contains(event.target) && this.positionBtnH) {
        this.positionBtnH = false;
      }
    },
    positionFrom() {
      this.positionBtnH = !this.positionBtnH;
    },
    dialogVisible() {
      this.centerDialogVisible = true;
      this.positionBtnH = false;
    },
    toTxDetails(item) {
      //钱包详情  可传对应的参数
      this.$router.push(
        { name: "recordsDetails",
          query: {
            privateKey: this.privateKey, 
            publicKey: this.publicKey, 
            walletsArr: this.walletsArr, 
            walletName: this.walletName, 
            walletPwd: this.walletPwd, 
            walletAddress: this.walletAddress, 
            walletBalance: this.walletMoney,
            colorArr: this.colorArr,
            detailsMoney: item.listMoney + ' SEC',
            detailsNumber: item.id,
            detailsBlock: item.blockNumber.toString(),
            detailsTime: item.listTime,
            detailsBeneficiary: item.listTo,
            detailsSending: item.listFrom,
            detailsCost: item.listMinerCost,
            detailsState: item.listState         
          }
      });
    },
    detailsWallet() {
      //钱包详情  可传对应的参数
      this.$router.push(
        { name: "walletDetails",
          query: {
            privateKey: this.privateKey, 
            publicKey: this.publicKey, 
            walletsArr: this.walletsArr, 
            walletName: this.walletName, 
            walletPwd: this.walletPwd, 
            walletAddress: this.walletAddress, 
            walletBalance: this.walletMoney,
            colorArr: this.colorArr}
      });
    },
    deleteWallet(event) {
      EventBus.$emit('changeSetVisibil', {
        isVisible: false
      })
      //删除钱包
      this.positionBtnH = false;
      this.centerDialogVisible = false;
      let dirPath = require('os').homedir() + '/secwallet'
      let filePath = dirPath + '/default.data'
      let walletName = this.walletName
      fs.readFile(filePath, 'utf-8', this._DeleteWallet.bind(this, filePath, walletName))
    },
    _DeleteWallet: function(filePath, walletName, err, data){
        if (err) {
          return
        }
        try {
          let keyData = CryptoJS.AES.decrypt(data.toString(), this.walletPwd).toString(CryptoJS.enc.Utf8)
          let keyDataJSON = JSON.parse(keyData)
          delete keyDataJSON[walletName]
          this.keyFileDataJS = keyDataJSON
          let keyFileData = JSON.stringify(keyDataJSON)
          let cipherKeyData = CryptoJS.AES.encrypt(keyFileData, this.walletPwd)
          this.walletsArr = this.walletsArr.filter((wallet) => {
            return wallet.walletAddress !== this.walletAddress
          })
          this.walletName = this.walletsArr[0].walletName
          this.walletAddress = this.walletsArr[0].walletAddress
          this.privateKey = this.walletsArr[0].privateKey
          this.publicKey = this.walletsArr[0].publicKey
          this.colorArr = new Array(this.walletsArr.length).fill(false)
          this.colorArr[0] = true
          EventBus.$emit('updateQuery', {
            walletPrivateKey: this.privateKey,
            walletPublicKey: this.publicKey,
            walletAddress: this.walletAddress,
            walletsArr: this.walletsArr,
            walletName: this.walletName,
            walletPwd: this.walletPwd,
            walletMoney: this.walletMoney,
            colorArr: this.colorArr
          })
          
          this.walletList = []
          let moneyValue = ""
          this.$JsonRPCClient.client.request('sec_getBalance', [this.walletAddress], (err, response) => {
            if(response.result.status === '1'){
              this.walletMoney = response.result.value
            }
          })
          this.refresh = true
          this.$JsonRPCClient.client.request("sec_getTransactions", [this.walletAddress], (err, response) => {
              if (response.result.resultInPool) {
                  for (let j = 0; j < response.result.resultInPool.length; j++) {
                    if (response.result.resultInPool[j].TxTo === this.walletAddress) {
                      moneyValue = "+ " + response.result.resultInPool[j].Value
                    } else {
                      moneyValue = "- " + response.result.resultInPool[j].Value
                    }
                    this.walletList.push({
                      id: response.result.resultInPool[j].TxHash,
                      blockNumber: "Not in Block yet",
                      listAddress: response.result.resultInPool[j].TxTo,
                      listFrom: response.result.resultInPool[j].TxFrom,
                      listTo: response.result.resultInPool[j].TxTo,
                      listTime: new Date(response.result.resultInPool[j].TimeStamp).toUTCString(),
                      listMoney: moneyValue,
                      listMinerCost: response.result.resultInPool[j].TxFee,
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
                    id: response.result.resultInChain[i].TxHash,
                    blockNumber: response.result.resultInChain[i].BlockNumber,
                    listAddress: response.result.resultInChain[i].TxTo,
                    listFrom: response.result.resultInChain[i].TxFrom,     
                    listTo: response.result.resultInChain[i].TxTo,                   
                    listTime: new Date(response.result.resultInChain[i].TimeStamp).toUTCString(),
                    listMoney: moneyValue,
                    listMinerCost: response.result.resultInChain[i].TxFee,
                    listState: "Successful"
                  });
                }
              }
              if (this.walletList.length>4){
                this.moreCnt = true
                this.showList = this.walletList.slice(0, 4) 
              }
              else {
                this.showList = this.walletList
              }
              if (this.walletList.length === 0) {
                this.tradingCnt = true
              } else {
                this.tradingCnt = false
              }
              this.refresh = false
            }
          );
          fs.writeFile(filePath, cipherKeyData, (err) => {
            if(err) {
              return
            }
          })
        } catch(e) {
          return
        }
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
.clickMore {height: 40px!important;line-height: 40px!important;text-align: center;
  color:rgba(101,114,146,.7);font-size: 12px;}
.walletRecordCnt {
  width: 606px;
  height: 384px;
  display: flex;
  flex-direction: column;
  background: #fff;
  margin-top: 16px;
  box-shadow:0px 0px 15px rgba(0,91,76,0.05);
}
.walletRecordTxt {
  width: 557px;
  display: flex;
  align-items: center;
  height: 43px;
  border-bottom: 1px solid rgba(200,209,218,0.5);
  color:#939CB2;
  font-weight: bold;
  margin-left: 20px;
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
  box-shadow:0px 0px 15px rgba(0,91,76,0.05);
}
.walletListTxt {
  vertical-align: middle;
  margin-right: 8px;
}

.walletMoneyTxt {
  margin: 21px 0 14px 20px;
  color: #00d6b2;
  font-size: 28px;
}
.walletAddressTxt {
  margin-left: 20px;
  color: #657292;
  margin-bottom: 16px;
}

.deleteBtn {
  width: 100%;
  border: none;
  background: #939CB2;
  color: rgba(255,255,255, 0.7);
  border-radius: 2px;
  height: 36px;
}
.detailsBtn {
  width: 100%;
  border: none;
  border-radius: 0;
  border-top: 1px solid rgba(255,255,255, 0.7);
  border-bottom-left-radius: 2px;
  border-bottom-right-radius: 2px;
  margin-left: 0;
  color: rgba(255,255,255, 0.7);
  background: #939CB2;
  
}
.deleteBtn:hover {
  background: rgba(147,156,178,.5)!important;
  color: #fff!important;
}
.el-button.is-disabled, .el-button.is-disabled:focus, .el-button.is-disabled:hove {
  background: rgba(255,255,255, 0.5)!important;
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
  background: #fff;
  box-shadow:0px 0px 15px rgba(0,91,76,0.05);
}
.walletHeaderList {
  display: flex;
  justify-content: space-between;
  margin: 16px 20px 0;
  color:#657292;
}

.walletNoneCnt {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.walletCntList {
  display: flex;
  flex-direction: column;
  justify-content: start;
}

.tradingList {
  width: 557px;
  height: 300px;
  margin-left: 20px;
  padding-right: 24px;
  overflow: hidden;
}
.tradingListAuto {overflow-y: auto;}
.tradingList::-webkit-scrollbar {width: 2px;height: 2px;}
.tradingList::-webkit-scrollbar-thumb {-webkit-box-shadow: inset 0 0 1px #00D6B2;background: #00D6B2;border-radius: 1px;}
.tradingList::-webkit-scrollbar-track {-webkit-box-shadow: inset 0 0 1px #EDF5F4; border-radius: 0;background: #EDF5F4;}
.tradingList li {
  height: 74px;
  width: 100%;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(200,209,218,0.5);
  color: #657292;
}

.tradingList li .radiusCnt {
  display: flex;
  align-items: center;
  width: 27px;
}
.radiusIcon {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: block;
}

.tradingList li .addressCnt {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  flex: 1;
}
.tradingList li .addressMt {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  flex: 1;
  margin-top:6px;
}

.tradingList li .moneyCnt {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: flex-end;
  width: 100px;
}

.positionBtn {
  position: absolute;
  bottom: -36px;
  right: 0;
  width: 138px;
  height: 36px;
  border-radius: 2px;
  background: #939CB2;
}

section >>> .el-dialog__title {color: #939CB2}
section >>> .el-dialog__header {height: 47px;line-height: 47px;padding: 0;border-bottom:1px solid rgba(200,209,218,0.5);}
section >>> .el-dialog--center {height: 288px;}
section >>> .el-dialog__body {padding-top: 0px;padding-bottom: 10px;}
section >>> .el-dialog__footer {padding: 0;}
section >>> .el-dialog__headerbtn {top: 15px!important;right: 16px!important;}
</style>