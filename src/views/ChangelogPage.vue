<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ArrowLeft, Calendar } from 'lucide-vue-next';

const router = useRouter();

const changelog = [
  {
    version: 'v1.2.0',
    date: '2026-03-12',
    changes: [
      '新增“企微自建平台-个人SOP”高保真页面，复刻Web端管理后台',
      '实现企微后台PC端视口强制适配，支持全屏预览',
      '重构系统首页，整合多入口导航',
      '优化客户画像模块，VIN码显示脱敏还原'
    ]
  },
  {
    version: 'v1.1.0',
    date: '2026-03-10',
    changes: [
      '客户画像页面新增“购车偏好预测”与“关注点总结”Tab栏',
      '优化底部Tab栏视觉效果，区分不同模块配色',
      '修复部署后白屏问题，优化构建配置',
      '增加GitHub Actions自动部署流程'
    ]
  },
  {
    version: 'v1.0.0',
    date: '2026-03-01',
    changes: [
      '初始化项目，完成客户画像基础信息卡片',
      '实现标签体系展示（基础、配置、状态等）',
      '集成 Mock 数据，支持多车型切换'
    ]
  }
];

const goBack = () => {
  router.push('/');
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Header -->
    <div class="bg-white sticky top-0 z-50 shadow-sm">
      <div class="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <button 
            @click="goBack"
            class="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
          >
            <ArrowLeft :size="20" />
          </button>
          <h1 class="text-lg font-bold text-gray-800">更新日志</h1>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 max-w-3xl mx-auto w-full px-6 py-8">
      <div class="space-y-8 relative">
        <!-- Timeline Line -->
        <div class="absolute left-[27px] top-4 bottom-4 w-[2px] bg-gray-200"></div>

        <div v-for="(log, index) in changelog" :key="index" class="relative pl-12">
          <!-- Timeline Dot -->
          <div class="absolute left-4 top-2 w-[24px] h-[24px] bg-white border-4 border-indigo-500 rounded-full z-10"></div>
          
          <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-3">
                <span class="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-sm font-bold font-mono">
                  {{ log.version }}
                </span>
              </div>
              <div class="flex items-center gap-1.5 text-gray-400 text-sm">
                <Calendar :size="14" />
                <span>{{ log.date }}</span>
              </div>
            </div>
            
            <ul class="space-y-3">
              <li v-for="(change, i) in log.changes" :key="i" class="flex items-start gap-2.5 text-gray-600 text-[15px] leading-relaxed">
                <div class="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0"></div>
                <span>{{ change }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="py-8 text-center border-t border-gray-200 bg-white">
      <p class="text-xs text-gray-400">© 2026 Audi Customer Insight Prototype</p>
    </div>
  </div>
</template>
