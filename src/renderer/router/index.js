import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: require('@/pages/login/login').default
    },
    {
      path: '/create',
      name: 'create',
      component: require('@/pages/create/create').default
    },
    {
      path: '/backup',
      name: 'backup',
      component: require('@/pages/create/backup').default
    },
    {
      path: '/home',
      name: 'home',
      component: require('@/pages/home/home').default,
      props: true,
      children: [
        {
          path: '/wallet',
          name: 'wallet',
          component: require('@/pages/wallet/wallet').default
        },
        {
          path: '/recordsDetails',
          name: 'recordsDetails',
          component: require('@/pages/wallet/recordsDetails').default
        },
        {
          path: '/walletDetails',
          name: 'walletDetails',
          component: require('@/pages/wallet/walletDetails').default
        },        
        {
          path: '/transfer',
          name: 'transfer',
          component: require('@/pages/wallet/transfer').default
        },
        {
          path: '/receipt',
          name: 'receipt',
          component: require('@/pages/wallet/receipt').default
        },
        {
          path: '/nodeSec',
          name: 'nodeSec',
          component: require('@/pages/nodeSec/nodeIndex').default
        }
      ]
    },
    // {
    //   path: '/menu/:userID/:userAddress/:walletBalance',
    //   name: 'menu-header',
    //   component: require('@/components/MenuHeader').default,
    //   props: true,
    //   children: [
    //     {
    //       path: '/',
    //       name: 'user-account',
    //       component: require('@/components/UserAccount').default
    //     },
    //     {
    //       path: 'transactions/:walletid',
    //       name: 'transaction-history',
    //       component: require('@/components/TransactionHistory').default,
    //       props: true
    //     },
    //     {
    //       path: 'details/:walletid',
    //       name: 'wallet-details',
    //       component: require('@/components/WalletDetails').default,
    //       props: true
    //     }
    //   ]
    // },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
