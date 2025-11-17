# bzfm

bzfm 是一个基于 Node.js/TypeScript 重写的模糊书签管理工具，用于为文件和目录创建、管理和跳转书签。
灵感来源于 `fzf`、`zoxide` 以及原始的 [`zfm`](https://github.com/pabloariasal/zfm) zsh 插件。

## 功能

- 管理文件和目录书签（纯文本书签文件，默认 `~/.bzfm.txt`）
- 使用 `fzf` 进行交互式选择
- Shell 集成：
  - Zsh：Ctrl+O 插入书签，Ctrl+P 跳转书签目录
  - Fish：Ctrl+O / Ctrl+P 快捷键

## 安装

```bash
npm install -g bzfm
```

依赖：
- Node.js >= 18
- `fzf` 已安装且在 `$PATH` 中

## 基本用法

- 添加书签：

  ```bash
  bzfm add <paths...>
  ```

- 列出书签：

  ```bash
  bzfm list [--files] [--dirs]
  ```

- 使用 fzf 选择书签：

  ```bash
  bzfm select [--files] [--dirs] [--multi]
  bzfm query [--files] [--dirs] <pattern>
  ```

- 清理 / 清空 / 编辑书签：

  ```bash
  bzfm fix
  bzfm clear
  bzfm edit
  ```

## Shell 集成

### Zsh

在 `~/.zshrc` 中添加：

```zsh
# 默认快捷命令：bz
eval "$(bzfm init zsh)"

# 自定义快捷命令名（例如 b）
# eval "$(bzfm init zsh --cmd b)"

# 禁用快捷命令，只启用快捷键和 f 函数
# eval "$(bzfm init zsh --no-cmd)"
```

### Fish

在 `config.fish` 中添加：

```fish
# 默认快捷命令：bz
bzfm init fish | source

# 自定义快捷命令名（例如 b）
# bzfm init fish --cmd b | source

# 禁用快捷命令，只启用快捷键
# bzfm init fish --no-cmd | source
```

## 书签文件

- 默认路径：`~/.bzfm.txt`
- 可通过环境变量 `BZFM_BOOKMARKS_FILE` 自定义路径。

每一行是一个绝对路径。

## 多语言

- 通过环境变量 `BZFM_LANG` 控制：`zh_cn` 或 `en_us`
- 未设置时根据系统 `LANG` 自动选择。
