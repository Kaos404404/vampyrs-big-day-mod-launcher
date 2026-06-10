let currentGamePath = null;

async function initializeApp() {
  // Try to load game path from config
  const gamePath = await window.electron.getGamePath();
  if (gamePath) {
    currentGamePath = gamePath;
    document.getElementById('gamePathDisplay').textContent = gamePath;
    updateStatusIndicator(true);
  } else {
    // Try to auto-detect the game
    await autoDetectGame();
  }
  
  await loadMods();
}

async function autoDetectGame() {
  const result = await window.electron.autoDetectGame();
  if (result.success) {
    currentGamePath = result.path;
    document.getElementById('gamePathDisplay').textContent = result.path;
    updateStatusIndicator(true);
    showMessage(`Spiel gefunden: ${result.path}`, 'success');
  } else {
    updateStatusIndicator(false);
  }
}

function updateStatusIndicator(isOnline) {
  const indicator = document.getElementById('statusIndicator');
  if (isOnline) {
    indicator.classList.remove('offline');
    indicator.classList.add('online');
    indicator.textContent = '● Online';
  } else {
    indicator.classList.remove('online');
    indicator.classList.add('offline');
    indicator.textContent = '● Offline';
  }
}

async function loadMods() {
  const mods = await window.electron.getMods();
  const modList = document.getElementById('modList');

  if (mods.length === 0) {
    modList.innerHTML = `
      <div class="empty-state">
        <p>Keine Mods installiert</p>
        <p style="font-size: 0.9em; margin-top: 10px;">Klicke "Mod installieren" um eine Mod hinzuzufügen</p>
      </div>
    `;
    return;
  }

  modList.innerHTML = mods
    .map(
      (mod) => `
    <div class="mod-card">
      <h3>${mod.name || 'Unbekannte Mod'}</h3>
      <p><strong>Version:</strong> ${mod.version || '1.0.0'}</p>
      <p><strong>Beschreibung:</strong> ${mod.description || 'Keine Beschreibung'}</p>
      <p><strong>Installiert:</strong> ${new Date(mod.installedAt).toLocaleDateString('de-DE')}</p>
      <div class="mod-status ${mod.enabled ? 'enabled' : 'disabled'}">
        ${mod.enabled ? '✓ Aktiviert' : '✗ Deaktiviert'}
      </div>
      <div class="mod-actions">
        <button class="btn btn-toggle ${mod.enabled ? 'enabled' : 'disabled'}" onclick="toggleMod('${mod.id}', ${!mod.enabled})">
          ${mod.enabled ? 'Deaktivieren' : 'Aktivieren'}
        </button>
        <button class="btn btn-danger" onclick="uninstallMod('${mod.id}')" style="flex: 0.5;">
          Löschen
        </button>
      </div>
    </div>
  `
    )
    .join('');
}

async function toggleMod(modId, enable) {
  if (enable) {
    const result = await window.electron.enableMod(modId);
    if (result.success) {
      showMessage('Mod aktiviert', 'success');
    } else {
      showMessage(`Fehler: ${result.error}`, 'error');
    }
  } else {
    const result = await window.electron.disableMod(modId);
    if (result.success) {
      showMessage('Mod deaktiviert', 'success');
    } else {
      showMessage(`Fehler: ${result.error}`, 'error');
    }
  }
  await loadMods();
}

async function uninstallMod(modId) {
  if (confirm('Möchtest du diese Mod wirklich löschen?')) {
    const result = await window.electron.uninstallMod(modId);
    if (result.success) {
      showMessage('Mod deinstalliert', 'success');
      await loadMods();
    } else {
      showMessage(`Fehler: ${result.error}`, 'error');
    }
  }
}

async function setGamePath() {
  const gamePath = await window.electron.selectGamePath();
  if (gamePath) {
    const result = await window.electron.setGamePath(gamePath);
    if (result.success) {
      currentGamePath = gamePath;
      document.getElementById('gamePathDisplay').textContent = gamePath;
      updateStatusIndicator(true);
      showMessage('Spielpfad gespeichert', 'success');
    } else {
      showMessage(`Fehler: ${result.error}`, 'error');
    }
  }
}

async function installMod() {
  const modPath = await window.electron.selectModFile();
  if (modPath) {
    try {
      const result = await window.electron.installMod(modPath);
      if (result.success) {
        showMessage(`Mod "${result.mod.name}" installiert!`, 'success');
        await loadMods();
      } else {
        showMessage(`Fehler: ${result.error}`, 'error');
      }
    } catch (error) {
      showMessage(`Fehler beim Installieren: ${error.message}`, 'error');
    }
  }
}

async function launchGame() {
  if (!currentGamePath) {
    showMessage('Bitte wähle zuerst einen Spielpfad aus', 'error');
    return;
  }

  const mods = await window.electron.getMods();
  const enabledMods = mods.filter((m) => m.enabled).map((m) => m.id);

  try {
    const result = await window.electron.launchGame(enabledMods);
    if (result.success) {
      showMessage('Spiel wird gestartet...', 'success');
    } else {
      showMessage(`Fehler: ${result.error}`, 'error');
    }
  } catch (error) {
    showMessage(`Fehler beim Starten: ${error.message}`, 'error');
  }
}

function showMessage(text, type) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `${type}-message`;
  messageDiv.textContent = text;
  document.body.appendChild(messageDiv);

  setTimeout(() => {
    messageDiv.remove();
  }, 3000);
}

// Event Listeners
document.getElementById('autoDetectBtn').addEventListener('click', autoDetectGame);
document.getElementById('setGamePathBtn').addEventListener('click', setGamePath);
document.getElementById('installModBtn').addEventListener('click', installMod);
document.getElementById('launchGameBtn').addEventListener('click', launchGame);

// Initialize on startup
initializeApp();
