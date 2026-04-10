import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import ChangelogPage from '../views/ChangelogPage.vue'
import RequirementPage from '../views/RequirementPage.vue'
import CustomerProfilePage from '../prototypes/customer-profile/CustomerProfilePage.vue'
import WeComSOPPage from '../prototypes/wecom-admin/WeComSOPPage.vue'

// 需求独立文件夹入口
import VINProfilePage from '../features/vin-tags-aggregation/VINProfilePage.vue'
import AIProfilePage from '../features/ai-analysis/AIProfilePage.vue'
import SOPPage from '../features/wecom-sop-sync/SOPPage.vue'
import AudiencePackagePage from '../features/audience-package-management/AudiencePackagePage.vue'
import AudiencePackageCreatePage from '../features/audience-package-management/AudiencePackageCreatePage.vue'
import AudiencePackageDetailPage from '../features/audience-package-management/AudiencePackageDetailPage.vue'
import PersonalSOPCreatePage from '../features/personal-sop/PersonalSOPCreatePage.vue'
import ContentLibraryWaterfallPage from '../features/content-library-waterfall/ContentLibraryWaterfallPage.vue'
import SessionArchivePage from '../features/session-archive/SessionArchivePage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '/customer-profile',
      name: 'customer-profile',
      component: CustomerProfilePage
    },
    // 需求 1: 车辆信息标签按VIN码展示
    {
      path: '/features/vin-tags',
      name: 'vin-tags',
      component: VINProfilePage
    },
    // 需求 2: AI智能分析功能
    {
      path: '/features/ai-analysis',
      name: 'ai-analysis',
      component: AIProfilePage
    },
    // 需求 3: 三系统经销商数据同步
    {
      path: '/features/wecom-sop-sync',
      name: 'wecom-sop-sync',
      component: SOPPage
    },
    // 需求 4: 人群包管理
    {
      path: '/features/audience-package',
      name: 'audience-package',
      component: AudiencePackagePage
    },
    {
      path: '/features/audience-package/new',
      name: 'audience-package-new',
      component: AudiencePackageCreatePage
    },
    {
      path: '/features/audience-package/:id/view',
      name: 'audience-package-view',
      component: AudiencePackageCreatePage
    },
    {
      path: '/features/audience-package/:id',
      name: 'audience-package-detail',
      component: AudiencePackageDetailPage
    },
    {
      path: '/features/personal-sop/new',
      name: 'personal-sop-new',
      component: PersonalSOPCreatePage
    },
    {
      path: '/content-library',
      name: 'content-library',
      component: ContentLibraryWaterfallPage
    },
    {
      path: '/features/session-archive',
      name: 'session-archive',
      component: SessionArchivePage
    },
    {
      path: '/wecom-sop',
      name: 'wecom-sop',
      component: WeComSOPPage
    },
    {
      path: '/changelog',
      name: 'changelog',
      component: ChangelogPage
    },
    {
      path: '/requirement',
      name: 'requirement',
      component: RequirementPage
    }
  ]
})

export default router
