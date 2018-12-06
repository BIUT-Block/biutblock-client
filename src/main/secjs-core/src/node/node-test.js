const NodeData = require('./node-data')

console.log('System Time: ')
console.log(NodeData.SysTime())

NodeData.SysSystem(data => {
  console.log('System Info: ')
  console.log(data)
})

NodeData.SysBios(data => {
  console.log('System Bios: ')
  console.log(data)
})

NodeData.SysBaseboard(data => {
  console.log('System Baseboard: ')
  console.log(data)
})

NodeData.SysCPU(data => {
  console.log('System CPU: ')
  console.log(data)
})

NodeData.SysMem(data => {
  console.log('System Mem: ')
  console.log(data)
})

NodeData.SysDiskLayout(data => {
  console.log('System DiskLayout: ')
  console.log(data)
})

NodeData.SysGraphics(data => {
  console.log('System Graphics: ')
  console.log(data)
})

NodeData.SysOSInfo(data => {
  console.log('System OS Info: ')
  console.log(data)
})

NodeData.SysNetworkInterfaces(data => {
  console.log('System Network Interfaces: ')
  console.log(data)
})

NodeData.SysNetworkStats(data => {
  console.log('System NetworkStats: ')
  console.log(data)
})

NodeData.SysCurrentLoad(data => {
  console.log('System CurrentLoad: ')
  console.log(data)
})

console.log('Process UpTime: ')
console.log(NodeData.PUptime())

console.log('Process Versions: ')
console.log(NodeData.Pverions())

console.log('Process PPID: ')
console.log(NodeData.PPPID())

console.log('Process CPU Usage: ')
console.log(NodeData.PCPUUsage())

NodeData.PublicIPV4(data => {
  console.log('Public IP V4: ')
  console.log(data)
})

NodeData.PublicIPV6(data => {
  console.log('Public IP V6: ')
  console.log(data)
})

NodeData.Location(data => {
  console.log('GEO Location: ')
  console.log(data)
})
