const SECMerkleTree = require('@sec-block/secjs-merkle-tree')

class SECVerify {
  constructor (Blockchain) {
    this.TokenBlockchain = Blockchain.getTokenBlockchain()
    this.LastTokenBlock = this.TokenBlockchain.getLastBlock()
    this.TxBlockchain = Blockchain.getTxBlockchain()
    this.LastTxBlock = this.TxBlockchain.getLastBlock()
  }

  TxVerify (TxHash) {
    // Variable "TxHash" should be array: [tx1, tx2, ..., txx, ...], txx can be string or buffer
    // Merkle tree hash calculations are done in constructor function
    let merkleTree = new SECMerkleTree(TxHash, 'sha256')

    // To get merkle tree root hash, use getRoot() function
    // Returned value is Buffer type, to verify root, use Buffer.compare(a, b) === 0
    let calcRoot = merkleTree.getRoot()
    let realRoot = Buffer.from('0123456789', 'hex')
    if (Buffer.compare(calcRoot, realRoot) === 0) {
      console.log('data complete and not modified')
    }

    // Extra functions which may never be used
    // getProof(leaf[, index]): 提供一个叶节点的值(TxHash变量的一员),这个方法会返回提供的叶节点的所有配偶节点相对自己的位置(left/right)以及hash值，返回json格式对象
    // verify(data, leaf, real_root): 输入参数data为getProof()的返回值，leaf为叶节点的值，因此根据data和leaf可以计算出该merkle树根值，与real_root比较后，返回 true|false
  }
}

module.exports = SECVerify
