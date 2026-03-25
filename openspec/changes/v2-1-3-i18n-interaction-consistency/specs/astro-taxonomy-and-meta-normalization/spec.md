## MODIFIED Requirements

### Requirement: English category core routes SHALL be generated for all canonical category keys
English category page static path generation MUST include the full canonical category key set defined by site taxonomy configuration, even when no English article currently belongs to a specific category. For categories with zero English articles, the page MUST render an explicit empty-state message and MUST output `robots` meta as `noindex, follow` to avoid thin-content indexing. For categories with content, page indexing behavior MUST remain `index, follow`.

#### Scenario: canonical category without en posts still resolves
- **WHEN** a canonical category has zero English articles
- **THEN** `/en/categories/{category}` is still generated and renders a valid empty-state page instead of 404

#### Scenario: empty english category uses noindex strategy
- **WHEN** rendering `/en/categories/{category}` with no article items
- **THEN** page output includes empty-state guidance text and `robots` meta is `noindex, follow`

#### Scenario: canonical category with en posts remains accessible
- **WHEN** a canonical category has English articles
- **THEN** `/en/categories/{category}` renders article list normally with localized display text and keeps `robots` meta as `index, follow`
