# Terminal Police 🚨

**Never miss a terminal error again!**

Terminal Police is a Visual Studio Code extension that plays an **instant audio alert** whenever your terminal commands fail or errors appear. Whether it's a build failure, runtime exception, or syntax error—you'll know immediately.

Perfect for developers who multitask, run long builds, or want instant feedback without constantly watching the terminal.

[![GitHub Repository](https://img.shields.io/badge/GitHub-Terminal%20Police-blue?logo=github)](https://github.com/CodeWhizPuneet/Terminal-Police)
[![VS Code Marketplace](https://img.shields.io/badge/VS%20Code-Marketplace-blue?logo=visualstudiocode)](https://marketplace.visualstudio.com/)

---

## ✨ Features

- 🚨 **Automatic Error Detection** — Monitors terminal output in real-time and catches failures instantly
- 🔊 **Custom Sound Support** — Use any `.mp3` or `.wav` file as your alert sound
- 🎵 **Built-in Default Sound** — Works out of the box with a bundled alert sound
- ⚡ **Smart Debouncing** — Prevents sound spam with configurable cooldown
- 🎯 **Command Palette Integration** — Toggle on/off or test sounds with one command
- 🌍 **Cross-Platform** — Windows, macOS, and Linux support
- 🎨 **Works with Colored Output** — ANSI escape codes automatically handled

---

## 📦 Installation

### From VS Code Marketplace (Recommended)

1. Open VS Code
2. Go to **Extensions** (`Ctrl+Shift+X` / `Cmd+Shift+X`)
3. Search for **"Terminal Police"**
4. Click **Install**

### Manual Installation

1. Download the latest `.vsix` from [Releases](https://github.com/CodeWhizPuneet/Terminal-Police/releases)
2. In VS Code: **Extensions** → **⋯** → **Install from VSIX…**
3. Select the downloaded file

---

## 🚀 Quick Start

1. **Install the extension** (see above)
2. **Run any terminal command** that produces an error
3. **Hear the alert sound** instantly when errors are detected!

### Test It Out

Open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`) and run:

```
Terminal Police: Test Sound
```

---

## ⚙️ Configuration

Customize Terminal Police in your VS Code settings:

```jsonc
{
  // Enable or disable Terminal Police
  "terminalErrorSound.enabled": true,

  // Path to your custom alert sound (mp3 or wav)
  // Leave empty to use the default bundled sound
  "terminalErrorSound.soundFile": "",

  // Minimum time (ms) between alerts to prevent spam
  "terminalErrorSound.debounceDuration": 3000
}
```

### Settings Reference

| Setting                                  | Type    | Default | Description                                           |
| ---------------------------------------- | ------- | ------- | ----------------------------------------------------- |
| `terminalErrorSound.enabled`             | boolean | `true`  | Turn Terminal Police on or off                        |
| `terminalErrorSound.soundFile`           | string  | `""`    | Path to custom sound file (empty = use default)       |
| `terminalErrorSound.debounceDuration`    | number  | `3000`  | Cooldown (ms) between consecutive alerts              |

---

## 🎮 Commands

Access these commands from the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`):

| Command                                  | Description                               |
| ---------------------------------------- | ----------------------------------------- |
| `Terminal Police: Toggle Enable/Disable` | Quickly turn the extension on or off      |
| `Terminal Police: Test Sound`            | Play a test sound to verify configuration |

---

## 🔍 Error Detection

Terminal Police automatically detects these common error patterns (case-insensitive):

| Pattern              | Example                                  |
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

The extension strips ANSI escape codes before pattern matching, so colored terminal output won't interfere with detection.

---

## 🎵 Using Custom Sounds

Want your own alert sound? It's easy:

1. **Choose a sound file** (`.mp3` or `.wav` format)
2. **Open VS Code Settings** (`Ctrl+,` / `Cmd+,`)
3. **Search for** `Terminal Police`
4. **Set the path** in `terminalErrorSound.soundFile`:

   ```json
   "terminalErrorSound.soundFile": "C:\\path\\to\\your\\sound.mp3"
   ```

5. **Test it** with `Terminal Police: Test Sound` command

The extension loads your custom sound immediately—no reload required!

---

## 🔧 How It Works

1. **Activation**: Terminal Police starts automatically when VS Code launches
2. **Monitoring**: Listens to `vscode.window.onDidEndTerminalShellExecution` events
3. **Detection**: Checks if terminal commands exit with non-zero exit codes (errors)
4. **Playback**: Plays the configured sound using native OS audio commands:
   - **Windows**: PowerShell `SoundPlayer` (`.wav`) or `MediaPlayer` (`.mp3`)
   - **macOS**: `afplay` command-line tool (built-in)
   - **Linux**: `aplay`, `mpv`, `ffplay`, or `paplay` (auto-detected)
5. **Debouncing**: Enforces cooldown period to prevent sound spam

---

## 💻 Requirements

- **VS Code** 1.93.0 or later
- **Audio playback support**:
  - **Windows**: PowerShell (built-in) ✅
  - **macOS**: `afplay` (built-in) ✅
  - **Linux**: One of `aplay`, `mpv`, `ffplay`, or `paplay` (usually pre-installed)

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve Terminal Police:

1. Fork the [repository](https://github.com/CodeWhizPuneet/Terminal-Police)
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "Add some feature"`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 🐛 Issues & Feedback

Found a bug or have a feature request?

- **Report issues**: [GitHub Issues](https://github.com/CodeWhizPuneet/Terminal-Police/issues)
- **Questions?** Open a discussion on GitHub

---

## 📁 Project Structure

```
Terminal-Police/
├── package.json          # Extension manifest and metadata
├── tsconfig.json         # TypeScript configuration
├── src/
│   └── extension.ts      # Main extension logic
├── media/
│   └── error.wav         # Default alert sound (bundled)
├── image/
│   └── icon.png          # Extension icon
├── out/                  # Compiled output (generated)
│   └── extension.js
└── README.md             # This file
```

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

---

## 🌟 Show Your Support

If Terminal Police helps you catch errors faster, please:

- ⭐ **Star the repo** on [GitHub](https://github.com/CodeWhizPuneet/Terminal-Police)
- 📝 **Rate the extension** on the VS Code Marketplace
- 🐦 **Share it** with other developers

---

**Made with ❤️ by [CodeWhizPuneet](https://github.com/CodeWhizPuneet)**


