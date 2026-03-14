import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import ChangelogPage from '../views/ChangelogPage.vue'
import RequirementPage from '../views/RequirementPage.vue'
import CustomerProfilePage from '../prototypes/customer-profile/CustomerProfilePage.vue'
import ContentLibraryPage from '../prototypes/content-library/ContentLibraryPage.vue'
import WeComSOPPage from '../prototypes/wecom-admin/WeComSOPPage.vue'

// 需求独立文件夹入口
import VINProfilePage from '../features/vin-tags-aggregation/VINProfilePage.vue'
import AIProfilePage from '../features/ai-analysis/AIProfilePage.vue'
import SOPPage from '../features/wecom-sop-sync/SOPPage.vue'

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
    {
      path: '/content-library',
      name: 'content-library',
      component: ContentLibraryPage
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
