<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import PrototypeCodeLocation from '../../components/PrototypeCodeLocation.vue';
import { BarChart2, Briefcase, ChevronDown, ChevronLeft, LayoutGrid, MessageCircle, MessageSquare, Monitor, Search, Settings, User, Users, Download, ArrowLeft } from 'lucide-vue-next';

const router = useRouter();
const activeMenu = ref('车辆包');
const expandedMenu = ref('运营工具');

const filters = ref({
  vin: '',
  mobile: ''
});

const rows = ref([
  { vin: 'LSV202603241001', seriesCode: 'A4L', modelName: '奥迪A4L 2024款 40 TFSI 时尚动感型', aid: 'AID8829101', mobile: '138****8821' },
  { vin: 'LSV202603241002', seriesCode: 'Q5L', modelName: '奥迪Q5L 2024款 45 TFSI 豪华动感型', aid: 'AID8829102', mobile: '139****7732' },
  { vin: 'LSV202603241003', seriesCode: 'A6L', modelName: '奥迪A6L 2024款 45 TFSI 臻选致雅型', aid: 'AID8829103', mobile: '137****6643' },
  { vin: 'LSV202603241004', seriesCode: 'Q3', modelName: '奥迪Q3 2024款 35 TFSI 进取致雅型', aid: 'AID8829104', mobile: '136****5554' },
  { vin: 'LSV202603241005', seriesCode: 'A4L', modelName: '奥迪A4L 2024款 45 TFSI quattro 臻选动感型', aid: 'AID8829105', mobile: '135****4465' },
]);

const handleSubMenuClick = (subItem: string) => {
  activeMenu.value = subItem;
  if (subItem === '个人SOP') router.push('/features/personal-sop');
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
    vin: '',
    mobile: ''
  };
};

const handleExport = () => {
  alert('正在导出车群包明细数据...');
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
          <button @click="router.back()" class="hover:text-gray-800 flex items-center gap-1">
            <ArrowLeft :size="16" />
            运营工具
          </button>
          <span class="text-gray-300">/</span>
          <button @click="router.push('/features/vehicle-package')" class="hover:text-gray-800">车辆包</button>
          <span class="text-gray-300">/</span>
          <span class="text-gray-800">车群包明细</span>
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
              <span class="text-gray-600 whitespace-nowrap min-w-[70px] text-right">车辆VIN码:</span>
              <input v-model="filters.vin" type="text" placeholder="请输入VIN码" class="flex-1 h-9 px-3 border border-gray-300 rounded focus:border-red-500 focus:outline-none" />
            </div>

            <div class="flex items-center gap-2">
              <span class="text-gray-600 whitespace-nowrap min-w-[70px] text-right">绑车手机号:</span>
              <input v-model="filters.mobile" type="text" placeholder="请输入手机号" class="flex-1 h-9 px-3 border border-gray-300 rounded focus:border-red-500 focus:outline-none" />
            </div>

            <div class="flex items-center gap-3 col-span-2 justify-end">
              <button class="h-9 px-4 bg-[#e53935] text-white rounded hover:bg-red-700 transition-colors flex items-center gap-2">
                <Search :size="14" />
                搜索
              </button>
              <button @click="resetFilters" class="h-9 px-4 border border-gray-300 text-gray-600 rounded hover:bg-gray-50 transition-colors flex items-center gap-2">
                重置
              </button>
            </div>
          </div>

          <div class="h-[1px] bg-gray-100 mb-6"></div>

          <!-- Actions -->
          <div class="flex justify-between items-center mb-4">
            <div class="flex gap-3">
              <button @click="handleExport" class="h-9 px-4 border border-[#e53935] text-[#e53935] rounded flex items-center gap-2 hover:bg-red-50 transition-colors shadow-sm font-bold">
                <Download :size="14" />
                导出明细
              </button>
            </div>
            <div class="text-gray-500 text-xs">
              当前车群包：<span class="font-bold text-gray-800">yx 车群 (VG202603241)</span>
            </div>
          </div>

          <!-- Table -->
          <div class="flex-1 border border-gray-200 rounded overflow-hidden flex flex-col">
            <div class="overflow-x-auto">
              <table class="w-full min-w-[1000px]">
                <thead class="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th class="px-4 py-3 text-left font-bold text-gray-600">车辆VIN码</th>
                    <th class="px-4 py-3 text-left font-bold text-gray-600">车系三位码名</th>
                    <th class="px-4 py-3 text-left font-bold text-gray-600">车型名称</th>
                    <th class="px-4 py-3 text-left font-bold text-gray-600">绑车AID</th>
                    <th class="px-4 py-3 text-left font-bold text-gray-600">绑车手机号</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr v-for="(row, index) in rows" :key="index" class="hover:bg-gray-50 transition-colors">
                    <td class="px-4 py-3 text-gray-700 font-mono">{{ row.vin }}</td>
                    <td class="px-4 py-3 text-gray-700">{{ row.seriesCode }}</td>
                    <td class="px-4 py-3 text-gray-700">{{ row.modelName }}</td>
                    <td class="px-4 py-3 text-gray-700 font-mono">{{ row.aid }}</td>
                    <td class="px-4 py-3 text-gray-700">{{ row.mobile }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Pagination -->
          <div class="flex items-center justify-end gap-4 mt-4 text-gray-600 text-xs">
            <span>共 {{ rows.length }} 条</span>
            <div class="flex items-center gap-2 border border-gray-300 rounded px-2 py-1">
              10条/页
              <ChevronDown :size="14" />
            </div>
            <div class="flex items-center gap-2">
              <button class="w-6 h-6 flex items-center justify-center border border-gray-200 rounded disabled:opacity-50" disabled>&lt;</button>
              <button class="w-6 h-6 flex items-center justify-center bg-[#e53935] text-white rounded">1</button>
              <button class="w-6 h-6 flex items-center justify-center border border-gray-200 rounded" disabled>&gt;</button>
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
</style>
