## MODIFIED Requirements

### Requirement: Public category, tag, and archive aggregations SHALL consume the public publish set

公开聚合页 MUST 只消费完整镜像对构成的 public publish set，而不是所有原始内容文件。

#### Scenario: pending translation content is excluded from public aggregation
- **WHEN** a content entry has no complete zh/en mirror pair
- **THEN** it is excluded from category, tag, and archive public aggregation output

### Requirement: Canonical category routes SHALL still be generated for navigation-level categories

导航中的 canonical category 路由 SHOULD 可稳定访问；若某语言下暂无公开文章，则页面可输出 empty-state 与合适的 noindex 策略，而不是 404。

#### Scenario: canonical category without published entries still resolves
- **WHEN** a canonical category has zero published entries for the current locale
- **THEN** the category route still resolves to a valid empty-state page instead of 404
