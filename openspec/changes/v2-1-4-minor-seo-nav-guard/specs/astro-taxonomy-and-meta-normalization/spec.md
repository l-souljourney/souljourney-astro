## MODIFIED Requirements

### Requirement: English category indexing policy SHALL preserve site default robots for non-empty pages
English category pages MUST apply `noindex, follow` only for empty categories. Categories with articles MUST rely on site default robots policy and MUST NOT hardcode `index, follow` at page level.

#### Scenario: empty category receives noindex
- **WHEN** `/en/categories/{category}` has zero English articles
- **THEN** page-level robots is set to `noindex, follow`

#### Scenario: non-empty category uses default robots
- **WHEN** `/en/categories/{category}` has one or more English articles
- **THEN** page-level robots override is omitted and Head default robots policy is used
