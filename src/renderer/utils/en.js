export default {
  login: {
    loginCreate1: 'Create',
    loginCreate2: 'New Wallet',
    loginImport1: 'Import',
    loginImport2: 'Wallet',
    loginCreated: 'Created!',

    loginImportBtn: '导入钱包',
    loginFooter1: '没有钱包？',
    loginFooter2: '点此创建钱包',

    loginBtn1: '创建钱包',
    loginBtn2: '登陆',
    loginBtn3: '进入钱包',

    createdTips1: '',
    createdTips2: '请妥善保存以下信息！如果您不小心泄露了以下重要信息，您将会失去钱包里的所有资产。',
    createdPhrase: '助记词',
    createdKey: '私钥',
    createdAgreement: '我已经把以上信息备份到安全的地方了',

    importSelectTit: '请选择Keystore文件',
    importSelectTxt1: '请选择Keystore文件',
    importSelectTxt2: '你的钱包加密了！请输入正确的密码.',

    importKey: '私钥',
    importKeystore: 'KeyStore文件',
    importPhrase: '助记词',
  },

  input: {
    walletName: '钱包名称',
    walletNameIpt: '请输入钱包名称',
    walletPass1: '钱包密码',
    walletPass1Ipt: '请输入钱包密码',
    walletName2: '确认密码',
    walletName2Ipt: '请再次确认密码',

    walletCode: '邀请码',
    walletCodeIpt: '请输入邀请码',

    walletPrivateKey: '请输入私钥',
    walletPhrase: '请输入助记词，并用空格隔开',

    passFormatTips: '8-20位字符，必须包含数字，英文字母以及特殊字符中至少两种.',
    passDifferent: '两次密码输入不一致.',
    passError: '密码错误，无法解锁钱包.',
    passUnlockError: '密码错误，解锁失败.',

    walletCodeError: '请输入正确的邀请码.',

    nameNull: '请输入钱包名称.',

    privateKeyError: '无效的私钥.',
    phraseError: '无效的助记词.',

    imporantExists: '当前钱包已存在或已导入。.'
  },

  homeLeftNav: {
    createBtn: '创建或导入钱包'
  },

  homeWallet: {
    hwSet1: '导出私钥',
    hwSet2: '导出Keystore文件',
    hwSet3: '导出助记词',
    hwSet4: '删除钱包',

    hwCode: '我的邀请码',
    hwBtn1: '收款',
    hwBtn2: '转账',

    hwBiut: 'BIUT 金额',
    hwBiutTxt1: '可用',
    hwBiutTxt2: '已冻结',
    hwBiu: 'BIU 金额',

    hwListTit: '交易记录',
    hwListNull: '暂无交易记录',

    hwBiuInsufficient: "BIU 不足",

    hwNameNull: '钱包名称不能为空或只有空格.',

    hwDeleteSuccess: '删除钱包成功！',
  },

  homeWalletMask: {
    hwmKeyTit: '安全警告：私钥未经加密，导出存在风险，建议使用助记词和Keystore进行备份。',
    hwmKeyCopy: '复制',

    hwmKeystoreIpt: '请输入新密码',

    hwmDeleteTit: '确认要删除钱包吗？请确认您已备份！',
    hwmDeleteBtn: '删除',

    hwmReceiptTxt1: '接收地址',
    hwmReceiptTxt2: '数量',
    hwmReceiptTxt3: '地址二维码',

    hwmSentTit1: '确认交易信息',
    hwmSentTips: '您正在向以下地址转账，请确认交易',
    hwmSentTxt1: '发送地址',
    hwmSentTxt2: '接收地址',
    hwmSentTxt2Error: '地址是以0x开头的42位字符.',
    hwmSentTxt3: '转账数量',
    hwmSentTxt3Error: '转账金额必须小于余额.',
    hwmSentTxt3Amount: '可用',
    hwmSentTxt3All: '全部',
    hwmSentTxt4: '手续费',
    hwmSentSilder1: '慢',
    hwmSentSilder2: '快',
  },

  homeWalletDetails: {
    hwdTit: '交易详情',
    hwdListTxt1: '交易哈希值',
    hwdListTxt2: '区块高度',
    hwdListTxt3: '创建时间',
    hwdListTxt4: '发送地址',
    hwdListTxt5: '接收地址',
    hwdListTxt6: '数量',
    hwdListTxt7: '手续费',

    hwFootTxt1: "在",
    hwFootTxt2: " 上查看详细信息",
  },

  homeNode: {
    hnTit: '蜂巢节点',
    hnTxt1: 'IP地址',
    hnTxt2: '本地时间',
    hnTxt3: '连接节点',
    hnTxt4: '节点时间',

    hnListTit: '所有节点',
    hnListTxt1: '节点 IP',
    hnListTxt2: '国家',
    hnListTxt3: '城市',
    hnListTxt4: '节点时间',

    hnNetwork: '请检查您的网络是否故障',
  },

  homeSet: {
    hsTit: '设置',
    hsTit1: '切换语言',
    hsTxt1: '语言',
    hsTxt2: '跟随系统',

    hsTit2: '切换网络',
    hsTxt2: '当前连接网络',
    hsTxt3: '测试网',
    hsTxt4: '主网',

    hsTit3: '版本',
    hsTxt5: '版本信息',

    hsNetwork1: '您将切换到 ',
    hsNetwork2: ', 这个操作会重启客户端并更新钱包数据，请确保您的钱包信息已备份',
  },

  homeDig: {
    hdEnteryTit: 'PC 矿工',
    hdEnteryTxt1: '挖矿钱包',
    hdEnteryTxt2: '抵押数量',
    hdEnteryTxt3: '10,000 BIUT起，抵押数量被冻结一年，抵押数量越多，挖到BIU的收益越高哦！',
    
    hdHeadListTxt: '进入挖矿页面，等待开启挖矿',

    hdNavProfit: '挖矿收益',
    hdNavProfitListNull: '没有挖矿记录',
    hdNavProfitListTit1: '挖矿收益',
    hdNavProfitListTit2: '挖矿数量',
    hdNavProfitListTit3: '总收益',
    hdNavProfitListTxt1: '块龄',
    hdNavProfitListTxt2: '收益',
    hdNavProfitListTxt3: '区块高度',
    hdNavProfitListTxt4: '区块哈希值',

    hdNavRecord: '锁仓记录',
    hdNavRecordMore: '查看更多',
    hdNavRecordListNull: '没有记录',
    hdNavRecordListTxt1: '锁仓时间',
    hdNavRecordListTxt2: '锁仓金额（BIUT）',
    hdNavRecordListTxt3: '解锁时间',

    hdNavPool: '矿池',
    hdNavPoolBtn1: '无法开通矿池',
    hdNavPoolBtn2: '申请开通矿池',

    hdNavPoolTxt1: '500,000 BIUT以上可申请开通矿池，获得更高收益哦！',
    hdNavPoolTxt2: '恭喜你获得开通矿池的资格，点击申请开通矿池，享受更高收益吧！',
    hdNavPoolApplyTxt1: '已申请开通矿池，请等待系统审核哦',
    hdNavPoolApplyTxt2: '名称',
    hdNavPoolApplyTxt3: '',

    hdNavPoolFailureTit: '开启我的矿池',
    hdNavPoolFailureTxt1: '申请记录',
    hdNavPoolFailureTxt2: '矿池名称',
    hdNavPoolFailureTxt3: '时间',
    hdNavPoolFailureTxt4: '状态',
    hdNavPoolFailureTxt5: '拒绝',

    hdNavPoolSuccessTit1: '名称',
    hdNavPoolSuccessTit2: '矿池开通时间',
    hdNavPoolSuccessListTxt1: '我的矿池资产',
    hdNavPoolSuccessListTxt2: '矿池节点数量',
    hdNavPoolSuccessListTxt3: '矿池总收益',
    hdNavPoolSuccessListTxt4: '我的收益',

    hdFootTit1: '全网挖矿收益',
    hdFootTit2: '区块高度',
    hdFootTit3: '矿工',
  },

  homeDigMore: {
    hdmTit1: '钱包名称',
    hdmTit2: '钱包地址',
  },

  homeDigMask: {
    hdMaskMortgageTit: '抵押',
    hdMaskMortgageTxt1: '抵押数量',
    hdMaskMortgageTxt2: '抵押数量会被冻结一年，抵押数量越多，挖到BIU的收益越高哦！',

    hdMaskFirstTit: 'Start Mining',
    hdMaskFirstBtn: 'Start invitation mining',

    hdMaskStartTit: 'You will start mining with',
    hdMaskStartTxt1: 'Increase the number of frozen.',
    hdMaskStartTxt2: 'Higer of the Mortgage amount, and higher the profit of BIU token',
    hdMaskStartTxt3: 'Guarantee Amount',
    hdMaskStartBtn: 'Open mining',

    hdMaskNetworkTit: 'No connection to network. Continue or exit?',
    hdMaskNetworkExit: 'Exit',
    hdMaskNetworkContinue: 'Continue',
    hdMaskNetworkReconnecting: 'Reconnecting',
    hdMaskNetworkTxt1: "No connected peer. You can exit the application and check your network",
    hdMaskNetworkTxt1: "No network connection. You can exit the application and check your network",

    hdMaskRecordTit: 'Lock record',
    hdMaskRecordListTxt1: 'LOCK TIME',
    hdMaskRecordListTxt2: 'LOCKED AMOUNT (BIUT)',
    hdMaskRecordListTxt3: 'UNLOCK TIME',

    hdMaskPoolTit: '开通我的矿池',
    hdMaskPoolTxt1: '恭喜你获得开通矿池的资格，完成以下操作即可申请开通我的矿池，享受更高收益。',
    hdMaskPoolTxt2: '矿池名称',
    hdMaskPoolTxt3: '矿池名称重复',
    hdMaskPoolTxt4: '申请开通矿池',
    hdMaskPoolNameIpt: '给矿池起个专属昵称吧'
  },

  homeInvitation: {
    hiTit: '我的等级',

    hiTxt: '金牌',

    hiBtn: '查看规则',

    hiListTit: '邀请记录',
    hiListSearch: '请输入地址进行搜索',
    hiListTxt1: '地址',
    hiListTxt2: '邀请时间',
    hiListTxt3: '已获得奖励（BIUT）',
    hiListTxt4: '操作',

  },

  homeInvitationMask: {
    hiMaskRulesTit: '查看规则',
    hiMaskRulesTxt: '每次邀请成功就会奖励BIUT，请注意查收哦.',
    hiMaskRulesListTxt1: '级别',
    hiMaskRulesListTxt1: '人数',
    hiMaskRulesListLevel1: '铜牌合伙人',
    hiMaskRulesListLevel2: '银牌合伙人',
    hiMaskRulesListLevel3: '金牌合伙人',
    hiMaskRulesListLevel4: '超级合伙人',

    hiMaskDetailsTit: '查看明细',
    hiMaskDetailsTxt: '总收益 (BIUT)',
    hiMaskDetailsListTxt1: '时间',
    hiMaskDetailsListTxt2: '奖励 (BUT)',
  },

  publicBtn: {
    cancelBtn: '取消',
    confirmBtn: '确定',
    backBtn: '返回',
    mortgageBtn1: '抵押',
    mortgageBtn2: '抵押更多',
    openBtn: '开启挖矿',

  },
  page: {
    pageTotal: '条记录',
    pageNext: '下一页',
    pagePrev: '上一页',
    addMore: '加载更多'
  },

  tips: {
    copySuccess: "复制成功",
    copyFailure: "复制失败"
  }
}