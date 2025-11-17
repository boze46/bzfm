/**
 * i18n 入口：负责加载 JSON 语言包并提供翻译函数。
 *
 * 设计原则：
 * - 语言包以 JSON 存储，便于在不改动源码的情况下增加新语言；
 * - 内置 en_us / zh_cn JSON，通过 require 静态打包，避免运行时 I/O；
 * - 外部扩展可以通过在未来支持的搜索路径中放置 JSON 文件（留有演进空间）。
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

// 使用 require 保证 JSON 在构建时被打包为静态对象。
// 对于新增语言，只需新增对应的 JSON 文件并在此处扩展。
// eslint-disable-next-line @typescript-eslint/no-var-requires
const enUs = require('./locales/en_us.json') as Record<MessageKey, string>;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const zhCn = require('./locales/zh_cn.json') as Record<MessageKey, string>;

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
