import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';

export const RELEASE_MANIFEST_PATH = '/.well-known/sj-release.json';
export const RELEASE_MANIFEST_SCHEMA = 1;

export type ReleaseContentEntry = {
  id: string;
  digest?: number | string;
};

export type ReleaseCommitSource = 'env' | 'git' | 'unknown';

export type ReleaseManifest = {
  schema: number;
  source: string;
  commit: string;
  commit_source: ReleaseCommitSource;
  built_at: string;
  content_digest: string;
  content_entries: number;
};

const sha256 = (input: string) => `sha256:${createHash('sha256').update(input).digest('hex')}`;

/**
 * 对已发布内容集合求稳定摘要。
 * 只依赖内容条目本身（id + Astro content digest），不依赖渲染产物——
 * 封面随机化会让 HTML 每次构建不同，字节哈希不可用。
 */
export const computeContentDigest = (entries: ReleaseContentEntry[]) =>
  sha256(
    [...entries]
      .map((entry) => `${entry.id}\t${entry.digest ?? ''}`)
      .sort()
      .join('\n')
  );

/**
 * 解析构建提交。构建环境不保证有 CI 变量或 git 元数据，
 * 降级时如实标注来源，不伪造提交号。
 */
export const resolveCommit = (
  env: Record<string, string | undefined> = process.env,
  cwd: string = process.cwd()
): { commit: string; commitSource: ReleaseCommitSource } => {
  const fromEnv = (env.GITHUB_SHA ?? env.CI_COMMIT_SHA ?? '').trim();
  if (fromEnv) {
    return { commit: fromEnv.slice(0, 40), commitSource: 'env' };
  }

  try {
    const fromGit = execFileSync('git', ['rev-parse', 'HEAD'], {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    if (fromGit) {
      return { commit: fromGit.slice(0, 40), commitSource: 'git' };
    }
  } catch {
    // 落到下面的 unknown 分支；由 commit_source 显式记录降级。
  }

  return { commit: 'unknown', commitSource: 'unknown' };
};

export const buildReleaseManifest = ({
  source,
  entries,
  builtAt = new Date().toISOString(),
  env = process.env,
  cwd = process.cwd(),
}: {
  source: string;
  entries: ReleaseContentEntry[];
  builtAt?: string;
  env?: Record<string, string | undefined>;
  cwd?: string;
}): ReleaseManifest => {
  const { commit, commitSource } = resolveCommit(env, cwd);

  return {
    schema: RELEASE_MANIFEST_SCHEMA,
    source,
    commit,
    commit_source: commitSource,
    built_at: builtAt,
    content_digest: computeContentDigest(entries),
    content_entries: entries.length,
  };
};
