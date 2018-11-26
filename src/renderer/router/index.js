import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'user-login',
      component: require('@/components/UserLogin').default
    },
    {
      path: '/menu/:walletAddress/:walletPublicKey/:walletBalance',
      name: 'menu-header',
      component: require('@/components/MenuHeader').default,
      props: true,
      children: [
        {
          path: '/',
          name: 'user-account',
          component: require('@/components/UserAccount').default
        },
        {
          path: 'transactions',
          name: 'transaction-history',
          component: require('@/components/TransactionHistory').default,
          props: true
        },
        {
          path: 'txdetail',
          name: 'transaction-detail',
          component: require('@/components/TransactionDetail').default,
          props: false
        },
        {
          path: 'details',
          name: 'wallet-details',
          component: require('@/components/WalletDetails').default,
          props: true
        }
      ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
