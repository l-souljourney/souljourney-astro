## MODIFIED Requirements

### Requirement: Mobile locale prefix helper SHALL be idempotent for English paths
Mobile sidebar link prefix resolution for English pages MUST be idempotent: if a path is already prefixed with `/en`, prefix logic MUST return it unchanged.

#### Scenario: already-prefixed path is kept as-is
- **WHEN** mobile navigation helper receives `/en/archives`
- **THEN** returned path remains `/en/archives`

#### Scenario: unprefixed path gets english prefix
- **WHEN** mobile navigation helper receives `/archives` under English locale
- **THEN** returned path is `/en/archives`
