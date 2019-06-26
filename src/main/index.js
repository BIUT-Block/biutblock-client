import {
  app,
  BrowserWindow,
  ipcMain
  // dialog,
  // Menu
} from 'electron'
import {
  autoUpdater
} from 'electron-updater'

import updateChecker from './updateChecker.js'
import walletsHandler from '../renderer/lib/WalletsHandler'

const packageJSON = require('../../package.json')
const fs = require('fs')

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */

if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development' ? `http://localhost:9080` : `file://${__dirname}/index.html`
// const appPort = process.env.NODE_ENV === 'development' ? '9080' : '3000'

let shouldQuit = app.makeSingleInstance(function (commandLine, workingDirectory) {
  // Someone tried to run a second instance, we should focus our window.
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.focus()
  }
})

function createWindow () {
  /**
   * Initial window options
   */
  updateChecker(app)

  if (shouldQuit) {
    app.quit()
    return
  }

  // ------------------------  SETUP DATABASE PATH && Envs -----------------------
  let path = app.getPath('appData') + '/' + packageJSON.name
  let netType = 'main'
  let settingPath = path + '/BIUT_Wallet_setting.json'
  if (fs.existsSync(settingPath)) {
    let settingContent = fs.readFileSync(settingPath, 'utf-8')
    netType = JSON.parse(settingContent).netType
  }
  console.log(path + '/data/')
  const { net } = require('electron')
  let requestBIUT
  let requestBIU
  if (netType === 'main') {
    console.log('node connect with http://scan.biut.io/genesisBlockHash')
    process.env.netType = 'main'
    requestBIUT = net.request('http://scan.biut.io/genesisBlockHash')
    requestBIU = net.request('http://scan.biut.io/sen/genesisBlockHash')
  } else {
    console.log('node connect with http://test.biut.io/genesisBlockHash')
    process.env.netType = 'test'
    requestBIUT = net.request('http://test.biut.io/genesisBlockHash')
    requestBIU = net.request('http://test.biut.io/sen/genesisBlockHash')
  }
  // ----------------  START RPC SERVER AND NODE INSTANCE  ----------------
  const SECNODE = require('@biut-block/biutjs-node')
  let SECCore = new SECNODE.Core({
    DBPath: path + '/data/',
    SecDBPath: path + '/data/Sec',
    SenDBPath: path + '/data/Sen',
    cacheDBPath: path + '/data/powCache',
    loggerPath: path + '/biutlogs',
    NDPPrivKeyFilePath: path + '/ndpprivatekey',
    ID: []
  })
  let SECRPC = new SECNODE.RPC(SECCore)
  SECRPC.runRPCServer()

  // ------------------  CHECK REMOTE GENESIS BLOCK HASH  -----------------
  requestBIUT.on('response', response => {
    response.on('data', remotegenesisHash => {
      remotegenesisHash = remotegenesisHash.toString()
      console.log(`remote BIUT GenesisHash: ${remotegenesisHash}`)
      SECCore.secAPIs.getTokenBlockchain(0, 0, (err, genesisBlock) => {
        if (err) {
          return console.log('BIUT Blockchain Database is empty')
        }
        console.log(`Local BIUT GenesisHash: ${genesisBlock[0].Hash}`)
        if (genesisBlock[0].Hash === remotegenesisHash) {
          return console.log('BIUT GenesisHash check passed')
        } else {
          SECCore.secAPIs.clearDB((err) => {
            if (err) return console.error(err)
            console.log('BIUT GenesisHash not passed, remove local database')
          })
        }
      })
    })
    response.on('end', () => { })
  })
  requestBIUT.end()

  requestBIU.on('response', response => {
    response.on('data', remotegenesisHash => {
      remotegenesisHash = remotegenesisHash.toString()
      console.log(`remote BIU GenesisHash: ${remotegenesisHash}`)
      SECCore.senAPIs.getTokenBlockchain(0, 0, (err, genesisBlock) => {
        if (err) {
          return console.log('BIU Blockchain Database is empty')
        }
        console.log(`Local BIU GenesisHash: ${genesisBlock[0].Hash}`)
        if (genesisBlock[0].Hash === remotegenesisHash) {
          return console.log('BIU GenesisHash check passed')
        } else {
          SECCore.senAPIs.clearDB((err) => {
            if (err) return console.error(err)
            console.log('BIU GenesisHash not passed, remove local database')
          })
        }
      })
    })
    response.on('end', () => { })
  })
  requestBIU.end()

  mainWindow = new BrowserWindow({
    height: 610,
    useContentSize: true,
    width: 960,
    transparent: false,
    frame: true,
    minHeight: 610,
    minWidth: 960
  })
  mainWindow.setResizable(true)

  /** catch the clos event of main window */
  mainWindow.on('close', () => {
    walletsHandler.deleteAllWalletsFromFile()
  })
  if (process.platform === 'darwin') {
    const template = [{
      label: 'Application',
      submenu: [{
        label: 'Quit',
        accelerator: 'Command+Q',
        click: function () {
          app.quit()
        }
      }]
    }, {
      label: 'Edit',
      submenu: [{
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C',
        selector: 'copy:'
      },
      {
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V',
        selector: 'paste:'
      }]
    }, {
      label: 'Network Setting',
      submenu: [{
        label: 'Main Network'
      }, {
        label: 'Test Network'
      }]
    }]
    // Menu.setApplicationMenu(null)
  } else {
    // Menu.setApplicationMenu(null)
  }
  try {
    mainWindow.loadURL(winURL)
  } catch (err) {
    console.log(err)
  }

  mainWindow.on('closed', () => {
    app.quit()
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  } else {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('min', () => mainWindow.minimize())
ipcMain.on('close', () => {
  console.log('Click Close')
  walletsHandler.deleteAllWalletsFromFile()
  mainWindow.close()
})
ipcMain.on('max', () => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize()
  } else {
    mainWindow.maximize()
  }
})

ipcMain.on('relaunch', () => {
  app.relaunch()
  app.quit()
})

// ipcMain.on('min', () => mainWindow.minimize())
// ipcMain.on('close', () => mainWindow.close())
// ipcMain.on('max', () => {
//   if (mainWindow.isMaximized()) {
//     mainWindow.unmaximize()
//   } else {
//     mainWindow.maximize()
//   }
// })
/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
