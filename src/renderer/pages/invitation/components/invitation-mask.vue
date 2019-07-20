<template>
  <main class="mask">

    <section class="rules-content" v-show="pagesIdx == 1">
      <section class="public-title">
        <h2>查看规则</h2>
        <img src="../../../assets/images/closeMask.png" alt="" title="close" @click="cloasMask">
      </section>
      <p>奖励会每周日发放，请注意查收哦</p>
      <ul>
        <li>
          <span>级别</span>
          <span>人数</span>
          <span>一级BIUT奖励</span>
          <span>二级BIUT奖励</span>
        </li>
        <li v-for="(item, index) in itemList" :key="index">
          <span>{{ item.rulesLevel }}</span>
          <span>{{ item.rulesNumber }}</span>
          <span>{{ item.rulesReward1 }}</span>
          <span>{{ item.rulesReward2 }}</span>
        </li>
      </ul>
    </section>

    <section class="details-content" v-show="pagesIdx == 2">
      <section class="public-title">
        <h2>奖励明细</h2>
        <img src="../../../assets/images/closeMask.png" alt="" title="close" @click="cloasMask">
      </section>
      <p>地址：{{ maskAddress }}</p>
      <p>级别：{{ maskLevel }}</p>
      <p>总收益（BIUT）：{{ maskMoney }}</p>
      <ul>
        <li>
          <span>时间</span>
          <span>奖励（BIUT）</span>
        </li>
        <li v-for="(item, index) in detailsList" :key="index">
          <span>{{ item.detailsTime }}</span>
          <span>{{ item.detailsMoney }}</span>
        </li>
      </ul>
    </section>
  </main>
</template>

<script>
export default {
  name: '',
  props: {
    pagesIdx: Number,
    maskAddress: String,
    maskLevel: String,
    maskMoney: String
  },
  data () {
    return {
      itemList: [
        {
          id: '1',
          rulesLevel: '铜牌合伙人',
          rulesNumber: '1-9',
          rulesReward1: '2%',
          rulesReward2: '1%'
        },
        {
          id: '2',
          rulesLevel: '银牌合伙人',
          rulesNumber: '10-99',
          rulesReward1: '4%',
          rulesReward2: '2%'
        },
        {
          id: '3',
          rulesLevel: '金牌合伙人',
          rulesNumber: '100-999',
          rulesReward1: '7%',
          rulesReward2: '3%'
        },
        {
          id: '4',
          rulesLevel: '超级合伙人',
          rulesNumber: '1000以上',
          rulesReward1: '10%',
          rulesReward2: '4%'
        }
      ],
      detailsList: [
        {
          id: 1,
          detailsTime: '2019-07-10 00:00',
          detailsMoney: '1.2'
        }
      ]
    }
  },
  methods: {
    cloasMask () {
      this.$emit('close')
    }
  },
}
</script>

<style scoped>
  .rules-content {height: 50%;width: 50%;background: #fff;padding: 0 24px 24px;border-radius: 4px;}
  .rules-content p {padding-bottom: 20px;}
  .rules-content ul li {display: flex;align-items: center;justify-content: space-between;height: 40px;}
  .rules-content ul li span {width: 25%;}

  .details-content {height: 50%;width: 50%;background: #fff;padding: 0 24px 24px;border-radius: 4px;}
  .details-content p {padding-top: 10px;}
  .details-content ul {margin-top: 20px;}
  .details-content ul li {display: flex;align-items: center;justify-content: space-between;height: 30px;}

  .public-title {display: flex;align-items: center;justify-content: space-between;height: 80px;}
  .public-title h2 {margin: 0;font-size: 18px;}
  .public-title img {cursor: pointer;}

</style>