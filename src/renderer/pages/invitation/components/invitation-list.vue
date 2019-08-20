<template>
  <main class="list-content">
    <header>
      <h2>{{ $t('homeInvitation.hiListTit') }}</h2>
      <section class="ipt-list">
        <input type="text" :placeholder="$t('homeInvitation.hiListSearch')" v-model='searchIpt' maxlength="42" @input="searchChange"/>
        <section class="img-list">
          <img src="../../../assets/images/clearAddress.png" alt="" v-show="clearBtn" class="clear-img" @click="clearIpt"/>
          <img src="../../../assets/images/search.png" alt="" class="search-img" @click="searchFrom"/>
        </section>
      </section>
    </header>

    <ul>
      <li>
        <span>{{ $t('homeInvitation.hiListTxt1') }}</span>
        <span>{{ $t('homeInvitation.hiListTxt2') }}</span>
        <span>{{ $t('homeInvitation.hiListTxt3') }}</span>
        <span>{{ $t('homeInvitation.hiListTxt4') }}</span>
      </li>
      <li v-for="(item, index) in itemLists" :key="index" v-show="!dataNull">
        <span>{{ item.itemAddress }}</span>
        <span>{{ item.itemTime }}</span>
        <span>{{ item.itemMoney }}</span>
        <span class="look-details" @click='lookDetails(""+ index +"")'>{{ $t('homeInvitation.hiListBtn') }}</span>
      </li>
      <section class="list-none" v-show="dataNull">
        <section>
          <img src="../../../assets/images/wallet-null.png" alt="">
          <p>{{ $t('homeInvitation.hiListSearchNull') }}</p>
        </section>
      </section>
    </ul>

    <!-- 分页 -->
    <wallet-pages 
      :total="total"
      @next="nextPage"
      @prev="prevPage"
      @goPage="goPage"
      v-show="!dataNull" />
  </main>
</template>

<script>
import walletPages from '../../../components/wallet-pages'
const dataCenterHandler = require('../../../lib/DataCenterHandler')
const walletsHandler = require('../../../lib/WalletsHandler')
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
      dataNull: false,
      total: 50,//总记录数
      searchIpt: '',//input搜索内容
      itemList: [
      ]
    }
  },
  computed: {
    // 列表数据
    itemLists () {
      return this.itemList
    }
  },
  created () {
    dataCenterHandler.getRelatedMiners({
      address: this.walletAddress
    }, (body) => {
      if (body.length > 0) {
        for (let i = 0; i < body.length; i++) {
          this.itemList.push({
            id: '1',
            itemAddress: body[i].address,
            itemTime: body[i].insertAt ? WalletsHandler.formatDate(moment(body[i].insertAt).format('YYYY/MM/DD HH:mm:ss'), new Date().getTimezoneOffset()),
            itemMoney: ''
          })
        }
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
    lookDetails (idx) {
      this.$emit('details', idx)
    },

    //下一页
    nextPage () {
      alert("下一页")
    },

    //上一页
    prevPage () {
      alert("上一页")
    },

    //失去焦点跳转到指定的页面
    goPage (e) {
      alert("失去焦点跳转页面" + e)
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
  .list-content {padding: 0 32px;display: flex;flex-direction: column;
    height: calc(100% - 146px);}
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
  ul li {display: flex;align-items: center;border-bottom: 1px solid #e5e5e5;padding: 6px 0 6px 12px;}
  ul li:first-child {color: #99A1A6;font-family: Lato-Bold;border-radius: 4px;border: 0;height: 36px;padding: 0 0 0 12px;
    font-size: 13px;background:#f7fbfa;}
  .en ul li:first-child {font-family: Source-Medium;}
  .en .ul li {color: #252F33;font-family: Lato-Regular;}
  ul li span:first-child {width: 38%;}
  ul li span:nth-child(2) {width: 25%;}
  ul li span:nth-child(3) {width: 23%;}
  ul li span:nth-child(4) {width: 14%;cursor: pointer;}
  
  .list-none {flex: 1;display: flex;align-items: center;justify-content: center;}
  .list-none section {width: 138px;text-align: center;}
  .list-none section p {color: #99A1A6;font-size: 14px;padding-top: 16px;}

  .look-details {width:94px!important;height:32px;background:#f7fbfa;border-radius:4px;color: #29D893;
    text-align: center;line-height: 32px;cursor: pointer;display: block;}
</style>