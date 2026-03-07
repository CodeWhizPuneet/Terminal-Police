import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { exec } from 'child_process';

// ─── Debounce State ──────────────────────────────────────────────────────────
let lastPlayedTime = 0;

/**
 * Play a sound file cross-platform using native OS commands.
 */
function playSound(filePath: string): void {
    if (!fs.existsSync(filePath)) {
        vscode.window.showWarningMessage(
            `Terminal Error Sound: Sound file not found at "${filePath}"`
        );
        return;
    }

    const platform = process.platform;
    let command: string;

    if (platform === 'win32') {
        const ext = path.extname(filePath).toLowerCase();
        const escaped = filePath.replace(/'/g, "''");
        if (ext === '.wav') {
            command = `powershell -NoProfile -Command "(New-Object System.Media.SoundPlayer '${escaped}').PlaySync()"`;
        } else {
            command = `powershell -NoProfile -Command "Add-Type -AssemblyName presentationCore; $p = New-Object System.Windows.Media.MediaPlayer; $p.Open([uri]'${escaped}'); $p.Play(); Start-Sleep -Seconds 3; $p.Close()"`;
        }
    } else if (platform === 'darwin') {
        command = `afplay "${filePath}"`;
    } else {
        const ext = path.extname(filePath).toLowerCase();
        if (ext === '.wav') {
            command = `aplay "${filePath}" 2>/dev/null || paplay "${filePath}" 2>/dev/null || ffplay -nodisp -autoexit "${filePath}" 2>/dev/null`;
        } else {
            command = `mpv --no-video "${filePath}" 2>/dev/null || ffplay -nodisp -autoexit "${filePath}" 2>/dev/null || paplay "${filePath}" 2>/dev/null`;
        }
    }

    exec(command, (err) => {
        if (err) {
            console.error(`Terminal Error Sound: Failed to play sound — ${err.message}`);
        }
    });
}

/**
 * Resolve the sound file path from user settings or fall back to the bundled default.
 */
function getSoundFilePath(extensionPath: string): string {
    const config = vscode.workspace.getConfiguration('terminalErrorSound');
    const userPath = config.get<string>('soundFile', '').trim();

    if (userPath && fs.existsSync(userPath)) {
        return userPath;
    }

    const mp3 = path.join(extensionPath, 'media', 'error.mp3');
    if (fs.existsSync(mp3)) {
        return mp3;
    }
    return path.join(extensionPath, 'media', 'error.wav');
}

/**
 * Check if enough time has elapsed since the last alert (debounce).
 */
function shouldPlay(): boolean {
    const config = vscode.workspace.getConfiguration('terminalErrorSound');
    const debounce = config.get<number>('debounceDuration', 3000);
    const now = Date.now();

    if (now - lastPlayedTime < debounce) {
        return false;
    }

    lastPlayedTime = now;
    return true;
}

// ─── Extension Activation ────────────────────────────────────────────────────

export function activate(context: vscode.ExtensionContext): void {
    console.log('Terminal Error Sound Alert is now active.');

    // Register the toggle command
    const toggleCommand = vscode.commands.registerCommand(
        'terminalErrorSound.toggle',
        async () => {
            const config = vscode.workspace.getConfiguration('terminalErrorSound');
            const current = config.get<boolean>('enabled', true);
            await config.update('enabled', !current, vscode.ConfigurationTarget.Global);
            vscode.window.showInformationMessage(
                `Terminal Error Sound: ${!current ? 'Enabled' : 'Disabled'}`
            );
        }
    );
    context.subscriptions.push(toggleCommand);

    // Register the test sound command
    const testSoundCommand = vscode.commands.registerCommand(
        'terminalErrorSound.testSound',
        () => {
            const soundPath = getSoundFilePath(context.extensionPath);
            vscode.window.showInformationMessage('Terminal Error Sound: Playing test sound...');
            playSound(soundPath);
        }
    );
    context.subscriptions.push(testSoundCommand);

    // ─── Listen for failed terminal commands (stable API) ────────────────────
    // Fires when a terminal shell command finishes execution.
    // If exit code is non-zero, the command failed → play the error sound.
    const shellListener = vscode.window.onDidEndTerminalShellExecution((event) => {
        const config = vscode.workspace.getConfiguration('terminalErrorSound');
        const enabled = config.get<boolean>('enabled', true);

        if (!enabled) {
            return;
        }

        if (event.exitCode !== undefined && event.exitCode !== 0) {
            if (shouldPlay()) {
                const soundPath = getSoundFilePath(context.extensionPath);
                playSound(soundPath);
            }
        }
    });
    context.subscriptions.push(shellListener);
}

// ─── Extension Deactivation ─────────────────────────────────────────────────

export function deactivate(): void {
    console.log('Terminal Error Sound Alert has been deactivated.');
}
