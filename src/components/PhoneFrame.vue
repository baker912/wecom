<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { computed, ref, provide } from 'vue';
import { Home, Wifi, Signal, Info, Target, Layout } from 'lucide-vue-next';
import PrototypeCodeLocation from './PrototypeCodeLocation.vue';

const route = useRoute();
const router = useRouter();

// 定义动态补充说明的逻辑
const dynamicLogic = ref<string[]>([]);
provide('updateRequirementLogic', (logic: string[]) => {
  dynamicLogic.value = logic;
});

// 需求描述数据映射
const requirementInfoMap: Record<string, { title: string; subtitle: string; folderPath: string; logic: string[]; table?: any[] }> = {
  '/features/vin-tags': {
    title: '车辆信息标签按 VIN 码展示',
    subtitle: '核心需求：解决多辆车，有不同的车辆信息标签做区分展示的问题',
    folderPath: 'src/features/vin-tags-aggregation',
    logic: [
      '不同 VIN 可以下拉单选：支持通过下拉菜单精准切换客户名下的不同车辆 VIN。'
    ]
  },
  '/features/ai-analysis': {
    title: 'AI 智能分析功能',
    subtitle: '核心需求：利用大模型能力赋能销售跟进与话术优化',
    folderPath: 'src/features/ai-analysis',
    logic: [
      'AI 悬浮助手：底部常驻 AI 助手球，提供即时的业务咨询支持。'
    ]
  },
  '/content-library': {
    title: '内容库瀑布流改造',
    subtitle: '核心需求：瀑布流展示提升多图/长图浏览与内容触达效率',
    folderPath: 'src/features/content-library-waterfall',
    logic: [
      '瀑布流双列：内容以双列瀑布流方式展示，提升浏览效率。',
      '筛选抽屉：支持车系/创作者/内容类型/发布时间/排序方式筛选。',
      '内容详情：点击卡片查看详情，支持视频播放与互动入口。'
    ],
    table: [
      { type: '文章', title: '【标题】', cover: '【封面图】', content: '【文章正文】', radar: '是', other: '-' },
      { type: '海报', title: '【标题】', cover: '【上传图片】', content: '【描述】', radar: '是', other: '-' },
      { type: '图片', title: '【标题】', cover: '【上传图片】', content: '【描述】', radar: '是', other: '-' },
      { type: '视频', title: '【标题】', cover: '【封面图】', content: '【描述】', radar: '是', other: '【视频文件】' },
      { type: '文件', title: '【标题】', cover: '【封面图】', content: '【描述】', radar: '否', other: '【附件】' },
      { type: '链接', title: '【标题】', cover: '【封面图】', content: '【描述】', radar: '是', other: '【URL地址】' },
      { type: '小程序', title: '【标题】', cover: '【卡片图片】', content: '-', radar: '否', other: '【AppID/路径】' },
      { type: '纯文本', title: '【标题】', cover: '-', content: '【文本内容】', radar: '否', other: '-' },
      { type: '语音', title: '【语音标题】', cover: '-', content: '-', radar: '否', other: '【音频文件】' }
    ]
  },
  '/customer-profile': {
    title: '客户画像综合视图',
    subtitle: '核心需求：360度客户全景信息展示',
    folderPath: 'src/prototypes/customer-profile',
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
        <div class="relative w-[340px] h-[720px] sm:w-[400px] sm:h-[820px] bg-[#1c1c1e] rounded-[55px] p-[10px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5),0_30px_60px_-30px_rgba(0,0,0,0.6)] border-[1px] border-[#3a3a3c] flex items-center justify-center transition-transform duration-500 group-hover:scale-[1.01]">
          
          <!-- 内黑边 (Bezel) -->
          <div class="relative w-full h-full bg-black rounded-[46px] overflow-hidden border-[6px] border-[#000000] transform-gpu">
            
            <!-- 灵动岛 (Dynamic Island) -->
            <div class="absolute top-2 left-1/2 -translate-x-1/2 w-[100px] h-[28px] bg-black rounded-full z-50 flex items-center justify-center border-[1px] border-white/5 shadow-inner">
              <div class="w-2.5 h-2.5 bg-[#1a1a1a] rounded-full mr-2 shadow-inner"></div>
              <div class="w-1.5 h-1.5 bg-[#1a1a1a] rounded-full"></div>
            </div>

            <!-- 状态栏 (Status Bar) -->
            <div class="absolute top-0 left-0 w-full h-11 px-8 flex justify-between items-end pb-1.5 z-[1000] text-black select-none pointer-events-none">
              <span class="text-[12px] font-bold">{{ currentTime }}</span>
              <div class="flex items-center gap-1">
                <Signal :size="12" :strokeWidth="2.5" />
                <Wifi :size="12" :strokeWidth="2.5" />
                <div class="relative w-5 h-2.5 border-[1.5px] border-black rounded-[2px] flex items-center p-[1px]">
                  <div class="h-full bg-black rounded-[0.5px]" style="width: 85%"></div>
                  <div class="absolute -right-[3px] top-1/2 -translate-y-1/2 w-[1.5px] h-[3px] bg-black rounded-r-[0.5px]"></div>
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
      <div v-if="currentInfo" class="flex-1 min-w-0 max-w-[900px] animate-fade-in-right py-10">
        <div class="inline-flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-bold mb-6">
          <Target :size="14" />
          需求原型说明
        </div>
        
        <h2 class="text-3xl font-black text-gray-900 mb-4 tracking-tight leading-tight">
          {{ currentInfo.title }}
        </h2>
        <p class="text-lg text-gray-500 mb-10 font-medium border-l-4 border-blue-600 pl-4">
          {{ currentInfo.subtitle }}
        </p>

        <div class="mb-8">
          <PrototypeCodeLocation :folderPath="currentInfo.folderPath" />
        </div>

        <div class="space-y-8">
          <div>
            <div class="flex items-center gap-2 text-gray-900 font-bold mb-6">
              <Layout :size="20" class="text-blue-600" />
              <span class="text-lg">功能逻辑说明</span>
            </div>
            
            <!-- 9个素材类型对比表 - 简化设计，增加宽度 -->
            <div v-if="currentInfo.table && (!dynamicLogic || dynamicLogic.length === 0)" class="mb-8">
              <div class="flex items-center gap-2 mb-3 pl-1">
                <div class="w-1 h-4 bg-blue-600 rounded-full"></div>
                <span class="text-sm font-bold text-gray-700">素材字段映射明细表</span>
              </div>
              <div class="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                <div class="overflow-x-auto">
                  <table class="w-full text-left border-collapse table-auto">
                    <thead>
                      <tr class="bg-gray-50/50 border-b border-gray-100">
                        <th class="px-4 py-2.5 text-[12px] font-bold text-gray-900 whitespace-nowrap border-r border-gray-50 text-center">序号</th>
                        <th class="px-4 py-2.5 text-[12px] font-bold text-gray-900 whitespace-nowrap border-r border-gray-50">素材类型</th>
                        <th class="px-4 py-2.5 text-[12px] font-bold text-gray-900 whitespace-nowrap border-r border-gray-50">封面图</th>
                        <th class="px-4 py-2.5 text-[12px] font-bold text-gray-900 whitespace-nowrap border-r border-gray-50">内容</th>
                        <th class="px-4 py-2.5 text-[12px] font-bold text-gray-900 whitespace-nowrap border-r border-gray-50">雷达配置</th>
                        <th class="px-4 py-2.5 text-[12px] font-bold text-gray-900 whitespace-nowrap">补充内容</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                      <tr v-for="(row, idx) in currentInfo.table" :key="idx" 
                          class="hover:bg-blue-50/30 transition-colors group">
                        <td class="px-4 py-2 text-[12px] font-medium text-gray-400 whitespace-nowrap border-r border-gray-50 text-center">
                          {{ idx + 1 }}
                        </td>
                        <td class="px-4 py-2 text-[12px] font-bold text-gray-900 whitespace-nowrap border-r border-gray-50">
                          {{ row.type }}
                        </td>
                        <td class="px-4 py-2 text-[12px] text-black font-bold whitespace-nowrap border-r border-gray-50">
                          <span v-if="row.cover !== '-'" class="px-2 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100/50">{{ row.cover }}</span>
                          <span v-else class="text-blue-600/40 font-bold">-</span>
                        </td>
                        <td class="px-4 py-2 text-[12px] text-black font-bold whitespace-nowrap border-r border-gray-50">
                          <span v-if="row.content !== '-'" class="px-2 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100/50">{{ row.content }}</span>
                          <span v-else class="text-blue-600/40 font-bold">-</span>
                        </td>
                        <td class="px-4 py-2 text-[12px] text-black font-bold whitespace-nowrap border-r border-gray-50">
                          <span v-if="row.radar === '是'" class="px-2 py-0.5 rounded bg-green-50 text-green-600 border border-green-100/50">已配置</span>
                          <span v-else class="text-blue-600/40 font-bold">-</span>
                        </td>
                        <td class="px-4 py-2 text-[12px] text-black font-bold whitespace-nowrap">
                          <span v-if="row.other !== '-'" class="px-2 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100/50">{{ row.other }}</span>
                          <span v-else class="text-blue-600/40 font-bold">-</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <ul class="space-y-4">
              <!-- 基础逻辑 (在进入详情页展示字段映射时隐藏) -->
              <template v-if="dynamicLogic.length === 0">
                <li v-for="(item, index) in currentInfo.logic" :key="index" class="flex items-start gap-3 group text-gray-600">
                  <div class="w-6 h-6 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    {{ index + 1 }}
                  </div>
                  <div class="flex-1">
                    <span class="leading-relaxed group-hover:text-gray-900 transition-colors">{{ item }}</span>
                  </div>
                </li>
              </template>

              <!-- 动态补充逻辑 (进入详情页后唯一展示) -->
              <li v-for="(item, index) in dynamicLogic" :key="'dynamic-' + index" class="flex items-start gap-3 group animate-fade-in-right">
                <div class="w-6 h-6 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {{ index + 1 }}
                </div>
                <div class="flex-1">
                   <span class="text-indigo-600 font-bold leading-relaxed">
                     {{ item.includes('字段映射') ? '字段映射' : item }}
                   </span>
                   
                   <!-- 可视化连线映射 (根据内容动态渲染) -->
                  <div v-if="item.includes('字段映射')" class="mt-4 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 space-y-3">
                    <!-- 封面图映射 (如果有) -->
                    <div v-if="item.includes('封面图对应')" class="flex items-center gap-3">
                      <div class="px-2 py-1 bg-indigo-600 text-white text-[12px] font-bold rounded">前端封面</div>
                      <div class="flex-1 flex items-center gap-1 opacity-30">
                        <div class="h-[1px] flex-1 border-t border-dashed border-indigo-600"></div>
                        <div class="w-1 h-1 rounded-full bg-indigo-600"></div>
                      </div>
                      <div class="text-[12px] text-indigo-600 font-black tracking-tight">
                        {{ item.match(/封面图对应后台.*?【(.*?)】/)?.[1] ? `后台上传的【${item.match(/封面图对应后台.*?【(.*?)】/)?.[1]}】` : '后台配置' }}
                      </div>
                    </div>
                    
                    <div class="flex items-center gap-3">
                      <div class="px-2 py-1 bg-indigo-600 text-white text-[12px] font-bold rounded">前端标题</div>
                      <div class="flex-1 flex items-center gap-1 opacity-30">
                        <div class="h-[1px] flex-1 border-t border-dashed border-indigo-600"></div>
                        <div class="w-1 h-1 rounded-full bg-indigo-600"></div>
                      </div>
                      <div class="text-[12px] text-indigo-600 font-black tracking-tight">
                        {{ item.match(/标题对应后台.*?【(.*?)】/)?.[1] ? `后台配置的【${item.match(/标题对应后台.*?【(.*?)】/)?.[1]}】` : '后台配置' }}
                      </div>
                    </div>
                    <div class="flex items-center gap-3">
                      <div class="px-2 py-1 bg-indigo-600 text-white text-[12px] font-bold rounded">前端内容</div>
                      <div class="flex-1 flex items-center gap-1 opacity-30">
                        <div class="h-[1px] flex-1 border-t border-dashed border-indigo-600"></div>
                        <div class="w-1 h-1 rounded-full bg-indigo-600"></div>
                      </div>
                      <div class="text-[12px] text-indigo-600 font-black tracking-tight">
                        {{ item.match(/内容对应后台.*?【(.*?)】/)?.[1] ? `后台配置的【${item.match(/内容对应后台.*?【(.*?)】/)?.[1]}】` : '后台配置' }}
                      </div>
                    </div>

                    <!-- 链接地址映射 (针对链接类型) -->
                    <div v-if="item.includes('链接地址对应')" class="flex items-center gap-3">
                      <div class="px-2 py-1 bg-indigo-600 text-white text-[12px] font-bold rounded shadow-sm">前端链接</div>
                      <div class="flex-1 flex items-center gap-1 opacity-20">
                        <div class="h-[1px] flex-1 border-t border-dashed border-indigo-600"></div>
                        <div class="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
                      </div>
                      <div class="text-[13px] text-indigo-700 font-bold tracking-tight">
                        {{ item.match(/链接地址对应后台.*?【(.*?)】/)?.[1] ? `后台配置的【${item.match(/链接地址对应后台.*?【(.*?)】/)?.[1]}】` : '后台配置' }}
                      </div>
                    </div>
                  </div>
                </div>
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

@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slide-in {
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
}

.animate-fade-in {
  animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-slide-in {
  animation: slide-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-fade-in-right {
  animation: slide-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
