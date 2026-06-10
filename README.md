# 🧛 Vampy's Big Day - Mod Launcher v2.0

Ein moderner Mod Launcher für das Spiel "Vampy's Big Day" (entwickelt in Construct 3).

## ✨ Neue Features v2.0

🔍 **Auto-Detect Funktion**
- Findet das Spiel automatisch auf deinem Computer
- Unterstützt Steam Registry Locations
- Prüft mehrere gängige Installationsorte

📦 **Optimierte Mod-Verwaltung**
- Schnellere Mod-Installation
- Bessere Fehlerbehandlung
- Status-Indikatoren

🔨 **EXE-Build Support**
- Automatisches Packaging als .exe Datei
- Installer + Portable Version
- Desktop- und Startmenü-Verknackelung

## Features

✨ **Mod Management**
- 📦 Installiere Mods aus ZIP-Dateien
- ⚙️ Aktiviere/Deaktiviere Mods nach Bedarf
- 🗑️ Deinstalliere Mods jederzeit
- 📋 Verwalte installierte Mods übersichtlich

🎮 **Spiel-Integration**
- 🚀 Starten Sie das Spiel mit aktivierten Mods
- 📂 Automatische Mod-Verwaltung
- 🔧 Einfache Spielpfad-Konfiguration
- 🔍 Automatische Spielerkennung

🎨 **Benutzeroberfläche**
- Modernes, dunkles Design
- Intuitive Bedienung
- Responsive Layout
- Status-Anzeige (Online/Offline)

## Installation

### Option 1: Als EXE Datei (Empfohlen)

1. Lade die neueste `.exe` aus den [Releases](https://github.com/Kaos404404/vampyrs-big-day-mod-launcher/releases) herunter
2. Führe die Datei aus
3. Folge dem Installationsassistenten

### Option 2: Aus Quelle

**Voraussetzungen:**
- Node.js (v14 oder höher)
- npm oder yarn

```bash
# Repository klonen
git clone https://github.com/Kaos404404/vampyrs-big-day-mod-launcher.git
cd vampyrs-big-day-mod-launcher

# Dependencies installieren
npm install

# Entwicklungs-Mode starten
npm start
```

## Verwendung

### Erstes Mal

1. Starten Sie den Launcher
2. Klicken Sie auf "Auto-Detect" - der Launcher versucht das Spiel automatisch zu finden
3. Falls nicht gefunden, klicken Sie auf "Spielpfad wählen" und navigieren Sie zum Verzeichnis
4. Klicken Sie auf "Mod installieren" und wählen Sie eine `.zip` Datei mit einer Mod

### Mod installieren

1. Klicken Sie auf "Mod installieren"
2. Wählen Sie eine `.zip` Datei aus
3. Die Mod wird automatisch installiert und angezeigt

### Mods verwalten

- **Aktivieren**: Klicken Sie "Aktivieren" um eine Mod für das nächste Spiel einzuschalten
- **Deaktivieren**: Klicken Sie "Deaktivieren" um eine Mod auszuschalten
- **Deinstallieren**: Klicken Sie "Löschen" um eine Mod zu entfernen

### Spiel starten

1. Aktivieren Sie die Mods, die Sie verwenden möchten
2. Klicken Sie "Spiel starten"
3. Das Spiel startet mit allen aktivierten Mods

## Mod Format

Zip-Dateien sollten eine `mod.json` Datei enthalten:

```json
{
  "name": "Meine Coole Mod",
  "version": "1.0.0",
  "description": "Beschreibung der Mod",
  "author": "Dein Name"
}
```

## Build & Distribution

### Build als EXE

```bash
# Installer + Portable Version
npm run build:win

# Nur Portable Version
npm run build:portable
```

Die Dateien werden im `dist/` Verzeichnis erstellt.

## Ordner-Struktur

```
vampyrs-big-day-mod-launcher/
├── main.js                 # Hauptprozess
├── preload.js             # IPC-Bridge
├── package.json           # Abhängigkeiten & Build-Config
├── README.md              # Diese Datei
└── src/
    ├── index.html         # UI
    ├── styles.css         # Styling
    ├── renderer.js        # Frontend-Logik
    └── modManager.js      # Mod-Verwaltung + Auto-Detect
```

## Speicherort der Mods

Mods werden standardmäßig hier gespeichert:
- **Windows**: `C:\Users\[Benutzer]\AppData\Local\VampysBigDayMods`

## Lizenz

MIT License - Frei verwendbar

## Support

Bei Fragen oder Problemen öffne bitte ein Issue auf GitHub.

## Changelog

### v2.0.0
- ✨ Auto-Detect-Funktion hinzugefügt
- 📦 EXE-Build-Unterstützung
- 🔏 Status-Indikatoren
- 🔧 Verbesserte Fehlerbehandlung
- 🏆 Performance-Optimierungen

### v1.0.0
- Initiale Veröffentlichung
