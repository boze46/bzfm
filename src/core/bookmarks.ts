import fs from 'fs';
import path from 'path';
import os from 'os';
import { t } from '../i18n';

/**
 * 负责管理书签文件路径与读写操作的核心模块。
 * 不依赖任何 CLI / fzf / zsh 逻辑，便于单元测试和复用。
 */

export const BOOKMARK_ENV_VAR = 'BZFM_BOOKMARKS_FILE';

/**
 * 解析书签文件路径：
 * - 优先使用环境变量 BZFM_BOOKMARKS_FILE
 * - 否则默认使用 "~/.bzfm.txt"
 * - 如果文件不存在会自动创建空文件
 */
export function resolveBookmarkFile(): string {
  const envPath = process.env[BOOKMARK_ENV_VAR];
  const filePath = envPath && envPath.length > 0
    ? expandHome(envPath)
    : path.join(os.homedir(), '.bzfm.txt');

  ensureFileExists(filePath);
  return filePath;
}

/**
 * 展开以 "~" 开头的路径到当前用户的 home 目录。
 * 仅做最小必要处理，避免引入额外依赖（KISS/YAGNI）。
 */
export function expandHome(p: string): string {
  if (!p.startsWith('~')) return p;
  if (p === '~') return os.homedir();
  if (p.startsWith('~/')) {
    return path.join(os.homedir(), p.slice(2));
  }
  // 对形如 ~user/path 的复杂形式不做处理，保持原样。
  return p;
}

/**
 * 确保书签文件存在；如不存在则创建空文件。
 */
export function ensureFileExists(filePath: string): void {
  try {
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, '', 'utf8');
    }
  } catch (err) {
    const reason = (err as Error).message;
    throw new Error(t('error.bookmark_file.create_failed', { path: filePath, reason }));
  }
}

/**
 * 读取书签文件，返回去掉空行与首尾空白的路径数组。
 */
export function readBookmarks(filePath: string): string[] {
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf8');
  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

/**
 * 将书签列表写回文件，每个路径一行。
 */
export function writeBookmarks(filePath: string, bookmarks: string[]): void {
  const text = bookmarks.join(os.EOL) + (bookmarks.length ? os.EOL : '');
  fs.writeFileSync(filePath, text, 'utf8');
}

/**
 * 去重并保持原有顺序。
 */
export function uniquePreserveOrder(items: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const item of items) {
    if (!seen.has(item)) {
      seen.add(item);
      result.push(item);
    }
  }
  return result;
}

/**
 * 添加书签：
 * - 将相对路径规范化为绝对路径
 * - 仅保留存在的文件/目录
 * - 与原有列表合并并去重
 * 返回最新的书签列表。
 */
export function addBookmarks(filePath: string, pathsToAdd: string[]): string[] {
  const existing = readBookmarks(filePath);

  const normalizedToAdd = pathsToAdd
    .map((p) => expandHome(p))
    .map((p) => path.resolve(p))
    .filter((p) => fs.existsSync(p));

  const merged = uniquePreserveOrder([...existing, ...normalizedToAdd]);
  writeBookmarks(filePath, merged);
  return merged;
}

/**
 * 过滤存在的路径（文件或目录），并去重。
 */
export function filterExisting(bookmarks: string[]): string[] {
  const filtered = bookmarks.filter((p) => fs.existsSync(p));
  return uniquePreserveOrder(filtered);
}

/**
 * 过滤为仅文件。
 */
export function filterFiles(bookmarks: string[]): string[] {
  return bookmarks.filter((p) => fs.existsSync(p) && fs.statSync(p).isFile());
}

/**
 * 过滤为仅目录。
 */
export function filterDirs(bookmarks: string[]): string[] {
  return bookmarks.filter((p) => fs.existsSync(p) && fs.statSync(p).isDirectory());
}

/**
 * 清理书签文件：
 * - 移除不存在的路径
 * - 移除重复
 * 返回清理后列表和清理掉的数量。
 */
export function cleanupBookmarks(filePath: string): { cleaned: string[]; removedCount: number } {
  const original = readBookmarks(filePath);
  const cleaned = filterExisting(uniquePreserveOrder(original));
  const removedCount = original.length - cleaned.length;
  writeBookmarks(filePath, cleaned);
  return { cleaned, removedCount };
}

/**
 * 清空书签文件。
 */
export function clearBookmarks(filePath: string): void {
  writeBookmarks(filePath, []);
}
