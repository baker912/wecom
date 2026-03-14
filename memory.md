# memory.md (Project Context Memory)

> 更新时间：2026-03-13 18:00

## 1. 项目基础信息 (Project Basics)
- **项目名称**：客户画像按VIN区分 (Customer Profile by VIN)
- **技术栈**：
  - **核心框架**：Vite 5 + **Vue 3** + TypeScript
  - **路由管理**：**Vue Router v4**
  - **样式方案**：TailwindCSS + PostCSS
  - **交互/图标**：`lucide-vue-next`
  - **构建/部署**：GitHub Actions CI/CD -> 腾讯云 Nginx (静态托管)
- **代码组织规范**：
  - **Feature-Based Structure**：每个独立的需求/功能原型必须存放在 `src/features/[feature-name]` 文件夹下。
  - **Self-Contained**：功能文件夹内应包含该功能所需的所有专用组件，确保开发人员可以独立提取和使用该文件夹内的代码。
  - **Independent Routes**：每个功能在 `router/index.ts` 中拥有独立的访问路径（如 `/features/...`）。
- **演示布局规范**：
  - **Split Layout**：移动端原型预览采用“左手机、右说明”的左右分栏布局。
  - **Context Aware**：`PhoneFrame.vue` 会根据当前路由自动从数据映射表中提取需求标题、核心目标及**功能逻辑说明**（仅展示核心的第一条）并展示在右侧。
  - **Visual Highlighting**：在原型页面中，通过高亮边框、阴影、微动画（如 Pulse/Bounce）及专属标签（统一文案为“**本次功能**”）直观地标识出与当前需求直接相关的功能区域。
- **协作与推送规范**：
  - **按需推送**：严禁在每次小改动后自动执行 `git push`。只有在用户明确发出“推送”或“部署”指令时，才允许将代码推送到 GitHub 仓库。
  - **本地优先**：所有的 UI 调整和逻辑优化应首先在本地预览环境验证完成。
  - **部署配置**：项目 `wecom` 部署于服务器 `/var/www/wecom/` 目录，通过 Nginx 8080 端口访问。

## 2. 会话历史摘要 (Session Summary)

### [2026-03-13] 预览界面交互升级与需求逻辑可视化
- **任务**：优化移动端原型的演示效果，将手机框移至左侧并添加右侧需求说明。
- **执行过程**：
  - **布局重构**：修改 [PhoneFrame.vue](file:///Users/zhangbinwen/Desktop/%E5%AE%A2%E6%88%B7%E7%94%BB%E5%83%8F%E6%8C%89VIN%E5%8C%BA%E5%88%86/src/components/PhoneFrame.vue)，在桌面端（lg 屏幕）启用 `flex-row` 布局，手机框靠左展示。
  - **逻辑说明注入**：在 `PhoneFrame` 中内置了 `requirementInfoMap`，涵盖了 VIN 聚合、AI 分析、内容库等核心需求的逻辑描述。
  - **内容精简与术语更正**：根据用户反馈，将“业务逻辑说明”更正为“**功能逻辑说明**”，并精简了描述列表，每个需求仅保留最核心的第一条说明。
  - **高亮标签文案统一**：将所有引导性标签（如“核心功能”、“需求相关功能”）统一修改为“**本次功能**”，使其更符合原型演示的语境。
  - **高亮逻辑增强**：根据最新反馈，将 VIN 聚合需求的逻辑描述更新为“不同 VIN 可以下拉单选”，并在 [VehicleSection.vue](file:///Users/zhangbinwen/Desktop/%E5%AE%A2%E6%88%B7%E7%94%BB%E5%83%8F%E6%8C%89VIN%E5%8C%BA%E5%88%86/src/features/vin-tags-aggregation/VehicleSection.vue) 和 [TagSection.vue](file:///Users/zhangbinwen/Desktop/%E5%AE%A2%E6%88%B7%E7%94%BB%E5%83%8F%E6%8C%89VIN%E5%8C%BA%E5%88%86/src/features/vin-tags-aggregation/TagSection.vue) 中实现了视觉高亮。
- **当前状态**：原型演示不再仅仅是静态页面，而是带有完整背景说明和**精简功能逻辑**解释的“数字化产品规格书”。

## 3. 项目关键决策 (Key Decisions)
- **架构模式**：采用 **Mock-First** 开发模式，优先完成前端 UI 与交互逻辑，通过 `src/mock/data.ts` 模拟数据结构，解耦后端开发依赖。
- **样式策略**：使用 TailwindCSS Utility 类实现快速开发，配合 PostCSS 处理兼容性。
- **技术栈迁移**：决定从 React 迁移至 Vue 3，以利用其更简洁的响应式语法 (Composition API)。采用“原地备份+重写+清理”策略，最终实现无缝切换。
- **记忆管理规则**：确立【自动上下文记忆文件记录规则】，将 AI 的学习与理解持久化到代码库中，作为项目资产的一部分。
- **预览增强**：引入 `PhoneFrame` 作为移动端原型的标准容器，提升原型演示的真实感和专业度。
- **容器化固定定位规范**：在模拟器容器内，利用 `transform` 诱导 `fixed` 定位相对于容器生效，从而在不改变标准开发习惯的前提下实现完美的容器内固定效果。
- **安全区域规范**：移动端页面 Header 需预留 `44px` (Tailwind `pt-11`) 的状态栏安全区域，以适配 `PhoneFrame` 的 system 级 UI。

## 4. 开发进度与待办 (Progress & Todo)
- **已完成 (Completed)**：
  - [x] 项目脚手架搭建 (Vite+React+TS+Tailwind)
  - [x] 核心页面实现：客户画像页、企微 SOP 页、更新日志页
  - [x] 关键交互：VIN 切换逻辑、标签分组展示、Tab 切换
  - [x] AI 分析模拟交互 (前端 `setTimeout` 模拟)
  - [x] **全量迁移至 Vue 3 并清理旧代码**
- **待办 (Pending)**：
  - [ ] **API 接入**：替换 `src/mock/data.ts` 为真实后端接口调用。
  - [ ] **状态管理**：评估引入 Pinia 管理跨组件状态 (目前仅使用 ref/reactive)。
  - [ ] **测试覆盖**：添加单元测试 (Vitest) 与 E2E 测试。

## 5. 关键代码片段 (Core Code Snippets)

### VIN 切换核心逻辑 (Vue 3 实现) (`src/components/VehicleSection.vue`)
```typescript
<script setup lang="ts">
const currentVinIndex = ref(0);
const isSwitching = ref(false);

const handleVinChange = (index: number) => {
  if (index === currentVinIndex.value) return;
  isSwitching.value = true;
  // 模拟切换延迟
  setTimeout(() => {
    currentVinIndex.value = index;
    isSwitching.value = false;
  }, 200);
};
</script>
```

### AI 分析模拟交互 (Vue 3 实现) (`src/components/BottomBar.vue`)
```typescript
const handleGenerateReply = (index: number) => {
  setTimeout(() => {
      // ... 生成逻辑
      aiGeneratedReply.value = { index, content: replyContent };
  }, 500);
};
```
