## ADDED Requirements

### Requirement: English category core routes SHALL be generated for all canonical category keys
English category page static path generation MUST include the full canonical category key set defined by site taxonomy configuration, even when no English article currently belongs to a specific category.

#### Scenario: canonical category without en posts still resolves
- **WHEN** a canonical category has zero English articles
- **THEN** `/en/categories/{category}` is still generated and renders a valid empty archive page instead of 404

#### Scenario: canonical category with en posts remains accessible
- **WHEN** a canonical category has English articles
- **THEN** `/en/categories/{category}` renders article list normally with localized display text
