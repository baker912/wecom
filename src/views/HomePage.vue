<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Users, Calendar, Clock, Image, Smartphone, Monitor, FileText, Sparkles, Database, Play, LayoutGrid, Info, Filter, CheckCircle2, History, ShieldCheck, Target, MessageSquare, ChevronDown, ChevronUp } from 'lucide-vue-next';
import { computed, ref } from 'vue';

const router = useRouter();

// Sprint Accordion Logic
const expandedSprint = ref<string | null>('Sprint 6'); // 默认展开第一个

const toggleSprint = (sprintName: string) => {
  if (expandedSprint.value === sprintName) {
    expandedSprint.value = null;
  } else {
    expandedSprint.value = sprintName;
  }
};

const isSprintExpanded = (sprintName: string) => expandedSprint.value === sprintName;

// Toast Logic
const showToast = ref(false);
const toastMessage = ref('');
let toastTimer: any = null;

const toast = (message: string) => {
  toastMessage.value = message;
  showToast.value = true;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    showToast.value = false;
  }, 2000);
};

// Filters & Navigation
const selectedRequirementStatus = ref('全部');
const requirementStatuses = ['全部', '设计中', '设计完成', '开发中', '测试中', '已发版'];

const navigateTo = (path: string) => {
  if (path === '/content-library') {
    toast('正在开发中');
    return;
  }
  router.push(path);
};

const handleRequirementClick = (req: any) => {
  if (req.id.startsWith('REQ-SPRINT4')) {
    toast('本需求暂无原型设计');
    return;
  }
  navigateTo(req.link);
};

// Mock Data - Milestones
const milestones = [
  { date: '2026-03-19', label: 'Sprint 4 发布', color: 'bg-amber-500', sprintName: 'Sprint 4' },
  { date: '2026-04-09', label: 'Sprint 5 发布', color: 'bg-blue-500', sprintName: 'Sprint 5' },
  { date: '2026-04-23', label: 'Sprint 6 发布', color: 'bg-gray-400', sprintName: 'Sprint 6' },
  { date: '2026-05-07', label: 'Sprint 7 发布', color: 'bg-gray-400', sprintName: 'Sprint 7' },
  { date: '2026-05-21', label: 'Sprint 8 发布', color: 'bg-gray-400', sprintName: 'Sprint 8' }
];

// 今天的信息和倒计时计算
const todayInfo = computed(() => {
  const now = new Date();
  const todayStr = `2026-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  
  // 找到最近的下一个发版日（不包括已过去的）
  const upcomingMilestones = milestones
    .map(m => ({ ...m, dateObj: new Date(m.date) }))
    .filter(m => m.date >= todayStr)
    .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());
    
  const nextMilestone = upcomingMilestones.length > 0 ? upcomingMilestones[0] : null;
  let daysUntilNext = 0;
  
  if (nextMilestone) {
    const nextDate = new Date(nextMilestone.date);
    const timeDiff = nextDate.getTime() - now.getTime();
    daysUntilNext = Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  return {
    todayStr,
    todayDate: now.getDate(),
    todayMonth: now.getMonth() + 1,
    nextMilestone,
    daysUntilNext: Math.max(0, daysUntilNext)
  };
});

// 计算所有里程碑的详细信息，包含距离今天的天数和进度
const calendarDays = computed(() => {
  const todayStr = todayInfo.value.todayStr;
  const today = new Date(todayStr);

  const statusWeights: Record<string, number> = {
    '设计中': 0,
    '设计完成': 33,
    '开发中': 66,
    '测试中': 85,
    '已发版': 100
  };

  return milestones.map(milestone => {
    const milestoneDate = new Date(milestone.date);
    const isToday = milestone.date === todayStr;
    const isPast = milestoneDate < today;
    
    // 计算距离今天的天数
    const diffTime = milestoneDate.getTime() - today.getTime();
    const remainingDays = Math.ceil(diffTime / (1000 * 3600 * 24));
    
    // 计算进度条：根据该 Sprint 内所有需求的状态权重平均值计算
    const sprint = sprints.value.find(s => s.name === milestone.sprintName);
    let progress = 0;
    if (sprint && sprint.requirements.length > 0) {
      const totalWeight = sprint.requirements.reduce((acc, req) => {
        return acc + (statusWeights[req.status] || 0);
      }, 0);
      progress = totalWeight / sprint.requirements.length;
    } else if (isPast) {
      progress = 100; // 过去的里程碑如果没有需求，默认 100%
    }
    
    return {
      ...milestone,
      day: milestoneDate.getDate(),
      month: milestoneDate.getMonth() + 1,
      isPast,
      isToday,
      remainingDays,
      isUpcoming: !isPast && !isToday,
      progress: Math.round(progress)
    };
  });
});

const sprints = ref([
  {
    name: 'Sprint 4',
    dateRange: '2026/03/01 - 2026/03/19',
    status: '已发版',
    statusColor: 'bg-blue-50 text-blue-600 border border-blue-100',
    targetDate: '2026-03-19',
    requirements: [
      {
        id: 'REQ-SPRINT4-01',
        title: '安全工单',
        module: '自建平台',
        progress: 35,
        status: '已发版',
        misId: 'MISMS20260304155247',
        misStatus: '需求实施中',
        version: 'v1.0.0',
        isExternalPrototype: false,
        icon: ShieldCheck,
        link: '',
        description: '1、3个月密码到期强制修改；2、输错5次以上密码后锁定更新密码；'
      },
      {
        id: 'REQ-SPRINT4-02',
        title: '邀约活动埋点',
        module: '自建平台',
        progress: 40,
        status: '已发版',
        misId: 'MISMS20260306173640',
        misStatus: '需求确认中',
        version: 'v1.0.1',
        isExternalPrototype: false,
        icon: Target,
        link: '',
        description: '邀约活动埋点监控与统计'
      },
      {
        id: 'REQ-SPRINT4-03',
        title: '售后自动消息推送',
        module: '自建平台',
        progress: 30,
        status: '已发版',
        misId: 'MISMS20260227165123',
        misStatus: '需求实施中',
        version: 'v1.0.0',
        isExternalPrototype: false,
        icon: MessageSquare,
        link: '',
        description: '售后自动消息推送场景，执行情况统计&入湖'
      },
      {
        id: 'REQ-SPRINT4-04',
        title: '素材详情优化',
        module: '客户端',
        progress: 55,
        status: '已发版',
        misId: 'MISMS20260129102608',
        misStatus: '产品设计中',
        version: 'v1.1.0',
        isExternalPrototype: false,
        icon: Image,
        link: '',
        description: '1、sop批量开启&关闭；2、素材埋点交互优化；3、富文本编辑器适配'
      },
      {
        id: 'REQ-SPRINT4-05',
        title: '三系统经销商数据同步',
        module: '自建平台',
        progress: 45,
        status: '已发版',
        misId: 'MISMS20260313100859',
        misStatus: '需求确认中',
        version: 'v1.2.0',
        isExternalPrototype: true,
        icon: Database,
        link: 'https://external-proto.audi.cn/dealer-data',
        description: '店端维度：离职员工自动继承好友关系；同EP一致，更新车系名称；'
      }
    ]
  },
  {
    name: 'Sprint 5',
    dateRange: '2026/03/20 - 2026/04/09',
    status: '进行中',
    statusColor: 'bg-blue-50 text-blue-600 border border-blue-100',
    targetDate: '2026-04-09',
    requirements: []
  },
  {
    name: 'Sprint 6',
    dateRange: '2026/04/10 - 2026/04/23',
    status: '规划中',
    statusColor: 'bg-gray-50 text-gray-500 border border-gray-200',
    targetDate: '2026-04-23',
    requirements: [
      {
        id: 'REQ-SPRINT6-01',
        title: '车辆信息标签按VIN码展示',
        module: '客户端',
        progress: 100,
        status: '设计完成',
        misId: 'MISMS20260311112047',
        misStatus: '产品设计中',
        version: 'v2.0.1',
        isExternalPrototype: false,
        icon: FileText,
        link: '/features/vin-tags',
        description: '在移动端客户画像中，支持按VIN码维度聚合展示车辆信息标签'
      },
      {
        id: 'REQ-SPRINT6-02',
        title: 'AI智能分析功能',
        module: '客户端',
        progress: 80,
        status: '设计完成',
        misId: 'MISMS20260310163158',
        misStatus: '需求实施中',
        version: 'v1.5.4',
        isExternalPrototype: false,
        icon: Sparkles,
        link: '/features/ai-analysis',
        description: '基于大模型能力，为经销商提供客户沟通话术建议及画像深度解析'
      }
    ]
  },
  {
    name: 'Sprint 7',
    dateRange: '2026/04/24 - 2026/05/07',
    status: '规划中',
    statusColor: 'bg-gray-50 text-gray-500 border border-gray-200',
    targetDate: '2026-05-07',
    requirements: [
      {
        id: 'REQ-SPRINT7-01',
        title: '人群包管理',
        module: '自建平台',
        progress: 0,
        status: '设计中',
        misId: 'MISMS20260311111749',
        misStatus: '产品设计中',
        version: 'v1.0.0',
        isExternalPrototype: false,
        icon: Users,
        link: '/features/audience-package',
        description: '通过调用cdp标签和属性值圈选人群包触发sop，支持全量cdp客户标签和时间等属性值圈选；'
      }
    ]
  },
  {
    name: 'Sprint 8',
    dateRange: '2026/05/08 - 2026/05/21',
    status: '规划中',
    statusColor: 'bg-gray-50 text-gray-500 border border-gray-200',
    targetDate: '2026-05-21',
    requirements: []
  }
]);

const filteredSprints = computed(() => {
  return sprints.value.map(sprint => {
    const filteredRequirements = sprint.requirements.filter(req => {
      const statusMatch = selectedRequirementStatus.value === '全部' || req.status === selectedRequirementStatus.value;
      return statusMatch;
    });

    // 计算统计数据
    const total = sprint.requirements.length;
    const planningCount = sprint.requirements.filter(r => r.status === '设计中').length;
    const devCount = sprint.requirements.filter(r => r.status === '开发中').length;
    const testingCount = sprint.requirements.filter(r => r.status === '测试中').length;
    const designCount = sprint.requirements.filter(r => r.status === '设计完成').length;
    const onlineCount = sprint.requirements.filter(r => r.status === '已发版').length;

    return {
      ...sprint,
      requirements: filteredRequirements,
      stats: {
        total,
        planningCount,
        devCount,
        testingCount,
        designCount,
        onlineCount
      }
    };
  }).filter(sprint => sprint.requirements.length > 0 || selectedRequirementStatus.value === '全部');
});

const scrollToSprint = (sprintName: string) => {
  // 如果该 Sprint 未展开，则展开它
  if (!isSprintExpanded(sprintName)) {
    toggleSprint(sprintName);
  }
  
  // 延迟一小会儿等待 DOM 更新后再滚动
  setTimeout(() => {
    const element = document.querySelector(`[data-sprint='${sprintName}']`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, 100);
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
        <p class="text-gray-500 text-sm font-medium tracking-wide pl-1">展示部分功能原型及进行简单的需求进度跟踪，系统持续优化中</p>
      </div>

      <!-- 右侧：核心入口卡片 (Expanded) -->
      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2 px-1">
          <Sparkles :size="14" class="text-blue-600" />
          <span class="text-xs font-bold text-gray-500 tracking-wider">快捷入口</span>
        </div>
        <div class="flex gap-4">
          <!-- 客户端入口 -->
          <div class="bg-white/80 backdrop-blur-md rounded-2xl p-1.5 shadow-sm border border-white/60 flex flex-col w-64 transition-all hover:shadow-md">
            <div class="flex items-center gap-2 px-3 py-2 border-b border-gray-100/80 mb-1">
              <Smartphone :size="14" class="text-orange-500" />
              <h2 class="text-xs font-bold text-gray-900">客户端</h2>
            </div>
            <div class="grid grid-cols-2 gap-1.5 p-1">
              <button @click="navigateTo('/customer-profile')" class="flex items-center gap-2 hover:bg-orange-50 rounded-xl px-2 py-2 transition-all group text-left border border-transparent hover:border-orange-100">
                <div class="w-7 h-7 bg-orange-100 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Users :size="14" class="text-orange-600" />
                </div>
                <h3 class="text-xs font-bold text-gray-800 group-hover:text-orange-600 transition-colors">客户画像</h3>
              </button>
              <button @click="navigateTo('/content-library')" class="flex items-center gap-2 hover:bg-orange-50 rounded-xl px-2 py-2 transition-all group text-left border border-transparent hover:border-orange-100">
                <div class="w-7 h-7 bg-orange-100 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Image :size="14" class="text-orange-600" />
                </div>
                <h3 class="text-xs font-bold text-gray-800 group-hover:text-orange-600 transition-colors">内容库</h3>
              </button>
            </div>
          </div>

          <!-- 自建平台入口 -->
          <button 
            @click="navigateTo('/wecom-sop')"
            class="bg-white/80 backdrop-blur-md rounded-2xl p-1.5 shadow-sm border border-white/60 flex flex-col w-64 hover:shadow-md transition-all group text-left border border-transparent hover:border-blue-100"
          >
            <div class="flex items-center gap-2 px-3 py-2 border-b border-gray-100/80 w-full mb-1">
              <Monitor :size="14" class="text-blue-500" />
              <h2 class="text-xs font-bold text-gray-900">自建平台</h2>
            </div>
            <div class="p-1">
              <div class="grid grid-cols-2 gap-1.5">
                <div class="col-span-2 justify-self-center w-[calc((100%-0.375rem)/2)] flex items-center gap-2 hover:bg-blue-50 rounded-xl px-2 py-2 transition-all text-left border border-transparent hover:border-blue-100">
                  <div class="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <LayoutGrid :size="14" class="text-blue-600" />
                  </div>
                  <h3 class="text-xs font-bold text-gray-800 group-hover:text-blue-600 transition-colors whitespace-nowrap">进入管理后台</h3>
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- 迭代日历与需求列表 (Expanded to fill space) -->
    <div class="w-full max-w-full px-8 lg:px-16 grid grid-cols-1 lg:grid-cols-4 gap-4 relative z-10 flex-1">
      
      <!-- 左侧：关键里程碑 (Refined Calendar Style) -->
      <div class="lg:col-span-1 space-y-4">
        
        <!-- 今日概览 (New Section) -->
        <div class="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 shadow-lg border border-white/20 text-white relative overflow-hidden group">
          <div class="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
            <Clock :size="120" />
          </div>
          <div class="relative z-10">
            <div class="flex items-center gap-2 mb-4 opacity-80">
              <Calendar :size="16" />
              <span class="text-xs font-bold tracking-wider">今日概览</span>
            </div>
            <div class="flex items-baseline gap-2 mb-1">
              <span class="text-4xl font-black tabular-nums">{{ todayInfo.todayMonth }}</span>
              <span class="text-xl font-bold opacity-60">月</span>
              <span class="text-4xl font-black tabular-nums">{{ todayInfo.todayDate }}</span>
              <span class="text-xl font-bold opacity-60">日</span>
            </div>
            <p class="text-xs font-medium opacity-70 mb-6">今天是 {{ todayInfo.todayStr }}</p>
            
            <div v-if="todayInfo.nextMilestone" class="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <div class="text-[10px] font-bold opacity-60 uppercase tracking-widest mb-1">距离下一个发版日</div>
              <div class="flex items-center justify-between">
                <div class="flex items-baseline gap-1">
                  <span class="text-3xl font-black tabular-nums">{{ todayInfo.daysUntilNext }}</span>
                  <span class="text-sm font-bold opacity-80">天</span>
                </div>
                <div class="text-right">
                  <div class="text-[10px] font-black bg-white/20 px-2 py-0.5 rounded-full mb-1">{{ todayInfo.nextMilestone.label }}</div>
                  <div class="text-[10px] opacity-60">{{ todayInfo.nextMilestone.date }}</div>
                </div>
              </div>
            </div>
            <div v-else class="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <p class="text-xs font-bold opacity-80 text-center">当前暂无后续发版计划</p>
            </div>
          </div>
        </div>

        <!-- 发布日历 Timeline Card -->
        <div class="bg-white/60 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-white/60">
          <div class="flex items-center justify-between mb-8">
            <div class="flex items-center gap-2.5 text-gray-900">
              <div class="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
                <Calendar :size="18" class="text-blue-600" />
              </div>
              <h2 class="text-lg font-black tracking-tight">发布日历</h2>
            </div>
          </div>
          
          <div class="space-y-10 relative">
            <!-- Background Timeline Line -->
            <div class="absolute left-[23px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-blue-100 via-gray-100 to-transparent"></div>

            <div v-for="item in calendarDays" :key="item.date" 
              class="relative flex items-start gap-5 group cursor-pointer transition-all duration-300" 
              :class="[isSprintExpanded(item.sprintName) ? 'scale-[1.02] translate-x-1' : 'opacity-70 hover:opacity-100']"
              @click="scrollToSprint(item.sprintName)"
            >
              <!-- Calendar Block -->
              <div class="relative z-10 flex flex-col items-center shrink-0">
                <div 
                  class="w-12 h-14 bg-white rounded-2xl shadow-sm border flex flex-col overflow-hidden transition-all duration-300 group-hover:shadow-md"
                  :class="[
                    isSprintExpanded(item.sprintName) 
                      ? 'ring-2 ring-blue-500/50 border-blue-500 shadow-blue-100/50 scale-110' 
                      : 'border-gray-100 group-hover:border-blue-200 group-hover:-translate-y-0.5'
                  ]"
                >
                  <div :class="`h-4 w-full ${isSprintExpanded(item.sprintName) ? 'bg-blue-600' : item.color} flex items-center justify-center text-[10px] font-black text-white/90 tracking-tighter text-center transition-colors duration-300`">
                    {{ item.month }}月
                  </div>
                  <div class="flex-1 flex items-center justify-center text-xl font-black text-gray-800 tabular-nums">
                    {{ item.day }}
                  </div>
                </div>
                <!-- Status Dot on Line -->
                <div :class="`absolute -left-[29px] top-6 w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm transition-all duration-300 ${isSprintExpanded(item.sprintName) ? 'bg-blue-600 scale-150 ring-4 ring-blue-100' : (item.isPast ? 'bg-gray-300' : (item.isToday ? 'bg-blue-600' : 'bg-blue-400'))}`"></div>
              </div>

              <!-- Info -->
              <div class="flex-1 pt-1">
                <div class="flex flex-col gap-1.5">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span :class="`text-sm font-black transition-all duration-300 ${isSprintExpanded(item.sprintName) ? 'text-blue-600 scale-105 origin-left' : (item.isPast ? 'text-gray-400' : 'text-gray-900 group-hover:text-blue-600')}`">
                        {{ item.label }}
                      </span>
                      <span v-if="item.isToday || isSprintExpanded(item.sprintName)" class="flex h-2 w-2 relative">
                        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span class="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                      </span>
                    </div>
                    <!-- Countdown Tag -->
                    <div v-if="!item.isPast" :class="`text-[10px] font-black px-2 py-0.5 rounded-lg transition-colors duration-300 ${isSprintExpanded(item.sprintName) ? 'bg-blue-600 text-white' : (item.isToday ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600')}`">
                      {{ item.isToday ? '今天发布' : `剩 ${item.remainingDays} 天` }}
                    </div>
                  </div>
                  
                  <div class="flex items-center gap-3">
                    <div class="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        :class="`h-full transition-all duration-1000 ${item.isPast ? 'bg-gray-200' : 'bg-gradient-to-r from-blue-400 to-blue-600'}`"
                        :style="{ width: `${item.progress}%` }"
                      ></div>
                    </div>
                    <span class="text-[10px] font-bold text-gray-400 tabular-nums">{{ item.progress }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：Sprint 详情 (Wider) -->
      <div class="lg:col-span-3 space-y-4">
        
        <!-- 状态看板筛选区 -->
        <div class="bg-white/60 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-white/60 flex flex-wrap items-center gap-6">
          <div class="flex items-center gap-2 text-gray-700">
            <Filter :size="16" class="text-blue-600" />
            <span class="text-sm font-bold">需求看板筛选:</span>
          </div>
          
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
              <span class="text-xs text-gray-500">需求状态:</span>
              <select v-model="selectedRequirementStatus" class="text-xs bg-white border border-gray-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-blue-100">
                <option v-for="status in requirementStatuses" :key="status" :value="status">{{ status }}</option>
              </select>
            </div>
          </div>

          <div class="ml-auto"></div>
        </div>

        <div v-for="sprint in filteredSprints" :key="sprint.name" :data-sprint="sprint.name" class="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-white/60 hover:shadow-md transition-shadow overflow-hidden">
          <!-- Sprint Header (Clickable for Accordion) -->
          <div 
            @click="toggleSprint(sprint.name)"
            class="flex justify-between items-center p-5 cursor-pointer hover:bg-white/40 transition-colors select-none"
          >
            <div class="flex items-center gap-4">
              <div class="flex flex-col">
                <div class="flex items-center gap-3">
                  <h3 class="font-bold text-2xl text-gray-900">{{ sprint.name }}</h3>
                  <div class="flex items-center gap-1.5 ml-2">
                    <span class="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-bold border border-gray-200">共 {{ sprint.stats.total }} 项</span>
                    <span v-if="sprint.stats.planningCount > 0" class="px-2 py-0.5 bg-gray-50 text-gray-600 rounded text-xs font-bold border border-gray-200">{{ sprint.stats.planningCount }} 设计中</span>
                    <span v-if="sprint.stats.devCount > 0" class="px-2 py-0.5 bg-amber-50 text-amber-600 rounded text-xs font-bold border border-amber-100">{{ sprint.stats.devCount }} 开发中</span>
                    <span v-if="sprint.stats.testingCount > 0" class="px-2 py-0.5 bg-purple-50 text-purple-600 rounded text-xs font-bold border border-purple-100">{{ sprint.stats.testingCount }} 测试中</span>
                    <span v-if="sprint.stats.designCount > 0" class="px-2 py-0.5 bg-green-50 text-green-600 rounded text-xs font-bold border border-green-100">{{ sprint.stats.designCount }} 设计完成</span>
                    <span v-if="sprint.stats.onlineCount > 0" class="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs font-bold border border-blue-100">{{ sprint.stats.onlineCount }} 已发版</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-6">
              <div class="text-right hidden sm:block">
                <div class="flex items-center gap-2 text-sm text-gray-500 font-medium bg-gray-50/80 px-4 py-2 rounded-xl">
                  <Clock :size="16" />
                  <span>发布日：{{ sprint.targetDate }}</span>
                </div>
              </div>
              <div class="text-gray-400">
                <ChevronDown v-if="!isSprintExpanded(sprint.name)" :size="24" />
                <ChevronUp v-else :size="24" />
              </div>
            </div>
          </div>

          <!-- Requirements List (Accordion Content) -->
          <Transition name="accordion">
            <div v-if="isSprintExpanded(sprint.name)" class="p-6 pt-0 border-t border-gray-100/50">
              <div class="space-y-3 mt-4">
                <div v-if="sprint.requirements.length === 0" class="text-center py-10 bg-gray-50/30 rounded-xl border border-dashed border-gray-200">
                  <p class="text-base text-gray-400">暂无符合筛选条件的需求</p>
                </div>
                
                <div v-for="req in sprint.requirements" :key="req.id" class="flex flex-col p-3 rounded-xl bg-gray-50/50 border border-gray-100 hover:border-gray-200 transition-colors group/req">
                  <div class="grid grid-cols-[auto_1fr_auto] gap-4 items-start">
                    <div
                      class="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm shrink-0"
                      :class="[req.module === '客户端' ? 'bg-orange-50' : 'bg-blue-50']"
                    >
                      <component :is="req.icon" :size="24" :class="[req.module === '客户端' ? 'text-orange-600' : 'text-blue-600']" />
                    </div>

                    <div class="min-w-0 pt-0.5">
                      <div class="flex items-start gap-3">
                        <h4 class="text-lg font-bold text-gray-900 truncate flex-1 min-w-0">{{ req.title }}</h4>
                      </div>

                      <div class="mt-1 flex flex-wrap items-center gap-2">
                        <span 
                          class="text-[10px] px-2 py-0.5 rounded border font-bold flex items-center gap-1"
                          :class="[
                            req.module === '客户端' 
                              ? 'bg-orange-50 text-orange-600 border-orange-100' 
                              : 'bg-blue-50 text-blue-600 border-blue-100'
                          ]"
                        >
                          <component :is="req.module === '客户端' ? Smartphone : Monitor" :size="10" />
                          {{ req.module }}
                        </span>

                        <span class="text-[10px] px-2 py-0.5 rounded border font-bold bg-white/70 text-gray-600 border-gray-200 font-mono">
                          MIS {{ req.misId }}
                        </span>
                      </div>

                      <p v-if="req.description" class="mt-1.5 text-sm text-gray-500 leading-relaxed line-clamp-2">
                        {{ req.description }}
                      </p>
                    </div>

                    <div class="flex flex-col items-end gap-2 shrink-0 pt-0.5">
                      <span
                        class="text-xs font-bold px-2.5 py-1 rounded border"
                        :class="[
                          req.status === '设计完成' ? 'text-green-600 bg-green-50 border-green-100' :
                          req.status === '开发中' ? 'text-amber-600 bg-amber-50 border-amber-100' :
                          req.status === '测试中' ? 'text-purple-600 bg-purple-50 border-purple-100' :
                          req.status === '已发版' ? 'text-blue-600 bg-blue-50 border-blue-100' :
                          'text-gray-600 bg-gray-50 border-gray-200'
                        ]"
                      >
                        {{ req.status }}
                      </span>

                      <button 
                        @click="handleRequirementClick(req)"
                        class="flex items-center gap-2 text-sm font-bold text-white shadow-md hover:shadow-lg transition-all active:scale-95 group/btn px-5 py-2.5 rounded-2xl"
                        :class="[
                          req.id.startsWith('REQ-SPRINT4') ? 'bg-gray-400 cursor-not-allowed opacity-80' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                        ]"
                      >
                        <component :is="req.id.startsWith('REQ-SPRINT4') ? Info : Play" :size="16" fill="none" class="group-hover/btn:translate-x-0.5 transition-transform" />
                        <span>{{ req.id.startsWith('REQ-SPRINT4') ? '暂无原型' : '查看原型' }}</span>
                      </button>
                    </div>
                  </div>
                  
                  <!-- Footer Tags -->
                  <div class="flex items-center gap-3 pt-1.5 border-t border-gray-100/30">
                    <div class="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                      <History :size="12" />
                      <span>最近更新: 2026-03-14</span>
                    </div>
                    <div class="flex items-center gap-1.5 text-xs text-gray-400 font-medium ml-auto">
                      <CheckCircle2 :size="12" class="text-green-500" />
                      <span>MIS单状态已同步</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>

    </div>

    <!-- Toast Component -->
    <Transition name="toast">
      <div v-if="showToast" class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999]">
        <div class="bg-black/80 backdrop-blur-md text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 min-w-[160px] justify-center border border-white/10 scale-100">
          <Info :size="18" class="text-blue-400" />
          <span class="text-sm font-bold tracking-wide">{{ toastMessage }}</span>
        </div>
      </div>
    </Transition>

  </div>
</template>

<style scoped>
.animate-fade-in-down {
  animation: fadeInDown 0.8s ease-out;
}

/* Toast Animation */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Accordion Animation */
.accordion-enter-active,
.accordion-leave-active {
  transition: all 0.3s ease-out;
  max-height: 2000px;
}

.accordion-enter-from,
.accordion-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-10px);
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, -40%) scale(0.9);
}

.toast-enter-to,
.toast-leave-from {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
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
