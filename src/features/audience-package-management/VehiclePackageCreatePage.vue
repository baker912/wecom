<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import PrototypeCodeLocation from '../../components/PrototypeCodeLocation.vue';
import { BarChart2, Briefcase, ChevronDown, ChevronLeft, LayoutGrid, MessageCircle, MessageSquare, Monitor, Plus, Settings, User, Users, Upload, X, FileDown, HelpCircle, Loader2, CheckCircle2, AlertCircle } from 'lucide-vue-next';

const router = useRouter();
const activeMenu = ref('车辆包');
const expandedMenu = ref('运营工具');

const fileInputRef = ref<HTMLInputElement | null>(null);

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

const form = ref({
  name: '',
  description: '',
  scopeDepts: [] as string[]
});

const handleMenuClick = (item: any) => {
  if (item.subItems) {
    expandedMenu.value = expandedMenu.value === item.label ? '' : item.label;
  } else {
    activeMenu.value = item.label;
  }
};

const handleSubMenuClick = (subItem: string) => {
  activeMenu.value = subItem;
  if (subItem === '个人SOP') router.push('/features/personal-sop/new');
  if (subItem === '人群包') router.push('/features/audience-package');
  if (subItem === '车辆包') router.push('/features/vehicle-package');
};

// 模版下载逻辑
const downloadTemplate = () => {
  // 模拟生成一个包含“车辆VIN码”表头的 Excel 文件内容 (CSV 格式兼容)
  const header = "车辆VIN码\n";
  const blob = new Blob(["\ufeff" + header], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", "车群包导入模版.xlsx");
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// 文件上传相关
const selectedFileName = ref<string | null>(null);
const uploadStatus = ref<'none' | 'uploading' | 'success'>('none');

const triggerFileUpload = () => {
  fileInputRef.value?.click();
};

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) {
    selectedFileName.value = file.name;
    uploadStatus.value = 'uploading';
    setTimeout(() => {
      uploadStatus.value = 'success';
      isCalculationDirty.value = false;
      calculationResult.value = Math.floor(Math.random() * 5000) + 100;
      calculationStatus.value = 'success';
    }, 1500);
  }
};

// 数量计算相关
const calculatingQuantity = ref(false);
const calculationResult = ref<number | null>(null);
const calculationStatus = ref<'none' | 'success' | 'error'>('none');
const isCalculationDirty = ref(true);

const canSave = computed(() => {
  return form.value.name.trim() !== '' && 
         selectedFileName.value !== null && 
         calculationStatus.value === 'success' &&
         !isCalculationDirty.value;
});

const handleSave = () => {
  if (!canSave.value) return;
  router.push('/features/vehicle-package');
};

const handleCancel = () => {
  router.push('/features/vehicle-package');
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
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-w-0">
      <div class="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-10">
        <div class="flex items-center text-gray-500 gap-2">
          <span>运营工具</span>
          <span class="text-gray-300">/</span>
          <button @click="router.push('/features/vehicle-package')" class="hover:text-gray-800">车辆包</button>
          <span class="text-gray-300">/</span>
          <span class="text-gray-800">新建车群包</span>
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
        <div class="bg-white rounded shadow-sm p-8 min-h-full flex flex-col max-w-5xl mx-auto">
          <!-- Help Info -->
          <div class="mb-8 p-4 bg-red-50 border border-red-100 rounded-lg flex gap-3">
            <HelpCircle :size="18" class="text-[#e53935] shrink-0 mt-0.5" />
            <div class="text-xs text-red-800 leading-6">
              <p class="font-bold mb-1">新建说明：</p>
              <p>1. 填写车群包名称及描述，方便后续在人群包筛选中快速识别。</p>
              <p>2. 目前仅支持通过“车辆VIN码导入”方式创建车群包。</p>
              <p>3. 导入完成后，系统将自动校验车辆有效性并计算覆盖车辆数。</p>
              <p>4. <span class="font-bold underline">上传要求：</span>上传的 Excel 文件表头必须为“车辆VIN码”，且文件内<span class="font-bold">不能有公式、不能有合并项、不能有空项</span>。</p>
            </div>
          </div>

          <div class="space-y-8">
            <!-- Basic Info Section -->
            <section class="space-y-6">
              <div class="flex items-center gap-2 pb-2 border-b border-gray-100">
                <div class="w-1 h-4 bg-[#e53935]"></div>
                <h3 class="font-bold text-gray-800">基础信息</h3>
              </div>
              
              <div class="grid grid-cols-[120px_1fr] gap-6 items-center">
                <label class="text-right text-gray-600 font-medium"><span class="text-[#e53935] mr-1">*</span>车群包名称:</label>
                <input 
                  v-model="form.name" 
                  type="text" 
                  placeholder="请输入车群包名称" 
                  class="h-10 px-3 border border-gray-300 rounded focus:border-[#e53935] focus:outline-none max-w-xl"
                />

                <label class="text-right text-gray-600 font-medium self-start pt-2">描述:</label>
                <textarea 
                  v-model="form.description" 
                  placeholder="请输入描述信息（可选）" 
                  class="h-24 px-3 py-2 border border-gray-300 rounded focus:border-[#e53935] focus:outline-none max-w-xl resize-none"
                ></textarea>
              </div>
            </section>

            <!-- Vehicle Selection Section -->
            <section class="space-y-6">
              <div class="flex items-center gap-2 pb-2 border-b border-gray-100">
                <div class="w-1 h-4 bg-[#e53935]"></div>
                <h3 class="font-bold text-gray-800">车辆导入</h3>
              </div>

              <div class="grid grid-cols-[120px_1fr] gap-6 items-start">
                <label class="text-right text-gray-600 font-medium pt-2"><span class="text-[#e53935] mr-1">*</span>选择文件:</label>
                <div class="space-y-4">
                  <div class="flex items-center gap-4">
                    <input 
                      type="file" 
                      ref="fileInputRef" 
                      class="hidden" 
                      accept=".xlsx,.xls,.csv"
                      @change="handleFileChange"
                    />
                    <button 
                      @click="triggerFileUpload" 
                      class="h-10 px-4 border border-[#e53935] text-[#e53935] rounded bg-white hover:bg-red-50 transition-colors flex items-center gap-2 font-bold"
                    >
                      <Upload :size="16" />
                      上传车辆VIN码
                    </button>
                    <button 
                      @click="downloadTemplate"
                      class="h-10 px-4 text-gray-500 hover:text-gray-700 flex items-center gap-2"
                    >
                      <FileDown :size="16" />
                      下载模板
                    </button>
                  </div>

                  <!-- Uploaded File Info -->
                  <div v-if="selectedFileName" class="p-4 bg-gray-50 border border-gray-200 rounded-lg max-w-xl flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 bg-white border border-gray-200 rounded flex items-center justify-center">
                        <Upload :size="20" class="text-green-500" />
                      </div>
                      <div>
                        <div class="text-sm font-bold text-gray-800">{{ selectedFileName }}</div>
                        <div v-if="uploadStatus === 'uploading'" class="text-xs text-blue-500 flex items-center gap-1 mt-1">
                          <Loader2 :size="12" class="animate-spin" />
                          正在解析车辆数据...
                        </div>
                        <div v-else-if="uploadStatus === 'success'" class="text-xs text-green-600 flex items-center gap-1 mt-1">
                          <CheckCircle2 :size="12" />
                          已成功导入并解析
                        </div>
                      </div>
                    </div>
                    <button @click="selectedFileName = null; uploadStatus = 'none'; calculationStatus = 'none'" class="text-gray-400 hover:text-red-500">
                      <X :size="16" />
                    </button>
                  </div>

                  <!-- Calculation Result -->
                  <div v-if="calculationStatus === 'success'" class="p-6 bg-green-50 border border-green-100 rounded-xl max-w-xl flex items-center gap-10">
                    <div class="flex flex-col">
                      <div class="text-3xl font-black text-gray-900 leading-none">
                        {{ calculationResult?.toLocaleString() }}
                      </div>
                      <div class="text-[10px] text-gray-400 mt-1 font-bold tracking-wider uppercase">覆盖车辆总数</div>
                    </div>
                    <div class="flex-1">
                      <p class="text-xs text-green-700 font-medium leading-5">
                        数据校验通过！系统已成功识别该文件中包含的有效车辆信息。点击“保存”即可完成车群包创建。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <!-- Footer Actions -->
          <div class="mt-auto pt-12 flex items-center gap-4">
            <button 
              @click="handleSave" 
              :disabled="!canSave"
              :class="`h-10 px-10 rounded font-bold transition-all shadow-md ${
                canSave 
                  ? 'bg-[#e53935] text-white hover:bg-red-700 active:scale-95' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`"
            >
              保存
            </button>
            <button @click="handleCancel" class="h-10 px-8 border border-gray-300 text-gray-600 rounded hover:bg-gray-50 transition-colors">
              取消
            </button>
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
