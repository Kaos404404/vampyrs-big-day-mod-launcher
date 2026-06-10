const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  getMods: () => ipcRenderer.invoke('get-mods'),
  getGamePath: () => ipcRenderer.invoke('get-game-path'),
  autoDetectGame: () => ipcRenderer.invoke('auto-detect-game'),
  installMod: (modPath) => ipcRenderer.invoke('install-mod', modPath),
  enableMod: (modId) => ipcRenderer.invoke('enable-mod', modId),
  disableMod: (modId) => ipcRenderer.invoke('disable-mod', modId),
  uninstallMod: (modId) => ipcRenderer.invoke('uninstall-mod', modId),
  launchGame: (enabledMods) => ipcRenderer.invoke('launch-game', enabledMods),
  setGamePath: (gamePath) => ipcRenderer.invoke('set-game-path', gamePath),
  selectGamePath: () => ipcRenderer.invoke('select-game-path'),
  selectModFile: () => ipcRenderer.invoke('select-mod-file'),
});
