import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import {
  addBookmarks,
  clearBookmarks,
  cleanupBookmarks,
  readBookmarks,
  writeBookmarks,
} from '../src/bookmarks';

const tmpDir = path.join(os.tmpdir(), 'bzfm-test');
const testFile = path.join(tmpDir, 'bookmarks.txt');

// 这些测试仅针对纯函数和文件操作逻辑，不依赖 fzf 或 shell 集成。
describe('bookmarks core logic', () => {
  beforeEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
    fs.mkdirSync(tmpDir, { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('addBookmarks only keeps existing paths and deduplicates', () => {
    const existingDir = tmpDir;
    const nonExisting = path.join(tmpDir, 'nope');

    writeBookmarks(testFile, []);
    const result = addBookmarks(testFile, [existingDir, nonExisting, existingDir]);

    expect(result).toHaveLength(1);
    expect(result[0]).toBe(existingDir);
  });

  it('clearBookmarks removes all entries', () => {
    writeBookmarks(testFile, ['/tmp/a', '/tmp/b']);
    clearBookmarks(testFile);
    const items = readBookmarks(testFile);
    expect(items).toHaveLength(0);
  });

  it('cleanupBookmarks removes non-existing entries', () => {
    const existingDir = tmpDir;
    const nonExisting = path.join(tmpDir, 'nope');
    writeBookmarks(testFile, [existingDir, nonExisting]);

    const { cleaned, removedCount } = cleanupBookmarks(testFile);
    expect(cleaned).toHaveLength(1);
    expect(cleaned[0]).toBe(existingDir);
    expect(removedCount).toBe(1);
  });
});
