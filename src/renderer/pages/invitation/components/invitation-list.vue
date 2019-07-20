<template>
  <main>
    <header>
      <section>
        <span>邀请记录</span>
        <span>共 {{total}} 条记录</span>
      </section>

      <section>
        <input type="text" placeholder="请输入搜索内容" v-model='searchIpt'/>
        <button type="button" @click="searchFrom">搜索</button>
      </section>
    </header>

    <ul>
      <li>
        <span>地址</span>
        <span>邀请时间</span>
        <span>已获得奖励（BIUT）</span>
        <span>操作</span>
      </li>
      <li v-for="(item, index) in itemLists" :key="index">
        <span>{{ item.itemAddress }}</span>
        <span>{{ item.itemTime }}</span>
        <span>{{ item.itemMoney }}</span>
        <span class="look-details" @click='lookDetails(""+ index +"")'>查看详情</span>
      </li>
    </ul>
    <!-- 分页可以用 election的插件、根据你那边做的来 -->
  </main>
</template>

<script>
export default {
  name: '',
  props: {},
  data() {
    return {
      total: 50,//总记录数
      searchIpt: '',//input搜索内容
      itemList: [
        {
          id: '1',
          itemAddress: '0xc4be3c8093fd7acdcdf415331040fc974f8b2ad5',
          itemTime:'2019-07-17 14:06 +8',
          itemMoney: '1234',
        }
      ]
    }
  },
  computed: {
    // 列表数据
    itemLists () {
      return Array(5).fill(this.itemList[0])
    }
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

    //查看详情传对应的参数
    lookDetails (idx) {
      this.$emit('details', idx)
    }
  },
  watch: {
    searchIpt (newVal, oldVal) {
      //监听input 输入的变化
      if (newVal.length === 0) {
        //重新加载列表
      }
    }
  },
}
</script>

<style scoped>
  header {display: flex;align-items: center;justify-content: space-between;margin: 20px 0 10px;}

  ul li {height: 40px;display: flex;align-items: center;border-bottom: 1px solid #e5e5e5;}
  ul li:first-child {color: #839299;font-family: Lato-Bold;border-bottom: 2px solid #e5e5e5;
    font-size: 16px;}
  ul li span:first-child {width: 50%;}
  ul li span:nth-child(2) {width: 20%;}
  ul li span:nth-child(3) {width: 20%;}
  ul li span:nth-child(4) {width: 10%;cursor: pointer;}
</style>