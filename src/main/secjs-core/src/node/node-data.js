const si = require('systeminformation')
const publicIp = require('public-ip')
const iplocation = require('iplocation')

class NodeData {
  SysTime () {
    return si.time()
  }
  SysSystem (callback) {
    si.system(callback)
  }
  SysBios (callback) {
    si.bios(callback)
  }
  SysBaseboard (callback) {
    si.baseboard(callback)
  }
  SysCPU (callback) {
    si.cpu(callback)
  }
  SysMem (callback) {
    si.mem(callback)
  }
  SysDiskLayout (callback) {
    si.diskLayout(callback)
  }
  SysGraphics (callback) {
    si.graphics(callback)
  }
  SysOSInfo (callback) {
    si.osInfo(callback)
  }
  SysNetworkInterfaces (callback) {
    si.networkInterfaces(callback)
  }
  SysNetworkStats (iface, callback) {
    si.networkStats(iface, callback)
  }
  SysCurrentLoad (callback) {
    si.currentLoad(callback)
  }
  PUptime () {
    return process.uptime()
  }
  Pverions () {
    return process.versions
  }
  PPPID () {
    return process.ppid
  }
  PCPUUsage () {
    return process.cpuUsage()
  }
  PublicIPV4 (callback) {
    publicIp.v4().then(callback).catch(() => {
      callback()
    })
  }
  PublicIPV6 (callback) {
    publicIp.v6().then(callback).catch(() => {
      callback()
    })
  }
  Location (callback) {
    publicIp.v4().then(ip => {
      iplocation(ip, (error, res) => {
        if (error) {
          callback()
        } else {
          callback(res)
        }
      })
    }).catch(() => {
      callback()
    })
  }
}

module.exports = new NodeData()
