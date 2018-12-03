<template>
  <el-container style="background: #FAFAFA">
    <el-row>
      <el-col :span="24">
        <section class="leftNavCnt">
          <ul>
            <!-- <li v-for="(item,index) in walletList" 
              :index="item.id"
              :class="[colorArr[index]?'color'+index%2:'',colorBorderArr[index%4]]"
              @click="tabWallet(index)">
                <p>{{item.walletName}}</p>
                <p style="margin-top:5px">{{item.walletAddress.replace(/(.{10}).+(.{10})/,'$1...$2')}}</p>
            </li> -->
            <li class="borderColor1" @click="tabWallet(index)">
                <p>{{walletName}}</p>
                <p style="margin-top:5px">{{walletAddress.replace(/(.{10}).+(.{10})/,'$1...$2')}}</p>
            </li>
          </ul>
          <button class="btn" @click="createWallet">+ Create a wallet</button>
        </section>
      </el-col>
    </el-row>
  </el-container>  
</template>

<script>
export default {
  name: '',
  props: ['walletName', 'walletAddress', 'walletsArr', 'walletPwd'],
  data () {
    return {
      colorArr: [false, false],
      colorBorderArr: ['borderColor1','borderColor2','borderColor3','borderColor4'],
      walletList:[{
        id: '01',
        walletName: 'Wallet 01',
        walletAddress: '0x75f04e06b80b4b249a878000714e038fcc746ac54f56a49fabba5f1cb9449828',
      },
      {
        id: '02',
        walletName: 'Wallet 01',
        walletAddress: '0x75f04e06b80b4b249a878000714e038fcc746ac54f56a49fabba5f1cb9449828',
      },
      {
        id: '03',
        walletName: 'Wallet 01',
        walletAddress: '0x75f04e06b80b4b249a878000714e038fcc746ac54f56a49fabba5f1cb9449828',
      },
      {
        id: '04',
        walletName: 'Wallet 01',
        walletAddress: '0x75f04e06b80b4b249a878000714e038fcc746ac54f56a49fabba5f1cb9449828',
      }]
    }
  },
  methods: {
    createWallet () {
      this.$router.push({ 
        name: 'create',
        query: {
          id: "3",
          walletPwd: this.walletPwd,
        }
      })
    },
    tabWallet (index) {
      const res = [false, false]
      res[index] = !res[index]
      this.colorArr = res

      console.log(index) //需要的参数可以通过方法 拿

      this.$router.go(-1)  //返回钱包首页 默认加载第一个钱包


      //点击那个钱包就加载那个钱包的数据  

      
    }
  },
  filters: {
    statusColor (status) {
        const statusMap = {
          0: 'testColor1',
          1: 'testColor2',
          2: 'testColor3',
          3: 'testColor4'
        }
        return statusMap[status]
    }
  }
}
</script>

<style scoped>
.btn {width: 160px;height: 58px;background: #fff;color: #657292;
  border:1px solid #657292;outline: none;position:fixed;bottom:24px;left: 90px;border-radius:2px;}


.leftNavCnt {width: 200px;background: #EDF5F4;height:580px;}
ul {display: flex;flex-direction:column;align-items:center;padding-top:8px;justify-content: center;}
li {width: 160px;height: 58px;display: flex;justify-content:center;margin-top: 16px;
    flex-direction: column;border:1px solid #fff;background: #fff;color:#657292;padding-left:20px;}


li:hover {cursor: pointer;background:#00D6B2;color:#fff;border-left: none;}


.borderColor1 {border-left: 2px solid #98A9D2;}
.borderColor2 {border-left: 2px solid #F5A623;}
.borderColor3 {border-left: 2px solid #FF8DB2;}
.borderColor4 {border-left: 2px solid #7498FB;}

.color0 {background:#00D6B2;color:#fff;border-left: none;}
.color1 {background:#00D6B2;color:#fff;border-left: none;}
</style>