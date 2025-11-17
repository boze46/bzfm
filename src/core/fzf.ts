import { spawn } from 'child_process';
import fs from 'fs';
import { BookmarkFilter } from './types';
import { filterDirs, filterFiles } from './bookmarks';
import { t } from '../i18n';

/**
 * 为书签条目追加类型标记并做简单对齐，用于 fzf 展示或 list 输出。
 * 格式示例：
 *   /path/to/dir   [d]
 *   /path/to/file  [f]
 */
export function decorateBookmarks(entries: string[]): string[] {
  if (entries.length === 0) return [];

  const tagged = entries.map((p) => {
    let tag = '[?]';
    try {
      const stat = fs.statSync(p);
      if (stat.isDirectory()) tag = '[d]';
      else if (stat.isFile()) tag = '[f]';
    } catch {
      // 一般不会走到这里，上游会过滤不存在的路径
      tag = '[?]';
    }
    return { path: p, tag };
  });

  const maxLen = Math.max(...tagged.map((t) => t.path.length));
  return tagged.map((t) => `${t.path.padEnd(maxLen + 2, ' ')}${t.tag}`);
}

/**
 * list 命令使用的装饰函数，语义与 decorateBookmarks 相同，
 * 单独导出以避免调用方直接依赖 fzf 相关逻辑。
 */
export function decorateBookmarksForList(entries: string[]): string[] {
  return decorateBookmarks(entries);
}

export interface FzfOptions {
  query?: string;
  multi?: boolean;
}

/**
 * 调用外部 fzf 进行交互选择。
 *
 * - inputLines: 作为 fzf 标准输入的多行内容
 * - options   : 是否启用多选、预设查询字符串等
 *
 * 返回用户选中的原始行（不解析第一列），上层按需解析。
 */
export function runFzf(inputLines: string[], options: FzfOptions = {}): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const args: string[] = [
      '--reverse',
      '--exact',
      '--no-sort',
      '--cycle',
    ];

    if (options.multi) {
      args.push('-m');
    }

    if (options.query) {
      args.push('-q', options.query);
    }

    const proc = spawn('fzf', args, { stdio: ['pipe', 'pipe', 'inherit'] });

    let stdout = '';
    proc.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });

    proc.on('error', (err) => {
      reject(new Error(t('error.fzf.failed', { reason: (err as Error).message })));
    });

    proc.on('close', (code) => {
      if (code === 0) {
        const lines = stdout
          .split(/\r?\n/)
          .map((l) => l.trim())
          .filter((l) => l.length > 0);
        resolve(lines);
      } else if (code === 130) {
        // 用户取消选择（Ctrl-C），视作空选择而不是错误。
        resolve([]);
      } else {
        reject(new Error(t('error.fzf.non_zero_exit', { code: String(code) })));
      }
    });

    proc.stdin.write(inputLines.join('\n'));
    proc.stdin.end();
  });
}

/**
 * 使用 fzf 从书签列表中选择路径，返回用户选中的路径数组。
 * 这里不关心文件/目录过滤，交给上游处理，以保持函数职责单一。
 */
export async function selectFromBookmarks(
  bookmarks: string[],
  filter: BookmarkFilter,
  opts: FzfOptions = {},
): Promise<string[]> {
  let filtered = bookmarks;
  if (filter === 'files') {
    filtered = filterFiles(bookmarks);
  } else if (filter === 'dirs') {
    filtered = filterDirs(bookmarks);
  }

  const decorated = decorateBookmarks(filtered);
  if (decorated.length === 0) return [];

  const selectedLines = await runFzf(decorated, opts);

  // 解析 fzf 返回行的第一列（原始路径），假设以空白分隔。
  return selectedLines.map((line) => line.split(/\s+/)[0]);
}
