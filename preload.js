const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('mjAPI', {

    makeSVG: (asciimath_str, filepath) => ipcRenderer.send('make-svg', asciimath_str, filepath),

    handleEditorEvent: (callback) => ipcRenderer.on('editor-event', callback)
    
});