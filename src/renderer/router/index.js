import Vue from 'vue'
import Router from 'vue-router'
const walletCreate = resolve => require(['@/pages/login/wallet-create'], resolve)
const Index = resolve => require(['@/pages/index'], resolve)
const WalletIndex = resolve => require(['@/pages/wallet/wallet-index'], resolve)
const WalletTrading = resolve => require(['@/pages/wallet/wallet-trading'], resolve)
const WalletNode = resolve => require(['@/pages/node/wallet-node'], resolve)
const WalletDig = resolve => require(['@/pages/dig/wallet-dig'], resolve)
const WalletDigMore = resolve => require(['@/pages/dig/wallet-dig-more'], resolve)

const Invitation = resolve => require(['@/pages/invitation/invitation'], resolve)

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
      component: WalletDig
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
      },

      //新的页面
      {
        path: '/invitation',
        name: 'invitation',
        component: Invitation
      }
      ]
    },
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