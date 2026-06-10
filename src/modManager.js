const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawn } = require('child_process');
const extract = require('extract-zip');
const { v4: uuidv4 } = require('uuid');

class ModManager {
  constructor() {
    this.modsDir = path.join(os.homedir(), 'AppData', 'Local', 'VampysBigDayMods');
    this.configFile = path.join(this.modsDir, 'mods.json');
    this.gameExePath = null;
    this.initModsDirectory();
    this.loadConfig();
  }

  initModsDirectory() {
    if (!fs.existsSync(this.modsDir)) {
      fs.mkdirSync(this.modsDir, { recursive: true });
    }
  }

  loadConfig() {
    if (fs.existsSync(this.configFile)) {
      const data = fs.readFileSync(this.configFile, 'utf8');
      this.config = JSON.parse(data);
    } else {
      this.config = {
        gamePath: null,
        mods: [],
      };
      this.saveConfig();
    }
  }

  saveConfig() {
    fs.writeFileSync(this.configFile, JSON.stringify(this.config, null, 2));
  }

  getMods() {
    return this.config.mods || [];
  }

  async installMod(modPath) {
    try {
      const modId = uuidv4();
      const modExtractDir = path.join(this.modsDir, modId);

      // Extract ZIP
      await extract(modPath, { dir: modExtractDir });

      // Read mod.json from the mod
      const modJsonPath = path.join(modExtractDir, 'mod.json');
      let modInfo = {
        id: modId,
        enabled: false,
        installedAt: new Date().toISOString(),
      };

      if (fs.existsSync(modJsonPath)) {
        const modJson = JSON.parse(fs.readFileSync(modJsonPath, 'utf8'));
        modInfo = { ...modInfo, ...modJson };
      } else {
        // Default name if mod.json doesn't exist
        modInfo.name = `Mod ${modId.substring(0, 8)}`;
        modInfo.version = '1.0.0';
      }

      // Save mod to config
      this.config.mods.push(modInfo);
      this.saveConfig();

      return modInfo;
    } catch (error) {
      throw new Error(`Fehler beim Installieren der Mod: ${error.message}`);
    }
  }

  enableMod(modId) {
    const mod = this.config.mods.find((m) => m.id === modId);
    if (mod) {
      mod.enabled = true;
      this.saveConfig();
    }
  }

  disableMod(modId) {
    const mod = this.config.mods.find((m) => m.id === modId);
    if (mod) {
      mod.enabled = false;
      this.saveConfig();
    }
  }

  uninstallMod(modId) {
    const modIndex = this.config.mods.findIndex((m) => m.id === modId);
    if (modIndex !== -1) {
      const modDir = path.join(this.modsDir, modId);
      if (fs.existsSync(modDir)) {
        fs.rmSync(modDir, { recursive: true, force: true });
      }
      this.config.mods.splice(modIndex, 1);
      this.saveConfig();
    }
  }

  setGamePath(gamePath) {
    this.config.gamePath = gamePath;
    this.gameExePath = gamePath;
    this.saveConfig();
  }

  launchGame(enabledMods) {
    if (!this.config.gamePath) {
      throw new Error('Spielpfad nicht gesetzt!');
    }

    // Create mod manifest
    const modManifest = {
      mods: enabledMods.map((modId) => {
        const mod = this.config.mods.find((m) => m.id === modId);
        return {
          id: modId,
          path: path.join(this.modsDir, modId),
          ...mod,
        };
      }),
    };

    // Write manifest to a temporary file that the game can read
    const manifestPath = path.join(this.modsDir, 'manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(modManifest, null, 2));

    // Launch the game - try different methods
    const indexPath = path.join(this.config.gamePath, 'index.html');
    const exePath = path.join(this.config.gamePath, 'Vampys Big Day.exe');
    
    // Try to launch the executable first, fall back to index.html
    let gameProcess;
    if (fs.existsSync(exePath)) {
      gameProcess = spawn(exePath, [], { detached: true });
    } else if (fs.existsSync(indexPath)) {
      gameProcess = spawn('start', [indexPath], { shell: true, detached: true });
    } else {
      throw new Error('Spiel-Executable nicht gefunden!');
    }
    
    gameProcess.unref();
  }
}

module.exports = { ModManager };
