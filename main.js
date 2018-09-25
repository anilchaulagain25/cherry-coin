require('module-alias/register');
const dotenv = require('dotenv').config();
const { app, BrowserWindow, ipcMain, remote } = require('electron');
const path = require('path');
const url = require('url');
const net = require('net');

global.APP_NAME = "Cherry-Coin";

const SignupHandler = require('./src/SignupHandler');
const {LoginHandler} = require('./src/LoginHandler');
const BlockResponder = require('./src/BlockResponder');
const Responder = require('./src/renderer/responder');



if (dotenv.error) {
  throw dotenv.error
}else{
  console.log(`Environment Variables : ${JSON.stringify(dotenv.parsed)}`);
}

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1000,
    height: 700,
    minHeight: 700,
    minWidth: 1000,
    icon: __dirname + '/ui/images/cherry-coin.png',
    title: "Cherry-Coin",
    autoHideMenuBar: true,
    useContentSize: true,
    resizable: true,
    frame: true,
    show: false
  });

  win.loadURL(url.format({
    // pathname: path.join(__dirname, 'block.html'),
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  win.once('ready-to-show', ()=>{
    win.show();
  });

  win.webContents.openDevTools()
  win.on('close', () => {
    win = null
  });

  //SIGNUP ACTION
  ipcMain.on('signup-request', (event, arg) => {

    var obj = JSON.parse(arg);
    new SignupHandler(obj.username, obj.pwd,obj.inputkey, event);

  });
  //LOGIN ACTION
  ipcMain.on('login-request', (event, arg) => {
    var obj = JSON.parse(arg);
    new LoginHandler(obj.username, obj.pwd, event);
  });

  // BLOCK RENDERER
  ipcMain.on('generate-block', (event, arg) =>{
    BlockResponder.GenerateBlock(event, arg);
  });
  ipcMain.on('mine-block', (event, arg) =>{
    BlockResponder.MineBlock(event, arg);
  });

  //USER 
  ipcMain.on('GetUserParameters', (event, arg) =>{
    console.log("MAIN.js bootstrapper");
    Responder.GetUserParameters(event,arg);
  });
  //UnConfirmed Balance
  ipcMain.on('GetCurrentBalance', (event, arg) =>{
    console.log("MAIN.js bootstrapper");
    Responder.GetCurrentBalance(event,arg);
  });
  //Confirmed
  ipcMain.on('GetBalance', (event, arg) =>{
    console.log("MAIN.js bootstrapper");
    Responder.GotBalance(event,arg);
  });

  //Global Values
  ipcMain.on('GetGlobalValues', (event, arg) =>{
    console.log("MAIN.js bootstrapper");
    Responder.GetGlobalValues(event,arg);
  });
  
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});
app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
});

