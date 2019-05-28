import {
  app,
  BrowserWindow,
  ipcMain,
  // dialog,
  Menu
} from 'electron'
import {
  autoUpdater
} from 'electron-updater'

import updateChecker from './updateChecker.js'
import walletsHandler from '../renderer/lib/WalletsHandler'

const SECNODE = require('@biut-block/biutjs-node')
const packageJSON = require('../../package.json')
const fs = require('fs')

let settingPath = app.getPath('appData') + '/BIUT_Wallet_setting.json'
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */

if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
let netType = 'main'
const winURL = process.env.NODE_ENV === 'development' ? `http://localhost:9080` : `file://${__dirname}/index.html`
// const appPort = process.env.NODE_ENV === 'development' ? '9080' : '3000'

if (fs.existsSync(settingPath)) {
  fs.readFile(settingPath, 'utf-8', function (err, data) {
    if (err) {
      console.log(err)
    }
    let setting = JSON.parse(data)
    netType = setting.netType
  })
}

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

  // ------------------------  SETUP DATABASE PATH  -----------------------
  let path = app.getPath('appData') + '/' + packageJSON.name

  console.log(path + '/data/')

  // ----------------  START RPC SERVER AND NODE INSTANCE  ----------------
  let SECCore = new SECNODE.Core({
    DBPath: path + '/data/',
    SecDBPath: path + '/data/Sec',
    SenDBPath: path + '/data/Sen',
    cacheDBPath: path + '/data/powCache',
    ID: []
  })
  let SECRPC = new SECNODE.RPC(SECCore)
  SECRPC.runRPCServer()

  // ------------------  CHECK REMOTE GENESIS BLOCK HASH  -----------------
  const { net } = require('electron')
  let request
  if (netType === 'main') {
    process.env.netType = 'main'
    request = net.request('http://scan.secblock.io/genesisBlockHash')
  } else {
    process.env.netType = 'test'
    request = net.request('http://test.secblock.io/genesisBlockHash')
  }

  request.on('response', response => {
    response.on('data', remotegenesisHash => {
      remotegenesisHash = remotegenesisHash.toString()
      console.log(`remote GenesisHash: ${remotegenesisHash}`)
      SECCore.secAPIs.getTokenBlockchain(0, 0, (err, genesisBlock) => {
        if (err) {
          return console.log('Blockchain Database is empty')
        }
        console.log(`Local GenesisHash: ${genesisBlock[0].Hash}`)
        if (genesisBlock[0].Hash === remotegenesisHash) {
          return console.log('GenesisHash check passed')
        } else {
          SECCore.secAPIs.clearDB((err) => {
            if (err) return console.error(err)
            console.log('GenesisHash not passed, remove local database')
          })
        }
      })
      SECCore.senAPIs.getTokenBlockchain(0, 0, (err, genesisBlock) => {
        if (err) {
          return console.log('Blockchain Database is empty')
        }
        console.log(`Local GenesisHash: ${genesisBlock[0].Hash}`)
        if (genesisBlock[0].Hash === remotegenesisHash) {
          return console.log('GenesisHash check passed')
        } else {
          SECCore.senAPIs.clearDB((err) => {
            if (err) return console.error(err)
            console.log('GenesisHash not passed, remove local database')
          })
        }
      })
    })
    response.on('end', () => { })
  })
  request.end()

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
    },
    {
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
    //Menu.setApplicationMenu(null)
  } else {
    //Menu.setApplicationMenu(null)
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
