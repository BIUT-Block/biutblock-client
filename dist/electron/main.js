module.exports=function(a){function b(d){if(c[d])return c[d].exports;var e=c[d]={i:d,l:!1,exports:{}};return a[d].call(e.exports,e,e.exports,b),e.l=!0,e.exports}var c={};return b.m=a,b.c=c,b.d=function(a,c,d){b.o(a,c)||Object.defineProperty(a,c,{configurable:!1,enumerable:!0,get:d})},b.n=function(a){var c=a&&a.__esModule?function(){return a['default']}:function(){return a};return b.d(c,'a',c),c},b.o=function(a,b){return Object.prototype.hasOwnProperty.call(a,b)},b.p='',b(b.s=1)}([function(a){a.exports=require('electron')},function(a,b,c){'use strict';function d(){if(Object(i.a)(),j=new e.BrowserWindow({height:624,useContentSize:!0,width:944,transparent:!1,frame:!0}),j.setResizable(!1),'darwin'===process.platform){e.Menu.setApplicationMenu(e.Menu.buildFromTemplate([{label:'Application',submenu:[{label:'Quit',accelerator:'Command+Q',click:function(){e.app.quit()}}]},{label:'Edit',submenu:[{label:'Copy',accelerator:'CmdOrCtrl+C',selector:'copy:'},{label:'Paste',accelerator:'CmdOrCtrl+V',selector:'paste:'}]}]))}else;j.loadURL(k),j.on('closed',()=>{j=null})}Object.defineProperty(b,'__esModule',{value:!0});var e=c(0),f=c.n(e),g=c(2),h=c.n(g),i=c(3);global.__static=c(6).join(__dirname,'/static').replace(/\\/g,'\\\\');let j;const k=`file://${__dirname}/index.html`;e.app.on('ready',d),e.app.on('window-all-closed',()=>{'darwin'!==process.platform&&e.app.quit()}),e.app.on('activate',()=>{null===j&&d()}),e.ipcMain.on('min',()=>j.minimize()),e.ipcMain.on('close',()=>j.close()),e.ipcMain.on('max',()=>{j.isMaximized()?j.unmaximize():j.maximize()}),g.autoUpdater.on('update-downloaded',()=>{g.autoUpdater.quitAndInstall()}),e.app.on('ready',()=>{g.autoUpdater.checkForUpdates()})},function(a){a.exports=require('electron-updater')},function(a,b,c){'use strict';var d=c(0),e=c.n(d),f=c(4),g=c.n(f),h=c(5),i=c.n(h);const j=i.a.version,k=(a,b)=>{console.log('Current Version'+a);const c=a.split('.').map((a)=>parseInt(a)),d=b.split('.').map((a)=>parseInt(a));let e=!1;for(let f=0;3>f;f++)c[f]<d[f]&&(e=!0);return e};b.a=async()=>{let a;if(a=!0,a){const a=await g.a.get('https://api.github.com/repos/FeiMinhao/secjs-client/releases/latest');if(console.log('Current Version'+a),200===a.status){const b=a.data.name,c=k(j,b);c&&d.dialog.showMessageBox({type:'info',title:'\u53D1\u73B0\u65B0\u7248\u672C',buttons:['Yes','No'],message:'\u53D1\u73B0\u65B0\u7248\u672C\uFF0C\u66F4\u65B0\u4E86\u5F88\u591A\u529F\u80FD\uFF0C\u662F\u5426\u53BB\u4E0B\u8F7D\u6700\u65B0\u7684\u7248\u672C\uFF1F',checkboxLabel:'\u4EE5\u540E\u4E0D\u518D\u63D0\u9192',checkboxChecked:!1},(a)=>{0===a&&d.shell.openExternal('https://github.com/Molunerfinn/secjs-client/releases/latest')})}else return!1}else return!1}},function(a){a.exports=require('axios')},function(a){a.exports={name:'secblock-wallet',version:'1.2.3',author:'theFay <fei.minhao@gmail.com>',description:'SEC Wallet Client',license:'MIT',main:'./dist/electron/main.js',scripts:{build:'node .electron-vue/build.js && electron-builder',release:'node .electron-vue/build.js && electron-builder',"release-all":'node .electron-vue/build.js && electron-builder && electron-builder -m && electron-builder --windows',"build:dir":'node .electron-vue/build.js && electron-builder --dir',"build:clean":'cross-env BUILD_TARGET=clean node .electron-vue/build.js',"build:web":'cross-env BUILD_TARGET=web node .electron-vue/build.js',dev:'node .electron-vue/dev-runner.js',pack:'npm run pack:main && npm run pack:renderer',"pack:main":'cross-env NODE_ENV=production webpack --progress --colors --config .electron-vue/webpack.main.config.js',"pack:renderer":'cross-env NODE_ENV=production webpack --progress --colors --config .electron-vue/webpack.renderer.config.js',test:'npm run unit',unit:'karma start test/unit/karma.conf.js',postinstall:'',patch:'npm version patch && git push origin master && git push origin --tags',minor:'npm version minor && git push origin master && git push origin --tags',major:'npm version major && git push origin master && git push origin --tags'},build:{productName:'Sec Client',appId:'sec.secjs-client',directories:{output:'build'},files:['dist/electron/**/*'],dmg:{contents:[{x:410,y:150,type:'link',path:'/Applications'},{x:130,y:150,type:'file'}]},mac:{icon:'build/icons/icon.icns'},win:{icon:'build/icons/icon.ico'},linux:{icon:'build/icons'}},dependencies:{"@mdi/font":'^2.7.94',"@sec-block/secjs-util":'^1.1.20',axios:'^0.16.1',buefy:'^0.6.6',clipboard:'^2.0.4',"crypto-js":'^3.1.9-1',"dom-to-image":'^2.6.0',"electron-updater":'^3.1.2',"element-ui":'^2.4.11',"file-saver":'^2.0.0',jayson:'^2.0.6',jsonwebtoken:'^8.3.0',mdi:'^2.2.43',"net-ping":'^1.2.3',qrious:'^4.0.2',"telnet-client":'^0.16.1',vue:'^2.3.3',"vue-electron":'^1.0.6',"vue-router":'^2.5.3',vuex:'^2.3.1'},devDependencies:{"babel-core":'^6.25.0',"babel-loader":'^7.1.1',"babel-plugin-istanbul":'^4.1.1',"babel-plugin-transform-runtime":'^6.23.0',"babel-preset-env":'^1.6.0',"babel-preset-stage-0":'^6.24.1',"babel-register":'^6.24.1',"babili-webpack-plugin":'^0.1.2',cfonts:'^1.1.3',chai:'^4.0.0',chalk:'^2.1.0',"copy-webpack-plugin":'^4.0.1',"cross-env":'^5.0.5',"css-loader":'^0.28.4',del:'^3.0.0',devtron:'^1.4.0',electron:'^1.8.8',"electron-builder":'^19.19.1',"electron-debug":'^1.4.0',"electron-devtools-installer":'^2.2.0',"extract-text-webpack-plugin":'^3.0.0',"file-loader":'^0.11.2',"html-webpack-plugin":'^2.30.1',"inject-loader":'^3.0.0',karma:'^1.3.0',"karma-chai":'^0.1.0',"karma-coverage":'^1.1.1',"karma-electron":'^5.1.1',"karma-mocha":'^1.2.0',"karma-sourcemap-loader":'^0.3.7',"karma-spec-reporter":'^0.0.31',"karma-webpack":'^2.0.1',mocha:'^3.0.2',multispinner:'^0.2.1',"node-loader":'^0.6.0',"normalize.css":'^8.0.1',"style-loader":'^0.18.2',"url-loader":'^0.5.9',"vue-html-loader":'^1.2.4',"vue-loader":'^13.7.3',"vue-style-loader":'^3.0.1',"vue-template-compiler":'^2.4.2',webpack:'^3.5.2',"webpack-dev-server":'^2.11.3',"webpack-hot-middleware":'^2.23.1',"webpack-merge":'^4.1.0'}}},function(a){a.exports=require('path')}]);