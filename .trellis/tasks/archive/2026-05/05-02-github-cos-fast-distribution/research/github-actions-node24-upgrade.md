# GitHub Actions Node 24 运行时处理（2026-05-02）

## 问题

GitHub Actions UI 已提示当前 workflow 中若干 JavaScript actions 仍运行在即将退役的 Node 20 runtime，需要补 Node 24 兼容处理。

涉及组件：

- `actions/checkout`
- `actions/setup-node`
- `pnpm/action-setup`

## 官方资料

### 1. `actions/checkout`

官方 README / release 说明显示：

- `checkout@v5` 已切到 Node 24 runtime
- `checkout@v6` 还引入了 credential 存储位置调整

这意味着：如果本轮目标只是处理 runtime 告警，`v5` 已经足够，且比 `v6` 更少行为变化。

来源：

- https://github.com/actions/checkout

### 2. `actions/setup-node`

官方 README / release 说明显示：

- `setup-node@v5` 已切到 Node 24 runtime
- `setup-node@v6` 还有额外的缓存与输入行为更新

因此本轮同样采用 `v5`，优先做最小运行时升级。

来源：

- https://github.com/actions/setup-node

### 3. `pnpm/action-setup`

官方最新稳定 release 已是：

- `v5.0.0`

直接回读 `action.yml` 可确认：

- `runs.using: node24`

来源：

- https://github.com/pnpm/action-setup
- https://github.com/pnpm/action-setup/issues/209

## 结论

本仓库本轮采用的最小风险方案：

1. `actions/checkout@v5`
2. `pnpm/action-setup@v5`
3. `actions/setup-node@v5`

## 为什么不直接全量升到更高 major

原因不是“不能升”，而是这轮目标明确是：

- 不扰动已经跑通的 GitHub -> CNB mirror 主链路
- 只处理 Node 24 runtime 告警

其中 `checkout@v6` 和 `setup-node@v6` 都带了除 runtime 外的额外行为变化。本轮先统一到 **Node 24 兼容的稳定 v5 系列**，后续若要继续追最新 major，再单独作为 workflow 维护任务处理。
