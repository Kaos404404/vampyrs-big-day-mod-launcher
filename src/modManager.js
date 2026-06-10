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

  getGamePath() {
    return this.config.gamePath;
  }

  // Auto-detect game path from common Steam locations
  async autoDetectGamePath() {
    const commonPaths = [
      path.join(os.homedir(), 'AppData', 'Local', 'Programs', 'steamapps', 'common', 'Vampys Big Day'),
      path.join(os.homedir(), 'AppData', 'Local', 'Programs', 'steamapps', 'common', "Vampy's Big Day"),
      'C:\\ Program Files (x86)\\Steam\\steamapps\\common\\Vampys Big Day',
      'C:\\ Program Files\\Steam\\steamapps\\common\\Vampys Big Day',
      path.join(os.homedir(), 'Games', "Vampy's Big Day"),
      path.join(os.homedir(), 'Games', 'Vampys Big Day'),
    ];

    // Check common Steam registry locations (Windows)
    try {
      const steamPaths = this.getSteamGamePath();
      if (steamPaths && steamPaths.length > 0) {
        for (const steamPath of steamPaths) {
          if (this.validateGamePath(steamPath)) {
            return steamPath;
          }
        }
      }
    } catch (error) {
      console.log('Could not read Steam registry');
    }

    // Check common paths
    for (const commonPath of commonPaths) {
      if (fs.existsSync(commonPath) && this.validateGamePath(commonPath)) {
        return commonPath;
      }
    }

    return null;
  }

  // Validate game path by checking for required files
  validateGamePath(gamePath) {
    if (!fs.existsSync(gamePath)) return false;
    
    // Check for either index.html or exe
    const hasIndexHtml = fs.existsSync(path.join(gamePath, 'index.html'));
    const hasExe = fs.existsSync(path.join(gamePath, 'Vampys Big Day.exe')) ||
                   fs.existsSync(path.join(gamePath, "Vampy's Big Day.exe"));
    
    return hasIndexHtml || hasExe;
  }

  // Get Steam game path from registry (Windows only)
  getSteamGamePath() {
    try {
      const registry = require('registry-js');
      const steamInstall = registry.getRegistryValue(
        'HKEY_LOCAL_MACHINE',
        'SOFTWARE\\Valve\\Steam',
        'InstallPath'
      );

      if (steamInstall) {
        const steamappsPath = path.join(steamInstall, 'steamapps', 'common');
        return [
          path.join(steamappsPath, 'Vampys Big Day'),
          path.join(steamappsPath, "Vampy's Big Day"),
        ];
      }
    } catch (error) {
      // Registry access failed, continue with common paths
    }
    return [];
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
    const exePath = path.join(this.config.gamePath, 'Vampys Big Day.exe');
    const exePath2 = path.join(this.config.gamePath, "Vampy's Big Day.exe");
    const indexPath = path.join(this.config.gamePath, 'index.html');
    
    // Try to launch the executable first, fall back to index.html
    let gameProcess;
    if (fs.existsSync(exePath)) {
      gameProcess = spawn(exePath, [], { detached: true });
    } else if (fs.existsSync(exePath2)) {
      gameProcess = spawn(exePath2, [], { detached: true });
    } else if (fs.existsSync(indexPath)) {
      gameProcess = spawn('start', [indexPath], { shell: true, detached: true });
    } else {
      throw new Error('Spiel-Executable nicht gefunden!');
    }
    
    gameProcess.unref();
  }
}

module.exports = { ModManager };
