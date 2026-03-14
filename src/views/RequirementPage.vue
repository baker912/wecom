<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ArrowLeft, Calendar, CheckCircle2, Clock, AlertCircle, PlayCircle, MoreHorizontal } from 'lucide-vue-next';

const router = useRouter();

// Mock Data
const requirements = [
  {
    id: 'REQ-20260409-01',
    title: '客户画像-车辆信息标签按VIN码展示',
    description: '优化现有车辆标签展示逻辑，支持单客户多车辆场景下，通过切换VIN码查看对应的车辆配置、状态及历史记录标签，解决多车信息混淆问题。',
    targetDate: '2026-04-09',
    status: 'pending_dev', // pending_dev, in_progress, testing, done
    priority: 'high',
    module: '客户画像(移动端)',
    progress: [
      { step: '业务评审', status: 'done', date: '2026-03-10' },
      { step: '需求导入', status: 'current', date: '2026-03-12' },
      { step: '开发实现', status: 'pending', date: '--' },
      { step: '测试验收', status: 'pending', date: '--' },
      { step: '上线发布', status: 'pending', date: '2026-04-09' },
    ]
  },
  {
    id: 'REQ-20260409-02',
    title: '客户画像-AI智能分析功能',
    description: '新增AI分析模块，基于客户历史交互数据和购车行为，自动生成购车偏好预测（动力、外观等维度）及关注点总结，辅助顾问精准营销。',
    targetDate: '2026-04-09',
    status: 'pending_dev',
    priority: 'high',
    module: '客户画像(移动端)',
    progress: [
      { step: '业务评审', status: 'done', date: '2026-03-11' },
      { step: '需求导入', status: 'current', date: '2026-03-12' },
      { step: '开发实现', status: 'pending', date: '--' },
      { step: '测试验收', status: 'pending', date: '--' },
      { step: '上线发布', status: 'pending', date: '2026-04-09' },
    ]
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'done': return 'text-green-500 bg-green-50 border-green-200';
    case 'current': return 'text-blue-600 bg-blue-50 border-blue-200 animate-pulse';
    case 'pending': return 'text-gray-300 bg-gray-50 border-gray-100';
    default: return 'text-gray-300';
  }
};

const goBack = () => {
  router.push('/');
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Header -->
    <div class="bg-white sticky top-0 z-50 shadow-sm border-b border-gray-100">
      <div class="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <button 
            @click="goBack"
            class="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
          >
            <ArrowLeft :size="20" />
          </button>
          <div>
            <h1 class="text-lg font-bold text-gray-800">需求跟踪看板</h1>
            <p class="text-xs text-gray-400">Project Requirement Tracking</p>
          </div>
        </div>
        <button class="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200">
          + 新增需求
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 max-w-3xl mx-auto w-full px-6 py-8">
      
      <!-- Filter / Summary -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex gap-2">
          <span class="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-bold">全部 2</span>
          <span class="px-3 py-1 bg-white border border-gray-200 text-gray-600 rounded-full text-xs">进行中 2</span>
          <span class="px-3 py-1 bg-white border border-gray-200 text-gray-600 rounded-full text-xs">已完成 0</span>
        </div>
        <div class="text-xs text-gray-400 flex items-center gap-1">
          <Calendar :size="12" />
          <span>目标版本：2026-04-09</span>
        </div>
      </div>

      <!-- Cards -->
      <div class="space-y-4">
        <div v-for="req in requirements" :key="req.id" class="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
          <!-- Card Header -->
          <div class="p-5 border-b border-gray-50 bg-gray-50/50 flex justify-between items-start">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <span class="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded border border-blue-200">
                  {{ req.module }}
                </span>
                <span class="px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold rounded border border-red-100 flex items-center gap-1">
                  <AlertCircle :size="8" /> P0 高优先级
                </span>
                <span class="text-gray-400 text-xs font-mono">{{ req.id }}</span>
              </div>
              <h3 class="text-base font-bold text-gray-800 mb-1">{{ req.title }}</h3>
              <p class="text-sm text-gray-500 leading-relaxed line-clamp-2">{{ req.description }}</p>
            </div>
            <button class="text-gray-400 hover:text-gray-600 p-1">
              <MoreHorizontal :size="20" />
            </button>
          </div>

          <!-- Progress Bar -->
          <div class="p-5 bg-white">
            <div class="flex items-center justify-between relative">
              <!-- Connecting Line -->
              <div class="absolute top-[15px] left-0 right-0 h-[2px] bg-gray-100 z-0 mx-8"></div>
              
              <div v-for="(step, index) in req.progress" :key="index" class="relative z-10 flex flex-col items-center gap-2 group cursor-default">
                <div :class="`w-8 h-8 rounded-full border-2 flex items-center justify-center bg-white transition-colors ${getStatusColor(step.status)}`">
                  <CheckCircle2 v-if="step.status === 'done'" :size="14" class="text-green-500" />
                  <PlayCircle v-else-if="step.status === 'current'" :size="14" class="text-blue-500" />
                  <Clock v-else-if="step.status === 'pending'" :size="14" class="text-gray-300" />
                </div>
                <div class="text-center">
                  <p :class="`text-xs font-medium ${step.status === 'current' ? 'text-blue-600' : step.status === 'done' ? 'text-gray-800' : 'text-gray-400'}`">
                    {{ step.step }}
                  </p>
                  <p class="text-[10px] text-gray-400 scale-90">{{ step.date }}</p>
                </div>
              </div>
            </div>
            
            <!-- Current Action -->
            <div class="mt-6 bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                <span class="text-xs text-blue-700 font-medium">当前状态：<span class="font-bold">待开发需求导入</span></span>
              </div>
              <button class="text-xs bg-white border border-blue-200 text-blue-600 px-3 py-1 rounded hover:bg-blue-50 transition-colors">
                查看详情
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
