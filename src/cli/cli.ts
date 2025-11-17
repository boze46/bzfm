import { Command } from 'commander';
import { BookmarkFilter } from '../core/types';
import {
  resolveBookmarkFile,
  addBookmarks,
  cleanupBookmarks,
  clearBookmarks,
  readBookmarks,
} from '../core/bookmarks';
import { listBookmarks } from '../list';
import { selectFromBookmarks } from '../core/fzf';
import { t } from '../i18n';
import { registerInitCommand } from '../shell/init';

/**
 * CLI 子命令定义，作为 bzfm 的主入口被 index.ts 调用。
 * 将 Commander 的配置集中在这里，便于维护和测试。
 */

export function buildCli(): Command {
  const program = new Command();

  program
    .name('bzfm')
    .description(t('cli.description'))
    .version('1.0.0', '-v, --version', t('cli.option.version'));

  // 注册 init 子命令，用于生成 zsh/fish 集成脚本
  registerInitCommand(program);

  program
    .command('list')
    .description(t('cli.command.list.description'))
    .option('--files', t('cli.option.files'))
    .option('--dirs', t('cli.option.dirs'))
    .action((options) => {
      const filePath = resolveBookmarkFile();
      const filter: BookmarkFilter = options.files
        ? 'files'
        : options.dirs
          ? 'dirs'
          : 'all';
      const items = listBookmarks(filePath, filter);
      items.forEach((p) => console.log(p));
    });

  program
    .command('add')
    .description(t('cli.command.add.description'))
    .argument('<paths...>', 'Paths to add')
    .action((paths: string[]) => {
      const filePath = resolveBookmarkFile();
      const updated = addBookmarks(filePath, paths);
      console.log(`${t('cli.add.added_to')}: ${filePath}`);
      console.log(`${t('cli.add.total_bookmarks')}: ${updated.length}`);
    });

  program
    .command('select')
    .description(t('cli.command.select.description'))
    .option('--files', t('cli.option.files'))
    .option('--dirs', t('cli.option.dirs'))
    .option('--multi', t('cli.option.multi'))
    .action(async (options) => {
      const filePath = resolveBookmarkFile();
      const filter: BookmarkFilter = options.files
        ? 'files'
        : options.dirs
          ? 'dirs'
          : 'all';

      const bookmarks = readBookmarks(filePath);
      const selected = await selectFromBookmarks(bookmarks, filter, {
        multi: Boolean(options.multi),
      });

      selected.forEach((p) => console.log(p));
    });

  program
    .command('query')
    .description(t('cli.command.query.description'))
    .option('--files', t('cli.option.files'))
    .option('--dirs', t('cli.option.dirs'))
    .argument('<pattern>', t('cli.option.pattern'))
    .action(async (pattern: string, options) => {
      const filePath = resolveBookmarkFile();
      const filter: BookmarkFilter = options.files
        ? 'files'
        : options.dirs
          ? 'dirs'
          : 'all';

      const bookmarks = readBookmarks(filePath);
      const selected = await selectFromBookmarks(bookmarks, filter, {
        query: pattern,
        multi: false,
      });

      if (selected[0]) {
        console.log(selected[0]);
      }
    });

  program
    .command('fix')
    .description(t('cli.command.fix.description'))
    .action(() => {
      const filePath = resolveBookmarkFile();
      const { removedCount } = cleanupBookmarks(filePath);
      console.log(t('cli.fix.removed_entries', { count: removedCount }));
    });

  program
    .command('clear')
    .description(t('cli.command.clear.description'))
    .action(() => {
      const filePath = resolveBookmarkFile();
      clearBookmarks(filePath);
      console.log(t('cli.clear.deleted'));
    });

  program
    .command('edit')
    .description(t('cli.command.edit.description'))
    .action(() => {
      const filePath = resolveBookmarkFile();
      const editor = process.env.EDITOR || 'vim';
      const { spawnSync } = require('child_process');
      spawnSync(editor, [filePath], {
        stdio: 'inherit',
      });
    });

  return program;
}
