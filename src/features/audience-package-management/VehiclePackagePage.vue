<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import PrototypeCodeLocation from '../../components/PrototypeCodeLocation.vue';
import { BarChart2, Briefcase, CalendarDays, ChevronDown, ChevronLeft, LayoutGrid, MessageCircle, MessageSquare, Monitor, Plus, Search, Settings, User, Users, History } from 'lucide-vue-next';

const router = useRouter();
const activeMenu = ref('车辆包');
const expandedMenu = ref('运营工具');

const filters = ref({
  name: '',
  code: '',
  status: '全部',
  startDate: '',
  endDate: ''
});

const statusOptions = ['全部', '有效', '计算中', '停用'];

const rows = ref([
  { name: 'yx 车群', code: 'VG202603241', description: '用于卡券发放的测试车群', system: 'ONEAPP', createdAt: '2026-03-26 10:33:38', creator: 'yutao.zou', type: 'VIN', vehicleCount: 1, peopleCount: '-', status: '有效' },
  { name: '增量推送车群vw', code: 'VG202603242', description: 'VW增量推送场景', system: 'ONEAPP', createdAt: '2026-03-24 16:45:59', creator: 'yutao.zou', type: 'VIN', vehicleCount: 1, peopleCount: '-', status: '有效' },
  { name: '小白测试纹车群', code: 'VG202603243', description: '功能测试用', system: 'ONEAPP', createdAt: '2026-03-21 13:06:05', creator: 'yutao.zou', type: 'VIN', vehicleCount: 1, peopleCount: '-', status: '有效' },
  { name: '车群同步处理中', code: 'VG202603201', description: 'CDP同步数据', system: 'CDP', createdAt: '2026-03-20 09:15:22', creator: 'system', type: 'VIN', vehicleCount: 0, peopleCount: '-', status: '计算中' },
  { name: '书包车群测试', code: 'VG202603181', description: '运营工具书包测试', system: 'CDP', createdAt: '2026-03-18 16:07:11', creator: 'wenchao.zhang.ms-1', type: 'VIN', vehicleCount: 2, peopleCount: '-', status: '停用' },
  { name: 'cc车群测试', code: 'VG202603161', description: 'CC个人测试', system: 'CDP', createdAt: '2026-03-16 10:43:14', creator: 'chen.chen.cp3', type: 'VIN', vehicleCount: 1, peopleCount: '-', status: '有效' },
  { name: '实时计算车群', code: 'VG202603151', description: '后台实时计算', system: 'ONEAPP', createdAt: '2026-03-15 14:22:10', creator: 'admin', type: 'VIN', vehicleCount: 152, peopleCount: '-', status: '有效' },
  { name: '小圈车辆属性签...', code: 'VG202602041', description: '车辆属性标签分群', system: 'ONEAPP', createdAt: '2026-02-04 15:47:25', creator: 'yutao.zou', type: 'VIN', vehicleCount: 1, peopleCount: '-', status: '有效' },
  { name: '杨景华p=3同星车...', code: 'VG202601261', description: '杨景华专用', system: 'ONEAPP', createdAt: '2026-01-26 16:34:25', creator: 'yutao.zou', type: 'VIN', vehicleCount: 5, peopleCount: '-', status: '有效' },
  { name: '小白匹配经车 大众', code: 'VG202601201', description: '大众品牌匹配', system: 'ONEAPP', createdAt: '2026-01-20 16:37:51', creator: 'yutao.zou', type: 'VIN', vehicleCount: 1, peopleCount: '-', status: '有效' },
  { name: 'dyy车辆分群', code: 'VG202601191', description: 'DYY业务分群', system: 'CDP', createdAt: '2026-01-19 09:35:11', creator: 'yanyan.duan', type: 'VIN', vehicleCount: 3, peopleCount: '-', status: '停用' },
  { name: 'yx车辆分群0115', code: 'VG202601151', description: 'YX历史遗留', system: 'ONEAPP', createdAt: '2026-01-15 14:39:22', creator: 'dingyuanxue', type: 'VIN', vehicleCount: 1, peopleCount: '-', status: '有效' }
]);

const toggleStatus = (row: any) => {
  if (row.status === '计算中') return;
  
  if (row.status === '有效') {
    row.status = '停用';
  } else if (row.status === '停用') {
    row.status = '有效';
  }
};

const filteredRows = computed(() => {
  return rows.value.filter(row => {
    const nameMatch = !filters.value.name || row.name.includes(filters.value.name);
    const codeMatch = !filters.value.code || row.code.includes(filters.value.code);
    const statusMatch = filters.value.status === '全部' || row.status === filters.value.status;
    return nameMatch && codeMatch && statusMatch;
  });
});

const handleSubMenuClick = (subItem: string) => {
  activeMenu.value = subItem;
  if (subItem === '个人SOP') router.push('/features/personal-sop/new');
  if (subItem === '人群包') router.push('/features/audience-package');
  if (subItem === '车辆包') router.push('/features/vehicle-package');
};

const handleMenuClick = (item: any) => {
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
    subItems: ['客户欢迎语', '消息群发', '客户朋友圈', '标签拉群', '个人SOP', '人群包', '车辆包']
  },
  { icon: BarChart2, label: 'BI看板' },
  { icon: LayoutGrid, label: '管理中心' },
];

const resetFilters = () => {
  filters.value = {
    name: '',
    code: '',
    status: '全部',
    startDate: '',
    endDate: ''
  };
};
</script>

<template>
  <div class="flex min-h-screen bg-gray-100 font-sans text-sm min-w-[1280px]">
    <!-- Sidebar -->
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

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-w-0">
      <div class="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-10">
        <div class="flex items-center text-gray-500 gap-2">
          <span>运营工具</span>
          <span class="text-gray-300">/</span>
          <span class="text-gray-800">车辆包</span>
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
          <!-- Filters -->
          <div class="grid grid-cols-4 gap-x-6 gap-y-4 mb-6">
            <div class="flex items-center gap-2">
              <span class="text-gray-600 whitespace-nowrap min-w-[70px] text-right">车群包名称:</span>
              <input v-model="filters.name" type="text" placeholder="车群包名称" class="flex-1 h-9 px-3 border border-gray-300 rounded focus:border-red-500 focus:outline-none" />
            </div>

            <div class="flex items-center gap-2">
              <span class="text-gray-600 whitespace-nowrap min-w-[70px] text-right">车群包代码:</span>
              <input v-model="filters.code" type="text" placeholder="车群包代码" class="flex-1 h-9 px-3 border border-gray-300 rounded focus:border-red-500 focus:outline-none" />
            </div>

            <div class="flex items-center gap-2 col-span-2">
              <span class="text-gray-600 whitespace-nowrap min-w-[70px] text-right">创建时间:</span>
              <div class="flex-1 flex items-center gap-2">
                <div class="flex-1 h-9 px-3 border border-gray-300 rounded flex items-center gap-2 text-gray-700">
                  <CalendarDays :size="14" class="text-gray-400" />
                  <input v-model="filters.startDate" type="text" placeholder="请选择起始日期" class="w-full bg-transparent outline-none text-xs" />
                </div>
                <span class="text-gray-400">-</span>
                <div class="flex-1 h-9 px-3 border border-gray-300 rounded flex items-center gap-2 text-gray-700">
                  <CalendarDays :size="14" class="text-gray-400" />
                  <input v-model="filters.endDate" type="text" placeholder="请选择结束日期" class="w-full bg-transparent outline-none text-xs" />
                </div>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <span class="text-gray-600 whitespace-nowrap min-w-[70px] text-right">车群包状态:</span>
              <div class="flex-1 h-9 border border-gray-300 rounded flex items-center justify-between px-3 text-gray-700">
                <select v-model="filters.status" class="w-full bg-transparent outline-none">
                  <option v-for="opt in statusOptions" :key="opt" :value="opt">{{ opt }}</option>
                </select>
              </div>
            </div>

            <div class="flex items-center gap-3 col-span-3 justify-end">
              <button class="h-9 px-4 bg-[#e53935] text-white rounded hover:bg-red-700 transition-colors flex items-center gap-2">
                <Search :size="14" />
                搜索
              </button>
              <button @click="resetFilters" class="h-9 px-4 border border-gray-300 text-gray-600 rounded hover:bg-gray-50 transition-colors flex items-center gap-2">
                <History :size="14" class="rotate-180" />
                重置
              </button>
            </div>
          </div>

          <div class="h-[1px] bg-gray-100 mb-6"></div>

          <!-- Actions -->
          <div class="flex justify-between items-center mb-4">
            <div class="flex gap-3">
              <button 
                @click="router.push('/features/vehicle-package/create')"
                class="h-9 px-4 bg-[#e53935] text-white rounded flex items-center gap-2 hover:bg-red-700 transition-colors shadow-sm font-bold"
              >
                <Plus :size="14" />
                新建车群包
              </button>
            </div>
          </div>

          <!-- Table -->
          <div class="flex-1 border border-gray-200 rounded overflow-hidden flex flex-col">
            <div class="overflow-x-auto">
              <table class="w-full min-w-[1200px]">
                <thead class="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th class="px-4 py-3 text-left font-bold text-gray-600 w-[130px]">车群包代码</th>
                    <th class="px-4 py-3 text-left font-bold text-gray-600">车群包名称</th>
                    <th class="px-4 py-3 text-left font-bold text-gray-600">描述</th>
                    <th class="px-4 py-3 text-left font-bold text-gray-600">创建时间</th>
                    <th class="px-4 py-3 text-left font-bold text-gray-600">创建人</th>
                    <th class="px-4 py-3 text-left font-bold text-gray-600">覆盖车辆数</th>
                    <th class="px-4 py-3 text-left font-bold text-gray-600">车群包状态</th>
                    <th class="px-4 py-3 text-center font-bold text-gray-600 w-[150px]">操作</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr v-for="row in filteredRows" :key="row.code" class="hover:bg-gray-50 transition-colors">
                    <td class="px-4 py-3 text-gray-700 font-mono text-xs">
                      {{ row.code }}
                    </td>
                    <td class="px-4 py-3 text-gray-700">{{ row.name }}</td>
                    <td class="px-4 py-3 text-gray-700 text-xs">{{ row.description || '-' }}</td>
                    <td class="px-4 py-3 text-gray-700 text-xs">{{ row.createdAt }}</td>
                    <td class="px-4 py-3 text-gray-700">{{ row.creator }}</td>
                    <td class="px-4 py-3 text-gray-700">{{ row.vehicleCount }}</td>
                    <td class="px-4 py-3">
                      <span :class="{
                        'text-green-600': row.status === '有效',
                        'text-blue-500 font-bold': row.status === '计算中',
                        'text-red-500 font-bold': row.status === '停用'
                      }">{{ row.status }}</span>
                    </td>
                    <td class="px-4 py-3 text-center">
                      <div class="flex items-center justify-center gap-3">
                        <div class="flex items-center gap-2 text-[#e53935] text-xs">
                          <button 
                            @click="row.status !== '计算中' && router.push(`/features/vehicle-package/${row.code}/detail`)" 
                            :class="`hover:underline ${row.status === '计算中' ? 'opacity-30 cursor-not-allowed' : ''}`"
                            :disabled="row.status === '计算中'"
                          >
                            明细
                          </button>
                          <button 
                            :disabled="row.status === '计算中'"
                            @click="toggleStatus(row)" 
                            :class="`hover:underline ${row.status === '计算中' ? 'opacity-30 cursor-not-allowed' : ''}`"
                          >
                            {{ row.status === '有效' ? '停用' : (row.status === '计算中' ? '停用' : '启用') }}
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Pagination -->
          <div class="flex items-center justify-end gap-4 mt-4 text-gray-600 text-xs">
            <span>共 69 条</span>
            <div class="flex items-center gap-2 border border-gray-300 rounded px-2 py-1">
              10条/页
              <ChevronDown :size="14" />
            </div>
            <div class="flex items-center gap-2">
              <button class="w-6 h-6 flex items-center justify-center border border-gray-200 rounded disabled:opacity-50" disabled>&lt;</button>
              <button class="w-6 h-6 flex items-center justify-center bg-[#e53935] text-white rounded">1</button>
              <button class="w-6 h-6 flex items-center justify-center border border-gray-200 rounded">2</button>
              <button class="w-6 h-6 flex items-center justify-center border border-gray-200 rounded">3</button>
              <button class="w-6 h-6 flex items-center justify-center border border-gray-200 rounded">4</button>
              <button class="w-6 h-6 flex items-center justify-center border border-gray-200 rounded">5</button>
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
  </div>
</template>

<style scoped>
/* 继承自人群包的统一样式 */
</style>
