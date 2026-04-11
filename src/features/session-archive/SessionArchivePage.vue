<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { 
  ChevronDown, ChevronLeft, Search, User, Users, Calendar, 
  FileText, Gift, Box, MonitorSmartphone,
  RefreshCw, Sparkles, MessageSquare, Loader2,
  Download, Clock, Car, ListTodo, Code
} from 'lucide-vue-next';

const router = useRouter();

// --- 基础数据 ---
const departments = ['销售部', '客服部', '售后部', '市场部'];

// --- 顶层三层筛选状态 ---
const searchKeyword = ref('');
const startDate = ref('');
const endDate = ref('');
const timeRangePreset = ref<'7days' | '30days' | 'custom'>('7days');
const showDeptSelect = ref(false);
const selectedDepts = ref<string[]>([]); // 支持多选部门

const toggleDept = (dept: string) => {
  const idx = selectedDepts.value.indexOf(dept);
  if (idx > -1) {
    selectedDepts.value.splice(idx, 1);
  } else {
    selectedDepts.value.push(dept);
  }
};

const setTimePreset = (preset: '7days' | '30days' | 'custom') => {
  timeRangePreset.value = preset;
  if (preset === 'custom') {
    // 切换到自定义时，保留当前时间或清空，让用户手动通过日历选择器输入
    return;
  }
  const end = new Date('2026-04-10'); // 模拟当前日期
  const start = new Date('2026-04-10');
  start.setDate(start.getDate() - (preset === '7days' ? 7 : 30));
  
  endDate.value = end.toISOString().split('T')[0];
  startDate.value = start.toISOString().split('T')[0];
};

// 初始化时应用近7天
setTimePreset('7days');

// 监听自定义时间变化并进行30天跨度验证
watch([startDate, endDate], ([newStart, newEnd]) => {
  if (newStart || newEnd) {
    if (timeRangePreset.value !== '7days' && timeRangePreset.value !== '30days') {
      timeRangePreset.value = 'custom';
    }

    // 验证最大跨度 30 天
    if (newStart && newEnd) {
      const s = new Date(newStart);
      const e = new Date(newEnd);
      const diffDays = (e.getTime() - s.getTime()) / (1000 * 3600 * 24);

      if (diffDays > 30) {
        alert('⚠️ 自定义时间区间最多只能选择 30 天！系统已自动为您截取前 30 天。');
        const maxEnd = new Date(s);
        maxEnd.setDate(maxEnd.getDate() + 30);
        endDate.value = maxEnd.toISOString().split('T')[0];
      } else if (diffDays < 0) {
        // 如果结束时间早于开始时间，自动交换
        startDate.value = newEnd;
        endDate.value = newStart;
      }
    }
  }
});

// --- 核心业务：会话配对清单数据 ---
type SessionMatch = {
  id: string;
  sessionId: string;
  empId: string;
  empName: string;
  dept: string;
  cusName: string;
  cusIcon: string;
  lastTime: string;
  msgCount: number;
};

const mockMatches: SessionMatch[] = [
  { id: 'm1', sessionId: 'S-20260410-001', empId: 'e1', empName: '温洁狗', dept: '销售部', cusName: 'SU、朝阳', cusIcon: '🚙', lastTime: '2026-04-10 10:15', msgCount: 24 },
  { id: 'm2', sessionId: 'S-20260409-082', empId: 'e1', empName: '温洁狗', dept: '销售部', cusName: 'w.', cusIcon: '👱‍♀️', lastTime: '2026-04-09 16:30', msgCount: 8 },
  { id: 'm3', sessionId: 'S-20260408-011', empId: 'e2', empName: '王丽君', dept: '销售部', cusName: '。', cusIcon: '🐻', lastTime: '2026-04-08 09:20', msgCount: 15 },
  { id: 'm4', sessionId: 'S-20260405-103', empId: 'e3', empName: '常丹丹', dept: '客服部', cusName: '杨珍珍', cusIcon: '🌲', lastTime: '2026-04-05 14:00', msgCount: 42 },
  { id: 'm5', sessionId: 'S-20260401-055', empId: 'e4', empName: '马丹', dept: '客服部', cusName: '不瘦十斤不改名', cusIcon: '🎁', lastTime: '2026-04-01 11:10', msgCount: 6 },
];

// 基于三层筛选实时计算配对清单
const filteredMatches = computed(() => {
  let list = [...mockMatches];
  
  // 部门过滤 (如果选了部门的话)
  if (selectedDepts.value.length > 0) {
    list = list.filter(m => selectedDepts.value.includes(m.dept));
  }
  
  // 时间过滤 (简单字符串比对模拟)
  if (startDate.value) {
    list = list.filter(m => m.lastTime.split(' ')[0] >= startDate.value);
  }
  if (endDate.value) {
    list = list.filter(m => m.lastTime.split(' ')[0] <= endDate.value);
  }

  return list; // 暂不实现深度关键词会话内容全文搜索模拟，这里仅演示架构
});

// --- 会话配对清单双栏状态 ---
const empSearch = ref('');
const cusSearch = ref('');
const activeEmpId = ref('');

const filteredEmployees = computed(() => {
  const empsMap = new Map();
  filteredMatches.value.forEach(m => {
    if (!empsMap.has(m.empId)) {
      empsMap.set(m.empId, { id: m.empId, name: m.empName, dept: m.dept });
    }
  });
  let emps = Array.from(empsMap.values());
  if (empSearch.value) {
    emps = emps.filter(e => e.name.includes(empSearch.value));
  }
  return emps;
});

const filteredCustomersForEmp = computed(() => {
  if (!activeEmpId.value) return [];
  let matches = filteredMatches.value.filter(m => m.empId === activeEmpId.value);
  if (cusSearch.value) {
    matches = matches.filter(m => m.cusName.includes(cusSearch.value));
  }
  return matches;
});

// 当员工列表发生变化时，如果当前选中的员工不在列表中，则清空选中状态
watch(filteredEmployees, (newEmps) => {
  if (activeEmpId.value && !newEmps.find(e => e.id === activeEmpId.value)) {
    activeEmpId.value = '';
    activeMatchId.value = '';
  }
});

// 当客户列表发生变化时，如果当前选中的客户不在列表中，则清空会话选中状态
watch(filteredCustomersForEmp, (newMatches) => {
  if (activeMatchId.value && !newMatches.find(m => m.id === activeMatchId.value)) {
    activeMatchId.value = '';
  }
});

// --- 交互状态控制 ---
const isSidebarHovered = ref(false);
const startDateRef = ref<HTMLInputElement | null>(null);
const endDateRef = ref<HTMLInputElement | null>(null);

const triggerDatePicker = () => {
  // 当点击整个时间框时，尝试唤起开始时间的日历选择器
  if (startDateRef.value) {
    try {
      startDateRef.value.showPicker();
    } catch (e) {
      // 某些浏览器可能不支持 showPicker，退级聚焦
      startDateRef.value.focus();
    }
  }
};
const viewState = ref<'loading' | 'empty' | 'error' | 'success'>('empty');

const activeMatchId = ref('');
const activeMatchObj = computed(() => mockMatches.find(m => m.id === activeMatchId.value));

// 监听顶层筛选器变化（不再自动触发加载，交由手动查询）
// 保留了变化检测逻辑以便于可能的重置操作，但移除了自动加载会话的定时器
// watch([searchKeyword, startDate, endDate, selectedDepts], () => { ... });

// 手动查询触发
const triggerQuery = () => {
  viewState.value = 'loading';
  activeMatchId.value = ''; // 重置右侧会话
  
  setTimeout(() => {
    viewState.value = filteredMatches.value.length > 0 ? 'success' : 'empty';
  }, 600);
};

// 初始化执行一次搜索
setTimeout(() => { triggerQuery(); }, 500);

const selectMatch = (id: string) => {
  activeMatchId.value = id;
};

// 导出Excel模拟
const isExporting = ref(false);
const handleExport = () => {
  isExporting.value = true;
  setTimeout(() => {
    isExporting.value = false;
    alert('✅ 会话记录已成功导出为 Excel 文件！');
  }, 1500);
};

const resetFilters = () => {
  searchKeyword.value = '';
  selectedDepts.value = [];
  setTimePreset('7days');
  empSearch.value = '';
  cusSearch.value = '';
};

const chatType = ref<'single' | 'group'>('single');

watch(chatType, () => {
  activeEmpId.value = '';
  activeMatchId.value = '';
  empSearch.value = '';
  cusSearch.value = '';
});

const aiActiveTab = ref<'preference' | 'concerns'>('preference');

const mockMessages = [
  { role: 'advisor', text: '您好，奥迪A6L目前有现车，您什么时候方便来店里看车呢？', time: '10:00' },
  { role: 'customer', text: '周末吧，价格还能优惠吗？', time: '10:05' },
  { role: 'advisor', text: '周末店里有团购活动，分期购车可以享受24期免息，并且送保养套餐，建议您来店详谈，我给您申请最大优惠！', time: '10:08' },
  { role: 'customer', text: '好的，那我周六下午过去。', time: '10:15' }
];

const backToHome = () => {
  router.push('/');
};
</script>

<template>
  <div class="min-h-screen flex bg-white text-sm font-sans text-gray-800 overflow-hidden">
    
    <!-- Left Sidebar -->
    <div 
      class="bg-[#1d1e23] text-gray-300 flex flex-col h-screen shrink-0 transition-all duration-300 relative z-50 group"
      :class="isSidebarHovered ? 'w-[240px]' : 'w-[64px]'"
      @mouseenter="isSidebarHovered = true"
      @mouseleave="isSidebarHovered = false"
    >
      <div class="h-16 flex items-center px-4 text-white font-bold text-base tracking-wide border-b border-white/5 whitespace-nowrap overflow-hidden shrink-0" :class="isSidebarHovered ? '' : 'justify-center !px-0'">
        <button @click="backToHome" class="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors shrink-0 rounded hover:bg-white/10" :class="isSidebarHovered ? 'mr-2' : 'mx-auto'" title="返回">
          <ChevronLeft :size="20" />
        </button>
        <span v-if="isSidebarHovered" class="transition-opacity duration-300">企业微信管理平台</span>
      </div>
      <div class="flex-1 overflow-y-auto py-4 custom-scrollbar overflow-x-hidden">
        <!-- Menu Items -->
        <div class="space-y-1">
          <div class="py-3 flex items-center justify-between hover:text-white cursor-pointer transition-colors" :class="isSidebarHovered ? 'px-6' : 'px-0 justify-center'">
            <div class="flex items-center" :class="isSidebarHovered ? 'gap-3' : 'justify-center w-full'">
              <User :size="16" class="shrink-0" />
              <span v-if="isSidebarHovered" class="whitespace-nowrap">客户联系</span>
            </div>
            <ChevronDown v-if="isSidebarHovered" :size="14" class="-rotate-90 shrink-0" />
          </div>
          <div class="py-3 flex items-center justify-between hover:text-white cursor-pointer transition-colors" :class="isSidebarHovered ? 'px-6' : 'px-0 justify-center'">
            <div class="flex items-center" :class="isSidebarHovered ? 'gap-3' : 'justify-center w-full'">
              <Users :size="16" class="shrink-0" />
              <span v-if="isSidebarHovered" class="whitespace-nowrap">客群管理</span>
            </div>
            <ChevronDown v-if="isSidebarHovered" :size="14" class="-rotate-90 shrink-0" />
          </div>
          <div class="py-3 flex items-center justify-between text-white cursor-pointer transition-colors" :class="isSidebarHovered ? 'px-6' : 'px-0 justify-center'">
            <div class="flex items-center" :class="isSidebarHovered ? 'gap-3' : 'justify-center w-full'">
              <FileText :size="16" class="shrink-0" />
              <span v-if="isSidebarHovered" class="whitespace-nowrap">营销中心</span>
            </div>
            <ChevronDown v-if="isSidebarHovered" :size="14" class="shrink-0" />
          </div>
          <!-- Sub-menu -->
          <div v-if="isSidebarHovered" class="bg-[#141518] py-2 space-y-1 whitespace-nowrap">
            <div class="px-12 py-2 hover:text-white cursor-pointer transition-colors">报名活动</div>
            <div class="px-12 py-2 hover:text-white cursor-pointer transition-colors">邀约活动</div>
            <div class="px-12 py-2 hover:text-white cursor-pointer transition-colors">线索渠道管理</div>
            <div class="px-12 py-2 hover:text-white cursor-pointer transition-colors">渠道活码</div>
            <div class="px-12 py-2 hover:text-white cursor-pointer transition-colors">一客一码</div>
            <div class="px-12 py-2 hover:text-white cursor-pointer transition-colors">员工名片</div>
            <div class="px-12 py-2 hover:text-white cursor-pointer transition-colors">短链接</div>
            <div class="px-12 py-2 hover:text-white cursor-pointer transition-colors">车展管理</div>
          </div>
          
          <div class="py-3 flex items-center justify-between hover:text-white cursor-pointer transition-colors" :class="isSidebarHovered ? 'px-6' : 'px-0 justify-center'">
            <div class="flex items-center" :class="isSidebarHovered ? 'gap-3' : 'justify-center w-full'">
              <Gift :size="16" class="shrink-0" />
              <span v-if="isSidebarHovered" class="whitespace-nowrap">抽奖活动</span>
            </div>
            <ChevronDown v-if="isSidebarHovered" :size="14" class="-rotate-90 shrink-0" />
          </div>
          
          <div class="py-3 flex items-center justify-between text-white cursor-pointer transition-colors" :class="isSidebarHovered ? 'px-6' : 'px-0 justify-center'">
            <div class="flex items-center" :class="isSidebarHovered ? 'gap-3' : 'justify-center w-full'">
              <MonitorSmartphone :size="16" class="shrink-0" />
              <span v-if="isSidebarHovered" class="whitespace-nowrap">内容中心</span>
            </div>
            <ChevronDown v-if="isSidebarHovered" :size="14" class="shrink-0" />
          </div>
          <!-- Sub-menu Active -->
          <div v-if="isSidebarHovered" class="bg-[#141518] py-2 space-y-1 whitespace-nowrap">
            <div class="px-12 py-2 hover:text-white cursor-pointer transition-colors">内容库</div>
            <div class="px-12 py-2 bg-[#e4393c] text-white cursor-pointer transition-colors">会话存档</div>
          </div>
          
          <div class="py-3 flex items-center justify-between hover:text-white cursor-pointer transition-colors" :class="isSidebarHovered ? 'px-6' : 'px-0 justify-center'">
            <div class="flex items-center" :class="isSidebarHovered ? 'gap-3' : 'justify-center w-full'">
              <Box :size="16" class="shrink-0" />
              <span v-if="isSidebarHovered" class="whitespace-nowrap">运营工具</span>
            </div>
            <ChevronDown v-if="isSidebarHovered" :size="14" class="-rotate-90 shrink-0" />
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col bg-[#f5f6f8] min-w-0 h-screen overflow-hidden">
      <!-- Top Header -->
      <div class="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 relative">
        <div class="flex-1"></div>
        <div class="flex items-center gap-2 cursor-pointer">
          <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold">李</div>
          <span class="text-gray-600">李贺</span>
          <ChevronDown :size="14" class="text-gray-400" />
        </div>
      </div>

      <!-- Main Area Scrollable -->
      <div class="flex-1 flex flex-col overflow-hidden custom-scrollbar">
        <div class="bg-white flex flex-col shadow-sm rounded-sm flex-1 overflow-hidden m-4 min-h-0">
          
          <!-- Breadcrumb & Tabs -->
          <div class="px-6 pt-4 pb-0 border-b border-gray-200 shrink-0 relative">
            <!-- 开发者提示信息 -->
            <div class="absolute top-4 right-6 bg-gray-800 text-gray-200 px-3 py-1.5 rounded-md text-xs font-mono shadow-md flex items-center gap-2 border border-gray-700/50 z-50 group hover:bg-gray-900 transition-colors">
              <Code :size="14" class="text-blue-400" />
              <span>开发文件路径:</span>
              <span class="text-green-400 select-all group-hover:text-green-300">src/features/session-archive/SessionArchivePage.vue</span>
            </div>

            <div class="flex items-center justify-between">
              <div class="text-gray-500 text-[13px] mb-4">内容中心 > <span class="text-gray-800">会话存档</span></div>
              
              <!-- 状态演示控制区（仅原型展示用） -->
              <div class="mb-4 flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded text-blue-800 text-xs shadow-inner">
                <span class="font-bold flex items-center gap-1"><MonitorSmartphone :size="14"/>交互状态演示：</span>
                <button @click="viewState = 'success'" :class="{'bg-blue-600 text-white shadow': viewState === 'success', 'bg-white hover:bg-gray-50': viewState !== 'success'}" class="px-2 py-1 rounded transition-colors">正常</button>
                <button @click="viewState = 'loading'" :class="{'bg-blue-600 text-white shadow': viewState === 'loading', 'bg-white hover:bg-gray-50': viewState !== 'loading'}" class="px-2 py-1 rounded transition-colors">加载中</button>
                <button @click="viewState = 'empty'" :class="{'bg-blue-600 text-white shadow': viewState === 'empty', 'bg-white hover:bg-gray-50': viewState !== 'empty'}" class="px-2 py-1 rounded transition-colors">空数据</button>
                <button @click="viewState = 'error'" :class="{'bg-blue-600 text-white shadow': viewState === 'error', 'bg-white hover:bg-gray-50': viewState !== 'error'}" class="px-2 py-1 rounded transition-colors">错误态</button>
              </div>
            </div>
            <div class="flex gap-8">
              <button 
                @click="chatType = 'single'"
                class="pb-3 font-bold transition-colors border-b-2"
                :class="chatType === 'single' ? 'text-[#e4393c] border-[#e4393c]' : 'text-gray-600 border-transparent hover:text-gray-800'"
              >单聊</button>
              <button 
                @click="chatType = 'group'"
                class="pb-3 font-bold transition-colors border-b-2"
                :class="chatType === 'group' ? 'text-[#e4393c] border-[#e4393c]' : 'text-gray-600 border-transparent hover:text-gray-800'"
              >群聊</button>
            </div>
          </div>

          <!-- Unified Filters -->
          <div class="px-6 py-4 flex flex-col gap-4 shrink-0 bg-white border-b border-gray-100 z-20">
            <div class="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
              
              <!-- Left: Target Selector & Time -->
              <div class="flex flex-wrap items-center gap-x-6 gap-y-4 flex-1">
                
                <!-- Time Range Selector -->
                <div class="flex items-center gap-2">
                  <span class="text-gray-600 font-medium whitespace-nowrap shrink-0">会话时间：</span>
                  <div class="flex items-center bg-gray-100 rounded p-1 h-9 shrink-0">
                    <button @click="setTimePreset('7days')" :class="timeRangePreset === '7days' ? 'bg-white shadow-sm text-blue-600 font-bold' : 'text-gray-600 hover:text-gray-800'" class="px-3 h-7 rounded text-xs transition-all">近7天</button>
                    <button @click="setTimePreset('30days')" :class="timeRangePreset === '30days' ? 'bg-white shadow-sm text-blue-600 font-bold' : 'text-gray-600 hover:text-gray-800'" class="px-3 h-7 rounded text-xs transition-all">近30天</button>
                    <button @click="setTimePreset('custom')" :class="timeRangePreset === 'custom' ? 'bg-white shadow-sm text-blue-600 font-bold' : 'text-gray-600 hover:text-gray-800'" class="px-3 h-7 rounded text-xs transition-all">自定义</button>
                  </div>
                  
                  <!-- 日期选择器，点击整个区域唤起弹窗 -->
                  <div 
                    @click="triggerDatePicker"
                    class="flex items-center border rounded h-9 px-3 w-64 bg-white transition-colors shrink-0 cursor-pointer overflow-hidden relative"
                    :class="timeRangePreset === 'custom' ? 'border-blue-400 ring-1 ring-blue-500/20' : 'border-gray-300 hover:border-gray-400 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/20'"
                  >
                    <Calendar :size="15" :class="timeRangePreset === 'custom' ? 'text-blue-500' : 'text-gray-400'" class="mr-2 shrink-0 pointer-events-none" />
                    
                    <input 
                      ref="startDateRef" 
                      type="date" 
                      v-model="startDate" 
                      @change="timeRangePreset = 'custom'"
                      class="flex-1 bg-transparent outline-none text-xs text-gray-600 cursor-pointer border-none p-0 h-full w-full" 
                    />
                    
                    <span class="mx-1 text-gray-400 shrink-0 pointer-events-none">-</span>
                    
                    <input 
                      ref="endDateRef" 
                      type="date" 
                      v-model="endDate" 
                      @change="timeRangePreset = 'custom'"
                      class="flex-1 bg-transparent outline-none text-xs text-gray-600 cursor-pointer border-none p-0 h-full w-full" 
                    />
                  </div>
                </div>

                <!-- Department Selector (Multi) -->
                <div class="flex items-center gap-2 relative">
                  <span class="text-gray-600 font-medium whitespace-nowrap shrink-0">所属部门：</span>
                  <button 
                    @click="showDeptSelect = !showDeptSelect"
                    class="h-9 px-3 bg-white border border-gray-300 rounded flex items-center justify-between gap-2 hover:border-gray-400 transition-colors w-40 text-sm shrink-0"
                  >
                    <span class="truncate text-gray-600">
                      {{ selectedDepts.length === 0 ? '全部部门' : `已选 ${selectedDepts.length} 项` }}
                    </span>
                    <ChevronDown :size="14" class="text-gray-400" />
                  </button>
                  <div v-if="showDeptSelect" class="absolute top-10 left-20 w-48 bg-white border border-gray-200 shadow-lg rounded-md py-1 z-50 animate-fade-in">
                    <div class="px-3 py-1.5 text-xs text-gray-400 border-b border-gray-100">支持多选</div>
                    <label 
                      v-for="dept in departments" :key="dept"
                      class="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer transition-colors text-sm"
                    >
                      <input type="checkbox" :checked="selectedDepts.includes(dept)" @change="toggleDept(dept)" class="w-3.5 h-3.5 text-blue-600 rounded border-gray-300" />
                      {{ dept }}
                    </label>
                  </div>
                </div>

                <!-- Keyword Search -->
                <div class="flex items-center gap-2">
                  <span class="text-gray-600 font-medium whitespace-nowrap shrink-0">关键内容：</span>
                  <div class="relative w-64 shrink-0">
                    <input 
                      v-model="searchKeyword"
                      type="text" 
                      placeholder="搜索聊天内容..." 
                      class="w-full h-9 pl-8 pr-3 border border-gray-300 rounded text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 placeholder-gray-400 transition-all bg-white" 
                    />
                    <Search :size="14" class="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
                
              </div>

              <!-- Right: Action Buttons -->
              <div class="flex items-center gap-2 shrink-0 self-end xl:self-auto">
                <button @click="triggerQuery" class="px-5 h-9 bg-[#e4393c] text-white rounded hover:bg-red-700 transition-colors font-medium flex items-center gap-1.5 shadow-sm">
                  <Search :size="15" /> 查询
                </button>
                <button @click="resetFilters" class="px-5 h-9 bg-red-50 text-[#e4393c] rounded border border-red-200 hover:bg-red-100 transition-colors font-medium flex items-center gap-1.5">
                  <RefreshCw :size="15" /> 重置条件
                </button>
                <button @click="handleExport" class="px-5 h-9 bg-[#e4393c] text-white rounded hover:bg-red-700 transition-colors font-medium flex items-center gap-1.5 shadow-sm" :disabled="isExporting">
                  <Loader2 v-if="isExporting" :size="15" class="animate-spin" />
                  <Download v-else :size="15" /> 
                  {{ isExporting ? '导出中...' : '导出Excel' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Grid Content (12 Columns Responsive Layout) -->
          <div class="flex-1 flex flex-col min-h-0 bg-[#fafafa] p-4">
            <div class="grid grid-cols-12 gap-4 h-full min-h-0">
              
              <!-- 模块 1.1：顾问列表 (Col: 2/12) -->
              <div class="col-span-2 flex flex-col bg-white border border-gray-200 rounded shadow-sm overflow-hidden min-h-0 relative">
                <div class="h-12 border-b border-gray-200 flex items-center justify-between px-4 shrink-0 bg-gray-50 shadow-sm z-10">
                  <div class="font-bold text-gray-800 flex items-center">
                    <User :size="16" class="mr-2 text-blue-500" />
                    顾问列表
                    <span class="ml-2 text-xs font-normal text-gray-500 bg-gray-200 px-1.5 py-0.5 rounded-full">{{ filteredEmployees.length }}</span>
                  </div>
                </div>
                <!-- 顾问搜索框 -->
                <div class="p-2 border-b border-gray-100 bg-white">
                  <div class="relative">
                    <input 
                      v-model="empSearch"
                      type="text" 
                      placeholder="搜索顾问姓名..." 
                      class="w-full h-8 pl-7 pr-2 border border-gray-300 rounded text-xs outline-none focus:border-blue-500 bg-gray-50 focus:bg-white transition-colors"
                    />
                    <Search :size="12" class="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
                
                <div class="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                  <button 
                    v-for="emp in filteredEmployees" :key="emp.id"
                    @click="activeEmpId = emp.id"
                    class="w-full text-left px-3 py-2 rounded-lg border transition-all flex items-center group overflow-hidden"
                    :class="activeEmpId === emp.id ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-white border-transparent hover:border-gray-200 hover:bg-gray-50'"
                  >
                    <span class="text-sm font-bold text-gray-800 truncate" :class="activeEmpId === emp.id ? 'text-blue-700' : ''">{{ emp.name }}</span>
                  </button>
                  <div v-if="filteredEmployees.length === 0" class="text-center py-6 text-xs text-gray-400">
                    无匹配顾问
                  </div>
                </div>
              </div>

              <!-- 模块 1.2：客户列表 (Col: 2/12) -->
              <div class="col-span-2 flex flex-col bg-white border border-gray-200 rounded shadow-sm overflow-hidden min-h-0 relative">
                <div class="h-12 border-b border-gray-200 flex items-center justify-between px-4 shrink-0 bg-gray-50 shadow-sm z-10">
                  <div class="font-bold text-gray-800 flex items-center">
                    <Users :size="16" class="mr-2 text-emerald-500" />
                    {{ chatType === 'single' ? '客户列表' : '群聊列表' }}
                    <span class="ml-2 text-xs font-normal text-gray-500 bg-gray-200 px-1.5 py-0.5 rounded-full">{{ filteredCustomersForEmp.length }}</span>
                  </div>
                </div>
                <!-- 客户搜索框 -->
                <div class="p-2 border-b border-gray-100 bg-white">
                  <div class="relative">
                    <input 
                      v-model="cusSearch"
                      type="text" 
                      :placeholder="chatType === 'single' ? '搜索客户名称...' : '搜索群聊名称...'" 
                      class="w-full h-8 pl-7 pr-2 border border-gray-300 rounded text-xs outline-none focus:border-blue-500 bg-gray-50 focus:bg-white transition-colors"
                    />
                    <Search :size="12" class="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
                
                <div class="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1 relative">
                  <div v-if="!activeEmpId" class="absolute inset-0 bg-white/90 z-10 flex flex-col items-center justify-center text-center p-4">
                    <User :size="24" class="text-gray-300 mb-2" />
                    <span class="text-xs text-gray-500">请先在左侧选择顾问</span>
                  </div>
                  
                  <template v-else>
                    <button 
                      v-for="match in filteredCustomersForEmp" :key="match.id"
                      @click="selectMatch(match.id)"
                      class="w-full text-left px-3 py-2 rounded-lg border transition-all flex items-center gap-2 relative group overflow-hidden"
                      :class="activeMatchId === match.id ? 'bg-emerald-50 border-emerald-200 shadow-sm' : 'bg-white border-transparent hover:border-gray-200 hover:bg-gray-50'"
                    >
                      <div class="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-xs shrink-0 shadow-sm">{{ match.cusIcon }}</div>
                      <span class="text-sm font-bold text-gray-800 truncate" :class="activeMatchId === match.id ? 'text-emerald-700' : ''">{{ match.cusName }}</span>
                    </button>
                    <div v-if="filteredCustomersForEmp.length === 0" class="text-center py-6 text-xs text-gray-400">
                      无匹配{{ chatType === 'single' ? '客户' : '群聊' }}
                    </div>
                  </template>
                </div>
              </div>
              
              <!-- 模块 2：右侧会话内容展示与AI (Col: 8/12) -->
              <div class="col-span-8 flex flex-col bg-white border border-gray-200 rounded shadow-sm overflow-hidden min-h-0 relative">
                <div class="h-12 border-b border-gray-200 flex items-center justify-between px-4 shrink-0 bg-white shadow-sm z-10">
                  <div class="font-bold text-gray-800 flex items-center">
                    <MessageSquare :size="16" class="mr-2 text-blue-500" />
                    会话内容
                  </div>
                </div>
                
                <!-- 整个下半部分包裹在 flex-1 中，缺省态覆盖这里 -->
                <div class="flex-1 overflow-hidden flex relative">
                  
                  <!-- 会话流 (只有选中时才渲染) -->
                  <template v-if="activeMatchId">
                    <div class="flex-1 overflow-y-auto custom-scrollbar p-4 bg-[#f8f9fa] border-r border-gray-200">
                      <div class="space-y-5">
                        <div class="flex items-center justify-center my-4">
                          <span class="text-[11px] text-gray-400 bg-gray-200/50 px-3 py-1 rounded-full font-medium">2026年04月10日</span>
                        </div>
                        <div v-for="(msg, idx) in mockMessages" :key="idx" :class="['flex gap-3', msg.role === 'customer' ? 'flex-row-reverse' : '']">
                          <div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-sm shadow-sm" :class="msg.role === 'customer' ? 'bg-white border border-gray-200' : 'bg-blue-100 text-blue-700 border border-blue-200'">
                            {{ msg.role === 'customer' ? activeMatchObj?.cusIcon || '客' : '顾' }}
                          </div>
                          <div class="flex flex-col max-w-[75%]" :class="msg.role === 'customer' ? 'items-end' : 'items-start'">
                            <span class="text-[11px] text-gray-400 mb-1.5 px-1">
                              {{ msg.role === 'customer' ? activeMatchObj?.cusName : activeMatchObj?.empName }} • {{ msg.time }}
                            </span>
                            <div class="p-3.5 rounded-2xl text-[13px] leading-relaxed shadow-sm" :class="msg.role === 'customer' ? 'bg-[#e4393c] text-white rounded-tr-sm' : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm'">
                              <!-- 模拟高亮关键词 -->
                              <span v-if="searchKeyword && msg.text.includes(searchKeyword)" v-html="msg.text.replace(searchKeyword, `<mark class='bg-yellow-200 text-gray-900 rounded px-1 font-bold'>${searchKeyword}</mark>`)"></span>
                              <span v-else>{{ msg.text }}</span>
                            </div>
                          </div>
                        </div>
                        <div class="flex items-center justify-center mt-8 pb-4">
                          <div class="h-px bg-gray-200 flex-1 max-w-[100px]"></div>
                          <span class="text-xs text-gray-400 mx-4 font-medium tracking-wider">仅展示包含筛选条件的上下文片段</span>
                          <div class="h-px bg-gray-200 flex-1 max-w-[100px]"></div>
                        </div>
                      </div>
                    </div>

                    <!-- 右侧 AI 总结 (固定宽度) -->
                    <div v-if="chatType === 'single'" class="w-[360px] bg-white flex flex-col shrink-0 border-l border-gray-200">
                      <div class="h-12 flex items-center px-4 font-bold text-gray-800 text-base shrink-0 relative">
                        <div class="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center text-white mr-3 shadow-sm shadow-indigo-200">
                          <Sparkles :size="14" />
                        </div>
                        AI 智能画像分析
                      </div>
                      
                      <!-- 核心洞察 -->
                      <div class="mx-4 mt-2 mb-4 p-4 rounded-xl bg-gradient-to-br from-indigo-50/80 to-purple-50/50 border border-indigo-100/60 shadow-sm relative overflow-hidden">
                        <div class="absolute right-0 bottom-0 w-24 h-24 bg-indigo-100/30 rounded-full blur-2xl pointer-events-none"></div>
                        <div class="flex items-center justify-between mb-3 relative z-10">
                          <span class="font-bold text-gray-800 text-sm">核心洞察</span>
                          <span class="text-[10px] text-gray-400 flex items-center gap-1"><Clock :size="10"/>更新于：2026-04-10 17:37</span>
                        </div>
                        <p class="text-xs text-gray-600 leading-relaxed relative z-10">
                          基于近3个月数据，客户购车意向 <span class="font-bold text-indigo-700">极高</span>。重点关注<span class="text-indigo-600 font-medium">车辆配置与售后服务</span>。建议跟进 <span class="text-indigo-600 font-medium">Q5L</span> 试驾及保养介绍。
                        </p>
                      </div>

                      <!-- Tabs -->
                      <div class="flex px-4 shrink-0">
                        <button 
                          @click="aiActiveTab = 'preference'"
                          class="flex-1 pb-3 flex items-center justify-center gap-2 text-[13px] font-medium border-b-2 transition-all"
                          :class="aiActiveTab === 'preference' ? 'text-indigo-600 border-indigo-600' : 'text-gray-400 border-gray-100 hover:text-gray-600'"
                        >
                          <Car :size="14" /> 购车偏好预测
                        </button>
                        <button 
                          @click="aiActiveTab = 'concerns'"
                          class="flex-1 pb-3 flex items-center justify-center gap-2 text-[13px] font-medium border-b-2 transition-all"
                          :class="aiActiveTab === 'concerns' ? 'text-orange-500 border-orange-500' : 'text-gray-400 border-gray-100 hover:text-gray-600'"
                        >
                          <ListTodo :size="14" /> 关注点总结
                        </button>
                      </div>

                      <div class="flex-1 overflow-y-auto custom-scrollbar bg-[#fcfcfc] relative">
                        <!-- 购车偏好预测 Tab Content -->
                        <div v-if="aiActiveTab === 'preference'" class="p-4 space-y-4">
                          <div class="flex items-center gap-2 mb-2">
                            <div class="w-1 h-3.5 bg-indigo-600 rounded-full"></div>
                            <span class="font-bold text-gray-800 text-[13px]">购车偏好预测</span>
                          </div>
                          
                          <div class="bg-white p-3.5 rounded-lg border border-gray-100 shadow-sm transition-shadow hover:shadow">
                            <div class="text-xs text-gray-500 mb-2">地域（上牌）</div>
                            <div class="text-sm mb-3 flex items-baseline">
                              <span class="text-indigo-600 font-medium mr-2">核心结论：</span>
                              <span class="font-bold text-gray-800">沈阳</span>
                            </div>
                            <div class="text-[10px] text-gray-400 mb-1.5">支撑依据：</div>
                            <div class="bg-gray-50/80 p-2.5 rounded text-xs text-gray-600 border border-gray-100/50 leading-relaxed">
                              客户询问“沈阳这边上牌有没有优惠。”
                            </div>
                          </div>

                          <div class="bg-white p-3.5 rounded-lg border border-gray-100 shadow-sm transition-shadow hover:shadow">
                            <div class="text-xs text-gray-500 mb-2">购车预算</div>
                            <div class="text-sm mb-3 flex items-baseline">
                              <span class="text-indigo-600 font-medium mr-2">核心结论：</span>
                              <span class="font-bold text-indigo-600 text-base">35-40 万</span>
                            </div>
                            <div class="text-[10px] text-gray-400 mb-1.5">支撑依据：</div>
                            <div class="bg-gray-50/80 p-2.5 rounded text-xs text-gray-600 border border-gray-100/50 leading-relaxed">
                              对话中用户提到“预算大概在40万以内，希望能办下来”。
                            </div>
                          </div>

                          <div class="bg-white p-3.5 rounded-lg border border-gray-100 shadow-sm transition-shadow hover:shadow">
                            <div class="text-xs text-gray-500 mb-2">意向车型</div>
                            <div class="text-sm mb-3 flex items-baseline">
                              <span class="text-indigo-600 font-medium mr-2">核心结论：</span>
                              <span class="font-bold text-gray-800">Q5L</span>
                            </div>
                            <div class="text-[10px] text-gray-400 mb-1.5">支撑依据：</div>
                            <div class="bg-gray-50/80 p-2.5 rounded text-xs text-gray-600 border border-gray-100/50 leading-relaxed">
                              客户多次询问 Q5L 的配置和价格，对比了豪华动感型和致雅型。
                            </div>
                          </div>
                        </div>

                        <!-- 关注点总结 Tab Content -->
                        <div v-if="aiActiveTab === 'concerns'" class="p-4">
                          <div class="flex items-center gap-2 mb-5">
                            <div class="w-1 h-3.5 bg-orange-500 rounded-full"></div>
                            <span class="font-bold text-gray-800 text-[13px]">关注点总结</span>
                          </div>
                          
                          <div class="relative border-l-2 border-gray-100 ml-2 pl-5 pb-8">
                            <div class="absolute -left-[7px] top-1 w-3 h-3 rounded-full border-2 border-orange-500 bg-white"></div>
                            
                            <div class="flex items-center gap-2 mb-3">
                              <span class="bg-gray-100/80 text-gray-500 text-[10px] px-2.5 py-1 rounded-full">2024-03-10</span>
                              <span class="text-orange-500 bg-orange-50/80 text-[10px] px-2.5 py-1 rounded-full font-medium flex items-center gap-1"><span class="w-1 h-1 rounded-full bg-orange-400"></span> 使用成本</span>
                              <span class="ml-auto text-emerald-600 bg-emerald-50 border border-emerald-100/50 text-[10px] px-2 py-0.5 rounded">有效回复</span>
                            </div>
                            
                            <div class="text-[13px] text-gray-800 font-medium mb-1.5 leading-relaxed">
                              Q5L现在的油耗怎么样？市区开费油吗？听说这车如果不跑高速的话，油耗会比较高，我...
                            </div>
                            <button class="text-indigo-600 text-xs flex items-center gap-0.5 mb-4 hover:text-indigo-700 transition-colors">展开 <ChevronDown :size="12"/></button>
                            
                            <div class="bg-white border border-gray-100 rounded-lg p-3.5 shadow-sm relative group">
                              <div class="flex items-center mb-2">
                                <span class="text-[10px] text-gray-500 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <MessageSquare :size="10" class="text-gray-400"/>顾问回复
                                </span>
                              </div>
                              <div class="text-xs text-gray-600 leading-relaxed">
                                目前车主反馈市区大概在9-10个油，高速能跑进7个，对于这个级别的SUV来说很省油了。确实如您所说，经常堵车的话油耗会高...
                              </div>
                              <button class="text-indigo-600 text-xs flex items-center gap-0.5 mt-2.5 hover:text-indigo-700 transition-colors">展开 <ChevronDown :size="12"/></button>
                            </div>
                          </div>

                          <div class="relative border-l-2 border-transparent ml-2 pl-5 pb-4">
                            <div class="absolute -left-[7px] top-1 w-3 h-3 rounded-full border-2 border-orange-500 bg-white"></div>
                            
                            <div class="flex items-center gap-2 mb-3">
                              <span class="bg-gray-100/80 text-gray-500 text-[10px] px-2.5 py-1 rounded-full">2024-03-05</span>
                              <span class="text-orange-500 bg-orange-50/80 text-[10px] px-2.5 py-1 rounded-full font-medium flex items-center gap-1"><span class="w-1 h-1 rounded-full bg-orange-400"></span> 购车成本</span>
                              <span class="ml-auto text-purple-600 bg-purple-50 border border-purple-100/50 text-[10px] px-2 py-0.5 rounded">无效回复</span>
                            </div>
                            
                            <div class="text-[13px] text-gray-800 font-medium mb-4 leading-relaxed">
                              现在买有优惠吗？落地大概多少？我看网上说最近有大促销。
                            </div>
                            
                            <div class="bg-white border border-gray-100 rounded-lg p-3.5 shadow-sm relative group">
                              <div class="flex items-center justify-between mb-2">
                                <span class="text-[10px] text-gray-500 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <MessageSquare :size="10" class="text-gray-400"/>顾问回复
                                </span>
                                <button class="text-[10px] text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full flex items-center gap-1 hover:bg-indigo-100 transition-colors cursor-pointer">
                                  <Sparkles :size="10"/>AI帮写
                                </button>
                              </div>
                              <div class="text-xs text-gray-600 leading-relaxed">
                                姐，咱们五一有车展活动，您要不过来看看？
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>

                  <!-- Loading / Empty State -->
                  <div v-else class="flex-1 flex flex-col items-center justify-center text-gray-400 bg-white">
                    <div class="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4 shadow-sm border border-gray-100">
                      <MessageSquare :size="40" class="text-gray-300" stroke-width="1.5" />
                    </div>
                    <p class="text-base font-bold text-gray-600 mb-2">未选择具体会话</p>
                    <p class="text-sm text-gray-400">请在左侧【配对清单】中点击选择一条记录以查看聊天内容</p>
                  </div>

                </div>
              </div>
            </div>
          </div>


          <!-- Pagination -->
          <div class="h-12 border-t border-gray-200 flex items-center justify-end px-6 text-[13px] text-gray-500 shrink-0 bg-white">
            <span class="mr-4">共 5836 条</span>
            <div class="relative mr-4 cursor-pointer border border-gray-300 rounded-sm h-7 px-2 flex items-center gap-2 hover:border-gray-400">
              <span>10条/页</span>
              <ChevronDown :size="12" />
            </div>
            <div class="flex items-center gap-1 mr-4">
              <button class="w-7 h-7 flex items-center justify-center hover:text-blue-600"><ChevronDown :size="14" class="rotate-90" /></button>
              <button class="w-7 h-7 flex items-center justify-center text-[#e4393c] font-bold">1</button>
              <button class="w-7 h-7 flex items-center justify-center hover:text-blue-600">2</button>
              <button class="w-7 h-7 flex items-center justify-center hover:text-blue-600">3</button>
              <button class="w-7 h-7 flex items-center justify-center hover:text-blue-600">4</button>
              <button class="w-7 h-7 flex items-center justify-center hover:text-blue-600">5</button>
              <button class="w-7 h-7 flex items-center justify-center hover:text-blue-600">6</button>
              <span>...</span>
              <button class="w-8 h-7 flex items-center justify-center hover:text-blue-600">584</button>
              <button class="w-7 h-7 flex items-center justify-center hover:text-blue-600"><ChevronDown :size="14" class="-rotate-90" /></button>
            </div>
            <div class="flex items-center gap-2">
              <span>前往</span>
              <input type="text" value="1" class="w-10 h-7 border border-gray-300 rounded-sm text-center outline-none focus:border-blue-500" />
              <span>页</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <div class="h-8 bg-[#8a8b8e] text-white/80 text-xs flex items-center justify-center gap-6 shrink-0 z-10">
        <span>京ICP备09000793号</span>
        <span>京公网安备22017102000263号</span>
        <span>运维联系电话：0431-85990175</span>
        <span>运维邮箱：ITeMail@faw-vw.com</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

@keyframes fade-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.animate-fade-in {
  animation: fade-in 0.2s ease-out forwards;
}

/* 隐藏原生 date input 的日历图标，因为我们有自定义的触发逻辑和全局图标 */
input[type="date"]::-webkit-calendar-picker-indicator {
  display: none;
  -webkit-appearance: none;
}
</style>