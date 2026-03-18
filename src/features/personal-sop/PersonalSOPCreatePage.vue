<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import PrototypeCodeLocation from '../../components/PrototypeCodeLocation.vue';
import { BarChart2, Briefcase, ChevronDown, ChevronLeft, LayoutGrid, MessageCircle, MessageSquare, Monitor, Plus, Settings, User, Users } from 'lucide-vue-next';

const router = useRouter();
const activeMenu = ref('个人SOP');
const expandedMenu = ref('运营工具');

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

const handleMenuClick = (item: typeof menuItems[0]) => {
  if ((item as any).subItems) {
    expandedMenu.value = expandedMenu.value === item.label ? '' : item.label;
  } else {
    activeMenu.value = item.label;
  }
};

const handleSubMenuClick = (subItem: string) => {
  activeMenu.value = subItem;
  if (subItem === '人群包') router.push('/features/audience-package');
};

const form = ref({
  name: '',
  description: '',
  sopType: '',
  staff: [] as string[],
  customerMode: 'all' as 'all' | 'filter' | 'phone' | 'package',
  audiencePackageId: '',
  customerPhones: '',
  rules: [] as Array<{ id: string; name: string }>
});

const sopNameCount = computed(() => form.value.name.length);
const sopDescCount = computed(() => form.value.description.length);

const sopTypeOptions = ['新客激活', '生日关怀', '保养提醒', '沉默唤醒'];
const audiencePackageOptions = [
  { id: 'AP20260201002', name: '高潜客户圈选' },
  { id: 'AP20260201003', name: '沉默客户唤醒' }
];

const addStaff = () => {
  form.value.staff = [...form.value.staff, `员工${form.value.staff.length + 1}`];
};

const addRule = () => {
  form.value.rules = [...form.value.rules, { id: `${Date.now()}`, name: `触发规则${form.value.rules.length + 1}` }];
};

const handleBack = () => {
  router.push('/wecom-sop');
};

const submitAttempted = ref(false);

const showAudiencePackage = computed(() => form.value.customerMode === 'package');
const showAudiencePackageError = computed(() => submitAttempted.value && showAudiencePackage.value && !form.value.audiencePackageId);

const handleSubmit = () => {
  submitAttempted.value = true;
  if (showAudiencePackageError.value) return;
  router.push('/wecom-sop');
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
              v-if="(item as any).subItems" 
              :size="12" 
              :class="`transition-transform duration-200 opacity-0 group-hover:opacity-100 ${expandedMenu === item.label ? 'rotate-180' : ''}`" 
            />
          </div>
          
          <div v-if="(item as any).subItems && expandedMenu === item.label" class="bg-[#111] hidden group-hover:block">
            <div
              v-for="subItem in (item as any).subItems"
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
          <span class="text-gray-800">个人SOP</span>
          <span class="text-gray-300">/</span>
          <span class="text-gray-800">新增个人SOP</span>
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
          <div class="border border-gray-200 rounded overflow-hidden">
            <div class="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
              <div class="w-1 h-4 bg-[#1e88e5]"></div>
              <div class="text-sm font-bold text-gray-900">基础信息</div>
            </div>
            <div class="p-6 grid grid-cols-[120px_1fr] gap-y-6 gap-x-6">
              <div class="text-gray-700 font-medium flex items-center justify-end">
                <span class="text-[#e53935] mr-1">*</span>SOP名称:
              </div>
              <div class="max-w-xl">
                <div class="flex items-center gap-3">
                  <input v-model="form.name" maxlength="20" type="text" placeholder="请输入SOP名称" class="flex-1 h-10 px-3 border border-gray-300 rounded focus:border-red-500 focus:outline-none" />
                  <div class="text-xs text-gray-400 w-14 text-right">{{ sopNameCount }}/20</div>
                </div>
              </div>

              <div class="text-gray-700 font-medium flex items-start justify-end pt-2">
                SOP说明:
              </div>
              <div class="max-w-xl">
                <textarea v-model="form.description" maxlength="100" placeholder="请输入" class="w-full h-24 px-3 py-2 border border-gray-300 rounded focus:border-red-500 focus:outline-none resize-none"></textarea>
                <div class="text-xs text-gray-400 mt-1 text-right">{{ sopDescCount }}/100</div>
              </div>

              <div class="text-gray-700 font-medium flex items-center justify-end">
                <span class="text-[#e53935] mr-1">*</span>SOP类型:
              </div>
              <div class="max-w-xl">
                <div class="h-10 px-3 border border-gray-300 rounded flex items-center bg-white">
                  <select v-model="form.sopType" class="w-full bg-transparent outline-none text-gray-700">
                    <option value="" disabled>请选择SOP类型</option>
                    <option v-for="opt in sopTypeOptions" :key="opt" :value="opt">{{ opt }}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div class="border border-gray-200 rounded overflow-hidden mt-6">
            <div class="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
              <div class="w-1 h-4 bg-[#1e88e5]"></div>
              <div class="text-sm font-bold text-gray-900">目标客户</div>
            </div>
            <div class="p-6 grid grid-cols-[120px_1fr] gap-y-6 gap-x-6">
              <div class="text-gray-700 font-medium flex items-center justify-end">
                <span class="text-[#e53935] mr-1">*</span>选择员工:
              </div>
              <div class="flex items-center gap-3">
                <button type="button" @click="addStaff" class="h-9 px-4 border border-gray-300 rounded bg-white hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <Plus :size="14" class="text-gray-600" />
                  添加人员
                </button>
                <div class="text-xs text-gray-500">
                  已选择 {{ form.staff.length }} 人
                </div>
              </div>

              <div class="text-gray-700 font-medium flex items-center justify-end">
                <span class="text-[#e53935] mr-1">*</span>选择客户:
              </div>
              <div class="flex items-center gap-5 flex-wrap">
                <label class="flex items-center gap-2 text-gray-700">
                  <input v-model="form.customerMode" type="radio" value="all" class="accent-[#e53935]" />
                  全部客户
                </label>
                <label class="flex items-center gap-2 text-gray-700">
                  <input v-model="form.customerMode" type="radio" value="filter" class="accent-[#e53935]" />
                  按条件筛选
                </label>
                <label class="flex items-center gap-2 text-gray-700">
                  <input v-model="form.customerMode" type="radio" value="phone" class="accent-[#e53935]" />
                  客户手机号
                </label>
                <label :class="`flex items-center gap-2 ${form.customerMode === 'package' ? 'text-[#e53935] font-bold' : 'text-gray-700'}`">
                  <input v-model="form.customerMode" type="radio" value="package" class="accent-[#e53935]" />
                  按人群包
                </label>
              </div>

              <template v-if="showAudiencePackage">
                <div class="text-gray-700 font-medium flex items-center justify-end">
                  <span class="text-[#e53935] mr-1">*</span>选择人群包:
                </div>
                <div class="max-w-xl">
                  <div class="h-10 px-3 border border-gray-300 rounded flex items-center bg-white">
                    <select v-model="form.audiencePackageId" class="w-full bg-transparent outline-none text-gray-700">
                      <option value="" disabled>请选择</option>
                      <option v-for="opt in audiencePackageOptions" :key="opt.id" :value="opt.id">{{ opt.name }}</option>
                    </select>
                  </div>
                  <div v-if="showAudiencePackageError" class="text-xs text-[#e53935] mt-2">
                    请选择人群包
                  </div>
                </div>
              </template>

              <template v-else-if="form.customerMode === 'phone'">
                <div class="text-gray-700 font-medium flex items-start justify-end pt-2">
                  客户手机号:
                </div>
                <div class="max-w-xl">
                  <textarea v-model="form.customerPhones" placeholder="请输入手机号，多个用逗号/换行分隔" class="w-full h-24 px-3 py-2 border border-gray-300 rounded focus:border-red-500 focus:outline-none resize-none"></textarea>
                </div>
              </template>
            </div>
          </div>

          <div class="border border-gray-200 rounded overflow-hidden mt-6">
            <div class="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
              <div class="w-1 h-4 bg-[#1e88e5]"></div>
              <div class="text-sm font-bold text-gray-900">触发设置</div>
            </div>
            <div class="p-6 grid grid-cols-[120px_1fr] gap-y-6 gap-x-6">
              <div class="text-gray-700 font-medium flex items-center justify-end">
                <span class="text-[#e53935] mr-1">*</span>触发规则:
              </div>
              <div class="flex items-center gap-3">
                <button type="button" @click="addRule" class="h-9 px-4 border border-gray-300 rounded bg-white hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <Plus :size="14" class="text-gray-600" />
                  添加规则
                </button>
                <div class="text-xs text-gray-500">
                  已添加 {{ form.rules.length }} 条
                </div>
              </div>
            </div>
          </div>

          <div class="mt-auto pt-10">
            <div class="flex items-center justify-between border-t border-gray-100 pt-4">
              <div class="text-xs text-gray-500">
                提交后需要到【任务】去执行任务
              </div>
              <div class="flex items-center gap-3">
                <button @click="handleBack" class="h-9 px-5 border border-gray-300 text-gray-600 rounded hover:bg-gray-50 transition-colors">
                  返回
                </button>
                <button @click="handleSubmit" class="h-9 px-5 bg-[#e53935] text-white rounded hover:bg-red-700 transition-colors">
                  立即提交
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <PrototypeCodeLocation
      mode="floating"
      position="top"
      containerClass="left-1/2 -translate-x-1/2 right-auto bottom-auto"
      folderPath="src/features/personal-sop"
    />
  </div>
</template>
