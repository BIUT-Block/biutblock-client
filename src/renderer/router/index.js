import Vue from 'vue'
import Router from 'vue-router'
const walletCreate = resolve => require(['@/pages/login/wallet-create'], resolve)
const Index = resolve => require(['@/pages/index'], resolve)
const WalletIndex = resolve => require(['@/pages/wallet/wallet-index'], resolve)
const WalletTrading = resolve => require(['@/pages/wallet/wallet-trading'], resolve)
const WalletNode = resolve => require(['@/pages/node/wallet-node'], resolve)
const WalletDig = resolve => require(['@/pages/dig/wallet-dig'], resolve)
const WalletDigMore = resolve => require(['@/pages/dig/wallet-dig-more'], resolve)

Vue.use(Router)

export default new Router({
  routes: [
    // {
    //   path: '/',
    //   name: 'login',
    //   component: require('@/pages/login/login').default
    // },
    {
      path: '/',
      name: 'walletCreate',
      component: walletCreate
    },
    {
      path: '/index',
      name: 'index',
      component: Index,
      redirect: 'walletIndex',
      children: [{
        path: '/walletIndex',
        name: 'walletIndex',
        component: WalletIndex
      },
      {
        path: '/walletTrading',
        name: 'walletTrading',
        component: WalletTrading
      },
      {
        path: '/walletNode',
        name: 'walletNode',
        component: WalletNode
      },
      {
        path: '/walletDig',
        name: 'walletDig',
        component: WalletDig
      },
      {
        path: '/walletDigMore',
        name: 'walletDigMore',
        component: WalletDigMore
      }
      ]
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
      children: [{
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

/**
 * {
      path: '/',
      name: 'walletCreate',
      component: walletCreate
    },
    {
      path: '/index',
      name: 'index',
      component: Index,
      redirect: 'walletIndex',
      children: [
        {
          path: '/walletIndex',
          name: 'walletIndex',
          component: WalletIndex
        },
        {
          path: '/walletTrading',
          name: 'walletTrading',
          component: WalletTrading
        },
        {
          path: '/walletNode',
          name: 'walletNode',
          component: WalletNode
        },
        {
          path: '/walletDig',
          name: 'walletDig',
          component: WalletDig
        },
        {
          path: '/walletDigMore',
          name: 'walletDigMore',
          component: WalletDigMore
        }
 */