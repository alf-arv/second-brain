const { app, BrowserWindow, globalShortcut, Menu } = require('electron')
const { ipcMain } = require('electron')
const fs  = require('fs')
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

temp_path = path.join(app.getPath("temp"), 'second-brain')


// create the savestate directory...
if (!fs.existsSync(temp_path)){
    fs.mkdir(temp_path, (err) => {
        if (err) {
            return console.error(err);
        } else {
            console.log("directory for temp data successfully created")
        }
    })
}
// ... and file
if (!fs.existsSync(path.join(temp_path, 'savestate'))){
    fs.writeFile(path.join(temp_path, 'savestate'), '', (err) => {
        if(err) {
            console.log(err)
        } else {
            console.log("savestate file successfully created")
        }

    })
}


// windows
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

        // read and send save state
        let savestate = fs.readFileSync(path.join(temp_path,'savestate'), 'utf8')
        listWindow.webContents.send("importSaveState", savestate)

    }
}

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
    inputWindow.loadFile('input-window.html');
    inputWindow.setResizable(false);
}


// utility functions
function exportSaveState(data){
    savestateLocation = path.join(temp_path, 'savestate');
    //state = JSON.parse(data)
    if (fs.existsSync(savestateLocation)){
        fs.unlinkSync(savestateLocation, (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log("old savestate deleted")
            }
        })
        fs.appendFile(savestateLocation, data/*JSON.stringify(state)*/, (err) => {
            if (err) {
                console.log(err);
            }
        })
    } else {
        console.log("No file exists, and no state could therefore be saved.")
    }
}


// Listeners
ipcMain.on("newThought", (event, data) => {
    inputWindow.close();
    inputWindow = null;
    listWindow.webContents.send("todoItem", data);
    listWindow.webContents.send("reloadList");
})

ipcMain.on("closeInputWindow", (event) => {
    inputWindow.close();
    inputWindow = null;
})

ipcMain.on("exportSaveState", (event, data) => {
    exportSaveState(data)
})


// application behaviour
app.whenReady().then(() => {
  renderListWindow();
})

app.whenReady().then(() => {
  globalShortcut.register('Alt+CommandOrControl+I', () => {
      if (inputWindow == null){
          renderInputWindow()
      }

      else if (inputWindow.isFocused()) {
          inputWindow.close();
          inputWindow = null;
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
