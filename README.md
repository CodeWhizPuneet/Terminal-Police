# Terminal Error Sound Alert

A Visual Studio Code extension that plays a **custom sound alert** whenever an error is detected in the integrated terminal.

Never miss a build failure, runtime exception, or command error again — get an immediate audio notification!

---

## Features

- **Automatic Error Detection** — Monitors terminal output in real time using regex pattern matching.
- **Custom Sound Support** — Configure any `.mp3` or `.wav` file as your alert sound.
- **Bundled Default Sound** — Works out of the box with a built-in `error.wav`.
- **Toggle On/Off** — Quickly enable or disable via command palette.
- **Debounce Protection** — Prevents sound spam by enforcing a configurable cooldown between alerts.
- **Cross-Platform** — Works on Windows, macOS, and Linux.

---

## Detected Error Patterns

The extension scans terminal output for these common patterns (case-insensitive):

| Pattern              | Example Trigger                          |
| -------------------- | ---------------------------------------- |
| `error`              | `error: something went wrong`            |
| `Error:`             | `Error: ENOENT`                          |
| `Traceback`          | `Traceback (most recent call last):`     |
| `Exception`          | `NullPointerException`                   |
| `failed`             | `Build failed`                           |
| `command not found`  | `bash: foo: command not found`           |
| `ModuleNotFoundError`| `ModuleNotFoundError: No module named x` |
| `SyntaxError`        | `SyntaxError: Unexpected token`          |
| `TypeError`          | `TypeError: undefined is not a function` |
| `ReferenceError`     | `ReferenceError: x is not defined`       |
| `FATAL`              | `FATAL ERROR: heap out of memory`        |
| `ERR!`               | `npm ERR! code ELIFECYCLE`               |

ANSI escape codes are automatically stripped before matching, so colored terminal output won't interfere.

---

## Installation

### From Source (Development)

1. **Clone / copy** the `terminal-error-sound` folder.
2. Open the folder in VS Code.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Compile TypeScript:

   ```bash
   npm run compile
   ```

5. Press **F5** to launch an Extension Development Host window.

### From VSIX Package

1. Package the extension:

   ```bash
   npm install -g @vscode/vsce
   vsce package
   ```

2. Install the generated `.vsix` file:

   ```bash
   code --install-extension terminal-error-sound-1.0.0.vsix
   ```

   Or via VS Code: **Extensions** → **⋯** → **Install from VSIX…**

---

## Configuration

Add these settings to your `settings.json` (or use the Settings UI):

```jsonc
{
  // Enable or disable the error sound alert
  "terminalErrorSound.enabled": true,

  // Absolute path to a custom sound file (.mp3 or .wav)
  // Leave empty to use the bundled default sound
  "terminalErrorSound.soundFile": "/absolute/path/to/your/sound.mp3",

  // Minimum time (ms) between consecutive alerts to prevent spamming
  "terminalErrorSound.debounceDuration": 3000
}
```

### Settings Reference

| Setting                              | Type    | Default | Description                                           |
| ------------------------------------ | ------- | ------- | ----------------------------------------------------- |
| `terminalErrorSound.enabled`         | boolean | `true`  | Enable or disable the extension                       |
| `terminalErrorSound.soundFile`       | string  | `""`    | Path to custom sound file (empty = use bundled sound) |
| `terminalErrorSound.debounceDuration`| number  | `3000`  | Cooldown in ms between consecutive sound alerts       |

---

## Commands

Open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`) and search for:

| Command                                       | Description                  |
| ---------------------------------------------- | ---------------------------- |
| `Terminal Error Sound: Toggle Enable/Disable`  | Toggle the extension on/off  |
| `Terminal Error Sound: Test Sound`              | Play the configured test sound |

---

## How It Works

1. The extension activates on VS Code startup (`onStartupFinished`).
2. It subscribes to `vscode.window.onDidWriteTerminalData`, which fires every time the integrated terminal outputs text.
3. Incoming terminal data is cleaned of ANSI escape codes.
4. The cleaned text is tested against a compiled regex of common error patterns.
5. If a match is found and the debounce window has elapsed, the configured sound file is played using native OS audio commands:
   - **Windows**: PowerShell `SoundPlayer` (wav) or `MediaPlayer` (mp3)
   - **macOS**: `afplay`
   - **Linux**: `aplay`, `mpv`, `ffplay`, or `paplay`

---

## Adding Your Own Sound

1. Place your `.mp3` or `.wav` file anywhere accessible on your filesystem.
2. Set the path in settings:

   ```json
   "terminalErrorSound.soundFile": "C:\\Users\\you\\sounds\\alert.mp3"
   ```

3. The extension will use your custom sound immediately — no reload needed.

If the file is missing or the path is invalid, a warning notification will appear and no sound will play.

---

## Packaging with vsce

To create a distributable `.vsix` package:

```bash
# Install vsce globally (if not already installed)
npm install -g @vscode/vsce

# From the extension root directory
vsce package
```

This produces a file like `terminal-error-sound-1.0.0.vsix` that can be shared and installed on any machine.

---

## Project Structure

```
terminal-error-sound/
├── package.json          # Extension manifest and configuration
├── tsconfig.json         # TypeScript compiler configuration
├── src/
│   └── extension.ts      # Main extension source code
├── media/
│   └── error.wav         # Bundled default alert sound
├── out/                  # Compiled JavaScript (generated)
│   └── extension.js
└── README.md             # This file
```

---

## Requirements

- **VS Code** 1.93.0 or later
- **Audio playback** support on your OS:
  - Windows: PowerShell (built-in)
  - macOS: `afplay` (built-in)
  - Linux: one of `aplay`, `mpv`, `ffplay`, or `paplay`

---

## License

MIT
