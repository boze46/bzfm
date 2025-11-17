# bzfm

English | [简体中文](#简体中文)

bzfm is a fuzzy bookmark manager for files and directories, rewritten in Node.js/TypeScript.
It is inspired by tools like `fzf`, `zoxide` and the original [`zfm`](https://github.com/urbainvaes/zfm) zsh plugin.
This project reimplements the core idea of zfm in Node.js, and extends it with a structured CLI,
TypeScript types, i18n, and multi-shell integration.

---

## Features

- Fuzzy bookmark management for files and directories
- Simple plain-text bookmark file (`~/.bzfm.txt` by default)
- fzf-based interactive selection
- Shell integration:
  - Zsh: Ctrl+O to insert bookmarks, Ctrl+P to jump to bookmarked directories
  - Fish: Ctrl+O / Ctrl+P bindings
- Minimal i18n support (English / Simplified Chinese)

---

## Installation

```bash
npm install -g bzfm
```

This exposes a global `bzfm` CLI.

> Requirements:
> - Node.js >= 18
> - `fzf` must be installed and available in your `$PATH`.

---

## Usage

### Basic commands

- `bzfm add <paths...>`
  - Add one or more paths (files or directories) to the bookmark file.

- `bzfm list [--files] [--dirs]`
  - List bookmarks. Shows `[d]` for directories, `[f]` for files.

- `bzfm select [--files] [--dirs] [--multi]`
  - Open fzf to select bookmark(s) and print the selected paths to stdout.

- `bzfm query [--files] [--dirs] <pattern>`
  - Open fzf with an initial query pattern and print the selected path.

- `bzfm fix`
  - Remove bookmarks that no longer exist on the filesystem.

- `bzfm clear`
  - Clear all bookmarks.

- `bzfm edit`
  - Open the bookmark file in `$EDITOR` (default: `vim`).

### Bookmark file

By default, bzfm stores bookmarks in:

- `~/.bzfm.txt`

You can override this with:

- Environment variable `BZFM_BOOKMARKS_FILE`

Each line in the bookmark file is a single absolute path.

---

## Shell integration

bzfm follows the style of tools like `fzf` and `zoxide` by providing an `init`
subcommand which outputs shell integration code.

### Zsh

Add one of the following lines to your `~/.zshrc`:

```zsh
# Default shorthand command: bz
eval "$(bzfm init zsh)"

# Custom shorthand command name (e.g. b)
# eval "$(bzfm init zsh --cmd b)"

# Disable shorthand alias, only keep keybindings and f()
# eval "$(bzfm init zsh --no-cmd)"
```

Behavior:

- `Ctrl+O` — select one or more bookmarks and insert them into the current command line.
- `Ctrl+P` — select a bookmarked directory and `cd` into it.
- `f` / `f <pattern>` — jump to a bookmarked directory via fzf.
- Shorthand command (default `bz`) — equivalent to `bzfm`.

### Fish

Add one of the following lines to your `config.fish`:

```fish
# Default shorthand command: bz
bzfm init fish | source

# Custom shorthand command name (e.g. b)
# bzfm init fish --cmd b | source

# Disable shorthand alias, only keep keybindings
# bzfm init fish --no-cmd | source
```

Behavior:

- `Ctrl+O` — select bookmarks and insert them into the current command line.
- `Ctrl+P` — select a bookmarked directory and `cd` into it.
- Shorthand command (default `bz`) — equivalent to `bzfm`.

---

## i18n

Runtime language is detected via:

1. `BZFM_LANG` environment variable (e.g. `zh_cn` or `en_us`)
2. Fallback to system `LANG`:
   - `LANG` starting with `zh` → `zh_cn`
   - otherwise → `en_us`

Currently supported locales:

- `en_us`
- `zh_cn`

---

## Development

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Run tests (requires vitest)
npm test
```

---

## License

The original zfm project is licensed under the MIT License. bzfm is a reimplementation
in Node.js/TypeScript and is also distributed under the MIT License. See the `LICENSE`
file for details.

Original project: https://github.com/urbainvaes/zfm

---

## 简体中文

[English](#bzfm) | 简体中文

bzfm 是一个基于 Node.js/TypeScript 重写的模糊书签管理工具，用于为文件和目录创建、管理和跳转书签。
灵感来源于 `fzf`、`zoxide` 以及原始的 [`zfm`](https://github.com/urbainvaes/zfm) zsh 插件。
本项目在 zfm 的核心理念基础上，提供了更结构化的 CLI、TypeScript 类型、多语言支持和多 shell 集成。

---

## 功能特性

- 文件和目录的模糊书签管理
- 使用纯文本书签文件（默认 `~/.bzfm.txt`）
- 基于 fzf 的交互式选择
- Shell 集成：
  - Zsh：Ctrl+O 插入书签，Ctrl+P 跳转书签目录
  - Fish：Ctrl+O / Ctrl+P 快捷键
- 简单的多语言支持（英文 / 简体中文）

---

## 安装

```bash
npm install -g bzfm
```

安装后会在系统中提供一个全局的 `bzfm` 命令。

> 前置依赖：
> - Node.js >= 18
> - 已安装 `fzf` 且在 `$PATH` 中可用

---

## 基本用法

- `bzfm add <paths...>`
  - 添加一个或多个路径（文件或目录）到书签文件。

- `bzfm list [--files] [--dirs]`
  - 列出所有书签。输出中会用 `[d]` 表示目录，用 `[f]` 表示文件。

- `bzfm select [--files] [--dirs] [--multi]`
  - 打开 fzf 选择一个或多个书签，并将选中的路径打印到标准输出。

- `bzfm query [--files] [--dirs] <pattern>`
  - 使用给定的初始查询模式打开 fzf，选择一个书签并打印路径。

- `bzfm fix`
  - 清理书签文件中已不存在的路径。

- `bzfm clear`
  - 清空所有书签。

- `bzfm edit`
  - 使用 `$EDITOR` 打开书签文件（默认 `vim`）。

### 书签文件

默认情况下，bzfm 使用以下文件保存书签：

- `~/.bzfm.txt`

你可以通过环境变量修改书签文件路径：

- `BZFM_BOOKMARKS_FILE`

书签文件中每一行是一个绝对路径。

---

## Shell 集成

bzfm 提供 `init` 子命令来输出 shell 集成脚本，使用方式类似 `fzf` 和 `zoxide`。

### Zsh 集成

在 `~/.zshrc` 中添加以下内容之一：

```zsh
# 默认快捷命令：bz
eval "$(bzfm init zsh)"

# 自定义快捷命令名（例如 b）
# eval "$(bzfm init zsh --cmd b)"

# 禁用快捷命令，只启用快捷键和 f 函数
# eval "$(bzfm init zsh --no-cmd)"
```

行为说明：

- `Ctrl+O`：通过 fzf 选择一个或多个书签，并插入到当前命令行。
- `Ctrl+P`：通过 fzf 选择一个目录书签，并自动 `cd` 过去。
- `f` / `f <pattern>`：通过 fzf 跳转到目录书签。
- 快捷命令（默认 `bz`）：等价于 `bzfm`。

### Fish 集成

在 `config.fish` 中添加以下内容之一：

```fish
# 默认快捷命令：bz
bzfm init fish | source

# 自定义快捷命令名（例如 b）
# bzfm init fish --cmd b | source

# 禁用快捷命令，只启用快捷键
# bzfm init fish --no-cmd | source
```

行为说明：

- `Ctrl+O`：通过 fzf 选择书签，并插入当前命令行。
- `Ctrl+P`：通过 fzf 选择目录书签，并自动 `cd` 过去。
- 快捷命令（默认 `bz`）：等价于 `bzfm`。

---

## 多语言（i18n）

运行时的语言选择规则：

1. 优先读取环境变量 `BZFM_LANG`（支持 `zh_cn` / `en_us`）；
2. 否则根据系统 `LANG` 判断：
   - 以 `zh` 开头 → 使用 `zh_cn`；
   - 其他 → 使用 `en_us`。

当前支持的语言：

- `en_us`
- `zh_cn`

---

## 开发

```bash
# 安装依赖
npm install

# 编译 TypeScript
npm run build

# 运行测试（依赖 vitest）
npj test
```

---

## 许可证

原始 zfm 项目使用 MIT 许可证发布。bzfm 在此基础上使用 Node.js/TypeScript 进行重写，
同样采用 MIT 许可证发布。详细信息请参阅项目根目录下的 `LICENSE` 文件。

原项目地址：https://github.com/urbainvaes/zfm
