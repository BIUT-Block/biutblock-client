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

    createdTips1: 'Save these information!',
    createdTips2: 'Store these information at a safety position. If you lose it, you will lose access to your funds.',
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
    lgTxt: "Unable to import, the wallet address doesn’t bind invitation code or network failure."
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

    passFormatTips: 'Use 8 to 30 characters, must with a mix of letters, numbers & symbols',
    passDifferent: "Passwords don’t match",
    passError: 'Wrong password, unable to unlock the wallet',
    passUnlockError: 'Password Error, unlock failed',

    walletCodeError: 'Please enter the correct invitation code',

    nameNull: 'Please input wallet name',

    privateKeyError: 'Invalid Private Key',
    privateKeyError2: 'Invalid Private Key',
    phraseError: 'Phrase Error',

    imporantExists: 'Wallet already exists or imported'
  },

  homeLeftNav: {
    createBtn: 'Create or Import a Wallet'
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
    hwListNull: 'No transaction record',

    hwBiuInsufficient: "Insufficient BIU amount",

    hwNameNull: 'Wallet name cannot be empty.',
    hwUpdateNameSuccess: 'Wallet name successfully changed',

    hwDeleteSuccess: 'Wallet successfully deleted',

    hwInvitationTips: 'Lock BIUT In the mining page, you will get your invitation code!'
  },

  homeWalletMask: {
    hwmKeyTit: 'Security Warning: The private key is not encrypted. and the export is risky. Here recommend to backup with mnemonic and Keystore.',
    hwmKeyCopy: 'Copy',

    hwmKeystoreIpt: 'Enter your new password',

    hwmDeleteTit: 'Are you sure to delete your wallet? Please make sure you have already make a backup!',
    hwmDeleteTit1: "The wallet is a mining wallet and can't be deleted.",
    hwmDeleteTit2: 'The wallet is mining. You can not delete it.',
    hwmDeleteBtn1: 'Delete',
    hwmDeleteBtn2: 'OK',
    
    hwmReceiptTxt1: 'Receive Address',
    hwmReceiptTxt2: 'Amount',
    hwmReceiptTxt3: 'Your address(QR Code)',

    hwmSentTit1: 'Confirm The Following Transaction Information.',
    hwmSentTips: 'You are sending assets to the following address, please confirm the information.',
    hwmSentTxt1: 'FROM',
    hwmSentTxt2: 'TO',
    hwmSentAddressIpt: 'Receive Address',
    hwmSentTxt2Error: 'Addresses are generally 42-bit characters beginning with 0x.',
    hwmSentTxt2Error2: 'This is not a valid address.',
    hwmSentTxt2Error3: 'The same address cannot be transferred.',
    hwmSentTxt3: 'AMOUNT',
    hwmSentTxt3Error: 'Transfer amount must be less than available balance.',
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
    hwdListTxt1: 'Transaction hash',
    hwdListTxt2: 'Height',
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

    hnNetwork: 'Please check your connection status.',

    hnNetworkTxt: 'Main Net'
  },

  homeSet: {
    hsTit: 'Setting',
    hsTit1: 'Language',
    hsTxt1: 'Language',
    hsTxt2: 'Follow system',

    hsTit2: 'Switch Network',
    hsTxt3: 'Current connected network',
    hsTxt4: 'Test Network',
    hsTxt5: 'Main Network',

    hsTit3: 'Version',
    hsTxt6: 'Version Information',

    hsText: 'Test Net',
    hsMain: 'Main Net',

    hsNetwork1: 'You will switch to the ',
    hsNetwork2: ', this operation will restart the application and update the wallet data, please make sure the wallet data has been saved!',
  },

  homeDig: {
    hdEnteryTit: 'PC-Miner',
    hdEnteryTxt1: 'Mining Wallet',
    hdEnteryTxt2: 'Lock-up amount',
    hdEnteryTxt3: '-Start from 10,000 BIUT, locked BIUT will be frozen one year. The more BIUT locked, the more profits of mining BIU.',
    hdEnteryTxt4: 'Locked BIUT will be frozen one year. The more BIUT locked, the more profits of mining BIU',
    
    hdHeadListTxt: 'Enter the mining page, and wait for mining.',

    hdNavProfit: 'Mining Profit',
    hdNavProfitListNull: 'No mining records yet',
    hdNavProfitListTit1: 'Mining Profits',
    hdNavProfitListTit2: 'Mining Amount',
    hdNavProfitListTit3: 'Total Profits',
    hdNavProfitListTxt1: 'Date',
    hdNavProfitListTxt2: 'Profits',
    hdNavProfitListTxt3: 'HEIGHT',
    hdNavProfitListTxt4: 'TRANSACTION HASH',

    hdNavRecord: 'Lock Record',
    hdNavRecordMore: 'More',
    hdNavRecordListNull: 'No record',
    hdNavRecordListTxt1: 'LOCK TIME',
    hdNavRecordListTxt2: 'LOCK AMOUNT (BIUT)',
    hdNavRecordListTxt3: 'UNLOCK TIME',

    hdNavPool: 'Mining Pool',
    hdNavPoolBtn1: 'Unable to open mining pool',
    hdNavPoolBtn2: 'Apply for opening a mining pool',

    hdNavPoolTxt1: 'With available 500,000 BIUT, you can open your own mining pool!',
    hdNavPoolTxt2: 'Congratulations! You can open your own mining pool now. Please click below button to open it. Enjoy more profits',
    hdNavPoolApplyTxt1: 'You have applied for open the mining pool. Please wait for the return result of the main network.',
    hdNavPoolApplyTxt2: '',
    hdNavPoolApplyTxt3: '),please wait for 3~5 days.',

    hdNavPoolFailureTit: 'Create my Mining Pool',
    hdNavPoolFailureTxt1: 'Application record',
    hdNavPoolFailureTxt2: 'Application Amount',
    hdNavPoolFailureTxt3: 'Time',
    hdNavPoolFailureTxt4: 'Status',
    hdNavPoolFailureTxt5: 'Refuse',

    hdNavPoolSuccessTit1: 'Mining Pool',
    hdNavPoolSuccessTit2: 'Start Time',
    hdNavPoolSuccessTit3: 'Current Address',
    hdNavPoolSuccessTit4: 'Contract Address',
    hdNavPoolSuccessListTxt1: 'My Pool assets',
    hdNavPoolSuccessListTxt2: 'Pool nodes amount',
    hdNavPoolSuccessListTxt3: 'Total Pool profits',
    hdNavPoolSuccessListTxt4: 'My profits',

    hdFootTit1: 'Whole Network Mining',
    hdFootTit2: 'Height',
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
    hdMaskMortgageTxt1: 'Lock amount',
    hdMaskMortgageTxt2: 'Locked BIUT will be frozen one year. The more BIUT locked, the more profits of mining BIU.',

    hdMaskFirstTit: 'Start Mining',
    hdMaskFirstBtn: 'Start invitation mining',

    hdMaskBeginTxt1: 'Whether to enable',
    hdMaskBeginTxt2: 'to open mining',
    hdMaskBeginTxt3: 'Start Mining?',

    hdMaskStartTit: 'You will start mining with',
    hdMaskStartTxt1: 'Increase the number of frozen.',
    hdMaskStartTxt2: 'Higer of the Mortgage amount, and higher the profit of BIU token',
    hdMaskStartTxt3: 'Frozen Amount',
    hdMaskStartBtn: 'Open mining',

    hdMaskNetworkTit: 'No connection to network, PC-Miner will be restarted, please check internet connection and relaunch the app.',
    hdMaskNetworkExit: 'Exit',
    hdMaskNetworkContinue: 'Continue',
    hdMaskNetworkReconnecting: 'Reconnecting',
    hdMaskNetworkTxt1: "No connected peer. You can exit the application and check your network",
    hdMaskNetworkTxt2: "No network connection. You can exit the application and check your network",

    hdMaskRecordTit: 'Lock record',
    hdMaskRecordListTxt1: 'LOCK TIME',
    hdMaskRecordListTxt2: 'LOCKED AMOUNT (BIUT)',
    hdMaskRecordListTxt3: 'UNLOCK TIME',

    hdMaskPoolTit: 'Create my Mining Pool',
    hdMaskPoolTxt1: 'Congratulations! You can open your mining pool now. Please complete below operations to open and enjoy more profits.',
    hdMaskPoolTxt2: 'Mining Pool Name',
    hdMaskPoolTxt3: 'Duplicate mine name',
    hdMaskPoolTxt4: 'Apply for opening a mining pool',
    hdMaskPoolNameIpt: 'Make a name for your poo'
  },

  homeInvitation: {
    hiTit: 'My Level',
    hiShare: 'Share',

    hiTxt1: 'Bronze medal',
    hiTxt2: 'Silver medal',
    hiTxt3: 'Gold medal',
    hiTxt4: 'Super partner',

    hiBtn: 'View rules',

    hiListTit: 'Invited Record',
    hiListHeadTxt1: 'LV 1 Miner',
    hiListHeadTxt2: 'Referral Bonus',
    hiListHeadTxt3: 'LV 2 Miner',
    hiListHeadTxt4: 'Referral Bonus',

    hiListSearch: 'Enter address to search',
    hiListTxt1: 'Address',
    hiListTxt2: 'Invitation time',
    hiListTxt3: 'Total reward (BIUT)',
    hiListTxt4: 'Operation',
    hiListBtn: 'View',

    hiListSearchNull: 'No search results yet',
    hiListNull: 'No record yet',
  },

  homeInvitationMask: {
    hiMaskRulesTit: 'View rules',
    hiMaskRulesTxt: 'Every time the invitation is successful, you will get BIUT rewards. Please check it.',
    hiMaskRulesListTxt1: 'Level',
    hiMaskRulesListTxt2: 'Number of people',
    hiMaskRulesListLevel1: 'Bronze partner',
    hiMaskRulesListLevel2: 'Silver partner',
    hiMaskRulesListLevel3: 'Gold partner',
    hiMaskRulesListLevel4: 'Super partner',
    hiMaskRulesListLevel4Txt: 'More than 64',

    hiMaskDetailsTit: 'View',
    hiMaskDetailsTxt: 'Total rewards(BIUT)',
    hiMaskDetailsListTxt1: 'LV2 Address',
    hiMaskDetailsListTxt2: 'Time',
    hiMaskDetailsListTxt3: 'Total Reward (BIUT)',

    hiMaskDetailsListNull: 'No records',

    hiMaskShareTit1: 'BIUT-PC Miner POW Mining',  
    
    hiMaskShareTit2: 'Invitation Code',

    hiMaskShareTxt1: 'Copy Link',
    hiMaskShareTxt2: 'Open the link with a browser to view',

    hiMaskShareTxt3: 'Lock 10,000 BIUT on the mining page to get your invitation link.',
  },

  publicBtn: {
    cancelBtn: 'Cancel',
    confirmBtn: 'Confirm',
    backBtn: 'Back',
    mortgageBtn1: 'Lock',
    mortgageBtn1s: 'Locking, please be patient...',
    mortgageBtn1ss: 'Waiting for contract address...',
    mortgageBtn2: 'Lock more',
    openBtn: 'Start mining',
    stopBtn: 'Stop mining',
    resubmitBtn: 'Resubmit',
    knowBtn: 'OK',

    myKnowBtn: 'OK',
    myGoShowBtn: 'Share Now'
  },
  page: {
    pageTotal: 'records in total',
    pageNext: 'Next',
    pagePrev: 'Previous',
    clickMore: 'Click to load more'
  },

  tips: {
    copySuccess: 'Copied',
    copyFailure: 'Fail to copy'
  }
}