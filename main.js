const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');
const express = require('./main/app');

let win

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
  	width: 800,
  	height: 600,
  	icon: __dirname + '/ui/images/cherry-coin.png',
  	title:"Cherry-Coin",
    autoHideMenuBar: true,
    useContentSize: true,
    resizable: false,
    show: false
  });

  // console.log(express.HTTP_PORT); //xx

  // and load the index.html of the app.
  // win.loadURL(url.format({pathname: path.join(__dirname, 'index.html'), protocol: 'file:', slashes: true}));
  
  //for express application
  win.loadURL("http://localhost:8085/");

  win.once('ready-to-show', () => {
    win.show();
  });

  // Open the DevTools.
  //win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  });
}


app.once('ready', ()=>{
  express;
  createWindow();
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

/*app.on('activate', () => {
	if (win === null) {
		createWindow();
	}
});*/