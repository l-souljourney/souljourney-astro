# Astro v6 Official Notes

## Latest stable line checked

- Official Astro blog shows `Astro 6.2` published on `April 30, 2026`
- The article states Astro `6.2.1` is the current version at publish time
- This confirms the current stable major line is Astro 6, not Astro 5

Source:

- https://astro.build/blog/astro-620/

## Astro v6 upgrade requirements

According to the official upgrade guide for v6:

- Astro v6 supports Node.js `v22.12.0`, `v23.11.0`, or later
- Astro v6 upgrades Vite to `v7.0`
- Astro v6 upgrades Zod to `v4`
- Deprecated `astro:schema` and `z` imports from `astro:content` become breaking and should move to `astro:schema`
- Legacy content collections compatibility support is removed
- `i18n.routing.redirectToDefaultLocale` default changes from `false` to `true`

Source:

- https://docs.astro.build/en/guides/upgrade-to/v6/

## Astro 6.2 note relevant to this repo

- Astro 6.2 introduces `image.layout` and a new `svgOptimizer` config option
- The blog explicitly says `svgOptimizer` replaces the previous `svgo` flag

Source:

- https://astro.build/blog/astro-620/

## Official migration tooling

- Astro’s official docs recommend running:
  - `npx @astrojs/upgrade`
  - then `pnpm dlx @astrojs/upgrade`
- The guide also recommends using the codemods shipped with the upgrade tool for v6 changes

Source:

- https://docs.astro.build/en/guides/upgrade-to/v6/

## Tailwind status in official docs

- The official Tailwind integration page is marked `Deprecated`
- The page says the Astro Tailwind integration should no longer be used and Tailwind should be configured using the Vite plugin

Source:

- https://docs.astro.build/en/guides/integrations-guide/tailwind/

## Mapping to this repo

### Hard blockers

1. Repo build/deploy runtime is still Node 20
2. Repo config still uses `experimental.svgo`
3. Repo content schema still imports `z` from `astro:content`

### Likely migration work items

1. Replace or modernize Tailwind integration path
2. Upgrade official Astro integrations together with framework
3. Verify third-party packages (`astro-pagefind`, `astro-icon`, `@playform/compress`) against Astro 6-compatible versions
4. Re-test i18n root/default-locale behavior because of `redirectToDefaultLocale`
5. Re-test all client-router lifecycle hooks after Vite/Astro runtime upgrade

## Initial official-readiness conclusion

Officially, Astro 6 is mature enough to target now. This repository is blocked not by Astro maturity, but by local runtime, dependency, and verification debt.
