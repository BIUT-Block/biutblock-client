const SECBlockChain = require('@sec-block/secjs-blockchain')
const SECDatahandler = require('@sec-block/secjs-datahandler')

const dbconfig = {
  DBPath: process.cwd() + '/../../data/',
  ID: []
}

let tokenDB = new SECDatahandler.TokenBlockChainDB(dbconfig)

let SECTokenBlockChain = new SECBlockChain.SECTokenBlockChain(tokenDB)
SECTokenBlockChain.init(() => {
  // console.log(SECTokenBlockChain.getLastBlock())
  // console.log(SECTokenBlockChain.getCurrentHeight() + 1)
  SECTokenBlockChain.getBlockChainFromDB(0, 1174, (err, data) => {
    if (err) {
      console.log(err)
    } else {
      console.log(data.length)
    }
  })
})
