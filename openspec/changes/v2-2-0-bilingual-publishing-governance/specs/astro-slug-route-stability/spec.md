## MODIFIED Requirements

### Requirement: zh/en article routes SHALL preserve the current locale path contract

公开文章路由 MUST 保持当前路径契约：中文 `/article/{slug}`，英文 `/en/article/{slug}`。

#### Scenario: zh article route uses root article prefix
- **WHEN** a zh article is published
- **THEN** its detail path is `/article/{slug}`

#### Scenario: en article route uses /en article prefix
- **WHEN** an en article is published
- **THEN** its detail path is `/en/article/{slug}`

### Requirement: Public article routes SHALL be generated only from complete mirror pairs

Language-specific static path generation MUST consume the public publish set rather than all raw entries.

#### Scenario: incomplete mirror pair is excluded from article routes
- **WHEN** only one language entry exists for a `source_id` + `slug` pair
- **THEN** neither side generates a public article route

### Requirement: Article hreflang SHALL always reference the mirrored counterpart in the public publish set

For published article detail routes, hreflang alternate links MUST point to the mirrored zh/en article with the same `slug`.

#### Scenario: bilingual article pair exists
- **WHEN** both zh and en entries exist in the public publish set for the same `slug`
- **THEN** page head emits valid `hreflang="zh"` and `hreflang="en"` alternates

### Requirement: Article language switch SHALL target the mirrored article with the same slug

Language switch behavior on published article pages MUST use the mirrored locale route derived from the same shared `slug`.

#### Scenario: published zh article switches to mirrored en route
- **WHEN** a user switches language on `/article/{slug}`
- **THEN** the target route is `/en/article/{slug}` for the mirrored article
