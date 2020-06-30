const { remote } = require('electron');
const { Tray, Menu, Notification } = remote;
const { readdirSync } = require('fs')
const { spawn } = require('child_process');
const path = require('path')

const store = require('./Model/store')

const btnChooseFolder = document.getElementById('chooseFolder')
const lblFilePath = document.getElementById('filePath')

const win = remote.getCurrentWindow();
const notification = new Notification({
    title: 'Promanager',
    body: 'Promanager está rodando na barra de tarefas!',
    closeButtonText: 'Fechar'
})
let tray;

btnChooseFolder.onclick = async function () {
    try {
        const result = await remote.dialog.showOpenDialog({  
            properties: [ 'openDirectory' ]
        })
    
        if (! result) return;
    
        const filePath = result.filePaths[0];
    
        lblFilePath.textContent = filePath;
        const childFolders = getDirectories(filePath)
        renderTray(childFolders)

        store.set('Directory', filePath)

        remote.dialog.showMessageBox({
            type: 'info',
            message: 'Repositório cadastrado com sucesso!',
            detail: filePath
        })

        win.minimize();
        notification.show();
    } catch (err) {
        remote.dialog.showMessageBox({
            type: 'error',
            message: 'Falha',
            detail: err.message
        })
    }
}

const directory = store.get('Directory')
    
if (directory) {
    lblFilePath.textContent = directory
    const childFolders = getDirectories(directory)
    renderTray(childFolders)
    win.hide();
    notification.show();
}

function renderTray (childFolders) {
    if (! tray) {
        tray = new Tray(path.resolve(__dirname, '..', 'assets', 'trayTemplate.png'));
    }

    const menu = childFolders.map(child => ({
        label: child,
        submenu: [
            { label: 'Abrir no VSCode', click: () => {
                console.log(`${directory}/${child}`);
                spawn('code', [`${directory}/${child}`], {
                    cwd: process.cwd(),
                    env: {
                        PATH: process.env.PATH
                    },
                    stdio: 'inherit',
                })
            } }
        ]
    }))

    const contextMenu = Menu.buildFromTemplate([
        ...menu,
        { type: 'separator' },
        { label: 'Settings', click: () => {
            win.show()
        } },
        { label: 'Quit', role: 'quit' }
    ])
    contextMenu.items[1].checked = false
    tray.setContextMenu(contextMenu)
}

function getDirectories (source) {
    return readdirSync(source, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory()) 
            .map(dirent => dirent.name)
}