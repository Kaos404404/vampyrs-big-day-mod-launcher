# 🧛 Vampy's Big Day - Mod Launcher

Ein moderner Mod Launcher für das Spiel "Vampy's Big Day" (entwickelt in Construct 3).

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

🎨 **Benutzeroberfläche**
- Modernes, dunkles Design
- Intuitive Bedienung
- Responsive Layout

## Installation

### Voraussetzungen
- Node.js (v14 oder höher)
- npm oder yarn

### Setup

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
2. Klicken Sie auf "Spielpfad wählen" und navigieren Sie zum Vampy's Big Day Verzeichnis
3. Klicken Sie auf "Mod installieren" und wählen Sie eine `.zip` Datei mit einer Mod

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

## Build für Distribution

```bash
# Windows
npm run build:win

# macOS
npm run build:mac

# Linux
npm run build:linux
```

## Ordner-Struktur

```
vampyrs-big-day-mod-launcher/
├── main.js                 # Hauptprozess
├── preload.js             # IPC-Bridge
├── package.json           # Abhängigkeiten
├── README.md              # Diese Datei
└── src/
    ├── index.html         # UI
    ├── styles.css         # Styling
    ├── renderer.js        # Frontend-Logik
    └── modManager.js      # Mod-Verwaltung
```

## Speicherort der Mods

Mods werden standardmäßig hier gespeichert:
- **Windows**: `C:\Users\[Benutzer]\AppData\Local\VampysBigDayMods`

## Lizenz

MIT License - Frei verwendbar

## Support

Bei Fragen oder Problemen öffne bitte ein Issue auf GitHub.
