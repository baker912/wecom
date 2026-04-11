<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { 
  ChevronDown, Settings, Users, User, Box, Database, 
  PieChart, LayoutGrid, Tag, Code, ChevronLeft, X
} from 'lucide-vue-next';

const router = useRouter();

// 筛选状态
const filters = ref({
  department: '',
  nameOrPhone: '',
  role: '',
  status: '',
  subject: '',
  epPost: '',
  accountId: ''
});

// 表格数据
const tableData = ref([
  {
    id: 1,
    name: '曾华荣',
    phone: '176036\n52905',
    pCode: 'P46481\n3',
    dealer: '哈尔滨市广申汽车销售服务有限责任公司',
    epPost: '销售顾问',
    jobStatus: '在职',
    subject: '一汽奥迪经销\n商',
    wecomAccount: '--',
    accountId: '--',
    wecomPhone: '--',
    mainDept: '哈尔滨市广申汽车销售服务有限责任公司',
    subDept: '销售部',
    role: '售前销售',
    isActive: false,
    updateTime: '2026-04-11 13:14:11',
    actionText: '关联',
    autoDelete: true
  },
  {
    id: 2,
    name: '葛文斌',
    phone: '138806\n21078',
    pCode: 'P35526\n30',
    dealer: '成都新元素兴业汽车服务有限公司',
    epPost: '销售顾问',
    jobStatus: '在职',
    subject: '一汽奥迪经销\n商',
    wecomAccount: '葛文斌',
    accountId: '138806210\n78',
    wecomPhone: '138806\n21078',
    mainDept: '成都新元素兴业汽车服务有限公司',
    subDept: '销售部',
    role: '售前销售',
    isActive: true,
    updateTime: '2026-04-11 12:33:26',
    actionText: '解绑',
    autoDelete: true
  },
  {
    id: 3,
    name: '李宣皓',
    phone: '186417\n08341',
    pCode: 'P36227\n1',
    dealer: '营口中升华盛汽车销售服务有限公司',
    epPost: '销售顾问',
    jobStatus: '在职',
    subject: '一汽奥迪经销\n商',
    wecomAccount: '--',
    accountId: '--',
    wecomPhone: '--',
    mainDept: '营口中升华盛汽车销售服务有限公司',
    subDept: '销售部',
    role: '售前销售',
    isActive: false,
    updateTime: '2026-04-11 12:18:05',
    actionText: '关联',
    autoDelete: true
  },
  {
    id: 4,
    name: '赵辉',
    phone: '188417\n09289',
    pCode: 'P657',
    dealer: '山东庞大兴业汽车销售服务有限公司',
    epPost: '售后总监',
    jobStatus: '在职',
    subject: '一汽奥迪经销\n商',
    wecomAccount: '--',
    accountId: '--',
    wecomPhone: '--',
    mainDept: '山东庞大兴业汽车销售服务有限公司',
    subDept: '营口中升华盛汽车销售服务有限公司,服务部,服务部',
    role: '售后总监',
    isActive: false,
    updateTime: '2026-04-11 12:17:30',
    actionText: '关联',
    autoDelete: true
  },
  {
    id: 5,
    name: '宋雨鹤',
    phone: '134644\n64320',
    pCode: 'P35513\n54',
    dealer: '营口中升华盛汽车销售服务有限公司',
    epPost: '主播',
    jobStatus: '在职',
    subject: '一汽奥迪经销\n商',
    wecomAccount: '--',
    accountId: '--',
    wecomPhone: '--',
    mainDept: '营口中升华盛汽车销售服务有限公司',
    subDept: '销售部',
    role: '售前销售',
    isActive: false,
    updateTime: '2026-04-11 11:51:32',
    actionText: '关联',
    autoDelete: true
  },
  {
    id: 6,
    name: '连乙婷',
    phone: '178247\n68715',
    pCode: 'P35512\n79',
    dealer: '营口中升华盛汽车销售服务有限公司',
    epPost: '前台',
    jobStatus: '在职',
    subject: '一汽奥迪经销\n商',
    wecomAccount: '--',
    accountId: '--',
    wecomPhone: '--',
    mainDept: '营口中升华盛汽车销售服务有限公司',
    subDept: '销售部',
    role: '--',
    isActive: false,
    updateTime: '2026-04-11 11:51:25',
    actionText: '关联',
    autoDelete: true
  },
  {
    id: 7,
    name: '姜家辉',
    phone: '139570\n10533',
    pCode: 'P35537\n85',
    dealer: '衢州君悦佳奥汽车有限公司',
    epPost: '销售顾问',
    jobStatus: '在职',
    subject: '一汽奥迪经销\n商',
    wecomAccount: '汪飞',
    accountId: '139570105\n33',
    wecomPhone: '139570\n10533',
    mainDept: '衢州君悦佳奥汽车有限公司',
    subDept: '销售部',
    role: '售前销售',
    isActive: true,
    updateTime: '2026-04-11 11:28:51',
    actionText: '解绑',
    autoDelete: true
  },
  {
    id: 8,
    name: '王春祥',
    phone: '139570\n10503',
    pCode: 'P27332\n5',
    dealer: '衢州君悦佳奥汽车有限公司',
    epPost: '销售总监',
    jobStatus: '在职',
    subject: '一汽奥迪经销\n商',
    wecomAccount: '叶树13957010503',
    accountId: '139570105\n03',
    wecomPhone: '139570\n10503',
    mainDept: '衢州君悦佳奥汽车有限公司',
    subDept: '销售部',
    role: '销售经理',
    isActive: true,
    updateTime: '2026-04-11 11:26:12',
    actionText: '解绑',
    autoDelete: true
  }
]);

const toggleStatus = (row: any) => {
  row.isActive = !row.isActive;
};

// --- 多选状态逻辑 ---
const selectedIds = ref<number[]>([]);

// 模拟分页数据（假设当前就在第1页，展示这8条数据，但总共有108条查询结果）
const isCurrentPageAllSelected = computed(() => tableData.value.length > 0 && tableData.value.every(row => selectedIds.value.includes(row.id)));
const isGlobalAllSelected = ref(false); // 记录是否点击了“一键全选”（选中了所有108条）

// 姓名左侧的当前页全选
const toggleCurrentPageAll = () => {
  if (isCurrentPageAllSelected.value) {
    // 取消当前页的选中状态
    selectedIds.value = selectedIds.value.filter(id => !tableData.value.find(r => r.id === id));
    isGlobalAllSelected.value = false;
  } else {
    // 选中当前页的所有数据
    const currentPageIds = tableData.value.map(row => row.id);
    const newIds = new Set([...selectedIds.value, ...currentPageIds]);
    selectedIds.value = Array.from(newIds);
  }
};

// 一键全选（选中当前筛选条件下的所有数据，这里用个特定的标识或文字提示来模拟）
const toggleGlobalAll = () => {
  isGlobalAllSelected.value = true;
  // 选中当前页以获得视觉反馈
  selectedIds.value = tableData.value.map(row => row.id);
};

// 单条勾选时如果取消，也要同步取消全局全选状态
const toggleSingle = (id: number) => {
  if (selectedIds.value.includes(id)) {
    selectedIds.value = selectedIds.value.filter(i => i !== id);
    isGlobalAllSelected.value = false;
  } else {
    selectedIds.value.push(id);
  }
};

// --- 批量离职设置逻辑 ---
const showBatchModal = ref(false);
const batchOption = ref('1');
const openBatchModal = () => {
  if (selectedIds.value.length === 0) {
    alert('请先选择需要设置的数据');
    return;
  }
  showBatchModal.value = true;
};
const confirmBatch = () => {
  const autoDel = batchOption.value === '1';
  
  if (isGlobalAllSelected.value) {
    // 如果是全局全选，这里模拟将所有数据都更新（真实情况下会调用后端接口）
    tableData.value.forEach(row => {
      row.autoDelete = autoDel;
    });
    alert('已成功为所有 108 条数据批量设置了离职规则！');
  } else {
    tableData.value.forEach(row => {
      if (selectedIds.value.includes(row.id)) {
        row.autoDelete = autoDel;
      }
    });
    alert('批量设置成功！');
  }
  
  showBatchModal.value = false;
  selectedIds.value = [];
  isGlobalAllSelected.value = false;
};

// --- 编辑弹窗逻辑 ---
const showEditModal = ref(false);
const editForm = ref({
  id: 0,
  name: '',
  phone: '',
  role: '',
  autoDelete: true
});
const openEditModal = (row: any) => {
  editForm.value = {
    id: row.id,
    name: row.name,
    phone: row.phone.replace('\n', ''),
    role: row.role === '--' ? '' : row.role,
    autoDelete: row.autoDelete
  };
  showEditModal.value = true;
};
const saveEdit = () => {
  const row = tableData.value.find(r => r.id === editForm.value.id);
  if (row) {
    row.name = editForm.value.name;
    row.autoDelete = editForm.value.autoDelete;
  }
  showEditModal.value = false;
};

// 侧边栏折叠状态
const isSidebarHovered = ref(false);

const backToHome = () => {
  router.push('/');
};
</script>

<template>
  <div class="min-h-screen flex bg-[#f5f6f8] text-sm font-sans text-gray-800 overflow-hidden">
    
    <!-- 左侧边栏 -->
    <div 
      class="bg-[#1a1b1e] text-gray-300 flex flex-col shrink-0 transition-all duration-300 relative z-50 group"
      :class="isSidebarHovered ? 'w-[200px]' : 'w-[64px]'"
      @mouseenter="isSidebarHovered = true"
      @mouseleave="isSidebarHovered = false"
    >
      <div class="h-14 flex items-center px-4 text-white font-bold text-base tracking-wide border-b border-white/5 whitespace-nowrap overflow-hidden shrink-0" :class="isSidebarHovered ? '' : 'justify-center !px-0'">
        <button @click="backToHome" class="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors shrink-0 rounded hover:bg-white/10" :class="isSidebarHovered ? 'mr-2' : 'mx-auto'" title="返回首页">
          <ChevronLeft :size="20" />
        </button>
        <span v-if="isSidebarHovered" class="transition-opacity duration-300">企业微信管理平台</span>
      </div>
      <div class="flex-1 overflow-y-auto py-4 custom-scrollbar space-y-1 overflow-x-hidden">
        
        <div class="py-2.5 flex items-center justify-between hover:text-white cursor-pointer transition-colors group" :class="isSidebarHovered ? 'px-4' : 'px-0 justify-center'">
          <div class="flex items-center" :class="isSidebarHovered ? 'gap-3' : 'justify-center w-full'">
            <Settings :size="16" class="group-hover:text-white shrink-0" />
            <span v-if="isSidebarHovered" class="whitespace-nowrap">系统设置</span>
          </div>
          <ChevronDown v-if="isSidebarHovered" :size="14" class="rotate-180 shrink-0" />
        </div>
        
        <!-- 子菜单 -->
        <div v-if="isSidebarHovered" class="bg-[#141518] py-1 space-y-0.5 whitespace-nowrap">
          <div class="px-10 py-2 hover:text-white cursor-pointer transition-colors">主体管理</div>
          <div class="px-10 py-2 bg-[#e54d4d] text-white font-medium cursor-pointer transition-colors">员工管理</div>
          <div class="px-10 py-2 hover:text-white cursor-pointer transition-colors">部门管理</div>
          <div class="px-10 py-2 hover:text-white cursor-pointer transition-colors">角色管理</div>
          <div class="px-10 py-2 hover:text-white cursor-pointer transition-colors">个人设置</div>
          <div class="px-10 py-2 hover:text-white cursor-pointer transition-colors">售后线索同步</div>
        </div>
        <!-- 折叠状态下的高亮提示点 -->
        <div v-else class="flex justify-center my-1">
          <div class="w-1.5 h-1.5 rounded-full bg-[#e54d4d]"></div>
        </div>

        <div class="py-2.5 flex items-center justify-between hover:text-white cursor-pointer transition-colors group mt-2" :class="isSidebarHovered ? 'px-4' : 'px-0 justify-center'">
          <div class="flex items-center" :class="isSidebarHovered ? 'gap-3' : 'justify-center w-full'">
            <User :size="16" class="group-hover:text-white shrink-0" />
            <span v-if="isSidebarHovered" class="whitespace-nowrap">客户联系</span>
          </div>
          <ChevronDown v-if="isSidebarHovered" :size="14" class="-rotate-90 shrink-0" />
        </div>
        <div class="py-2.5 flex items-center justify-between hover:text-white cursor-pointer transition-colors group" :class="isSidebarHovered ? 'px-4' : 'px-0 justify-center'">
          <div class="flex items-center" :class="isSidebarHovered ? 'gap-3' : 'justify-center w-full'">
            <Users :size="16" class="group-hover:text-white shrink-0" />
            <span v-if="isSidebarHovered" class="whitespace-nowrap">客群管理</span>
          </div>
          <ChevronDown v-if="isSidebarHovered" :size="14" class="-rotate-90 shrink-0" />
        </div>
        <div class="py-2.5 flex items-center justify-between hover:text-white cursor-pointer transition-colors group" :class="isSidebarHovered ? 'px-4' : 'px-0 justify-center'">
          <div class="flex items-center" :class="isSidebarHovered ? 'gap-3' : 'justify-center w-full'">
            <Tag :size="16" class="group-hover:text-white shrink-0" />
            <span v-if="isSidebarHovered" class="whitespace-nowrap">营销中心</span>
          </div>
          <ChevronDown v-if="isSidebarHovered" :size="14" class="-rotate-90 shrink-0" />
        </div>
        <div class="py-2.5 flex items-center justify-between hover:text-white cursor-pointer transition-colors group" :class="isSidebarHovered ? 'px-4' : 'px-0 justify-center'">
          <div class="flex items-center" :class="isSidebarHovered ? 'gap-3' : 'justify-center w-full'">
            <Box :size="16" class="group-hover:text-white shrink-0" />
            <span v-if="isSidebarHovered" class="whitespace-nowrap">内容中心</span>
          </div>
          <ChevronDown v-if="isSidebarHovered" :size="14" class="-rotate-90 shrink-0" />
        </div>
        <div class="py-2.5 flex items-center justify-between hover:text-white cursor-pointer transition-colors group" :class="isSidebarHovered ? 'px-4' : 'px-0 justify-center'">
          <div class="flex items-center" :class="isSidebarHovered ? 'gap-3' : 'justify-center w-full'">
            <LayoutGrid :size="16" class="group-hover:text-white shrink-0" />
            <span v-if="isSidebarHovered" class="whitespace-nowrap">运营工具</span>
          </div>
          <ChevronDown v-if="isSidebarHovered" :size="14" class="-rotate-90 shrink-0" />
        </div>
        <div class="py-2.5 flex items-center justify-between hover:text-white cursor-pointer transition-colors group" :class="isSidebarHovered ? 'px-4' : 'px-0 justify-center'">
          <div class="flex items-center" :class="isSidebarHovered ? 'gap-3' : 'justify-center w-full'">
            <PieChart :size="16" class="group-hover:text-white shrink-0" />
            <span v-if="isSidebarHovered" class="whitespace-nowrap">BI看板</span>
          </div>
          <ChevronDown v-if="isSidebarHovered" :size="14" class="-rotate-90 shrink-0" />
        </div>
        <div class="py-2.5 flex items-center justify-between hover:text-white cursor-pointer transition-colors group mt-8" :class="isSidebarHovered ? 'px-4' : 'px-0 justify-center'">
          <div class="flex items-center" :class="isSidebarHovered ? 'gap-3' : 'justify-center w-full'">
            <Database :size="16" class="group-hover:text-white shrink-0" />
            <span v-if="isSidebarHovered" class="whitespace-nowrap">管理中心</span>
          </div>
          <ChevronDown v-if="isSidebarHovered" :size="14" class="-rotate-90 shrink-0" />
        </div>
      </div>
    </div>

    <!-- 右侧主内容区 -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <!-- 顶栏 -->
      <div class="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 relative z-20">
        <!-- 开发者提示信息 -->
        <div class="absolute top-3 left-1/2 -translate-x-1/2 bg-gray-800 text-gray-200 px-3 py-1.5 rounded-md text-xs font-mono shadow-md flex items-center gap-2 border border-gray-700/50 z-50 group hover:bg-gray-900 transition-colors">
          <Code :size="14" class="text-blue-400" />
          <span>开发文件路径:</span>
          <span class="text-green-400 select-all group-hover:text-green-300">src/features/delete-friend-settings/DeleteFriendSettingsPage.vue</span>
        </div>

        <div class="text-gray-500 text-sm">系统设置 > <span class="text-gray-800">员工管理</span></div>
        <div class="flex items-center gap-2 cursor-pointer">
          <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white">
            <User :size="16" />
          </div>
          <span class="text-gray-600 text-sm">李荣</span>
          <ChevronDown :size="14" class="text-gray-400" />
        </div>
      </div>

      <!-- 内容区滚动 -->
      <div class="flex-1 overflow-y-auto p-4 custom-scrollbar flex flex-col gap-4">
        
        <!-- 筛选卡片 -->
        <div class="bg-white rounded shadow-sm border border-gray-100 p-5 shrink-0">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 mb-4">
            <!-- 部门 -->
            <div class="flex items-center gap-3">
              <label class="w-20 text-right text-gray-600 whitespace-nowrap">部门：</label>
              <div class="relative flex-1">
                <select v-model="filters.department" class="w-full h-9 pl-3 pr-8 border border-gray-200 rounded text-sm text-gray-600 outline-none focus:border-blue-500 appearance-none bg-white">
                  <option value="" disabled selected>请选择或者搜索部门</option>
                  <option value="dept1">销售部</option>
                </select>
                <ChevronDown :size="14" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
            
            <!-- 姓名或手机号 -->
            <div class="flex items-center gap-3">
              <label class="w-24 text-right text-gray-600 whitespace-nowrap">姓名或手机号：</label>
              <input type="text" v-model="filters.nameOrPhone" placeholder="请填姓名或手机号" class="flex-1 h-9 px-3 border border-gray-200 rounded text-sm text-gray-800 outline-none focus:border-blue-500 placeholder-gray-400" />
            </div>

            <!-- 角色 -->
            <div class="flex items-center gap-3">
              <label class="w-20 text-right text-gray-600 whitespace-nowrap">角色：</label>
              <div class="relative flex-1">
                <select v-model="filters.role" class="w-full h-9 pl-3 pr-8 border border-gray-200 rounded text-sm text-gray-600 outline-none focus:border-blue-500 appearance-none bg-white">
                  <option value="" disabled selected>请选择角色</option>
                  <option value="role1">销售</option>
                </select>
                <ChevronDown :size="14" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <!-- 开通状态 -->
            <div class="flex items-center gap-3">
              <label class="w-20 text-right text-gray-600 whitespace-nowrap">开通状态：</label>
              <div class="relative flex-1">
                <select v-model="filters.status" class="w-full h-9 pl-3 pr-8 border border-gray-200 rounded text-sm text-gray-600 outline-none focus:border-blue-500 appearance-none bg-white">
                  <option value="" disabled selected>请选择当前状态</option>
                  <option value="1">已开通</option>
                  <option value="0">未开通</option>
                </select>
                <ChevronDown :size="14" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <!-- 所属主体 -->
            <div class="flex items-center gap-3">
              <label class="w-24 text-right text-gray-600 whitespace-nowrap">所属主体：</label>
              <input type="text" v-model="filters.subject" placeholder="请搜索" class="flex-1 h-9 px-3 border border-gray-200 rounded text-sm text-gray-800 outline-none focus:border-blue-500 placeholder-gray-400" />
            </div>

            <!-- EP岗位 -->
            <div class="flex items-center gap-3">
              <label class="w-20 text-right text-gray-600 whitespace-nowrap">EP岗位：</label>
              <input type="text" v-model="filters.epPost" placeholder="请搜索" class="flex-1 h-9 px-3 border border-gray-200 rounded text-sm text-gray-800 outline-none focus:border-blue-500 placeholder-gray-400" />
            </div>

            <!-- 账号id -->
            <div class="flex items-center gap-3">
              <label class="w-20 text-right text-gray-600 whitespace-nowrap">账号id：</label>
              <input type="text" v-model="filters.accountId" placeholder="请输入" class="flex-1 h-9 px-3 border border-gray-200 rounded text-sm text-gray-800 outline-none focus:border-blue-500 placeholder-gray-400" />
            </div>
          </div>

          <div class="flex justify-end gap-3 mt-2">
            <button class="px-6 h-9 bg-[#e54d4d] text-white rounded text-sm hover:bg-red-600 transition-colors font-medium">查询</button>
            <button class="px-6 h-9 bg-gray-100 text-gray-600 border border-gray-200 rounded text-sm hover:bg-gray-200 transition-colors font-medium">重置</button>
          </div>
        </div>

        <!-- 表格卡片 -->
        <div class="bg-white rounded shadow-sm border border-gray-100 flex flex-col flex-1 min-h-0 overflow-hidden">
          <div class="p-4 border-b border-gray-100 shrink-0 flex items-center gap-3">
            <button class="px-4 h-8 bg-[#e54d4d] text-white rounded text-sm hover:bg-red-600 transition-colors font-medium flex items-center gap-1">
              新增
            </button>
            <button @click="toggleGlobalAll" class="px-4 h-8 bg-white border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50 transition-colors font-medium flex items-center gap-1 relative overflow-hidden group">
              <span class="relative z-10">一键全选</span>
            </button>
            <button @click="openBatchModal" class="px-4 h-8 bg-white border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50 transition-colors font-medium flex items-center gap-1">
              批量离职设置
            </button>
          </div>

          <div class="flex-1 overflow-auto custom-scrollbar relative">
            <table class="w-full text-center border-collapse whitespace-nowrap text-xs">
              <thead class="sticky top-0 bg-[#f9fafb] z-10 shadow-sm text-gray-700">
                <!-- 第一行表头 -->
                <tr>
                  <th rowspan="2" class="p-3 border border-gray-200 w-10 text-center">
                    <input type="checkbox" :checked="isCurrentPageAllSelected || isGlobalAllSelected" @change="toggleCurrentPageAll" class="w-3.5 h-3.5 cursor-pointer accent-[#e54d4d]" />
                  </th>
                  <th rowspan="2" class="p-3 border border-gray-200 font-bold min-w-[70px]">姓名</th>
                  <th rowspan="2" class="p-3 border border-gray-200 font-bold min-w-[90px]">手机号</th>
                  <th colspan="4" class="p-2 border border-gray-200 font-bold bg-gray-50/50">来自EP</th>
                  <th colspan="4" class="p-2 border border-gray-200 font-bold bg-gray-50/50">企微原生</th>
                  <th colspan="3" class="p-2 border border-gray-200 font-bold bg-gray-50/50">企微自建后台</th>
                  <th rowspan="2" class="p-3 border border-gray-200 font-bold min-w-[70px]">开通状态</th>
                  <th rowspan="2" class="p-3 border border-gray-200 font-bold min-w-[130px]">更新时间</th>
                  <th rowspan="2" class="p-3 border border-gray-200 font-bold min-w-[80px]">操作</th>
                </tr>
                <!-- 第二行表头 -->
                <tr class="text-[11px] text-gray-600">
                  <th class="p-2 border border-gray-200 font-medium">P码</th>
                  <th class="p-2 border border-gray-200 font-medium min-w-[160px] whitespace-normal leading-tight">经销商</th>
                  <th class="p-2 border border-gray-200 font-medium">EP岗位</th>
                  <th class="p-2 border border-gray-200 font-medium">在职状态</th>
                  
                  <th class="p-2 border border-gray-200 font-medium min-w-[120px] whitespace-normal leading-tight">所属企业主体</th>
                  <th class="p-2 border border-gray-200 font-medium">已关联企微</th>
                  <th class="p-2 border border-gray-200 font-medium">账号id</th>
                  <th class="p-2 border border-gray-200 font-medium">手机号</th>

                  <th class="p-2 border border-gray-200 font-medium min-w-[160px] whitespace-normal leading-tight">主部门</th>
                  <th class="p-2 border border-gray-200 font-medium">辅部门</th>
                  <th class="p-2 border border-gray-200 font-medium">角色</th>
                </tr>
              </thead>
              <tbody class="text-gray-600">
                <tr v-for="row in tableData" :key="row.id" class="hover:bg-blue-50/30 transition-colors">
                  <td class="p-3 border border-gray-100 text-center">
                    <input type="checkbox" :checked="selectedIds.includes(row.id) || isGlobalAllSelected" @change="toggleSingle(row.id)" class="w-3.5 h-3.5 cursor-pointer accent-[#e54d4d]" />
                  </td>
                  <td class="p-3 border border-gray-100">{{ row.name }}</td>
                  <td class="p-3 border border-gray-100 whitespace-pre-wrap leading-snug text-[11px]">{{ row.phone }}</td>
                  <td class="p-3 border border-gray-100 whitespace-pre-wrap leading-snug text-[11px]">{{ row.pCode }}</td>
                  <td class="p-3 border border-gray-100 whitespace-normal leading-relaxed text-left min-w-[160px]">{{ row.dealer }}</td>
                  <td class="p-3 border border-gray-100">{{ row.epPost }}</td>
                  <td class="p-3 border border-gray-100">{{ row.jobStatus }}</td>
                  
                  <td class="p-3 border border-gray-100 whitespace-normal leading-relaxed text-left min-w-[120px]">{{ row.subject.replace('\n', '') }}</td>
                  <td class="p-3 border border-gray-100">{{ row.wecomAccount }}</td>
                  <td class="p-3 border border-gray-100 whitespace-pre-wrap leading-snug text-[11px]">{{ row.accountId }}</td>
                  <td class="p-3 border border-gray-100 whitespace-pre-wrap leading-snug text-[11px]">{{ row.wecomPhone }}</td>
                  
                  <td class="p-3 border border-gray-100 whitespace-normal leading-relaxed text-left min-w-[160px]">{{ row.mainDept }}</td>
                  <td class="p-3 border border-gray-100">{{ row.subDept }}</td>
                  <td class="p-3 border border-gray-100">{{ row.role }}</td>
                  
                  <td class="p-3 border border-gray-100">
                    <button 
                      @click="toggleStatus(row)"
                      class="relative w-8 h-4 rounded-full transition-colors duration-300 mx-auto"
                      :class="row.isActive ? 'bg-[#e54d4d]' : 'bg-gray-300'"
                    >
                      <span 
                        class="absolute top-0.5 left-0.5 bg-white w-3 h-3 rounded-full shadow-sm transition-transform duration-300"
                        :class="row.isActive ? 'translate-x-4' : 'translate-x-0'"
                      ></span>
                    </button>
                  </td>
                  <td class="p-3 border border-gray-100 text-[11px] text-gray-500">{{ row.updateTime }}</td>
                  <td class="p-3 border border-gray-100">
                    <button @click="openEditModal(row)" class="text-[#e54d4d] hover:text-red-700 transition-colors mr-3 font-medium">编辑</button>
                    <button class="text-[#e54d4d] hover:text-red-700 transition-colors font-medium">{{ row.actionText }}</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- 分页器模拟 -->
          <div class="h-12 border-t border-gray-100 flex items-center justify-end px-4 text-xs text-gray-500 shrink-0 bg-white">
            <span class="mr-4">共 108 条</span>
            <div class="relative mr-4 cursor-pointer border border-gray-300 rounded-sm h-7 px-2 flex items-center gap-2 hover:border-gray-400">
              <span>10条/页</span>
              <ChevronDown :size="12" />
            </div>
            <div class="flex items-center gap-1">
              <button class="w-6 h-6 flex items-center justify-center hover:text-[#e54d4d] border border-transparent hover:border-gray-200 rounded"><ChevronDown :size="12" class="rotate-90" /></button>
              <button class="w-6 h-6 flex items-center justify-center text-white bg-[#e54d4d] rounded">1</button>
              <button class="w-6 h-6 flex items-center justify-center hover:text-[#e54d4d] border border-transparent hover:border-gray-200 rounded">2</button>
              <button class="w-6 h-6 flex items-center justify-center hover:text-[#e54d4d] border border-transparent hover:border-gray-200 rounded">3</button>
              <span>...</span>
              <button class="w-6 h-6 flex items-center justify-center hover:text-[#e54d4d] border border-transparent hover:border-gray-200 rounded">11</button>
              <button class="w-6 h-6 flex items-center justify-center hover:text-[#e54d4d] border border-transparent hover:border-gray-200 rounded"><ChevronDown :size="12" class="-rotate-90" /></button>
            </div>
          </div>
        </div>
        
      </div>
      
      <!-- Footer -->
      <div class="h-8 bg-[#8a8b8e] text-white/80 text-[11px] flex items-center justify-center gap-6 shrink-0 z-10">
        <span>京ICP备09000793号</span>
        <span>京公网安备22017102000263号</span>
        <span>运维联系电话：0431-85990175</span>
        <span>运维邮箱：ITeMail@faw-vw.com</span>
      </div>
    </div>
  </div>

  <!-- 批量离职设置弹窗 -->
  <div v-if="showBatchModal" class="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center">
    <div class="bg-white w-[420px] rounded-md shadow-lg flex flex-col overflow-hidden">
      <div class="h-12 px-5 flex items-center justify-between border-b border-gray-100">
        <span class="font-bold text-gray-800 text-base">批量离职设置</span>
        <button @click="showBatchModal = false" class="text-gray-400 hover:text-gray-600 transition-colors">
          <X :size="18" />
        </button>
      </div>
      <div class="p-6">
        <div class="text-sm text-gray-700 mb-4">
          请确认对选中的【<span class="text-[#e54d4d] font-bold">{{ isGlobalAllSelected ? '108' : selectedIds.length }}</span>】名顾问设置：
        </div>
        <div class="space-y-3 pl-2">
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="radio" v-model="batchOption" value="1" class="w-4 h-4 accent-[#e54d4d]" />
            <span class="text-sm text-gray-700">1、EP离职后，自动删除原生账号</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="radio" v-model="batchOption" value="2" class="w-4 h-4 accent-[#e54d4d]" />
            <span class="text-sm text-gray-700">2、EP离职后，不自动删除原生账号</span>
          </label>
        </div>
      </div>
      <div class="px-5 py-3 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
        <button @click="showBatchModal = false" class="px-4 py-1.5 border border-gray-300 text-gray-600 rounded hover:bg-gray-50 transition-colors text-sm">取消</button>
        <button @click="confirmBatch" class="px-4 py-1.5 bg-[#e54d4d] text-white rounded hover:bg-red-600 transition-colors text-sm">确定</button>
      </div>
    </div>
  </div>

  <!-- 编辑员工弹窗 -->
  <div v-if="showEditModal" class="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center">
    <div class="bg-white w-[520px] rounded-md shadow-lg flex flex-col overflow-hidden">
      <div class="h-14 px-6 flex items-center justify-between border-b border-gray-100">
        <span class="font-bold text-[#2d2d2d] text-[17px]">编辑员工</span>
        <button @click="showEditModal = false" class="text-gray-400 hover:text-gray-600 transition-colors">
          <X :size="20" />
        </button>
      </div>
      <div class="px-8 py-6 space-y-5">
        <div class="flex items-center">
          <label class="w-24 text-right pr-4 text-[#2d2d2d] text-[13px]"><span class="text-[#e64d4d] mr-1">*</span>姓名：</label>
          <input type="text" v-model="editForm.name" class="flex-1 h-8 px-3 border border-gray-200 rounded text-[13px] text-gray-800 outline-none focus:border-[#e54d4d]" />
        </div>
        <div class="flex items-center">
          <label class="w-24 text-right pr-4 text-[#2d2d2d] text-[13px]"><span class="text-[#e64d4d] mr-1">*</span>手机号：</label>
          <input type="text" v-model="editForm.phone" class="flex-1 h-8 px-3 border border-gray-200 rounded text-[13px] text-gray-800 outline-none focus:border-[#e54d4d]" />
        </div>
        <div class="flex items-center">
          <label class="w-24 text-right pr-4 text-[#2d2d2d] text-[13px]"><span class="text-[#e64d4d] mr-1">*</span>主部门：</label>
          <button class="h-8 px-4 border border-gray-200 bg-gray-50 text-gray-500 rounded text-[13px] hover:bg-gray-100 transition-colors">+ 添加部门</button>
        </div>
        <div class="flex items-center">
          <label class="w-24 text-right pr-4 text-[#2d2d2d] text-[13px]">辅部门：</label>
          <button class="h-8 px-4 border border-gray-200 bg-gray-50 text-gray-500 rounded text-[13px] hover:bg-gray-100 transition-colors">+ 添加部门</button>
        </div>
        <div class="flex items-center">
          <label class="w-24 text-right pr-4 text-[#2d2d2d] text-[13px]"><span class="text-[#e64d4d] mr-1">*</span>角色：</label>
          <div class="relative flex-1">
            <select v-model="editForm.role" class="w-full h-8 pl-3 pr-8 border border-gray-200 rounded text-[13px] text-gray-800 outline-none focus:border-[#e54d4d] appearance-none bg-white">
              <option value="" disabled selected>请选择角色</option>
              <option value="售前销售">售前销售</option>
              <option value="售后总监">售后总监</option>
              <option value="销售经理">销售经理</option>
            </select>
            <ChevronDown :size="14" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div class="flex items-center">
          <label class="w-56 text-right pr-4 text-[#2d2d2d] text-[13px] whitespace-nowrap"><span class="text-[#e64d4d] mr-1">*</span>EP离职后是否自动删除原生账号：</label>
          <div class="flex items-center gap-6 flex-1 h-8">
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="radio" v-model="editForm.autoDelete" :value="true" class="w-3.5 h-3.5 accent-[#e54d4d]" />
              <span class="text-[13px] text-[#2d2d2d]">是</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="radio" v-model="editForm.autoDelete" :value="false" class="w-3.5 h-3.5 accent-[#e54d4d]" />
              <span class="text-[13px] text-[#2d2d2d]">否</span>
            </label>
          </div>
        </div>
      </div>
      <div class="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-white">
        <button @click="showEditModal = false" class="px-5 py-1.5 border border-gray-200 text-gray-600 rounded text-[13px] hover:bg-gray-50 transition-colors">取 消</button>
        <button @click="saveEdit" class="px-5 py-1.5 bg-[#e8504e] text-white rounded text-[13px] hover:bg-red-600 transition-colors shadow-sm">保 存</button>
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

table th {
  position: sticky;
  top: 0;
  z-index: 10;
}
table th[colspan] {
  border-bottom: 1px solid #e5e7eb;
}
table tr:first-child th {
  border-bottom: none;
}
</style>
