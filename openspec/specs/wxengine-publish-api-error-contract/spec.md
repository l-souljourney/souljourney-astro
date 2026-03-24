## ADDED Requirements

### Requirement: Publish API SHALL validate mandatory payload before write

`/api/blog/publish` MUST validate mandatory fields before writing to GitHub: `title`, `date`, `categories`, `slug`, `source_id`.

#### Scenario: Missing mandatory field returns 422
- **WHEN** request payload misses any mandatory field
- **THEN** API returns HTTP `422`

### Requirement: Publish API SHALL enforce categories enum and slug regex

The API MUST reject non-canonical `categories` and invalid `slug` values.

#### Scenario: Invalid category returns 422
- **WHEN** payload contains `categories` outside canonical enum
- **THEN** API returns HTTP `422`

#### Scenario: Invalid slug returns 422
- **WHEN** payload contains `slug` not matching `^[a-z0-9]+(?:-[a-z0-9]+)*$`
- **THEN** API returns HTTP `422`

### Requirement: Publish API SHALL enforce boolean-only flags

`recommend`, `top`, and `hide` MUST be boolean when provided.

#### Scenario: String boolean returns 422
- **WHEN** payload contains `hide: "true"`
- **THEN** API returns HTTP `422`

### Requirement: Error and success response body SHALL be machine-readable

For validation failures, response body MUST include `message`. For success, response body MUST include generated article `route`.

#### Scenario: 422 response includes message
- **WHEN** API returns `422`
- **THEN** response body contains a non-empty `message`

#### Scenario: Success response includes route
- **WHEN** publish succeeds
- **THEN** response body contains non-empty `route` for published article path
