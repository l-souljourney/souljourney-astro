## MODIFIED Requirements

### Requirement: Public publish set SHALL include only complete mirror pairs

只有完整 zh/en 镜像对可以进入公开发布集合。任何缺失镜像的一侧都 MUST NOT 进入 article route、RSS、sitemap、搜索索引与公开聚合页。  
同时，发布流水线 MUST 对公开集合健康度进行门禁校验，避免公开集合被静默清空后继续部署。

#### Scenario: complete mirror pair enters public publish set
- **WHEN** both `lang=zh` and `lang=en` entries exist with the same `source_id` and `slug`
- **THEN** both entries are included in the public publish set

#### Scenario: single-language entry is excluded from public publish set
- **WHEN** only one language entry exists for a `source_id` + `slug` pair
- **THEN** that entry is treated as pending translation and excluded from public routes and public indexes

#### Scenario: publish set collapse is blocked by CI health guard
- **WHEN** build-time publish health check reports mirror pair count below configured minimum
- **THEN** deployment is blocked and workflow exits with failure
