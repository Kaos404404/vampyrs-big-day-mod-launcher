const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { ModManager } = require('./src/modManager');

let mainWindow;
let modManager;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    icon: path.join(__dirname, 'assets', 'icon.ico'),
  });

  mainWindow.loadFile('src/index.html');

  // Open DevTools in development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
};

app.on('ready', () => {
  modManager = new ModManager();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// IPC Handlers
ipcMain.handle('get-mods', async () => {
  return modManager.getMods();
});

ipcMain.handle('get-game-path', async () => {
  return modManager.getGamePath();
});

ipcMain.handle('auto-detect-game', async () => {
  try {
    const detectedPath = await modManager.autoDetectGamePath();
    if (detectedPath) {
      modManager.setGamePath(detectedPath);
      return { success: true, path: detectedPath };
    } else {
      return { success: false, error: 'Spiel nicht gefunden' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('install-mod', async (event, modPath) => {
  try {
    const result = await modManager.installMod(modPath);
    return { success: true, mod: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('enable-mod', async (event, modId) => {
  try {
    modManager.enableMod(modId);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('disable-mod', async (event, modId) => {
  try {
    modManager.disableMod(modId);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('uninstall-mod', async (event, modId) => {
  try {
    modManager.uninstallMod(modId);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('launch-game', async (event, enabledMods) => {
  try {
    modManager.launchGame(enabledMods);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('set-game-path', async (event, gamePath) => {
  try {
    modManager.setGamePath(gamePath);
    return { success: true, path: gamePath };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('select-game-path', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
    title: 'Wähle Vampy\'s Big Day Spielverzeichnis',
  });
  return result.filePaths[0] || null;
});

ipcMain.handle('select-mod-file', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [{ name: 'Mod Files', extensions: ['zip'] }],
    title: 'Wähle eine Mod-Datei (.zip)',
  });
  return result.filePaths[0] || null;
});
