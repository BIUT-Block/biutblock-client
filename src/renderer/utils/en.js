export default {
  login: {
    loginCreate1: 'Create',
    loginCreate2: 'New Wallet',
    loginImport1: 'Import',
    loginImport2: 'Wallet',
    loginCreated: 'Created!',

    loginImportBtn: 'Import Wallet',
    loginFooter1: 'No wallet?',
    loginFooter2: 'Create Wallet',

    loginBtn1: 'Create Wallet',
    loginBtn1s: 'Create Wallet...',
    loginBtn2: 'Login',
    loginBtn3: 'Enter Wallet',

    createdTips1: 'Save these details!',
    createdTips2: 'If you lose these credentials, you lose access to your assets.',
    createdPhrase: 'PHRASE',
    createdKey: 'PRIVATE KEY',
    createdAgreement: 'I have backed up these credentials',

    importSelectTit: 'Select your Keystore',
    importSelectTxt1: 'Select Keystore',
    importSelectTxt2: 'Your wallet is encrypted',

    importKey: 'Private Key',
    importKeystore: 'Keystore',
    importPhrase: 'Phrase',
  },

  loginMask: {
    lgTxt: 'Unable to import, wallet address unbound invitation code.'
  },

  input: {
    walletName: 'WALLET NAME',
    walletNameIpt: 'Wallet Name',
    walletPass1: 'PASSWORD',
    walletPass1Ipt: 'Password',
    walletPass2: 'CONFIRM PASSWORD',
    walletPass2Ipt: 'Confirm Password',

    walletCode: 'INVITATION CODE',
    walletCodeIpt: 'Enter invitation code',

    walletPrivateKey: 'Eenter your private key here',
    walletPhrase: 'Enter your Phrase here width space-separated',

    passFormatTips: 'Use 8 to 30 characters must with a mix of letters, numbers & symbols',
    passDifferent: 'Two passwords are inconsistent',
    passError: 'Password error, unable to unlock wallet',
    passUnlockError: 'Password Error, unlock failed',

    walletCodeError: 'Please enter the correct invitation code',

    nameNull: 'Please input wallet name',

    privateKeyError: 'Private Error',
    privateKeyError2: 'Input value is not valid',
    phraseError: 'Phrase error',

    imporantExists: 'Wallet already exists or imported'
  },

  homeLeftNav: {
    createBtn: 'Create and Import Wallets'
  },

  homeWallet: {
    hwSet1: 'Export Private key',
    hwSet2: 'Export Keystore',
    hwSet3: 'Export Phrase',
    hwSet4: 'Delete Wallet',

    hwCode: 'My invitation code',
    hwBtn1: 'Receipt',
    hwBtn2: 'Sent',

    hwBiut: 'BIUT Balance',
    hwBiutTxt1: 'Available',
    hwBiutTxt2: 'Frozen',
    hwBiu: 'BIU Balance',

    hwListTit: 'Transaction Record',
    hwListNull: 'No transaction data',

    hwBiuInsufficient: "BIU isn't enough to sent",

    hwNameNull: 'Wallet name cannot be empty or only with space.',
    hwUpdateNameSuccess: 'Change wallet name success',

    hwDeleteSuccess: 'Delete wallet successfully',

    hwInvitationTips: 'In the mining page lock  BIUT, you can unlock the invitation code oh!'
  },

  homeWalletMask: {
    hwmKeyTit: 'Security Warning: The private key is not encrypted and the export is risky. Here recommend to backup with mnemonic and Keystore.',
    hwmKeyCopy: 'Copy',

    hwmKeystoreIpt: 'Enter your new password',

    hwmDeleteTit: 'Confirm to delete your wallet? Please make sure you have backed up your wallet.',
    hwmDeleteTit1: "The wallet is a mining wallet and can't be deleted.",
    hwmDeleteTit2: 'The wallet is bind to mining. You can not remove it.',
    hwmDeleteBtn1: 'Delete',
    hwmDeleteBtn2: 'OK',
    
    hwmReceiptTxt1: 'Account',
    hwmReceiptTxt2: 'Amount',
    hwmReceiptTxt3: 'Your address(QR Code)',

    hwmSentTit1: 'Confirm The Following Information.',
    hwmSentTips: 'You are sending assets to the following address, please confirm the operation.',
    hwmSentTxt1: 'FROM',
    hwmSentTxt2: 'TO',
    hwmSentAddressIpt: 'Receive Address',
    hwmSentTxt2Error: 'Addresses are generally 42-bit characters beginning with 0x.',
    hwmSentTxt2Error2: 'This is not a valid address.',
    hwmSentTxt2Error3: 'The same address cannot be transferred.',
    hwmSentTxt3: 'AMOUNT',
    hwmSentTxt3Error: 'Transfer amount must be less than balance.',
    hwmSentTxt3Amount: 'Available',
    hwmSentTxt3All: 'All',
    hwmSentTxt4: 'FEE',
    hwmSentSilder1: 'Slow',
    hwmSentSilder2: 'Fast',
    hwmSentNetwork: 'No network connection.',

    hwmSentFeeErrorText: 'Fee cannot be greater than BIU balance.',
    hwmSentFailure: 'Submission Failed',
    hwmSentSuccess: 'Submitted successfully',
  },

  homeWalletDetails: {
    hwdTit: 'Transaction Details',
    hwdListTxt1: 'Transaction number',
    hwdListTxt2: 'Block',
    hwdListTxt3: 'Creation time',
    hwdListTxt4: 'From',
    hwdListTxt5: 'To',
    hwdListTxt6: 'Value',
    hwdListTxt7: 'Fee',

    hwFootTxt1: "See more details at",
    hwFootTxt2: "BLOCKCHAIN",
  },

  homeNode: {
    hnTit: 'Node',
    hnTxt1: 'IP Address',
    hnTxt2: 'Local Time',
    hnTxt3: 'Connected Node',
    hnTxt4: 'Node Time',

    hnListTit: 'All Nodes List',
    hnListTxt1: 'NODE IP',
    hnListTxt2: 'COUNTRY',
    hnListTxt3: 'CITY',
    hnListTxt4: 'NODE TIME',

    hnNetwork: 'Please check for network failure.',
  },

  homeSet: {
    hsTit: 'Setting',
    hsTit1: 'Language',
    hsTxt1: 'Language',
    hsTxt2: 'Follow system',

    hsTit2: 'Switching Network',
    hsTxt3: 'Currently connected network',
    hsTxt4: 'Test Network',
    hsTxt5: 'Main Network',

    hsTit3: 'Version',
    hsTxt6: 'Version Information',

    hsText: 'Test Net',
    hsMain: 'Main Net',

    hsNetwork1: 'You will switch to the ',
    hsNetwork2: ', this operation will restart the client and update the wallet data, please confirm that the wallet information has been saved!',
  },

  homeDig: {
    hdEnteryTit: 'PC-Miner',
    hdEnteryTxt1: 'Mining Wallet',
    hdEnteryTxt2: 'Locked amount',
    hdEnteryTxt3: '-Start from 10,000 BIUT, locked BIUT will be frozen one year. The more BIUT locked, the more profits of mining BIU.',
    hdEnteryTxt4: 'Locked BIUT will be frozen one year. The more BIUT locked, the more profits of mining BIU',
    
    hdHeadListTxt: 'Enter the mining page, and wait for mining.',

    hdNavProfit: 'Mining Profit',
    hdNavProfitListNull: 'No mining records yet',
    hdNavProfitListTit1: 'Mining Record',
    hdNavProfitListTit2: 'Number Of Mining',
    hdNavProfitListTit3: 'Income of Mining',
    hdNavProfitListTxt1: 'AGE',
    hdNavProfitListTxt2: 'REWARD',
    hdNavProfitListTxt3: 'BLOCKS',
    hdNavProfitListTxt4: 'BLOCK HASH',

    hdNavRecord: 'Lock Record',
    hdNavRecordMore: 'More',
    hdNavRecordListNull: 'No record',
    hdNavRecordListTxt1: 'LOCK RECORD',
    hdNavRecordListTxt2: 'LOCKED AMOUNT (BIUT)',
    hdNavRecordListTxt3: 'UNLOCK TIME',

    hdNavPool: 'Mining Pool',
    hdNavPoolBtn1: 'Unable to open mining pool',
    hdNavPoolBtn2: 'Apply for opening a mining pool',

    hdNavPoolTxt1: 'Only more than 500,000 you  can apply for opening the mining pool!',
    hdNavPoolTxt2: 'Congratulations you on getting the qualification to open the mining pool,and click  to open the mining pool, enjoy more profit! ',
    hdNavPoolApplyTxt1: 'You have applied for starting the mining pool(',
    hdNavPoolApplyTxt2: '',
    hdNavPoolApplyTxt3: '),please wait for 3~5 days.',

    hdNavPoolFailureTit: 'Create my mine pool',
    hdNavPoolFailureTxt1: 'Application record',
    hdNavPoolFailureTxt2: 'Application Amount',
    hdNavPoolFailureTxt3: 'Time',
    hdNavPoolFailureTxt4: 'Status',
    hdNavPoolFailureTxt5: 'Refuse',

    hdNavPoolSuccessTit1: 'Mine Pool',
    hdNavPoolSuccessTit2: 'Start Time',
    hdNavPoolSuccessTit3: 'Current Address',
    hdNavPoolSuccessTit4: 'Contract Address',
    hdNavPoolSuccessListTxt1: 'My pool assets',
    hdNavPoolSuccessListTxt2: 'Number of pool nodes',
    hdNavPoolSuccessListTxt3: 'Total pool profit',
    hdNavPoolSuccessListTxt4: 'My profit',

    hdFootTit1: 'Whole Network Mining',
    hdFootTit2: 'Blocks',
    hdFootTit3: 'Mined by',

    hdFootTimeTxt1: 'seconds ago',
    hdFootTimeTxt2: 'minutes ago',
    hdFootTimeTxt3: 'hours ago',


    hdNavPoolRes: 'The mine pool has been opened. Please wait for the return result of the main network.'
  },

  homeDigMore: {
    hdmTit1: 'Wallet Name',
    hdmTit2: 'Wallet Account',
  },

  homeDigMask: {
    hdMaskMortgageTit: 'Lock',
    hdMaskLoading: 'Loading...',
    hdMaskMortgageTxt1: 'Locked amount',
    hdMaskMortgageTxt2: 'Locked BIUT will be frozen one year. The more BIUT locked, the more profits of mining BIU.',

    hdMaskFirstTit: 'Start Mining',
    hdMaskFirstBtn: 'Start invitation mining',

    hdMaskBeginTxt1: 'Whether to enable',
    hdMaskBeginTxt2: 'to open mining',

    hdMaskStartTit: 'You will start mining with',
    hdMaskStartTxt1: 'Increase the number of frozen.',
    hdMaskStartTxt2: 'Higer of the Mortgage amount, and higher the profit of BIU token',
    hdMaskStartTxt3: 'Frozen Amount',
    hdMaskStartBtn: 'Open mining',

    hdMaskNetworkTit: 'No connection to network. Continue or exit?',
    hdMaskNetworkExit: 'Exit',
    hdMaskNetworkContinue: 'Continue',
    hdMaskNetworkReconnecting: 'Reconnecting',
    hdMaskNetworkTxt1: "No connected peer. You can exit the application and check your network",
    hdMaskNetworkTxt2: "No network connection. You can exit the application and check your network",

    hdMaskRecordTit: 'Lock record',
    hdMaskRecordListTxt1: 'LOCK TIME',
    hdMaskRecordListTxt2: 'LOCKED AMOUNT (BIUT)',
    hdMaskRecordListTxt3: 'UNLOCK TIME',

    hdMaskPoolTit: 'Create the mining pool',
    hdMaskPoolTxt1: 'Congratulations on getting the opportunity to creat mining pool. You can get more mining profit by completing the following operations.',
    hdMaskPoolTxt2: 'Mining Pool Name',
    hdMaskPoolTxt3: 'Duplicate mine name',
    hdMaskPoolTxt4: 'Apply for opening a mining pool',
    hdMaskPoolNameIpt: 'name your pool'
  },

  homeInvitation: {
    hiTit: 'My Level',
    hiShare: 'Share',

    hiTxt: 'Gold medal',

    hiBtn: 'View rules',

    hiListTit: 'Invited Record',
    hiListSearch: 'Enter address to search',
    hiListTxt1: 'Address',
    hiListTxt2: 'Invitation time',
    hiListTxt3: 'Total reward (BIUT)',
    hiListTxt4: 'Operation',
    hiListBtn: 'View details',

    hiListSearchNull: 'No search results yet',
    hiListNull: 'No record yet',
  },

  homeInvitationMask: {
    hiMaskRulesTit: 'View rules',
    hiMaskRulesTxt: 'Every time the invitation is successful, it will reward BIUT, please check it.',
    hiMaskRulesListTxt1: 'Level',
    hiMaskRulesListTxt2: 'Number of people',
    hiMaskRulesListLevel1: 'Bronze partner',
    hiMaskRulesListLevel2: 'Silver partner',
    hiMaskRulesListLevel3: 'Gold partner',
    hiMaskRulesListLevel4: 'Super partner',
    hiMaskRulesListLevel4Txt: 'More than 64',

    hiMaskDetailsTit: 'Reward details',
    hiMaskDetailsTxt: 'Total revenue (BIUT)',
    hiMaskDetailsListTxt1: 'Time',
    hiMaskDetailsListTxt2: 'Reward (BUT)',

    hiMaskShareTit1: 'BIUT-PC Miner POW Mining',  
    
    hiMaskShareTit2: 'Invitation Code',

    hiMaskShareTxt1: 'Copy Link',
    hiMaskShareTxt2: 'Open the link with a browser to view',

    hiMaskShareTxt3: 'Lock 10,000 BIUT on the mining page to open one-click sharing.',
  },

  publicBtn: {
    cancelBtn: 'Cancel',
    confirmBtn: 'Confirm',
    backBtn: 'Back',
    mortgageBtn1: 'Locked',
    mortgageBtn1s: 'Locking...',
    mortgageBtn2: 'Locked amount',
    openBtn: 'Open mining',
    stopBtn: 'Stop mining',
    resubmitBtn: 'Resubmit',
    knowBtn: 'OK',

    myKnowBtn: 'OK',
    myGoShowBtn: 'Open Sharing'
  },
  page: {
    pageTotal: 'records in total',
    pageNext: 'Next',
    pagePrev: 'Previous',
    clickMore: 'Click to load more'
  },

  tips: {
    copySuccess: 'Copy success',
    copyFailure: 'Copy failure'
  }
}