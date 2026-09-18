import { getCollection } from 'astro:content';
import { buildReleaseManifest } from '@/utils/releaseIdentity';
import { getPublishedEntries } from '@/utils/publishSet';

const RELEASE_SOURCE = 'github:l-souljourney/souljourney-astro';

export async function GET() {
  const posts = await getCollection('blog');
  const published = getPublishedEntries(posts);

  const manifest = buildReleaseManifest({
    source: RELEASE_SOURCE,
    entries: published.map((entry) => ({
      id: entry.id,
      digest: (entry as { digest?: number | string }).digest,
    })),
  });

  return new Response(`${JSON.stringify(manifest, null, 2)}\n`, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
}
