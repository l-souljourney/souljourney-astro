## MODIFIED Requirements

### Requirement: Article language switch SHALL resolve by mirrored publish pair

Language switch on published article pages MUST resolve from the mirrored publish pair rather than ad-hoc path slicing or homepage fallback.

#### Scenario: published article switches by mirrored pair
- **WHEN** a user triggers language switch on a published article detail page
- **THEN** the target path is resolved from the mirrored article with the same shared `source_id` and `slug`
