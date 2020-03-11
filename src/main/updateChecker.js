import { dialog, shell } from 'electron'
// import db from '../../datastore'
import axios from 'axios'
import pkg from '../../package.json'
const version = pkg.version
const release = 'https://api.github.com/repositories/206411923/releases'


const checkVersion = async (cb) => {
  let showTip
  // let showTip = db.read().get('picBed.showUpdateTip').value()
  // if (showTip === undefined) {
  // db.read().set('picBed.showUpdateTip', true).write()
  showTip = true
  if (showTip) {
    try{
      const res = await axios.get(release)
      if (res.status === 200) {
        const latest = res.data[0].tag_name
        const result = compareVersion2Update(version, latest)
        if (result) {
          cb(true, latest)    
        } else {
          cb(false, '')
        }
      } else {
        cb(false, '')
      }
    } catch(err){
      cb(false, '')
    }
  } else {
    cb(false, '')
  }
}

// if true -> update else return false
const compareVersion2Update = (current, latest) => {
  console.log('Current Version: ' + current)
  const currentVersion = current.split('.').map(item => parseInt(item))
  const latestVersion = latest.split('.').map(item => parseInt(item))
  let flag = false

  for (let i = 0; i < 3; i++) {
    if (Number(currentVersion[i]) < Number(latestVersion[i])) {
      flag = true
    } else if (Number(currentVersion[i]) === Number(latestVersion[i])) {
      continue
    } else {
      break
    }
  }

  return flag
}

export default checkVersion
