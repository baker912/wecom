<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Users, ChevronRight, Calendar, Clock, Image, Smartphone, Monitor, FileText, Sparkles, Database, Play, LayoutGrid } from 'lucide-vue-next';
import { computed } from 'vue';

const router = useRouter();

const navigateTo = (path: string) => {
  router.push(path);
};

// Mock Data
const sprints = [
  {
    name: 'Sprint 4',
    dateRange: '2026/03/01 - 2026/03/19',
    status: '测试中',
    statusColor: 'bg-amber-50 text-amber-600 border border-amber-100',
    targetDate: '2026-03-19',
    requirements: [
      {
        id: 'REQ-SPRINT4-01',
        title: '三系统经销商数据同步',
        module: '后端',
        progress: 100,
        status: '原型设计完成',
        icon: Database,
        link: '/features/wecom-sop-sync'
      }
    ]
  },
  {
    name: 'Sprint 5',
    dateRange: '2026/03/20 - 2026/04/09',
    status: '进行中',
    statusColor: 'bg-blue-50 text-blue-600 border border-blue-100',
    targetDate: '2026-04-09',
    requirements: [
      {
        id: 'REQ-SPRINT5-01',
        title: '车辆信息标签按VIN码展示',
        module: '移动端',
        progress: 100,
        status: '原型设计完成',
        icon: FileText,
        link: '/features/vin-tags'
      },
      {
        id: 'REQ-SPRINT5-02',
        title: 'AI智能分析功能',
        module: '移动端',
        progress: 100,
        status: '原型设计完成',
        icon: Sparkles,
        link: '/features/ai-analysis'
      }
    ]
  },
  {
    name: 'Sprint 6',
    dateRange: '2026/04/10 - 2026/04/23',
    status: '规划中',
    statusColor: 'bg-gray-50 text-gray-500 border border-gray-200',
    targetDate: '2026-04-23',
    requirements: []
  },
  {
    name: 'Sprint 7',
    dateRange: '2026/04/24 - 2026/05/07',
    status: '规划中',
    statusColor: 'bg-gray-50 text-gray-500 border border-gray-200',
    targetDate: '2026-05-07',
    requirements: []
  },
  {
    name: 'Sprint 8',
    dateRange: '2026/05/08 - 2026/05/21',
    status: '规划中',
    statusColor: 'bg-gray-50 text-gray-500 border border-gray-200',
    targetDate: '2026-05-21',
    requirements: []
  }
];

const milestones = [
  { date: '2026-03-19', label: 'Sprint 4 发布', color: 'bg-amber-500', sprintName: 'Sprint 4' },
  { date: '2026-04-09', label: 'Sprint 5 发布', color: 'bg-blue-500', sprintName: 'Sprint 5' },
  { date: '2026-04-23', label: 'Sprint 6 发布', color: 'bg-gray-400', sprintName: 'Sprint 6' },
  { date: '2026-05-07', label: 'Sprint 7 发布', color: 'bg-gray-400', sprintName: 'Sprint 7' },
  { date: '2026-05-21', label: 'Sprint 8 发布', color: 'bg-gray-400', sprintName: 'Sprint 8' }
];

const todayInfo = computed(() => {
  const today = new Date();
  const todayStr = `2026-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
  
  // 找到下一个里程碑
  const futureMilestones = milestones.filter(m => m.date >= todayStr);
  const nextMilestone = futureMilestones.length > 0 ? futureMilestones[0] : null;
  
  let daysUntilNext = 0;
  if (nextMilestone) {
    const nextDate = new Date(nextMilestone.date);
    const timeDiff = nextDate.getTime() - today.getTime();
    daysUntilNext = Math.ceil(timeDiff / (1000 * 3600 * 24));
  }
  
  return {
    todayStr,
    todayDate: today.getDate(),
    todayMonth: today.getMonth() + 1,
    nextMilestone,
    daysUntilNext
  };
});

const calendarDays = computed(() => {
  // 直接显示所有Sprint里程碑，而不是只显示未来5天
  const today = new Date();
  const todayStr = todayInfo.value.todayStr;
  
  return milestones.map(milestone => {
    const milestoneDate = new Date(milestone.date);
    const isToday = milestone.date === todayStr;
    const isPast = milestoneDate < today;
    
    return {
      ...milestone,
      type: isToday ? 'today' : 'milestone',
      day: milestoneDate.getDate(),
      month: milestoneDate.getMonth() + 1,
      isPast: isPast,
      isToday: isToday
    };
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
});
const scrollToSprint = (sprintName: string) => {
  const element = document.querySelector(`[data-sprint='${sprintName}']`);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-[#F5F5F7] to-[#E8EAF6] flex flex-col p-6 relative overflow-hidden">
    
    <!-- 装饰背景 -->
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
      <div class="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] bg-gradient-to-br from-blue-100/40 to-transparent rounded-full blur-3xl opacity-60"></div>
      <div class="absolute top-[20%] -left-[10%] w-[600px] h-[600px] bg-gradient-to-tr from-purple-100/40 to-transparent rounded-full blur-3xl opacity-50"></div>
      <div class="absolute bottom-[-10%] right-[20%] w-[500px] h-[500px] bg-gradient-to-t from-gray-200/30 to-transparent rounded-full blur-3xl opacity-40"></div>
    </div>

    <!-- 顶部布局：左侧标题区 + 右侧应用入口区 -->
    <div class="w-full max-w-full px-8 lg:px-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-12 mb-6 relative z-10 pt-4">
      
      <div class="animate-fade-in-down max-w-2xl">
        <div class="flex items-center gap-4 mb-3">
          <div class="inline-flex items-center justify-center w-14 h-14 bg-white rounded-2xl shadow-lg border border-white/60">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="32" height="32">
              <path fill="#1890FF" d="M24,6C12.954,6,4,13.611,4,23c0,4.86,2.41,9.227,6.236,12.235c0.559,0.44,0.923,1.106,0.923,1.829 c0,1.21-0.287,3.159-0.998,5.163c-0.129,0.363,0.187,0.723,0.551,0.627c2.615-0.686,5.551-1.956,7.542-3.238 c0.548-0.353,1.203-0.491,1.848-0.385C21.284,39.426,22.628,39.5,24,39.5c11.046,0,20-7.611,20-17S35.046,6,24,6z M16.5,26 c-1.381,0-2.5-1.119-2.5-2.5s1.119-2.5,2.5-2.5s2.5,1.119,2.5,2.5S17.881,26,16.5,26z M31.5,26c-1.381,0-2.5-1.119-2.5-2.5 s1.119-2.5,2.5-2.5s2.5,1.119,2.5,2.5S32.881,26,31.5,26z"/>
            </svg>
          </div>
          <h1 class="text-3xl font-bold text-gray-900 tracking-tight">奥迪企业微信原型方案</h1>
        </div>
        <p class="text-gray-500 text-sm font-medium tracking-wide pl-1">仅展示核心功能原型</p>
      </div>

      <!-- 右侧：核心入口卡片 (Expanded) -->
      <div class="flex gap-4">
        <!-- 移动端入口集合 -->
        <div class="bg-white/80 backdrop-blur-md rounded-xl p-1 shadow-sm border border-white/60 flex flex-col w-64">
          <div class="flex items-center gap-2 px-3 py-2 border-b border-gray-100/80">
            <Smartphone :size="14" class="text-blue-600" />
            <h2 class="text-xs font-bold text-gray-900">客户端侧边栏应用</h2>
          </div>
          <div class="grid grid-cols-2 gap-1 p-1">
            <button @click="navigateTo('/customer-profile')" class="flex items-center gap-2 hover:bg-blue-50 rounded-lg px-2 py-1.5 transition-colors group text-left">
              <div class="w-6 h-6 bg-blue-100 rounded flex items-center justify-center shrink-0">
                <Users :size="12" class="text-blue-600" />
              </div>
              <div>
                <h3 class="text-xs font-bold text-gray-800">客户画像</h3>
              </div>
            </button>
            <button @click="navigateTo('/content-library')" class="flex items-center gap-2 hover:bg-purple-50 rounded-lg px-2 py-1.5 transition-colors group text-left">
              <div class="w-6 h-6 bg-purple-100 rounded flex items-center justify-center shrink-0">
                <Image :size="12" class="text-purple-600" />
              </div>
              <div>
                <h3 class="text-xs font-bold text-gray-800">内容库</h3>
              </div>
            </button>
          </div>
        </div>

        <!-- PC端入口 -->
        <button 
          @click="navigateTo('/wecom-sop')"
          class="bg-white/80 backdrop-blur-md rounded-xl p-1 shadow-sm border border-white/60 flex flex-col w-48 hover:shadow-md transition-all group text-left"
        >
          <div class="flex items-center gap-2 px-3 py-2 border-b border-gray-100/80 w-full">
            <Monitor :size="14" class="text-[#e53935]" />
            <h2 class="text-xs font-bold text-gray-900">PC端后台</h2>
          </div>
          <div class="flex-1 flex flex-col items-center justify-center p-2">
            <div class="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
              <LayoutGrid :size="16" class="text-[#e53935]" />
            </div>
            <span class="text-[10px] font-bold text-gray-600 group-hover:text-[#e53935] transition-colors">进入后台</span>
          </div>
        </button>
      </div>
    </div>

    <!-- 迭代日历与需求列表 (Expanded to fill space) -->
    <div class="w-full max-w-full px-8 lg:px-16 grid grid-cols-1 lg:grid-cols-4 gap-4 relative z-10 flex-1">
      
      <!-- 左侧：关键里程碑日历 -->
      <div class="lg:col-span-1 bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-white/60 h-fit">
        <div class="flex items-center gap-2 mb-6">
          <Calendar :size="20" class="text-gray-700" />
          <h3 class="text-base font-bold text-gray-800">关键里程碑</h3>
        </div>
        
        <!-- 今天信息卡片 -->
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-6 border border-blue-100">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock :size="16" class="text-blue-600" />
            </div>
            <div class="flex-1">
              <div class="text-sm font-bold text-gray-800">今天是 {{ todayInfo.todayMonth }}月{{ todayInfo.todayDate }}日</div>
              <div v-if="todayInfo.nextMilestone" class="text-xs text-gray-600 mt-1">
                距离 {{ todayInfo.nextMilestone.label }} 还有 <span class="font-bold text-blue-600">{{ todayInfo.daysUntilNext }}</span> 天
              </div>
              <div v-else class="text-xs text-gray-500 mt-1">暂无后续里程碑</div>
            </div>
          </div>
        </div>
        
        <div class="space-y-4">
          <div v-for="(item, index) in calendarDays" :key="index" 
               class="bg-white/60 rounded-xl p-4 border border-white/80 transition-all hover:shadow-sm"
               :class="{ 'ring-2 ring-blue-200': item.isToday, 'opacity-60': item.isPast }">
            
            <!-- 里程碑头部 -->
            <div class="flex items-center gap-3 mb-3">
              <div :class="`w-3 h-3 rounded-full ${item.color}`"></div>
              <div class="flex-1">
                <div class="flex items-center gap-2">
                  <span class="text-sm font-bold text-gray-800">{{ item.label }}</span>
                  <span v-if="item.isToday" class="text-xs bg-gray-800 text-white px-2 py-0.5 rounded-full">今天</span>
                  <span v-else-if="item.isPast" class="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">已发布</span>
                </div>
                <div class="text-xs text-gray-500">{{ item.date }}</div>
              </div>
            </div>
            
            <!-- 对应Sprint的需求预览 -->
            <div class="space-y-2">
              <div v-for="sprint in sprints.filter(s => s.targetDate === item.date)" :key="sprint.name" class="space-y-1">
                <div v-if="sprint.requirements.length === 0" class="text-xs text-gray-400 text-center py-2">
                  暂无具体需求
                </div>
                <div v-else>
                  <div v-for="req in sprint.requirements.slice(0, 2)" :key="req.id" 
                       class="flex items-center gap-2 text-xs text-gray-600 bg-gray-50/80 rounded-lg px-2 py-1.5">
                    <component :is="req.icon" :size="12" class="text-gray-400 shrink-0" />
                    <span class="truncate">{{ req.title }}</span>
                  </div>
                  <div v-if="sprint.requirements.length > 2" class="text-xs text-gray-400 pl-2">
                    +{{ sprint.requirements.length - 2 }} 更多需求
                  </div>
                </div>
              </div>
              
              <!-- 如果没有对应的Sprint，显示提示 -->
              <div v-if="!sprints.find(s => s.targetDate === item.date)" class="text-xs text-gray-400 text-center py-2">
                暂无Sprint数据
              </div>
            </div>
            
            <!-- 查看详情按钮 -->
            <div v-if="sprints.find(s => s.targetDate === item.date && s.requirements.length > 0)" class="mt-3 pt-2 border-t border-gray-100">
              <button @click="scrollToSprint(item.sprintName)"
                      class="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 w-full justify-center">
                <span>查看详情</span>
                <ChevronRight :size="12" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：Sprint 详情 (Wider) -->
      <div class="lg:col-span-3 space-y-3">
        <div v-for="sprint in sprints" :key="sprint.name" :data-sprint="sprint.name" class="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-white/60 hover:shadow-md transition-shadow">
          <!-- Sprint Header -->
          <div class="flex justify-between items-start mb-5">
            <div>
              <div class="flex items-center gap-2.5 mb-1.5">
                <h3 class="font-bold text-xl text-gray-900">{{ sprint.name }}</h3>
                <span :class="`px-2.5 py-0.5 rounded text-xs font-bold ${sprint.statusColor}`">{{ sprint.status }}</span>
              </div>
              <p class="text-sm text-gray-400 font-mono">{{ sprint.dateRange }}</p>
            </div>
            <div class="text-right">
              <div class="flex items-center gap-1.5 text-xs text-gray-500 font-medium bg-gray-50/80 px-3 py-1.5 rounded">
                <Clock :size="14" />
                <span>发布日：{{ sprint.targetDate }}</span>
              </div>
            </div>
          </div>

          <!-- Requirements List -->
          <div class="space-y-3">
            <div v-for="req in sprint.requirements" :key="req.id" class="flex items-center gap-4 p-4 rounded-xl bg-gray-50/50 border border-gray-100 hover:border-gray-200 transition-colors group/req">
              <div class="w-11 h-11 rounded-lg bg-white flex items-center justify-center shadow-sm shrink-0">
                <component :is="req.icon" :size="20" class="text-blue-600" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex justify-between items-center mb-1.5">
                  <h4 class="text-base font-bold text-gray-800 truncate">{{ req.title }}</h4>
                  <span class="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded border border-green-100">{{ req.status }}</span>
                </div>
              </div>
              
              <!-- Action Button -->
              <button 
                @click="navigateTo(req.link)"
                class="flex items-center gap-2 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-6 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 ml-2 shrink-0 group/btn"
              >
                <Play :size="14" fill="currentColor" class="group-hover/btn:translate-x-0.5 transition-transform" />
                <span>查看原型</span>
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.animate-fade-in-down {
  animation: fadeInDown 0.8s ease-out;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
