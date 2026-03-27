## ADDED Requirements

### Requirement: GitHub Actions SHALL deploy to COS with global acceleration

The `.github/workflows/deploy.yml` SHALL use COS global acceleration endpoint (`cos.accelerate.myqcloud.com`) for uploading build artifacts from GitHub Actions runners (US-based) to Tencent Cloud COS (China region). The deployment SHALL use incremental sync (`coscli sync --delete`) to minimize transfer volume.

#### Scenario: Successful COS deployment with acceleration

- **WHEN** a commit is pushed to the `main` branch
- **THEN** GitHub Actions builds the site and uploads to COS using the global acceleration endpoint, completing within 5 minutes

#### Scenario: COS secrets validation prevents deployment failure

- **WHEN** any required COS secret (`TENCENT_CLOUD_SECRET_ID`, `TENCENT_CLOUD_SECRET_KEY`, `COS_BUCKET`, `COS_REGION`) is missing
- **THEN** the deploy job fails early with a clear error message before attempting upload

### Requirement: CDN cache SHALL be invalidated after deployment

After a successful COS sync, the workflow SHALL trigger a CDN cache purge to ensure visitors see the latest content immediately.
The workflow SHALL support a lightweight compatible strategy: use `TEO_ZONE_ID` when available, otherwise fallback to domain-based purge flow when `CDN_DOMAIN` is available.

#### Scenario: CDN purge after successful deploy

- **WHEN** COS sync completes successfully and CDN credentials are configured
- **THEN** the workflow submits a CDN cache purge request for the site domain

#### Scenario: CDN purge is skipped gracefully when not configured

- **WHEN** CDN credentials (`TEO_ZONE_ID` or equivalent) are not configured
- **THEN** the CDN purge step is skipped without failing the overall workflow

#### Scenario: Missing purge config emits warning only

- **WHEN** neither `TEO_ZONE_ID` nor `CDN_DOMAIN` is configured
- **THEN** workflow logs a warning and continues successful deployment without purge

### Requirement: Cloudflare Pages SHALL auto-deploy from GitHub

Cloudflare Pages SHALL be configured to automatically build and deploy from the GitHub repository on every push to `main`. This is a Dashboard configuration, not a code change.

Build configuration:
- Build command: `pnpm build`
- Output directory: `dist`
- Node version: 20
- Package manager: pnpm

#### Scenario: International users access site via Cloudflare

- **WHEN** a commit is pushed to `main`
- **THEN** Cloudflare Pages automatically pulls the repo, builds, and deploys to Cloudflare CDN within 5 minutes

### Requirement: CNB build configuration SHALL be removed

All CNB-related build configuration files (`.cnb.yml` and related artifacts) SHALL be removed from the repository.

#### Scenario: No CNB configuration exists after cleanup

- **WHEN** a search is performed for `.cnb.yml` or CNB-related configuration in the repository root
- **THEN** no files are found
