const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('mjAPI', {

    makeSVG: (options) => ipcRenderer.send('make-svg', options),

    handleEditorEvent: (callback) => ipcRenderer.on('editor-event', callback)
    
});