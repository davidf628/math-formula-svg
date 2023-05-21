// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const mjAPI = require('mathjax-node');
const fs = require('fs');

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  ipcMain.on('make-svg', 
    (event, asciimath_str, filepath) => {
        mjAPI.typeset({
            math: asciimath_str,
            format: "TeX", // or "inline-TeX", "MathML", "AsciiMath", "TeX"
            svg:true,      // or svg:true, or html:true, or mml:true
          }, function (data) {
            if (!data.errors) {
                const window = BrowserWindow.getFocusedWindow();
                window.webContents.send('editor-event', { action: 'load-svg', data: data.svg });
                fs.writeFile(filepath, data.svg, (err) => {
                    if (err) {
                      console.error('An error occurred while writing the file:', err);
                    } else {
                      console.log(`${filepath} has been written successfully!`);
                    }
                  });
            }
          });

    });

  // and load the index.html of the app.
  mainWindow.loadFile('index.html');

  mjAPI.config({
    MathJax: {
        loader: {load: ['input/asciimath', 'output/svg', 'ui/menu']},
    }
  });
  mjAPI.start();

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.