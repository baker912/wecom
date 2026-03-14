<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { computed } from 'vue';
import { Home, Wifi, Signal, Info, Target, Layout } from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();

// 需求描述数据映射
const requirementInfoMap: Record<string, { title: string; subtitle: string; logic: string[] }> = {
  '/features/vin-tags': {
    title: '车辆信息标签按 VIN 码展示',
    subtitle: '核心需求：解决多辆车，有不同的车辆信息标签做区分展示的问题',
    logic: [
      '不同 VIN 可以下拉单选：支持通过下拉菜单精准切换客户名下的不同车辆 VIN。'
    ]
  },
  '/features/ai-analysis': {
    title: 'AI 智能分析功能',
    subtitle: '核心需求：利用大模型能力赋能销售跟进与话术优化',
    logic: [
      'AI 悬浮助手：底部常驻 AI 助手球，提供即时的业务咨询支持。'
    ]
  },
  '/content-library': {
    title: '营销内容库',
    subtitle: '核心需求：标准化的营销素材分发与追踪平台',
    logic: [
      '全类型素材：支持海报、图文、短视频等多种形式的营销素材。'
    ]
  },
  '/customer-profile': {
    title: '客户画像综合视图',
    subtitle: '核心需求：360度客户全景信息展示',
    logic: [
      '基础画像：整合客户姓名、性别、联系方式等基本信息。'
    ]
  }
};

const currentInfo = computed(() => {
  return requirementInfoMap[route.path] || null;
});

// 判断是否是移动端页面
const isMobilePage = computed(() => {
  const mobilePaths = [
    '/customer-profile', 
    '/content-library',
    '/features/vin-tags',
    '/features/ai-analysis'
  ];
  return mobilePaths.includes(route.path);
});

const goHome = () => {
  router.push('/');
};

const currentTime = computed(() => {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
});
</script>

<template>
  <div v-if="isMobilePage" class="min-h-screen bg-[#F5F5F7] flex items-center justify-center lg:justify-start p-4 sm:p-8 lg:pl-20 font-sans overflow-x-hidden">
    <div class="flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-20 w-full max-w-7xl">
      
      <!-- iPhone 16 Pro 外壳容器 (左侧) -->
      <div class="relative group animate-fade-in shrink-0">
        <!-- 手机外框 (Titanium Frame) -->
        <div class="relative w-[340px] h-[720px] sm:w-[430px] sm:h-[880px] bg-[#1c1c1e] rounded-[55px] p-[10px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5),0_30px_60px_-30px_rgba(0,0,0,0.6)] border-[1px] border-[#3a3a3c] flex items-center justify-center transition-transform duration-500 group-hover:scale-[1.01]">
          
          <!-- 内黑边 (Bezel) -->
          <div class="relative w-full h-full bg-black rounded-[46px] overflow-hidden border-[6px] border-[#000000] transform-gpu">
            
            <!-- 灵动岛 (Dynamic Island) -->
            <div class="absolute top-2 left-1/2 -translate-x-1/2 w-[110px] h-[32px] bg-black rounded-full z-50 flex items-center justify-center border-[1px] border-white/5 shadow-inner">
              <div class="w-3 h-3 bg-[#1a1a1a] rounded-full mr-2 shadow-inner"></div>
              <div class="w-2 h-2 bg-[#1a1a1a] rounded-full"></div>
            </div>

            <!-- 状态栏 (Status Bar) -->
            <div class="absolute top-0 left-0 w-full h-11 px-8 flex justify-between items-end pb-1.5 z-[1000] text-black select-none pointer-events-none">
              <span class="text-[13px] font-bold">{{ currentTime }}</span>
              <div class="flex items-center gap-1.5">
                <Signal :size="14" :strokeWidth="2.5" />
                <Wifi :size="14" :strokeWidth="2.5" />
                <div class="relative w-6 h-3 border-[1.5px] border-black rounded-[3px] flex items-center p-[1px]">
                  <div class="h-full bg-black rounded-[0.5px]" style="width: 85%"></div>
                  <div class="absolute -right-[3.5px] top-1/2 -translate-y-1/2 w-[2px] h-[4px] bg-black rounded-r-[1px]"></div>
                </div>
              </div>
            </div>

            <!-- 内容区域 (IFrame Container) -->
            <div class="w-full h-full bg-white overflow-y-auto no-scrollbar relative pt-11">
              <slot></slot>
            </div>

            <!-- 底部指示条 (Home Indicator) -->
            <div class="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-black/20 rounded-full z-50"></div>
          </div>

          <!-- 侧边按键 (Buttons) -->
          <div class="absolute top-[90px] -left-[2px] w-[3px] h-[22px] bg-[#3a3a3c] rounded-r-sm"></div>
          <div class="absolute top-[135px] -left-[2px] w-[3px] h-[45px] bg-[#3a3a3c] rounded-r-sm"></div>
          <div class="absolute top-[195px] -left-[2px] w-[3px] h-[45px] bg-[#3a3a3c] rounded-r-sm"></div>
          <div class="absolute top-[165px] -right-[2px] w-[3px] h-[75px] bg-[#3a3a3c] rounded-l-sm"></div>
        </div>

        <!-- 底部装饰阴影 -->
        <div class="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[80%] h-4 bg-black/10 blur-xl rounded-full pointer-events-none"></div>
      </div>

      <!-- 需求说明区域 (右侧) -->
      <div v-if="currentInfo" class="flex-1 max-w-xl animate-fade-in-right py-10">
        <div class="inline-flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-bold mb-6">
          <Target :size="14" />
          需求原型说明
        </div>
        
        <h2 class="text-4xl font-bold text-gray-900 mb-4 tracking-tight leading-tight">
          {{ currentInfo.title }}
        </h2>
        <p class="text-xl text-gray-500 mb-10 font-medium border-l-4 border-blue-600 pl-4">
          {{ currentInfo.subtitle }}
        </p>

        <div class="space-y-8">
          <div>
            <div class="flex items-center gap-2 text-gray-900 font-bold mb-4">
              <Layout :size="20" class="text-blue-600" />
              <span>功能逻辑说明</span>
            </div>
            <ul class="space-y-4">
              <li v-for="(item, index) in currentInfo.logic" :key="index" class="flex items-start gap-3 group">
                <div class="w-6 h-6 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {{ index + 1 }}
                </div>
                <span class="text-gray-600 leading-relaxed group-hover:text-gray-900 transition-colors">{{ item }}</span>
              </li>
            </ul>
          </div>

          <div class="pt-8 border-t border-gray-200">
            <div class="flex items-center gap-4">
              <button 
                @click="goHome"
                class="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-xl shadow-sm border border-gray-200 font-bold hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95"
              >
                <Home :size="18" />
                返回导航首页
              </button>
              <div class="flex items-center gap-2 text-gray-400 text-sm italic">
                <Info :size="16" />
                当前仅作为功能原型交互展示
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
  
  <!-- 非移动端页面直接显示 -->
  <div v-else>
    <slot></slot>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}
</style>
