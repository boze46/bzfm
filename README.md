# bzfm

English | [简体中文](assets/README_CN.md)

bzfm is a fuzzy bookmark manager for files and directories, rewritten in Node.js/TypeScript.
It is inspired by tools like `fzf`, `zoxide` and the original [`zfm`](https://github.com/pabloariasal/zfm) zsh plugin.
This project reimplements the core idea of zfm in Node.js, and extends it with a structured CLI
and multi-shell integration.

## Features

- Fuzzy bookmark management for files and directories
- Simple plain-text bookmark file (`~/.bzfm.txt` by default)
- fzf-based interactive selection
- Shell integration:
  - Zsh: Ctrl+O to insert bookmarks, Ctrl+P to jump to bookmarked directories
  - Fish: Ctrl+O / Ctrl+P bindings

## Installation

```bash
npm install -g bzfm
```

Requirements:
- Node.js >= 18
- `fzf` installed and available in `$PATH`

## Usage

Basic commands:

- `bzfm add <paths...>` – add one or more paths (files or directories).
- `bzfm list [--files] [--dirs]` – list bookmarks, with `[d]` for dirs and `[f]` for files.
- `bzfm select [--files] [--dirs] [--multi]` – fuzzy-select bookmarks via `fzf`.
- `bzfm query [--files] [--dirs] <pattern>` – fuzzy-select with an initial query.
- `bzfm fix` – remove bookmarks that no longer exist.
- `bzfm clear` – clear all bookmarks.
- `bzfm edit` – open the bookmark file in `$EDITOR` (default: `vim`).

Bookmark file:

- Default path: `~/.bzfm.txt`
- Override via `BZFM_BOOKMARKS_FILE` environment variable.

## Shell integration

bzfm provides an `init` subcommand to output shell integration code.

### Zsh

Add to your `~/.zshrc`:

```zsh
# Default shorthand command: bz
eval "$(bzfm init zsh)"

# Custom shorthand command name (e.g. b)
# eval "$(bzfm init zsh --cmd b)"

# Disable shorthand alias, only keep keybindings and f()
# eval "$(bzfm init zsh --no-cmd)"
```

### Fish

Add to your `config.fish`:

```fish
# Default shorthand command: bz
bzfm init fish | source

# Custom shorthand command name (e.g. b)
# bzfm init fish --cmd b | source

# Disable shorthand alias, only keep keybindings
# bzfm init fish --no-cmd | source
```

## i18n

Runtime language is detected via:

1. `BZFM_LANG` environment variable (`zh_cn` or `en_us`)
2. Fallback to system `LANG` (`zh*` → `zh_cn`, otherwise `en_us`)

Supported locales:

- `en_us`
- `zh_cn`

## License

The original zfm project is licensed under the MIT License.
This project reimplements zfm in Node.js/TypeScript and is also distributed under the MIT License.
See the `LICENSE` file for details.

Original project: https://github.com/pabloariasal/zfm
