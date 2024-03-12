const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("myAPI", {
  openDialog: () => ipcRenderer.invoke("open-dialog"),
  setA: (text) => ipcRenderer.send("set-A", text),
  setB: (text) => ipcRenderer.send("set-B", text),
  setL: (text) => ipcRenderer.send("set-L", text),
});
