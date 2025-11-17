/**
 * i18n 入口：提供简单的多语言支持。
 *
 * 采用内联字典而不是外部 JSON 文件，避免运行时缺少资源的问题，
 * 同时保持实现足够简单，符合 KISS 原则。
 */

export type Locale = 'en_us' | 'zh_cn' | (string & {});

export type MessageKey =
  | 'cli.description'
  | 'cli.option.files'
  | 'cli.option.dirs'
  | 'cli.option.multi'
  | 'cli.option.pattern'
  | 'cli.option.version'
  | 'cli.command.list.description'
  | 'cli.command.add.description'
  | 'cli.command.select.description'
  | 'cli.command.query.description'
  | 'cli.command.fix.description'
  | 'cli.command.clear.description'
  | 'cli.command.edit.description'
  | 'cli.command.init.description'
  | 'cli.add.added_to'
  | 'cli.add.total_bookmarks'
  | 'cli.fix.removed_entries'
  | 'cli.clear.deleted'
  | 'error.bookmark_file.create_failed'
  | 'error.fzf.failed'
  | 'error.fzf.non_zero_exit';

const enUs: Record<MessageKey, string> = {
  'cli.description': 'Fuzzy bookmark manager for files and directories.',
  'cli.option.files': 'Only operate on file bookmarks',
  'cli.option.dirs': 'Only operate on directory bookmarks',
  'cli.option.multi': 'Allow multiple selection',
  'cli.option.pattern': 'Initial query pattern passed to fzf',
  'cli.option.version': 'output the version number',
  'cli.command.list.description': 'List bookmarks',
  'cli.command.add.description': 'Add path(s) to bookmarks',
  'cli.command.select.description': 'Interactively select bookmark(s) using fzf',
  'cli.command.query.description': 'Query bookmark matching a pattern using fzf',
  'cli.command.fix.description': 'Remove bookmarks that no longer exist',
  'cli.command.clear.description': 'Clear all bookmarks',
  'cli.command.edit.description': 'Edit bookmark file using $EDITOR',
  'cli.command.init.description': 'Generate shell integration script for zsh / fish',
  'cli.add.added_to': 'Added to',
  'cli.add.total_bookmarks': 'Total bookmarks',
  'cli.fix.removed_entries': 'removed {count} entries',
  'cli.clear.deleted': 'bookmarks deleted!',
  'error.bookmark_file.create_failed': 'Failed to create bookmark file: {path}. Reason: {reason}',
  'error.fzf.failed': 'Failed to run fzf: {reason}',
  'error.fzf.non_zero_exit': 'fzf exited with non-zero code: {code}',
};

const zhCn: Record<MessageKey, string> = {
  'cli.description': '面向文件和目录的模糊书签管理工具。',
  'cli.option.files': '仅操作文件类型书签',
  'cli.option.dirs': '仅操作目录类型书签',
  'cli.option.multi': '允许多选',
  'cli.option.pattern': '作为初始查询传递给 fzf 的模式字符串',
  'cli.option.version': '输出版本号',
  'cli.command.list.description': '列出书签',
  'cli.command.add.description': '添加路径到书签',
  'cli.command.select.description': '使用 fzf 交互选择书签',
  'cli.command.query.description': '使用 fzf 根据模式查询书签',
  'cli.command.fix.description': '移除已不存在的书签条目',
  'cli.command.clear.description': '清空所有书签',
  'cli.command.edit.description': '通过 $EDITOR 编辑书签文件',
  'cli.command.init.description': '集成脚本到 zsh / fish',
  'cli.add.added_to': '已添加到',
  'cli.add.total_bookmarks': '当前书签总数',
  'cli.fix.removed_entries': '已移除 {count} 条记录',
  'cli.clear.deleted': '所有书签已删除！',
  'error.bookmark_file.create_failed': '无法创建书签文件: {path}。原因: {reason}',
  'error.fzf.failed': '执行 fzf 失败: {reason}',
  'error.fzf.non_zero_exit': 'fzf 退出码非零: {code}',
};

const builtinDictionaries: Record<string, Record<MessageKey, string>> = {
  en_us: enUs,
  zh_cn: zhCn,
};

let cachedLocale: Locale | null = null;

export function detectLocale(): Locale {
  if (cachedLocale) return cachedLocale;

  const explicit = process.env.BZFM_LANG?.toLowerCase();
  if (explicit && builtinDictionaries[explicit]) {
    cachedLocale = explicit;
    return explicit;
  }

  const sysLang = process.env.LANG?.toLowerCase() || '';
  if (sysLang.startsWith('zh')) {
    cachedLocale = 'zh_cn';
    return 'zh_cn';
  }

  cachedLocale = 'en_us';
  return 'en_us';
}

export function getDictionary(locale?: Locale): Record<MessageKey, string> {
  const loc = locale ?? detectLocale();
  return builtinDictionaries[loc] || builtinDictionaries.en_us;
}

export function t(key: MessageKey, params: Record<string, string | number> = {}): string {
  const dict = getDictionary();
  const template = dict[key] || builtinDictionaries.en_us[key] || key;
  return Object.keys(params).reduce((acc, k) => {
    return acc.replace(new RegExp(`\\{${k}\\}`, 'g'), String(params[k]));
  }, template);
}
