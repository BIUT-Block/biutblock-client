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

const SECNODE = require('@sec-block/secjs-node')
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

  // ------------------------  SETUP DATABASE PATH  -----------------------
  let path = app.getPath('appData')
  console.log(path + '/data/')

  // ----------------  START RPC SERVER AND NODE INSTANCE  ----------------
  let SECCore = new SECNODE.Core({ DBPath: path + '/data/', cacheDBPath: path + '/data/powCache' })
  let SECRPC = new SECNODE.RPC(SECCore)
  SECRPC.runRPCServer()

  // ------------------  CHECK REMOTE GENESIS BLOCK HASH  -----------------
  const { net } = require('electron')
  const request = net.request('http://scan.secblock.io/genesisBlockHash')
  request.on('response', response => {
    response.on('data', remotegenesisHash => {
      remotegenesisHash = remotegenesisHash.toString()
      console.log(`remote GenesisHash: ${remotegenesisHash}`)
      SECCore.APIs.getTokenBlockchain(0, 0, (err, genesisBlock) => {
        if (err) {
          return console.log('Blockchain Database is empty')
        }
        console.log(`Local GenesisHash: ${genesisBlock[0].Hash}`)
        if (genesisBlock[0].Hash === remotegenesisHash) {
          return console.log('GenesisHash check passed')
        } else {
          SECCore.APIs.clearDB((err) => {
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
    height: 640,
    useContentSize: true,
    width: 960,
    transparent: false,
    frame: true,
    minHeight: 640,
    minWidth: 960,
  })
  mainWindow.setResizable(true)

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
    Menu.setApplicationMenu(Menu.buildFromTemplate(template))
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
ipcMain.on('close', () => mainWindow.close())
ipcMain.on('max', () => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize()
  } else {
    mainWindow.maximize()
  }
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
