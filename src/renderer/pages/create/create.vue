<template>
  <el-container class="layoutCnt">
    <main style="width: 640px;height: 432px;border:1px solid #ccc;">
      <el-row class="publicNav">
        <el-col :span="6">
          <router-link :to="returnPage">
            <i class="el-icon-arrow-left icon_nav"></i>
          </router-link>
        </el-col>
        <el-col :span="12" class="navTit">
          New wallet
        </el-col>
        <el-col :span="6" class="windowsCnt">
          <i class="el-icon-minus icon_nav"></i>
          <span class="publicBtn amplification"></span>
          <i class="el-icon-close icon_nav"></i>
        </el-col>
      </el-row>

      <el-row class="createTabCnt">
        <el-col :span="24" class="mainCnt">
          
          <section class="mainCntTab">
            <button @click="tab1" class="pointerTxt" :class="btn">Create a new wallet</button>
            <button @click="tab2" class="pointerTxt" :class="btn2">Mnemonic import wallet</button>
          </section>

          <section v-show="mainCntTab1" class="mainCntTab1">
            <p class="mainCntTab1Txt">Wallet name</p>
            <input v-model="name" class="tabIpt" maxlength="10" placeholder="Please enter wallet name"></input>
            <p class="mainCntTab1Txt">password</p>
            <input type="password" v-model="password" maxlength="30" class="tabIpt" placeholder="8-30 characters, must contain at least 2 types of numbers,English letters, and special characters."></input>
            <p class="mainCntTab1Txt">confirm password</p>
            <input type="password" v-model="confirmP" maxlength="30" class="tabIpt" placeholder="Please confirm the password you entered"></input>
            
            <section class="publicCntBtn mt30">
              <button class="publicBtn" :disabled="!createActiveBtn" :class="createActiveBtn?'publicBtnAcitve':''" @click="createBtn">Create a wallet</button>
            </section>

          </section>

          <section v-show="mainCntTab2" class="mainCntTab2">
            <ul>
              <li class="iptTxt"><input type="text" v-model="word1"></li>
              <li class="iptTxt"><input type="text" v-model="word2"></li>
              <li class="iptTxt"><input type="text" v-model="word3"></li>
              <li class="iptTxt"><input type="text" v-model="word4"></li>
            </ul>

            <ul>
              <li class="iptTxt"><input type="text" v-model="word5"></li>
              <li class="iptTxt"><input type="text" v-model="word6"></li>
              <li class="iptTxt"><input type="text" v-model="word7"></li>
              <li class="iptTxt"><input type="text" v-model="word8"></li>
            </ul>
            <ul>
             <li class="iptTxt"><input type="text" v-model="word9"></li>
              <li class="iptTxt"><input type="text" v-model="word10"></li>
              <li class="iptTxt"><input type="text" v-model="word11"></li>
              <li class="iptTxt"><input type="text" v-model="word12"></li>
            </ul>
            <section class="publicCntBtn mt50">
              <button class="publicBtn" :disabled="!publicBtnAcitve" :class="publicBtnAcitve?'publicBtnAcitve':''" @click="importingFrom">Start importing</button>
            </section>
          </section>
        </el-col>
      </el-row>
      
    </main>
  </el-container>
</template>

<script>
const CryptoJS = require("crypto-js");
const SECUtil = require("@sec-block/secjs-util");
const jwt = require("jsonwebtoken");
//const secUtil = new SECUtil()
export default {
  name: "",
  data() {
    return {
      returnPage: "/",
      name: "wallet 01",
      password: "",
      confirmP: "",
      privateKey: "",
      englishWords: "",
      mainCntTab1: true,
      mainCntTab2: false,
      btn: "btn",
      btn2: "btn2",
      word1: "",
      word2: "",
      word3: "",
      word4: "",
      word5: "",
      word6: "",
      word7: "",
      word8: "",
      word9: "",
      word10: "",
      word11: "",
      word12: "",
      newUserAccount: {
        walletName: "",
        password: "",
        repeatPassword: ""
      }
    };
  },
  methods: {
    createBtn() {
      // 创建钱包方法
      if (this.confirmP != this.password) {
        alert("两次密码输入不一致，请重新输入");
        return;
      } else {
        let keys = SECUtil.generateSecKeys();
        let privKey64 = keys.privKey;
        this.privateKey = privKey64;
        this.englishWords = SECUtil.entropyToMnemonic(privKey64);

        let pubKey128 = keys.publicKey;
        this.pubKey128ToString = pubKey128.toString("hex");

        //let userAddressBuffer = keys.secAddress;
        //let userAddress = userAddressBuffer.toString("hex");
        this.userAddressToString = keys.secAddress;

        let tokenInfo = {
          password: this.newUserAccount.password
        };

        let token = jwt.sign(tokenInfo, "MongoX-Block", {
          expiresIn: 60 * 60 * 24
        });
        this.decoded = this.$JWT.verifyToken(token);
        //成功就跳转到助记词
        //this.$router.push('/backup')
        //失败  弹出提示框，不做任何跳转
        if (this.decoded === "") {
          return;
        } else {
          // save to local file
          this.userToken = token;
        }
        this.$router.push({
          name: "backup",
          query: {
            privateKey: this.privateKey,
            publicKey: this.pubKey128ToString,
            userAddress: this.userAddressToString,
            password: this.password,
            englishWords: this.englishWords
          }
        });
      }
    },

    _userAuthRequest: function(keyDataJSON, password) {
      let tokenInfo = {
        password: password
      };

      let token = jwt.sign(tokenInfo, "MongoX-Block", {
        expiresIn: 60 * 60 * 24
      });
      window.localStorage.setItem("userToken", token);
      this.$JsonRPCClient.client.request(
        "sec_getBalance", [keyDataJSON.walletAddres], (err, response) => {
          if (response.result.status === 'false') {
            this.loginError = true;
          } else if (response.result.status == '1') {
            this._navToAccountDetail({
              publicKey: keyDataJSON.publicKey,
              walletAddress: keyDataJSON.walletAddress,
              walletBalance: response.result.value.toString()
            });
          } else if (response.result.status === '0'){
            this._navToAccountDetail({
              publicKey: keyDataJSON.publicKey,
              walletAddress: keyDataJSON.walletAddress,
              walletBalance: response.result.value.toString()
            });
          }
        }
      );
    },

    _navToAccountDetail: function(params) {
      this.$router.push({
        name: "backup",
        query: {
          privateKey: this.privateKey,
          englishWords: this.englishWords
        }
      });
    },

    importingFrom() {
      //导入助记词方法
      //导入成功 跳转至首页

      this.$router.push("/wallet");

      //导入失败，停留在当前页面 给出对应的提示
    },
    tab1() {
      this.mainCntTab1 = true;
      this.mainCntTab2 = false;
      this.btn = "btn";
      this.btn2 = "btn2";
    },
    tab2() {
      this.mainCntTab1 = false;
      this.mainCntTab2 = true;
      this.btn = "btn2";
      this.btn2 = "btn";

      let filePath = ''
      if(require('os').type() === 'Darwin' || require('os').type() === 'Linux') {
        filePath = require('os').homedir() + '/secwallet/default.data'
      } else {
        filePath = require('os').homedir() + '\\secwallet\\default.data'
      }
      if (!fs.existsSync(dirPath)){
          return
      }
      fs.readFile(filePath, 'utf-8', this._fileRequest.bind(this, this.loginValue))

    }
  },
  computed: {
    createActiveBtn() {
      return this.name.length > 0 &&
        this.password.length > 7 &&
        this.password.length < 29 &&
        this.confirmP.length > 7 &&
        this.confirmP.length < 29
        ? true
        : false;
    },
    publicBtnAcitve() {
      return this.word1.length > 0 &&
        this.word2.length > 0 &&
        this.word3.length > 0 &&
        this.word4.length > 0 &&
        this.word5.length > 0 &&
        this.word6.length > 0 &&
        this.word7.length > 0 &&
        this.word8.length > 0 &&
        this.word9.length > 0 &&
        this.word10.length > 0 &&
        this.word11.length > 0 &&
        this.word12.length > 0
        ? true
        : false;
    }
  },
  created() {
    if (this.$route.query.id === "1") {
      this.returnPage = "/";
      this.mainCntTab1 = true;
      this.mainCntTab2 = false;
      this.btn = "btn";
      this.btn2 = "btn2";
    }
    if (this.$route.query.id === "3") {
      this.returnPage = "/home";
      this.mainCntTab1 = true;
      this.mainCntTab2 = false;
      this.btn = "btn";
      this.btn2 = "btn2";
    }
    if (this.$route.query.id === "2") {
      this.returnPage = "/backup";
      this.mainCntTab1 = false;
      this.mainCntTab2 = true;
      this.btn = "btn2";
      this.btn2 = "btn";
    }
  }
};
</script>

<style scoped>
.layoutCnt {
  display: flex;
  flex-direction: column;
  height: 100vh;
  justify-content: center;
  align-items: center;
}
.mainCnt {
  background: #ffffff;
  width: 500px;
  height: 382px;
}

.createTabCnt {
  display: flex;
  justify-content: center;
  align-items: center;
}
.mainCntTab {
  display: flex;
  justify-content: space-between;
  width: 380px;
  margin: 28px auto 0;
}
.mainCntTab1 {
  margin: 32px auto 0;
  width: 380px;
}
.mainCntTab1Txt {
  color: #c8d1da;
  margin: 12px 0 6px;
}
.tabIpt {
  width: 100%;
  height: 36px;
  outline: none;
  border: 1px solid #c8d1da;
  border-radius: 2px;
  padding-left: 8px;
}

.mainCntTab2 {
  width: 500px;
  margin: 16px auto 32px;
}

.btn {
  width: 184px;
  height: 36px;
  background: #242e49;
  border: 1px solid #c8d1da;
  color: #fff;
  outline: none;
  border-radius: 2px;
}
.btn2 {
  width: 184px;
  height: 36px;
  background: #fff;
  color: #c8d1da;
  border: 1px solid #c8d1da;
  outline: none;
  border-radius: 2px;
}

ul {
  display: flex;
}
ul .iptTxt {
  width: 116px;
  height: 36px;
  border: 1px solid #c8d1da;
  color: #c8d1da;
  line-height: 36px;
  text-align: center;
  margin-top: 12px;
  margin-right: 12px;
}
ul .iptTxt:last-child {
  margin-right: 0;
}

ul .iptTxt input[type="text"] {
  width: 116px;
  height: 30px;
  border: none;
  outline: none;
  text-align: center;
  color: #657292;
}
</style>