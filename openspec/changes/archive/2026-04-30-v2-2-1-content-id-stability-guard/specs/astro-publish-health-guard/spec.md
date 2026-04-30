## ADDED Requirements

### Requirement: Build pipeline SHALL gate deployment on publish health

Before deployment, CI MUST verify publish health metrics from generated build artifacts and MUST fail the workflow if public publish set health is below configured threshold.

#### Scenario: mirror pair count below threshold blocks deployment
- **WHEN** publish health check computes `mirrorPairs` less than configured minimum
- **THEN** CI exits with non-zero status and deployment job does not run

#### Scenario: article route and rss checks are empty
- **WHEN** build output contains zero article routes or zero RSS items
- **THEN** CI marks publish health check as failed

### Requirement: Publish health check SHALL emit diagnostics for triage

Health check output MUST include key counters (`blogSize`, `mirrorPairs`, route count, RSS item count) so failures can be diagnosed without rerunning ad-hoc scripts.

#### Scenario: check fails with readable metrics
- **WHEN** publish health validation fails
- **THEN** command output prints metric summary and failing threshold before exit
