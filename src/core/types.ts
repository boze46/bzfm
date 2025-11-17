/**
 * 公共类型定义，避免在多个模块中重复声明（DRY）。
 */

/**
 * 书签过滤类型：
 * - 'all'  : 不做类型区分
 * - 'files': 仅保留文件
 * - 'dirs' : 仅保留目录
 */
export type BookmarkFilter = 'all' | 'files' | 'dirs';
