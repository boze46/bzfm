import fs from 'fs';
import path from 'path';
import { Command } from 'commander';
import { t } from '../i18n';

/**
 * init 子命令：输出 zsh / fish 的集成脚本。
 *
 * 设计参考 zoxide：
 * - 实际 shell 代码维护在独立的模板文件中（share/init.zsh, share/init.fish）；
 * - Node 仅负责选择模板并做极少量的占位符替换（{ALIAS_BLOCK}）。
 */

export function registerInitCommand(program: Command): void {
  program
    .command('init')
    .description(t('cli.command.init.description'))
    .argument('<shell>', 'Target shell: zsh | fish')
    .option('--cmd <name>', 'Override the shorthand command alias', 'bz')
    .option('--no-cmd', 'Do not define any alias function')
    .action((shell: string, options: { cmd?: string; noCmd?: boolean }) => {
      const target = shell.toLowerCase();
      const aliasEnabled = !options.noCmd;
      const cmdName = options.cmd ?? 'bz';

      let templateFile: string;
      if (target === 'zsh') {
        templateFile = path.join(__dirname, '../../share/init.zsh');
      } else if (target === 'fish') {
        templateFile = path.join(__dirname, '../../share/init.fish');
      } else {
        console.error(`Unsupported shell: ${shell}. Expected 'zsh' or 'fish'.`);
        process.exitCode = 1;
        return;
      }

      let template: string;
      try {
        template = fs.readFileSync(templateFile, 'utf8');
      } catch (err) {
        console.error(`Failed to read template file: ${templateFile}`);
        process.exitCode = 1;
        return;
      }

      const aliasBlock = aliasEnabled
        ? renderAliasBlock(cmdName, target)
        : '# alias disabled by --no-cmd';

      const output = template.replace('# {ALIAS_BLOCK}', aliasBlock);
      process.stdout.write(output);
    });
}

function renderAliasBlock(cmdName: string, shell: 'zsh' | 'fish' | string): string {
  if (shell === 'zsh') {
    return [
      '# bzfm shorthand command',
      `function ${cmdName}() {`,
      '  bzfm "$@"',
      '}',
      '',
    ].join('\n');
  }
  if (shell === 'fish') {
    return [
      '# bzfm shorthand command',
      `function ${cmdName} --wraps bzfm`,
      '  bzfm $argv',
      'end',
      '',
    ].join('\n');
  }
  return '';
}
