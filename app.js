const { app, BrowserWindow, globalShortcut, Menu } = require('electron')
const { ipcMain } = require('electron');
const path = require('path')

let listWindow
let inputWindow

// Menu bar configuration
const isMac = process.platform === 'darwin';
const template = [
  ...(isMac ? [{
    label: app.name,
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  }] : []),
  {
    label: 'Actions',
    submenu: [
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        isMac ? { role: 'close' } : { role: 'quit' }
    ]
  }
]
const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)


function renderListWindow(){
    if (listWindow == null) {
        listWindow = new BrowserWindow({
          width: 800,
          height: 600,
          webPreferences: {
            preload: path.join(__dirname, 'preload_listwindow.js')
          },
          show: false,
          skipTaskbar:true,
          icon: path.join(__dirname, 'icons', '2ndbrain_icon_256px.ico')
        })

        listWindow.loadFile('list-window.html');

        listWindow.setResizable(false);

        // This is code to let the application not quit when X is pressed
        //listWindow.on('close', (event) => {
        //    if (app.quitting) {
        //      listWindow = null
        //    } else {
        //      event.preventDefault()
        //      listWindow.hide()
        //    }
        }
}


ipcMain.on("newThought", (event, data) => {
    //console.log(`Recieved a thought from the input window: ${data}. `)
    inputWindow.close();
    inputWindow = null;
    listWindow.webContents.send("todoItem", data);
    listWindow.webContents.send("reloadList");
})


function renderInputWindow(){

    inputWindow = new BrowserWindow({
        width: 800,
        height: 250,
        transparent:true,
        frame:false,
        webPreferences: {
          preload: path.join(__dirname, 'preload_inputwindow.js')
        }
    })
    inputWindow.loadFile('input-window.html')
}


app.whenReady().then(() => {
  renderListWindow();
})


app.whenReady().then(() => {
  globalShortcut.register('Alt+CommandOrControl+I', () => {
      if (inputWindow == null){
          renderInputWindow()
      }
  })

  globalShortcut.register('Alt+CommandOrControl+B', () => {
      listWindow.minimize();
      listWindow.restore();
      listWindow.focus();
  })
})

app.on('quit', () => {
    app.quit();
})
