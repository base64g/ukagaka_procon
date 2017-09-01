'use strict';

var electron = require('electron');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var mainWindow = null;
var textWindow = null;
app.on('window-all-closed', function() {
  if (process.platform != 'darwin')
    app.quit();
});

app.on('ready', function() {

  // ブラウザ(Chromium)の起動, 初期画面のロード
  mainWindow = new BrowserWindow({
    "width":       120,
    "height":      240,
    "transparent": true,  // ウィンドウの背景を透過
    "frame":       false, // 枠の無いウィンドウ
    "resizable":   false, // ウィンドウのリサイズを禁止
    "hasShadow":   false, // 残像が残らないようにする(Mac only option)
    "alwaysOnTop": true,  // 常に最前面);
  });
  mainWindow.loadURL('file://' + __dirname + '/../index.html');
  mainWindow.on('closed', function() {
    mainWindow = null;
  });

  textWindow = new BrowserWindow({
    "width":       160,
    "height":      100,
    "transparent": true,  // ウィンドウの背景を透過
    "frame":       false, // 枠の無いウィンドウ
    "resizable":   false, // ウィンドウのリサイズを禁止
    "hasShadow":   false, // 残像が残らないようにする(Mac only option)
    "alwaysOnTop": true,  // 常に最前面);
    "parent":      mainWindow,
  });
  textWindow.loadURL('file://' + __dirname + '/../text.html')
  textWindow.hide();
});

function showText(){
  textWindow.setPosition(mainWindow.getPosition()[0] - 135, mainWindow.getPosition()[1] + 5);
  textWindow.setParentWindow(mainWindow);
  textWindow.showInactive();
}

function hideText(){
  textWindow.hide();
}

//show: arg[ms] showする
electron.ipcMain.on('show', (event, arg) => {
  console.log(arg)
  showText();
  event.sender.send('reply', 'pong');
  setTimeout(hideText, arg);
})

//test用のやつ
electron.ipcMain.on('test', (event, arg) => {
  console.log(arg)
})
