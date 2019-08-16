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
    loginBtn2: 'Login',
    loginBtn3: 'Enter Wallet',

    createdTips1: 'Save these details!',
    createdTips2: 'If you lose these credentials, you lose access to your assets.',
    createdPhrase: 'PHRASE',
    createdKey: 'PRIVATE KEY',
    createdAgreement: 'I have backed up these credentials',

    importSelectTit: 'Select your Keystore',
    importSelectTxt1: 'Select Keystore',
    importSelectTxt2: 'Your wallet is encrypted.Good! Please enter the password.',

    importKey: 'Private Key',
    importKeystore: 'Keystore',
    importPhrase: 'Phrase',
  },

  input: {
    walletName: 'WALLET NAME',
    walletNameIpt: 'Wallet Name',
    walletPass1: 'PASSWORD',
    walletPass1Ipt: 'password',
    walletName2: 'CONFIRM PASSWORD',
    walletName2Ipt: 'Confirm Password',

    walletCode: 'INVITATION CODE',
    walletCodeIpt: 'Enter invitation code',

    walletPrivateKey: 'Eenter your private key here',
    walletPhrase: 'Enter your Phrase here width space-separated',

    passFormatTips: '8-30 characters, must contain at least 2 types of numbers, English letters, and special characters.',
    passDifferent: 'Two passwords are inconsistent.',
    passError: 'Password error, unable to unlock wallet.',
    passUnlockError: 'Password Error, unlock failed.',

    walletCodeError: 'Please enter the correct invitation code.',

    nameNull: 'Please input wallet name.',

    privateKeyError: 'Private Error.',
    phraseError: 'Phrase error.',

    imporantExists: 'Wallet already exists or imported.'
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
    hwBiutTxt2: 'Guarantee',
    hwBiu: 'BIU Balance',

    hwListTit: 'Transaction Record',
    hwListNull: 'No transaction data',

    hwBiuInsufficient: "BIU isn't enough to sent",

    hwNameNull: 'Wallet name cannot be empty or only with space.',

    hwDeleteSuccess: 'Delete wallet successfully',
  },

  homeWalletMask: {
    hwmKeyTit: 'Security Warning: The private key is not encrypted and the export is risky. Here recommend to backup with mnemonic and Keystore.',
    hwmKeyCopy: 'Copy',

    hwmKeystoreIpt: 'Enter your new password',

    hwmDeleteTit: 'Confirm to delete your wallet? Please make sure you have backed up your wallet.',
    hwmDeleteBtn: 'Delete',

    hwmReceiptTxt1: 'Account',
    hwmReceiptTxt2: 'Amount',
    hwmReceiptTxt3: 'Your address(QR Code)',

    hwmSentTit1: 'Confirm The Following information.',
    hwmSentTips: 'You are sending assets to the following address, please confirm the operation.',
    hwmSentTxt1: 'FROM',
    hwmSentTxt2: 'TO',
    hwmSentTxt2Error: 'Addresses are generally 42-bit characters beginning with 0x.',
    hwmSentTxt3: 'AMOUNT',
    hwmSentTxt3Error: 'Transfer amount must be less than balance.',
    hwmSentTxt3Amount: 'Available',
    hwmSentTxt3All: 'All',
    hwmSentTxt4: 'FEE',
    hwmSentSilder1: 'Slow',

    hwmSentSilder2: 'Fast',
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
    hsTxt2: 'Currently connected network',
    hsTxt3: 'Test Network',
    hsTxt4: 'Main Network',

    hsTit3: 'Version',
    hsTxt5: 'Version Information',

    hsNetwork1: 'You will switch to the ',
    hsNetwork2: ', this operation will restart the client and update the wallet data, please confirm that the wallet information has been saved!',
  },

  homeDig: {
    hdEnteryTit: 'PC-Miner',
    hdEnteryTxt1: 'Mining Wallet',
    hdEnteryTxt2: 'Mortgage amount',
    hdEnteryTxt3: 'Not less than 10,000 BIUT, This BIUT will be locked for one year. The more BIUT locked, the greater the chance of digging BIU!',
    
    hdHeadListTxt: 'Enter the mining page, and wait for mining',

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
    hdNavPoolSuccessTit2: 'Start time',
    hdNavPoolSuccessListTxt1: 'My pool assets',
    hdNavPoolSuccessListTxt2: 'Number of pool nodes',
    hdNavPoolSuccessListTxt3: 'Total pool profit',
    hdNavPoolSuccessListTxt4: 'My profit',

    hdFootTit1: 'Whole Network Mining',
    hdFootTit2: 'Blocks',
    hdFootTit3: 'Mined by',
  },

  homeDigMore: {
    hdmTit1: 'Wallet Name',
    hdmTit2: 'Wallet Account',
  },

  homeDigMask: {
    hdMaskMortgageTit: 'Mortgage',
    hdMaskMortgageTxt1: 'Mortgage amount',
    hdMaskMortgageTxt2: 'This BIUT will be locked for one year. The more BIUT locked, the greater the chance of digging BIU!',

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

    hdMaskPoolTit: 'Create the mining pool',
    hdMaskPoolTxt1: 'Congratulations on getting the opportunity to creat mining pool. You can get more mining profit by completing the following operations.',
    hdMaskPoolTxt2: 'Mining Pool Name',
    hdMaskPoolTxt3: 'Duplicate mine name',
    hdMaskPoolTxt4: 'Apply for opening a mining pool',
    hdMaskPoolNameIpt: 'name your pool'
  },

  homeInvitation: {
    hiTit: 'My Level',

    hiTxt: 'Gold medal',

    hiBtn: 'View rules',

    hiListTit: 'Invited record',
    hiListSearch: 'Enter address to search',
    hiListTxt1: 'Address',
    hiListTxt2: 'Invitation time',
    hiListTxt3: 'Received a reward (BIUT)',
    hiListTxt4: 'Operation',

  },

  homeInvitationMask: {
    hiMaskRulesTit: 'View rules',
    hiMaskRulesTxt: 'Every time the invitation is successful, it will reward BIUT, please check it.',
    hiMaskRulesListTxt1: 'Level',
    hiMaskRulesListTxt1: 'Number of people',
    hiMaskRulesListLevel1: 'Bronze partner',
    hiMaskRulesListLevel2: 'Silver partner',
    hiMaskRulesListLevel3: 'Gold partner',
    hiMaskRulesListLevel4: 'Super partner',

    hiMaskDetailsTit: 'Reward details',
    hiMaskDetailsTxt: 'Total revenue (BIUT)',
    hiMaskDetailsListTxt1: 'Time',
    hiMaskDetailsListTxt2: 'Reward (BUT)',
  },

  publicBtn: {
    cancelBtn: 'Cancel',
    confirmBtn: 'Confirm',
    backBtn: 'Back',
    mortgageBtn1: 'Mortgage',
    mortgageBtn2: 'Mortgage more',
    openBtn: 'Open mining',

  },
  page: {
    pageTotal: 'records in total',
    pageNext: 'Next',
    pagePrev: 'Previous',
    addMore: 'Click to load more'
  },

  tips: {
    copySuccess: "Copy success",
    copyFailure: "Copy the failure"
  }
}