## ADDED Requirements

### Requirement: Article hreflang SHALL only reference existing counterpart content

For article detail routes, hreflang alternate links MUST be emitted only when the corresponding opposite-language article exists for the same slug.

#### Scenario: zh article without en counterpart
- **WHEN** rendering `/article/{slug}` and no `/en/article/{slug}` content exists
- **THEN** page head MUST NOT emit `hreflang="en"` pointing to that missing route

#### Scenario: bilingual article pair exists
- **WHEN** both zh and en entries exist for the same slug
- **THEN** page head emits valid `hreflang="zh"` and `hreflang="en"` alternates

### Requirement: Article language switch SHALL avoid dead-end route

Language switch behavior on article pages MUST avoid linking to non-existent counterpart article routes.

#### Scenario: missing counterpart article
- **WHEN** current article has no opposite-language entry
- **THEN** language switch target falls back to language homepage instead of dead article route
