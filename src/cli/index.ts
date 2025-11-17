#!/usr/bin/env node

import { buildCli } from './cli';

// CLI 入口，仅负责调用 Commander 配置并解析进程参数。
// 将命令定义与实现细节隔离，保持结构清晰。

const program = buildCli();
program.parse(process.argv);
