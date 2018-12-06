const level = require('level')

// 1) Create our database, supply location and options.
//    This will create or open the underlying LevelDB store.
let tokenDB = level('../../data/tokenBlockChain')

function _getAllKeysInDB (db, callback) {
  let buffer = []
  db.createReadStream().on('data', function (data) {
    buffer.push(data.key)
  }).on('error', function (err) {
    // console.log('Stream occurs an error when trying to read all data!')
    callback(err, null)
  }).on('close', function () {
    // console.log('Stream closed')
  }).on('end', function () {
    // console.log('Stream ended')
    callback(null, buffer)
  })
}

function printListInRows (list) {
  list.forEach(element => {
    console.log(element)
  })
}

_getAllKeysInDB(tokenDB, (err, data) => {
  if (err) console.log(err)
  else {
    printListInRows(data)
  }
})
