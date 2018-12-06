const Utils = {
  getPeerAddr: peer => `${peer._socket.remoteAddress || ''}:${peer._socket.remotePort || ''}`,

  toStringArray: _data => {
    let data = obtainLastArray(_data)
    data.forEach((_data, index) => {
      if (Buffer.isBuffer(_data)) {
        data[index] = _data.toString('hex')
      }
    })
    return data
  },

  toBufferArray: data => {

  }
}

function obtainLastArray (data) {
  if (Array.isArray(data[0])) {
    return obtainLastArray(data[0])
  } else {
    return data
  }
}

module.exports = Utils
