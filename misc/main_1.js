const {app,BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

let win;

var createWindow = () =>{
    win = new BrowserWindow({
        width: 1200,//800,
  	    height: 1000,//600,
  	    icon: __dirname + '/ui/images/cherry-coin.png',
  	    title:"Cherry-Coin",
        autoHideMenuBar: true,
        useContentSize: true,
        resizable: true,
        frame: true,
        show: false
    });

    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
      }));

    win.once('ready-to-show', ()=>{
        win.show();
    });

    win.webContents.openDevTools();

    win.on('close', ()=>{
        win = null;
    });
}

// app.once('ready', ()=>{
//     createWindow();
//   });
app.on('ready', function(){
    createWindow();
  });

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') {
      app.quit();
    }
  });

global.APP_NAME = "Cherry-Coin";