<template>
  <main class="list-content">
    <header>
      <h2>{{ $t('homeInvitation.hiListTit') }}</h2>

      <!-- <section class="ipt-list">
        <input type="text" :placeholder="$t('homeInvitation.hiListSearch')" v-model='searchIpt' maxlength="42" @input="searchChange"/>
        <section class="img-list">
          <img src="../../../assets/images/clearAddress.png" alt="" v-show="clearBtn" class="clear-img" @click="clearIpt"/>
          <img src="../../../assets/images/search.png" alt="" class="search-img" @click="searchFrom"/>
        </section>
      </section> -->
    </header>

    <ul>
      <li>
        <span>{{ $t('homeInvitation.hiListTxt1') }}</span>
        <span>{{ $t('homeInvitation.hiListTxt2') }}</span>
        <span>{{ $t('homeInvitation.hiListTxt3') }}</span>
        <span>{{ $t('homeInvitation.hiListTxt4') }}</span>
      </li>
      <li v-for="(item, index) in itemLists" :key="index" v-show="itemLists.length > 0">
        <span>{{ item.itemAddress }}</span>
        <span>{{ item.itemTime }}</span>
        <span>{{ item.itemMoney }}</span>
        <span class="look-details" @click='lookDetails(item)'>{{ $t('homeInvitation.hiListBtn') }}</span>
      </li>
      <section class="list-none" v-show="itemLists.length === 0">
        <section>
          <img src="../../../assets/images/wallet-null.png" alt="">
          <p>{{ $t(nullTips) }}</p>
        </section>
      </section>
    </ul>

    <!-- 分页 -->
    <wallet-pages 
      :total="total"
      :pageSum="pageSum"
      @next="nextPage"
      @prev="prevPage"
      @goPage="goPage"
      v-show="itemLists.length > 0" />
  </main>
</template>

<script>
import walletPages from '../../../components/wallet-pages'
import walletsHandler from '../../../lib/WalletsHandler'
const dataCenterHandler = require('../../../lib/DataCenterHandler')

const moment = require('moment-timezone')
export default {
  name: '',
  props: {
    walletAddress: String
  },
  components: {
    walletPages
  },
  data() {
    return {
      clearBtn: false,
      pageSum: 0,
      total: 0,//总记录数
      beginPos: 0,
      endpos: 50,
      searchIpt: '',//input搜索内容
      itemList: [],
      nullTips: 'homeInvitation.hiListNull'  //为空记录提示  hiListSearchNull - 搜素记录空   hiListNull- 列表空
    }
  },
  computed: {
    // 列表数据
    itemLists () {
      return this.itemList.slice(this.beginPos, this.endpos)
    }
  },
  created () {
    dataCenterHandler.getRelatedMiners({ address: this.walletAddress }, (body) => {
      if (body.length > 0) {
        for (let i = 0; i < body.length; i++) {
          let reward = body[i].reward || '0'
          if (body.mortgageValue !== "0") {
            this.itemList.push({
              id: '1',
              itemAddress: `0x${body[i].address}`,
              itemTime: body[i].insertAt ? walletsHandler.formatDate(moment(body[i].insertAt).format('YYYY/MM/DD HH:mm:ss'), new Date().getTimezoneOffset()) : '',
              level: body[i].level,
              itemMoney: `${reward} BIUT`
            })
          }
          
        }
        this.total = this.itemList.length
        this.pageSum = Math.ceil(this.itemList.length / 50)
      }
    })
  },
  methods: {
    //搜索
    searchFrom () {
      let ipt = this.searchIpt.replace(/\s+/g, "")
      if (ipt == "") {
        alert("请输入搜索内容")
      } else {
        alert("搜索内容 " + ipt)
      }
    },

    //搜索框不能输入中文跟空格
    searchChange () {
      this.$nextTick(() => {
        this.searchIpt = this.inputNull(this.searchIpt)
      })
    },

    //清空输入框
    clearIpt () {
      this.searchIpt = ''
      this.clearBtn = false
    },

    //查看详情传对应的参数 地址、私钥都行
    lookDetails (item) {
      this.$emit('details', item)
    },

    //下一页
    nextPage (skip) {
      this.beginPos = (skip - 1) * 50
      this.endpos = skip * 50
    },

    //上一页
    prevPage (skip) {
      this.beginPos = (skip - 1) * 50
      this.endpos = skip * 50
    },

    //失去焦点跳转到指定的页面
    goPage (e) {
      alert("失去焦点跳转页面" + e)
    },

    calcPageSum () {
      if (this.itemList.length > 50) {
        pageSum = Math.round(this.itemList.length / 50)
      } else {
        pageSum = 1
      }
    }
  },
  watch: {
    searchIpt (newVal, oldVal) {
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
  .list-content {padding: 0 32px;display: flex;flex-direction: column;height: calc(100vh - 188px);}
  header {display: flex;align-items: center;justify-content: space-between;margin: 20px 0 6px;}
  h2 {margin: 0;color: #252F33;font-size: 16px;font-family: Lato-Bold;}
  .en h2 {font-weight: 500;font-family: Source-Medium;color: #576066;}

  .ipt-list {width:232px;height:32px;border:1px solid #e6e6e6;border-radius:4px;display: flex;
    align-items: center;justify-content: space-between;padding: 0 15px;}
  .ipt-list input {flex: 1;border: 0;color: #252F33;font-family: Lato-Regular;}
  .en .ipt-list input {font-family: Source-Medium;}
  .ipt-list .clear-img,.ipt-list .search-img {margin-left: 8px;cursor: pointer;}

  .img-list {display: flex;align-items: center;}
  ul {flex: 1;display: flex;flex-direction: column;}
  ul li {display: flex;align-items: center;border-bottom: 1px solid #e5e5e5;padding: 6px 0 6px 12px;justify-content: space-between;
    font-family: Lato-Regular;color: #252F33;}
  ul li:first-child {color: #99A1A6;font-family: Lato-Bold;border-radius: 4px;border: 0;height: 36px;padding: 0 0 0 12px;
    font-size: 13px;background:#f7fbfa;}
  ul li:first-child span:nth-child(4) {text-align: center;}
  .en ul li:first-child {font-family: Source-Medium;}

  ul li span:first-child {width: 40%;}
  ul li span:nth-child(2) {width: 25%;}
  ul li span:nth-child(3) {width: 23%;}
  ul li span:nth-child(4) {width: 12%;cursor: pointer;}
  
  .list-none {flex: 1;display: flex;align-items: center;justify-content: center;}
  .list-none section {width: 138px;text-align: center;}
  .list-none section p {color: #99A1A6;font-size: 14px;padding-top: 16px;}

  .look-details {width:94px!important;height:32px;background:#f7fbfa;border-radius:4px;color: #29D893;
    text-align: center;line-height: 32px;cursor: pointer;display: block;font-family: Lato-Regular;}
  .en .look-details {font-family: Source-Regular;}
</style>