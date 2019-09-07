import { dialog, shell } from 'electron'
// import db from '../../datastore'
import axios from 'axios'
import pkg from '../../package.json'
const version = pkg.version
const release = 'https://api.github.com/repositories/206411923/releases'
const downloadUrl = 'https://github.com/BIUT-Block/biutblock-client-pool/releases/tag/'

const checkVersion = async (app) => {
  let showTip
  // let showTip = db.read().get('picBed.showUpdateTip').value()
  // if (showTip === undefined) {
  // db.read().set('picBed.showUpdateTip', true).write()
  showTip = true
  if (showTip) {
    const res = await axios.get(release)
    if (res.status === 200) {
      const latest = res.data[0].tag_name
      const result = compareVersion2Update(version, latest)
      if (result) {
        dialog.showMessageBox({
          type: 'info',
          title: 'New Version',
          buttons: ['Yes'],
          message: `Found new version ${latest}. Please update.`
        }, (res, checkboxChecked) => {
          if (res === 0) { // if selected yes
            shell.openExternal(`${downloadUrl}${latest}`)
          }
          app.quit()
        // db.read().set('picBed.showUpdateTip', !checkboxChecked).write()
        })
      }
    } else {
      return false
    }
  } else {
    return false
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
