# Terminal Police 🚨

**Never miss a terminal error again!**

Terminal Police is a Visual Studio Code extension that plays an **instant audio alert** whenever your terminal commands fail or errors appear. Whether it's a build failure, runtime exception, or syntax error—you'll know immediately.

Perfect for developers who multitask, run long builds, or want instant feedback without constantly watching the terminal.

[![GitHub Repository](https://img.shields.io/badge/GitHub-Terminal%20Police-blue?logo=github)](https://github.com/CodeWhizPuneet/Terminal-Police)
[![VS Code Marketplace](https://img.shields.io/badge/VS%20Code-Marketplace-blue?logo=visualstudiocode)](https://marketplace.visualstudio.com/)

---

## ✨ Features

- 🚨 **Real-Time Error Detection** — Instant alerts as errors occur
- 🐍 **Python & venv Support** — Full support for Python virtual environments
- 🔊 **Custom Sound Support** — Use any `.mp3` or `.wav` file
- 🎵 **Built-in Default Sound** — Works out of the box
- ⚡ **Smart Debouncing** — Prevents unwanted alert spam
- 🎯 **Command Palette Integration** — Quick toggle and test commands
- 🌍 **Cross-Platform** — Windows, macOS, and Linux
- 🎨 **Colored Output Support** — ANSI escape codes handled automatically
- 📝 **Customizable Patterns** — Define your own error keywords

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

1. **Install the extension**
2. **Run any command that produces an error**
3. **Hear the alert sound** instantly!

### Test It Out

Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`) and run:
```
Terminal Police: Test Sound
```

---

## 🐍 Python & Virtual Environment (venv) Support

Terminal Police **fully supports error detection inside Python virtual environments!**

### What's Supported

- ✅ **Python venv** — Standard `python -m venv` virtual environments
- ✅ **Conda/mamba** — Works in conda-activated shells
- ✅ **Live error detection** — Detects errors **as they occur**
- ✅ **pytest/unittest** — Real-time test output monitoring
- ✅ **pip failures** — Package installation errors  
- ✅ **Long-running processes** — Streaming output from `python app.py`, servers, etc.
- ✅ **All shells** — Windows PowerShell, Bash, Zsh, etc.

### Tested Example

```bash
# Create and activate venv
$ python -m venv test_venv
$ .\test_venv\Scripts\Activate          # Windows
# (or) source test_venv/bin/activate    # macOS/Linux

# Run a failing command
(test_venv) $ python -c "import nonexistent_module"

Traceback (most recent call last):
  File "<string>", line 1, in <module>
    import nonexistent_module
ModuleNotFoundError: No module named 'nonexistent_module'

# ✅ Sound plays IMMEDIATELY (tested and working)
```

### How It Works

Terminal Police uses **dual detection**:

1. **Exit Code Detection** — Traditional method (commands with non-zero exit code)
2. **Real-Time Output Detection** — Monitors output live for error patterns (**venv support**)

The real-time detection requires `terminalErrorSound.detectLiveOutput: true` (default) and uses the proposed VS Code API `terminalDataWriteEvent`. To test in Extension Development Host, use launch config: **"Run Terminal Police Extension (Proposed API)"**.

### Error Deduplication

- ✅ Each failing command gets **one sound**
- ✅ Repeated chunks of the same error → **no duplicate sounds**
- ✅ Consecutive different errors → **each gets an alert**
- ✅ Debounce prevents spam (default: 3000ms between alerts)

---

## ⚙️ Configuration

Open VS Code Settings (`Ctrl+,`) and search for **Terminal Police**:

```jsonc
{
  // Master switch
  "terminalErrorSound.enabled": true,

  // Enable real-time venv/streaming detection (required for venv support)
  "terminalErrorSound.detectLiveOutput": true,

  // Custom alert sound (empty = use bundled default)
  "terminalErrorSound.soundFile": "",

  // Minimum time between alerts (milliseconds)
  "terminalErrorSound.debounceDuration": 3000,

  // Error patterns to detect
  "terminalErrorSound.errorPatterns": [
    "Error", "error", "Exception", "exception",
    "Traceback", "traceback", "Failed", "failed",
    "ModuleNotFoundError", "ImportError", "SyntaxError",
    "ValueError", "TypeError", "AttributeError",
    "FileNotFoundError", "KeyError", "IndexError"
  ],

  // Patterns to exclude (prevents false positives)
  "terminalErrorSound.excludePatterns": [
    "no error", "error handling", "error message",
    "error code", "error recovery"
  ]
}
```

### Settings Reference

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `terminalErrorSound.enabled` | boolean | `true` | Enable/disable the extension |
| `terminalErrorSound.detectLiveOutput` | boolean | `true` | Enable venv/streaming detection |
| `terminalErrorSound.soundFile` | string | `""` | Path to custom sound file |
| `terminalErrorSound.debounceDuration` | number | `3000` | Cooldown between alerts (ms) |
| `terminalErrorSound.errorPatterns` | array | `[...]` | Error keywords to detect |
| `terminalErrorSound.excludePatterns` | array | `[...]` | Exclude patterns (false positive prevention) |

---

## 🎵 Custom Alert Sounds

Use your own sound file:

1. Prepare a `.mp3` or `.wav` file
2. Open VS Code Settings (`Ctrl+,`)
3. Search for **Terminal Police**
4. Set `terminalErrorSound.soundFile` to the **absolute path**:
   - Windows: `C:\\Users\\YourName\\Sounds\\alert.mp3`
   - macOS/Linux: `/home/user/sounds/alert.wav`
5. Test with: Command Palette → `Terminal Police: Test Sound`

Changes apply immediately—no reload required!

---

## 🎮 Commands

Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`):

| Command | Description |
|---------|-------------|
| `Terminal Police: Toggle Enable/Disable` | Quick on/off switch |
| `Terminal Police: Test Sound` | Play test alert |

---

## 🔧 How It Works

### Detection Strategy

**Dual monitoring for reliable error detection:**

1. **Exit Code Monitoring** (Stable API)
   - Listens for command termination with non-zero exit codes
   - Fast and reliable for traditional commands

2. **Live Output Monitoring** (Proposed API)
   - Watches terminal output in real-time
   - Catches errors **during execution** (Python, pytest, streaming)
   - Enables venv support (errors detected before command ends)

### Architecture

```
Extension Activation
    ↓
[onDidStartTerminalShellExecution] → Reset execution state & buffer
    ↓
    ├─ [onDidEndTerminalShellExecution] → Check exit code
    │   └─ If non-zero → shouldPlay() → playSound()
    │
    └─ [onDidWriteTerminalData] → Real-time output monitoring
        ├─ Strip ANSI codes
        ├─ Append to terminal's output buffer
        ├─ Check for error patterns
        ├─ Verify not benign command (grep, ls, etc.)
        ├─ Check execution state (prevent duplicates)
        └─ If match → shouldPlay() → playSound()
```

### Key Components

- **Per-Terminal State** — Each terminal tracks its own execution state
- **Command-Scoped Deduplication** — One alert per command execution
- **Output Buffering** — Catches patterns across multiple chunks
- **ANSI Handling** — Colored output works correctly
- **Benign Detection** — Filters grep, ls, find, echo commands
- **Debouncing** — Prevents alert spam (default 3s between alerts)

---

## ⚡ Performance

- **Memory**: Minimal (per-terminal buffers ~1KB each)
- **CPU**: Negligible (regex matching on output chunks)
- **Startup**: No impact (lazy listener initialization)
- **Audio**: Fast native OS integration

---

## 💻 Requirements

- **VS Code** 1.93.0 or later
- **Audio playback**:
  - Windows: PowerShell (built-in) ✅
  - macOS: `afplay` (built-in) ✅
  - Linux: `aplay`, `mpv`, `ffplay`, or `paplay` (usually pre-installed)

---

## 🐛 Troubleshooting

### Sound not playing in venv?
1. Verify `terminalErrorSound.detectLiveOutput` is `true`
2. Ensure you're using launch config: **"Run Terminal Police Extension (Proposed API)"** for F5 testing
3. Check `terminalErrorSound.enabled` is `true`

### No sound for consecutive errors?
This usually means the debounce window is active. Adjust:
```json
"terminalErrorSound.debounceDuration": 1000  // Reduce to 1 second
```

### Too many alerts?
Increase debounce or add problematic patterns to `excludePatterns`:
```json
"terminalErrorSound.debounceDuration": 5000  // Increase to 5 seconds
```

### Extension not detecting certain errors?
1. Check your error keyword exists in `errorPatterns`
2. Verify it's not in `excludePatterns`
3. Test with `Terminal Police: Test Sound` to confirm audio works
4. Custom patterns are case-sensitive!

### Custom sound not playing?
1. Use absolute file path (not relative)
2. Ensure file is `.mp3` or `.wav`
3. Verify file exists and is readable
4. Test with `Terminal Police: Test Sound`

### Getting "terminalDataWriteEvent" API error?
Only happens in development mode. Use the correct launch config:
- Press F5
- Select: **"Run Terminal Police Extension (Proposed API)"**

---

## 🤝 Contributing

Contributions welcome! 

1. Fork the [repository](https://github.com/CodeWhizPuneet/Terminal-Police)
2. Create feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -m "Add feature description"`
4. Push: `git push origin feature/my-feature`
5. Open Pull Request

---

## 📁 Project Structure

```
Terminal-Police/
├── package.json          # Extension manifest & config
├── tsconfig.json         # TypeScript settings
├── .vscode/
│   └── launch.json       # Debug configurations
├── src/
│   └── extension.ts      # Main extension code
├── media/
│   └── error.wav         # Default alert sound
├── out/                  # Compiled JavaScript
└── README.md             # This file
```

---

## 🐛 Issues & Feedback

- **Report bugs**: [GitHub Issues](https://github.com/CodeWhizPuneet/Terminal-Police/issues)
- **Feature requests**: Open an issue with `[Feature]` tag
- **Discussions**: [GitHub Discussions](https://github.com/CodeWhizPuneet/Terminal-Police/discussions)

---

## 📝 License

See [LICENSE](LICENSE) file

---

## 🙏 Acknowledgments

Original author: **CodeWhizPuneet**  
venv & real-time detection enhancement: Community contribution

---

**Enjoy Terminal Police! May your errors never go unheard! 🔊**
