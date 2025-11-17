import { BookmarkFilter } from './core/types';
import { readBookmarks, filterFiles, filterDirs } from './core/bookmarks';
import { decorateBookmarksForList } from './core/fzf';

/**
 * 根据过滤条件获取书签列表，并为 list 命令附加 [d]/[f] 标记。
 */
export function listBookmarks(rawFilePath: string, filter: BookmarkFilter): string[] {
  const items = readBookmarks(rawFilePath);
  let filtered: string[];
  switch (filter) {
    case 'files':
      filtered = filterFiles(items);
      break;
    case 'dirs':
      filtered = filterDirs(items);
      break;
    case 'all':
    default:
      filtered = items;
      break;
  }
  return decorateBookmarksForList(filtered);
}
