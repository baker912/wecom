<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import PrototypeCodeLocation from '../../components/PrototypeCodeLocation.vue';
import { BarChart2, Briefcase, CalendarDays, ChevronDown, ChevronLeft, LayoutGrid, MessageCircle, MessageSquare, Monitor, Plus, Search, Settings, User, Users } from 'lucide-vue-next';

const router = useRouter();
const activeMenu = ref('人群包');
const expandedMenu = ref('运营工具');

const filters = ref({
  name: '',
  status: '',
  creator: '',
  department: '',
  startDate: '',
  endDate: ''
});

const statusOptions = ['全部', '已启用', '已停用'];

const departmentOptions = [
  '全部',
  '北京奥迪世达汽车销售服务有限公司',
  '上海奥迪东昌汽车销售服务有限公司',
  '广州奥迪锦龙汽车销售服务有限公司'
];

const rows = ref([
  { id: 'AP20260201001', name: '这里是人群包名称', desc: '这里是描述', createMode: '标签组合圈选', creator: '朱云', dept: '北京奥迪世达汽车销售服务有限公司', createdAt: '2026-02-11 10:45:02', status: '已启用' },
  { id: 'AP20260201002', name: '高潜客户圈选', desc: 'CDP标签+属性组合圈选', createMode: '标签组合圈选', creator: '李松浩', dept: '上海奥迪东昌汽车销售服务有限公司', createdAt: '2026-02-12 09:12:36', status: '已启用' },
  { id: 'AP20260201003', name: '沉默客户唤醒', desc: '近90天无互动客户', createMode: '导入车辆VIN码', creator: '佟麟阁', dept: '广州奥迪锦龙汽车销售服务有限公司', createdAt: '2026-02-13 16:22:10', status: '已停用' },
  { id: 'AP20260201004', name: '保养到期提醒', desc: '保养到期时间属性筛选', createMode: '标签组合圈选', creator: '李万滔', dept: '北京奥迪世达汽车销售服务有限公司', createdAt: '2026-02-14 11:08:44', status: '已启用' },
  { id: 'AP20260201005', name: '新客激活人群', desc: '新近成交客户激活', createMode: '导入车辆VIN码', creator: '朱云', dept: '上海奥迪东昌汽车销售服务有限公司', createdAt: '2026-02-15 14:30:18', status: '已启用' },
  { id: 'AP20260201006', name: '置换意向客户', desc: '置换意向标签圈选', createMode: '标签组合圈选', creator: '佟麟阁', dept: '广州奥迪锦龙汽车销售服务有限公司', createdAt: '2026-02-16 09:46:55', status: '已停用' }
]);

const filteredRows = computed(() => {
  return rows.value.filter(row => {
    const nameMatch = !filters.value.name || row.name.includes(filters.value.name);
    const statusMatch = !filters.value.status || filters.value.status === '全部' || row.status === filters.value.status;
    const creatorMatch = !filters.value.creator || row.creator.includes(filters.value.creator);
    const deptMatch = !filters.value.department || filters.value.department === '全部' || row.dept === filters.value.department;
    return nameMatch && statusMatch && creatorMatch && deptMatch;
  });
});

const showToggleModal = ref(false);
const toggleTargetId = ref<string | null>(null);
const toggleNextStatus = ref<'已启用' | '已停用'>('已停用');

const openToggleModal = (row: (typeof rows.value)[number]) => {
  toggleTargetId.value = row.id;
  toggleNextStatus.value = row.status === '已启用' ? '已停用' : '已启用';
  showToggleModal.value = true;
};

const closeToggleModal = () => {
  showToggleModal.value = false;
  toggleTargetId.value = null;
};

const confirmToggleStatus = () => {
  if (!toggleTargetId.value) return;
  const row = rows.value.find(r => r.id === toggleTargetId.value);
  if (!row) {
    closeToggleModal();
    return;
  }
  row.status = toggleNextStatus.value;
  closeToggleModal();
};

const handleSubMenuClick = (subItem: string) => {
  activeMenu.value = subItem;
  if (subItem === '个人SOP') router.push('/features/personal-sop/new');
  if (subItem === '人群包') router.push('/features/audience-package');
};

const openDetail = (row: (typeof rows.value)[number]) => {
  localStorage.setItem('audience-package-detail', JSON.stringify({
    id: row.id,
    name: row.name,
    desc: row.desc,
    createMode: row.createMode,
    creator: row.creator,
    dept: row.dept,
    createdAt: row.createdAt,
    status: row.status
  }));
  router.push(`/features/audience-package/${row.id}/view`);
};

const handleMenuClick = (item: typeof menuItems[0]) => {
  if (item.subItems) {
    expandedMenu.value = expandedMenu.value === item.label ? '' : item.label;
  } else {
    activeMenu.value = item.label;
  }
};

const menuItems = [
  { icon: Settings, label: '系统设置' },
  { icon: User, label: '客户联系' },
  { icon: Users, label: '客群管理' },
  { icon: Monitor, label: '营销中心' },
  { icon: MessageSquare, label: '内容中心' },
  { 
    icon: Briefcase, 
    label: '运营工具',
    subItems: ['客户欢迎语', '消息群发', '客户朋友圈', '标签拉群', '个人SOP', '人群包']
  },
  { icon: BarChart2, label: 'BI看板' },
  { icon: LayoutGrid, label: '管理中心' },
];

const resetFilters = () => {
  filters.value = {
    name: '',
    status: '',
    creator: '',
    department: '',
    startDate: '',
    endDate: ''
  };
};
</script>

<template>
  <div class="flex min-h-screen bg-gray-100 font-sans text-sm min-w-[1280px]">
    <div class="w-16 hover:w-52 bg-[#1a1a1a] text-[#b3b3b3] flex flex-col shrink-0 transition-all duration-300 group overflow-hidden relative z-50">
      <div class="h-14 flex items-center px-4 border-b border-[#333] gap-2 whitespace-nowrap overflow-hidden">
        <button 
          @click="router.push('/')" 
          class="text-white bg-[#333] p-1 rounded-full hover:bg-[#444] transition-colors shrink-0 flex items-center justify-center" 
          title="返回首页"
        >
          <ChevronLeft :size="16" />
        </button>
        <span class="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 truncate">企业微信管理平台</span>
      </div>
      
      <div class="flex-1 overflow-y-auto overflow-x-hidden py-3">
        <div v-for="item in menuItems" :key="item.label">
          <div 
            :class="`px-4 py-2.5 flex items-center justify-between cursor-pointer hover:text-white hover:bg-[#333] transition-colors whitespace-nowrap ${
              activeMenu === item.label ? 'text-white' : ''
            }`"
            @click="handleMenuClick(item)"
          >
            <div class="flex items-center gap-2.5">
              <div class="shrink-0">
                <component :is="item.icon" :size="20" />
              </div>
              <span class="text-[13px] opacity-0 group-hover:opacity-100 transition-opacity duration-300">{{ item.label }}</span>
            </div>
            <ChevronDown 
              v-if="item.subItems" 
              :size="12" 
              :class="`transition-transform duration-200 opacity-0 group-hover:opacity-100 ${expandedMenu === item.label ? 'rotate-180' : ''}`" 
            />
          </div>
          
          <div v-if="item.subItems && expandedMenu === item.label" class="bg-[#111] hidden group-hover:block">
            <div
              v-for="subItem in item.subItems"
              :key="subItem"
              :class="`pl-11 pr-4 py-2 cursor-pointer transition-colors text-[13px] whitespace-nowrap ${
                activeMenu === subItem 
                  ? 'bg-[#e53935] text-white' 
                  : 'hover:text-white hover:bg-[#333]'
              }`"
              @click="handleSubMenuClick(subItem)"
            >
              {{ subItem }}
            </div>
          </div>
        </div>
      </div>
      
      <div class="p-3 border-t border-[#333] flex justify-center group-hover:justify-start">
         <button class="flex items-center gap-2 text-[#b3b3b3] hover:text-white">
           <MessageCircle :size="20" />
           <span class="text-[13px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap hidden group-hover:inline">消息通知</span>
         </button>
      </div>
    </div>

    <div class="flex-1 flex flex-col min-w-0">
      <div class="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-10">
        <div class="flex items-center text-gray-500 gap-2">
          <span>运营工具</span>
          <span class="text-gray-300">/</span>
          <span class="text-gray-800">人群包</span>
        </div>
        <div class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded">
          <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
            闻
          </div>
          <span class="text-gray-700">闻浩</span>
          <ChevronDown :size="14" class="text-gray-400" />
        </div>
      </div>

      <div class="flex-1 overflow-y-auto p-4">
        <div class="bg-white rounded shadow-sm p-6 min-h-full flex flex-col">
          <div class="grid grid-cols-3 gap-x-8 gap-y-4 mb-6">
            <div class="flex items-center gap-3">
              <span class="text-gray-600 w-20 text-right">人群包名称:</span>
              <input v-model="filters.name" type="text" placeholder="请输入" class="flex-1 h-9 px-3 border border-gray-300 rounded focus:border-red-500 focus:outline-none" />
            </div>

            <div class="flex items-center gap-3">
              <span class="text-gray-600 w-20 text-right">状态:</span>
              <div class="flex-1 h-9 border border-gray-300 rounded flex items-center justify-between px-3 text-gray-700">
                <select v-model="filters.status" class="w-full bg-transparent outline-none">
                  <option v-for="opt in statusOptions" :key="opt" :value="opt === '全部' ? '全部' : opt">{{ opt }}</option>
                </select>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <span class="text-gray-600 w-20 text-right">创建人:</span>
              <input v-model="filters.creator" type="text" placeholder="请输入" class="flex-1 h-9 px-3 border border-gray-300 rounded focus:border-red-500 focus:outline-none" />
            </div>

            <div class="flex items-center gap-3">
              <span class="text-gray-600 w-20 text-right">创建时间:</span>
              <div class="flex-1 flex items-center gap-2">
                <div class="flex-1 h-9 px-3 border border-gray-300 rounded flex items-center gap-2 text-gray-700">
                  <CalendarDays :size="14" class="text-gray-400" />
                  <input v-model="filters.startDate" type="text" placeholder="开始日期" class="w-full bg-transparent outline-none text-xs" />
                </div>
                <span class="text-gray-400">至</span>
                <div class="flex-1 h-9 px-3 border border-gray-300 rounded flex items-center gap-2 text-gray-700">
                  <CalendarDays :size="14" class="text-gray-400" />
                  <input v-model="filters.endDate" type="text" placeholder="结束日期" class="w-full bg-transparent outline-none text-xs" />
                </div>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <span class="text-gray-600 w-20 text-right">所属门店:</span>
              <div class="flex-1 h-9 border border-gray-300 rounded flex items-center justify-between px-3 text-gray-700">
                <select v-model="filters.department" class="w-full bg-transparent outline-none">
                  <option v-for="opt in departmentOptions" :key="opt" :value="opt">{{ opt }}</option>
                </select>
              </div>
            </div>

            <div class="flex items-center gap-3 justify-end">
              <button class="h-9 px-4 bg-[#e53935] text-white rounded hover:bg-red-700 transition-colors flex items-center gap-2">
                <Search :size="14" />
                查询
              </button>
              <button @click="resetFilters" class="h-9 px-4 border border-gray-300 text-gray-600 rounded hover:bg-gray-50 transition-colors">
                重置
              </button>
            </div>
          </div>

          <div class="h-[1px] bg-gray-100 mb-6"></div>

          <div class="flex justify-between items-center mb-4">
            <div class="flex gap-3">
              <button @click="router.push('/features/audience-package/new')" class="h-9 px-4 bg-[#e53935] text-white rounded flex items-center gap-2 hover:bg-red-700 transition-colors shadow-sm">
                <Plus :size="14" />
                新增人群包
              </button>
            </div>
          </div>

          <div class="flex-1 border border-gray-200 rounded overflow-hidden flex flex-col">
            <div class="overflow-x-auto">
              <table class="w-full min-w-[1100px]">
                <thead class="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th class="px-4 py-3 text-left font-medium text-gray-600">人群包ID</th>
                    <th class="px-4 py-3 text-left font-medium text-gray-600">人群包名称</th>
                    <th class="px-4 py-3 text-left font-medium text-gray-600">描述</th>
                    <th class="px-4 py-3 text-left font-medium text-gray-600">创建方式</th>
                    <th class="px-4 py-3 text-left font-medium text-gray-600">创建人</th>
                    <th class="px-4 py-3 text-left font-medium text-gray-600">创建人所属部门</th>
                    <th class="px-4 py-3 text-left font-medium text-gray-600">创建时间</th>
                    <th class="px-4 py-3 text-left font-medium text-gray-600">状态</th>
                    <th class="px-4 py-3 text-center font-medium text-gray-600 w-[180px]">操作</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr v-for="row in filteredRows" :key="row.id" class="hover:bg-gray-50 transition-colors">
                    <td class="px-4 py-3 text-gray-700 font-mono">{{ row.id }}</td>
                    <td class="px-4 py-3 text-gray-700">{{ row.name }}</td>
                    <td class="px-4 py-3 text-gray-700">{{ row.desc }}</td>
                    <td class="px-4 py-3 text-gray-700">{{ row.createMode }}</td>
                    <td class="px-4 py-3 text-gray-700">{{ row.creator }}</td>
                    <td class="px-4 py-3 text-gray-700">{{ row.dept }}</td>
                    <td class="px-4 py-3 text-gray-500">{{ row.createdAt }}</td>
                    <td class="px-4 py-3">
                      <span :class="row.status === '已启用' ? 'text-green-600' : 'text-gray-500'">{{ row.status }}</span>
                    </td>
                    <td class="px-4 py-3 text-center">
                      <div class="flex items-center justify-center gap-3">
                        <button class="text-[#333] hover:underline" @click="openDetail(row)">详情</button>
                        <button class="text-[#333] hover:underline" @click="openToggleModal(row)">{{ row.status === '已启用' ? '停用' : '启用' }}</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="flex items-center justify-end gap-4 mt-4 text-gray-600 text-xs">
            <span>共 {{ filteredRows.length }} 条</span>
            <div class="flex items-center gap-2 border border-gray-300 rounded px-2 py-1">
              10条/页
              <ChevronDown :size="14" />
            </div>
            <div class="flex items-center gap-2">
              <button class="w-6 h-6 flex items-center justify-center border border-gray-200 rounded disabled:opacity-50" disabled>&lt;</button>
              <button class="w-6 h-6 flex items-center justify-center bg-[#e53935] text-white rounded">1</button>
              <button class="w-6 h-6 flex items-center justify-center border border-gray-200 rounded">&gt;</button>
            </div>
            <div class="flex items-center gap-2">
              <span>前往</span>
              <input type="text" value="1" class="w-8 h-6 border border-gray-300 rounded text-center" />
              <span>页</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <PrototypeCodeLocation
      mode="floating"
      position="top"
      containerClass="left-1/2 -translate-x-1/2 right-auto bottom-auto"
      folderPath="src/features/audience-package-management"
    />

    <div v-if="showToggleModal" class="fixed inset-0 z-[95] bg-black/30 flex items-center justify-center p-6">
      <div class="bg-white w-full max-w-md rounded shadow-lg border border-gray-200">
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div class="text-gray-800 font-bold">确认操作</div>
          <button @click="closeToggleModal" class="p-1 text-gray-400 hover:text-gray-600">
            <X :size="18" />
          </button>
        </div>
        <div class="px-6 py-6 text-sm text-gray-700">
          确认将该人群包{{ toggleNextStatus === '已启用' ? '启用' : '停用' }}？
        </div>
        <div class="px-6 pb-5 flex justify-end gap-3">
          <button @click="closeToggleModal" class="h-9 px-4 border border-gray-300 text-gray-600 rounded hover:bg-gray-50 transition-colors">
            取消
          </button>
          <button @click="confirmToggleStatus" class="h-9 px-4 bg-[#e53935] text-white rounded hover:bg-red-700 transition-colors">
            确认
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
