<template>
  <main class="list-content">
    <header>
      <h2>{{ $t("homeInvitation.hiListTit") }}</h2>
      <ul class="head-list">
        <li v-for="(item, index) in headList" :key="index">
          <section>
            <span></span>
            <span>{{ $t(item.tit) }}：</span>
          </section>
          <span class="head-list-cnt">{{ item.txt }}</span>
        </li>
      </ul>
      <!-- <section class="ipt-list">
        <input type="text" :placeholder="$t('homeInvitation.hiListSearch')" v-model='searchIpt' maxlength="42" @input="searchChange"/>
        <section class="img-list">
          <img src="../../../assets/images/clearAddress.png" alt="" v-show="clearBtn" class="clear-img" @click="clearIpt"/>
          <img src="../../../assets/images/search.png" alt="" class="search-img" @click="searchFrom"/>
        </section>
      </section> -->
    </header>

    <ul class="list-head">
      <li>
        <span>{{ $t("homeInvitation.hiListTxt1") }}</span>
        <span>{{ $t("homeInvitation.hiListTxt2") }}</span>
        <span>{{ $t("homeInvitation.hiListTxt3") }}</span>
        <span>{{ $t("homeInvitation.hiListTxt4") }}</span>
      </li>
    </ul>
    <section class="list-node">
      <ul class="list-body">
        <li
          v-for="(item, index) in itemLists"
          :key="index"
          v-show="itemLists.length > 0"
        >
          <span>{{ item.itemAddress }}</span>
          <span>{{ item.itemTime.substring(0,20) }}</span>
          <span>{{ getPointNum(item.itemMoney) }}</span>
          <span class="look-details" @click="lookDetails(item)">{{
            $t("homeInvitation.hiListBtn")
          }}</span>
        </li>
      </ul>
      <section class="list-none" v-show="itemLists.length === 0">
        <section>
          <img src="../../../assets/images/wallet-null.png" alt="" />
          <p>{{ $t(nullTips) }}</p>
        </section>
      </section>
    </section>

    <!-- 分页 -->
    <!-- <wallet-pages 
      :total="total"
      :pageSum="pageSum"
      @next="nextPage"
      @prev="prevPage"
      @goPage="goPage"
      v-show="itemLists.length > 0" /> -->
      <wallet-translucent :text="translucentText" v-show="translucentShow" class="translucent-mask"/>
  </main>
</template>

<script>
import walletPages from '../../../components/wallet-pages'
import walletTranslucent from '../../../components/wallet-translucent'

import walletsHandler from '../../../lib/WalletsHandler'
const dataCenterHandler = require('../../../lib/DataCenterHandler')

const moment = require('moment-timezone')
export default {
  name: '',
  props: {
    walletAddress: String
  },
  components: {
    walletPages,
    walletTranslucent
  },
  data() {
    return {
      clearBtn: false,
      pageSum: 0,
      total: 0,//总记录数
      beginPos: 0,
      endpos: 50,
      firstLevel: 0,
      firstLevelAmount: 0,
      secondLevel: 0,
      secondLevelAmount: 0,
      searchIpt: '',//input搜索内容
      itemList: [],
      nullTips: 'homeInvitation.hiListNull', //为空记录提示  hiListSearchNull - 搜素记录空   hiListNull- 列表空
      translucentText: 'homeInvitationMask.hiMaskDetailsListNull',
      translucentShow: false
    }
  },
  computed: {
    // 列表数据
    itemLists() {
      return this.itemList
    },

    //头部数据
    headList () {
      return [
        {
          id: '1',
          tit: 'homeInvitation.hiListHeadTxt1',
          txt: this.firstLevel
        },
        {
          id: '2',
          tit: 'homeInvitation.hiListHeadTxt2',
          txt: this.getPointNum(this.firstLevelAmount).substring(0, 9) +'BIUT'
        },
        {
          id: '3',
          tit: 'homeInvitation.hiListHeadTxt3',
          txt: this.secondLevel
        },
        {
          id: '4',
          tit: 'homeInvitation.hiListHeadTxt4',
          txt: this.getPointNum(this.secondLevelAmount).substring(0, 9) +'BIUT'
        }
      ]
    }
  },
  created() {
    dataCenterHandler.getInvitationDetails({ address: this.walletAddress }, (body) => {
      if (body.rewards && body.rewards.length > 0) {
        for (let i = 0; i < body.rewards.length; i++) {
          let reward = body.rewards[i].rewards || '0'
          let level = 1
          switch (body.rewards[i].type) {
            case 'level1':
              level = 1
              break
            case 'level2':
              level = 2
              break
            case 'level3':
              level = 3
              break
            case 'level4':
              level = 4
              break
            case 'pool':
              level = 5 //矿池的等级
              break
          }
          if (body.rewards[i].type === 'level1') {
            this.firstLevel = this.firstLevel + 1
            if (body.rewards[i].rewards !== '0') {
              this.firstLevelAmount = this.cal.accAdd(this.firstLevelAmount, body.rewards[i].rewards)
              this.itemList.push({
                id: '1',
                itemAddress: body.rewards[i].addressFrom ? `0x${body.rewards[i].addressFrom}` : '',
                itemTime: body.rewards[i].insertAt ? walletsHandler.formatDate(moment(body.rewards[i].insertAt).format('YYYY/MM/DD HH:mm:ss'), new Date().getTimezoneOffset()) : '',
                level: level,
                itemMoney: `${reward}`
              })
            }
          } else if (body.rewards[i].rewards !== '0' && body.rewards[i].type === 'level2') {
            this.secondLevel = this.secondLevel + 1
            this.secondLevelAmount = this.cal.accAdd(this.secondLevelAmount, body.rewards[i].rewards)
          }
        } 

        this.total = this.itemList.length
        this.pageSum = Math.ceil(this.itemList.length / 50)
      }
    })
  },
  methods: {
    //搜索
    searchFrom() {
      let ipt = this.searchIpt.replace(/\s+/g, "")
      if (ipt == "") {
        alert("请输入搜索内容")
      } else {
        alert("搜索内容 " + ipt)
      }
    },

    //搜索框不能输入中文跟空格
    searchChange() {
      this.$nextTick(() => {
        this.searchIpt = this.inputNull(this.searchIpt)
      })
    },

    //清空输入框
    clearIpt() {
      this.searchIpt = ''
      this.clearBtn = false
    },

    //查看详情传对应的参数 地址、私钥都行
    lookDetails(item) {
      if (item.itemMoney > 0) {
        this.$emit('details', item)
      } else {
        this.translucentShow = true
        setTimeout(() => {
          this.translucentShow = false
        }, 3000)
      }
    },

    //下一页
    nextPage(skip) {
      this.beginPos = (skip - 1) * 50
      this.endpos = skip * 50
    },

    //上一页
    prevPage(skip) {
      this.beginPos = (skip - 1) * 50
      this.endpos = skip * 50
    },

    //失去焦点跳转到指定的页面
    goPage(e) {
      alert("失去焦点跳转页面" + e)
    },

    calcPageSum() {
      if (this.itemList.length > 50) {
        pageSum = Math.round(this.itemList.length / 50)
      } else {
        pageSum = 1
      }
    }
  },
  watch: {
    searchIpt(newVal, oldVal) {
      //监听input 输入的变化  如果  newVal.length = 0 的时候重新渲染列表
      if (newVal.length > 0) {
        this.clearBtn = true
      } else {
        this.clearBtn = false
      }
    }
  },
}
</script>

<style scoped>
.list-content {
  padding-left: 32px;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 188px);
}
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 27px 32px 22px 0;
}

h2 {
  margin: 0;
  color: #252f33;
  font-size: 16px;
  font-family: Lato-Bold;
}
.en h2 {
  font-weight: 500;
  font-family: Source-Medium;
  color: #576066;
}

.head-list {display: flex;align-items: center;}
.head-list li {padding-left: 28px;font-size: 13px;color: #42535B;font-family: Lato-Bold;display: flex;flex-direction: column;}
.en .head-list li {flex-direction:inherit;}
.head-list li:first-child {padding-left: 0;}
.head-list li section span {color: #6D7880;}
.head-list li section span:first-child {width:6px;height:6px;border-radius:50%;display: inline-block;background: #388ed9;margin-right: 6px;}
.head-list li:first-child section span:first-child,.head-list li:nth-child(2) section span:first-child {background:#F5A623;}
.head-list li .head-list-cnt {padding: 2px 0 0 14px;}
.en .head-list li .head-list-cnt {padding: 0;}

.ipt-list {
  width: 232px;
  height: 32px;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
}
.ipt-list input {
  flex: 1;
  border: 0;
  color: #252f33;
  font-family: Lato-Regular;
}
.en .ipt-list input {
  font-family: Source-Medium;
}
.ipt-list .clear-img,
.ipt-list .search-img {
  margin-left: 8px;
  cursor: pointer;
}

.img-list {
  display: flex;
  align-items: center;
}
.list-head {
  display: flex;
  flex-direction: column;
  padding-right: 32px;
}
.list-body li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e5e5e5;
  padding-left: 12px;
  
  font-family: Lato-Regular;
  color: #252f33;
  height: 45px;
}
.list-head li {
  color: #99a1a6;
  font-family: Lato-Bold;
  border-radius: 4px;
  border: 0;
  height: 36px;
  padding: 0 0 0 12px;
  font-size: 13px;
  background: #f7fbfa;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.list-head li:first-child span:nth-child(4) {
  text-align: center;
}
.en .list-head li:first-child {
  font-family: Source-Medium;
}

.list-head li span:first-child,.list-body li span:first-child {
  width: 40%;
}
.list-head li span:nth-child(2),.list-body li span:nth-child(2) {
  width: 25%;
}
.list-head li span:nth-child(3),.list-body li span:nth-child(3) {
  width: 23%;
}
.list-head li span:nth-child(4),.list-body li span:nth-child(4) {
  width: 12%;
  cursor: pointer;
}

.list-none {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.list-none section {
  width: 138px;
  text-align: center;
}
.list-none section p {
  color: #99a1a6;
  font-size: 14px;
  padding-top: 16px;
}

.look-details {
  height: 32px;
  background: #f7fbfa;
  border-radius: 4px;
  color: #29d893;
  text-align: center;
  line-height: 32px;
  cursor: pointer;
  display: block;
  font-family: Lato-Regular;
}
.en .look-details {
  font-family: Source-Regular;
}

.translucent-mask {width: 172px;text-align: center;margin-left: -110px;}

.list-node {overflow: auto;flex: 1;height: calc(100vh - 300px);padding: 0 32px 20px 0;}
.list-node::-webkit-scrollbar { width: 2px; height: 2px;}
.list-node::-webkit-scrollbar-thumb { -webkit-box-shadow: inset 0 0 1px #00D6B2;background: #00D6B2;border-radius: 1px;}
.list-node::-webkit-scrollbar-track {-webkit-box-shadow: inset 0 0 1px #EDF5F4;border-radius: 0; background: #EDF5F4;}
</style>