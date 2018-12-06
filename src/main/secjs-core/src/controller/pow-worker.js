const chalk = require('chalk')
const sysConfig = require('config')

const SECPow = require('@sec-block/secjs-pow')
const secPow = new SECPow({
  cacheDBPath: process.cwd() + sysConfig.get('SECBlock.dbConfig').Path + sysConfig.get('SECBlock.powConfig').path,
  expectedDifficulty: sysConfig.get('SECBlock.powConfig').expectedDifficulty
})

process.on('message', (blockForPOW) => {
  blockForPOW.Difficulty = secPow.calcDifficulty(blockForPOW.Difficulty, blockForPOW.Number, blockForPOW.parentPOWCalcTime)
  blockForPOW.Header = Buffer.from(blockForPOW.Header, 'hex')
  console.time(`POW Calculation Duration with Diffculty ${blockForPOW.Difficulty}`)
  secPow.mineLight(blockForPOW, blockForPOW.Difficulty, (nonce, result) => {
    console.timeEnd(`POW Calculation Duration with Diffculty ${blockForPOW.Difficulty}`)
    blockForPOW.MixHash = result.mix
    blockForPOW.Nonce = nonce
    console.log(chalk.magenta('POW RESULT: '))
    console.log(chalk.magenta('Mix Hash: ' + blockForPOW.MixHash.toString('hex')))
    console.log(chalk.magenta('Nonce: ' + blockForPOW.Nonce.toString('hex')))
    secPow.verifyPOW(blockForPOW, (result) => {
      console.log(chalk.magenta('Verified POW: ' + result))
      process.send({
        result: result,
        MixHash: blockForPOW.MixHash.toString('hex'),
        Nonce: blockForPOW.Nonce
      })
    })
  })
})

/* process.on('close', () => {
  secPow.cacheDB.close()
}) */
