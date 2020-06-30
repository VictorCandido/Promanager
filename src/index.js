const { app, BrowserWindow, } = require('electron')
const path = require('path')
const fixPath = require('fix-path');

fixPath();

app.dock.hide();

function configWindow () {
    // Cria uma janela de navegação
    let win = new BrowserWindow({
        width: 700,
        height: 400,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        }
    })

    win.loadFile(path.resolve(__dirname, 'index.html'))
    // win.webContents.openDevTools({ 'mode': 'detach' })
}

app.whenReady().then(configWindow)