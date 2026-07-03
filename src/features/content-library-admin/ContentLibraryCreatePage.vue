<script setup lang="ts">
import { computed, ref, nextTick, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { 
  BarChart2, Briefcase, ChevronDown, ChevronLeft, GripVertical, LayoutGrid, 
  MessageSquare, Monitor, Plus, Settings, User, Users, X 
} from 'lucide-vue-next';

const router = useRouter();
const activeMenu = ref('内容库');
const expandedMenu = ref('内容中心');
const sidebarCollapsed = ref(true);

// ====== 左侧菜单 ======
const menuItems = [
  { icon: Settings, label: '系统设置' },
  { icon: User, label: '客户联系' },
  { icon: Users, label: '客群管理' },
  { icon: Monitor, label: '营销中心' },
  { 
    icon: MessageSquare, 
    label: '内容中心',
    subItems: ['内容库', '会话存档']
  },
  { 
    icon: Briefcase, 
    label: '运营工具',
    subItems: ['客户欢迎语', '消息群发', '客户朋友圈', '标签拉群', '个人SOP']
  },
  { icon: BarChart2, label: 'BI看板' },
  { icon: LayoutGrid, label: '管理中心' },
];

const handleMenuClick = (item: typeof menuItems[0]) => {
  if ((item as any).subItems) {
    if (expandedMenu.value === item.label) {
      expandedMenu.value = '';
    } else {
      expandedMenu.value = item.label;
    }
  } else {
    activeMenu.value = item.label;
  }
};

const handleSubMenuClick = (subItem: string) => {
  activeMenu.value = subItem;
  if (subItem === '内容库') {
    router.push('/content-library-admin');
  }
};

// ====== 表单数据 ======
const contentType = ref('文章');
const contentTypes = ['文本', '图片', '文章', '视频', '链接', '文件', '小程序', '语音', '海报'];

const title = ref('');
const description = ref('');
const content = ref('');

const titleCount = computed(() => title.value.length);
const descCount = computed(() => description.value.length);

// 有效期
const validityType = ref('永久有效');

// 所属业务（单选）
const selectedBusiness = ref('品质车型');
const businessOptions = ['品质车型', '品牌种草', '售后服务'];

// 所属场景（单选）
const selectedScene = ref('车型参数');
const sceneOptions = ['车型参数', '外观', '内饰', '核心卖点', '友商对比', '营销海报', '购车权益'];

// 所属车系（单选）
const selectedSeries = ref('A系列');
const seriesOptions = ['A系列', 'Q系列', '纯电', '旅行车', '高性能'];

// 所属车型（单选）
const selectedModels = ref('A5L');
const modelOptions = ['A5L', 'A6L', 'A4L', 'A8L', 'A3', 'A5', 'A7 Sportback', '全新A6L'];

// 使用范围
const useScope = ref('全国');

// 雷达配置
const radarEnabled = ref('是');
const radarOptions = ref({
  behaviorNotify: false,
  dynamicNotify: true,
  customerTag: false,
  dataRadar: true,
});

// ====== 封面图多张上传 ======
const MAX_IMAGES = 9;
interface CoverImage {
  id: number;
  url: string;
  name: string;
}
const coverImages = ref<CoverImage[]>([]);
const dragIndex = ref<number | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);

// Toast
const toastVisible = ref(false);
const toastMessage = ref('');

const showToast = (msg: string) => {
  toastMessage.value = msg;
  toastVisible.value = true;
  setTimeout(() => { toastVisible.value = false; }, 2000);
};

const triggerFileUpload = () => {
  fileInputRef.value?.click();
};

const handleFileChange = (e: Event) => {
  const input = e.target as HTMLInputElement;
  const files = input.files;
  if (!files) return;
  
  const remaining = MAX_IMAGES - coverImages.value.length;
  if (remaining <= 0) {
    showToast(`最多上传 ${MAX_IMAGES} 张图片`);
    input.value = '';
    return;
  }

  let added = 0;
  for (let i = 0; i < files.length && added < remaining; i++) {
    const file = files[i];
    if (!file.type.startsWith('image/')) continue;
    const url = URL.createObjectURL(file);
    coverImages.value.push({
      id: Date.now() + i,
      url,
      name: file.name,
    });
    added++;
  }
  
  if (files.length > remaining) {
    showToast(`最多上传 ${MAX_IMAGES} 张，已自动截取前 ${remaining} 张`);
  } else if (added > 0) {
    showToast(`已上传 ${coverImages.value.length} 张图片`);
  }
  input.value = '';
};

const removeImage = (id: number) => {
  coverImages.value = coverImages.value.filter(img => img.id !== id);
};

// 拖拽排序
const onDragStart = (index: number) => {
  dragIndex.value = index;
};

const onDragOver = (e: DragEvent) => {
  e.preventDefault();
};

const onDrop = (targetIndex: number) => {
  if (dragIndex.value === null || dragIndex.value === targetIndex) return;
  const images = [...coverImages.value];
  const [moved] = images.splice(dragIndex.value, 1);
  images.splice(targetIndex, 0, moved);
  coverImages.value = images;
  dragIndex.value = null;
};

const onDragEnd = () => {
  dragIndex.value = null;
};

// ====== 操作 ======
const goBack = () => {
  router.push('/content-library-admin');
};

const handleSave = () => {
  router.push('/content-library-admin');
};

const handlePublish = () => {
  router.push('/content-library-admin');
};

// 标签模块
const tagCategoryOptions = ['品质车系', '品牌系列', '内容类型', '营销场景', '客户群体'];
const tagValueOptions = ['A系列', 'Q系列', '纯电系列', '旅行车', '高性能', 'SUV', '轿车'];
const selectedTagCategory = ref('');
const selectedTagValue = ref('');
const customTagInput = ref('');
const addedTags = ref<{ category: string; value: string }[]>([]);

const addTagFromDropdown = () => {
  if (!selectedTagCategory.value || !selectedTagValue.value) return;
  const exists = addedTags.value.some(
    t => t.category === selectedTagCategory.value && t.value === selectedTagValue.value
  );
  if (!exists) {
    addedTags.value.push({ category: selectedTagCategory.value, value: selectedTagValue.value });
    selectedTagValue.value = '';
  }
};

const addCustomTag = () => {
  const val = customTagInput.value.trim();
  if (!val) return;
  const exists = addedTags.value.some(t => t.category === '自定义' && t.value === val);
  if (!exists) {
    addedTags.value.push({ category: '自定义', value: val });
    customTagInput.value = '';
  }
};

const handleCustomTagKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    addCustomTag();
  }
};

const removeTag = (index: number) => {
  addedTags.value.splice(index, 1);
};

const clearAllTags = () => {
  addedTags.value = [];
};
const mounted = ref(false);
onMounted(() => {
  nextTick(() => { mounted.value = true; });
});
</script>

<template>
  <div class="flex min-h-screen bg-gray-50 font-sans text-sm min-w-[1400px]">
    <!-- ====== 左侧深色侧边栏 ====== -->
    <div 
      @mouseenter="sidebarCollapsed = false"
      @mouseleave="sidebarCollapsed = true"
      :class="`bg-[#1a1a1a] text-[#b3b3b3] flex flex-col shrink-0 transition-all duration-200 relative z-50 ${sidebarCollapsed ? 'w-16' : 'w-56'}`">
      <!-- Logo / 返回 -->
      <div class="h-14 flex items-center px-4 border-b border-[#333] gap-2">
        <button @click="goBack" class="text-white bg-[#333] p-1 rounded-full hover:bg-[#444] transition-colors shrink-0 flex items-center justify-center" title="返回首页">
          <ChevronLeft :size="16" />
        </button>
        <span v-show="!sidebarCollapsed" class="text-white text-sm font-medium truncate">企业微信管理平台</span>
      </div>
      
      <!-- 一级菜单 -->
      <div class="flex-1 overflow-y-auto overflow-x-hidden py-2">
        <div v-for="item in menuItems" :key="item.label">
          <div 
            @click="handleMenuClick(item)"
            :class="`px-4 py-2.5 flex items-center justify-between cursor-pointer hover:text-white hover:bg-[#333] transition-colors ${
              activeMenu === item.label || ((item as any).subItems && (item as any).subItems.includes(activeMenu))
                ? 'text-white bg-[#2a2a2a]' : ''
            }`"
          >
            <div class="flex items-center gap-2.5 truncate">
              <component :is="item.icon" :size="18" class="shrink-0" />
              <span v-show="!sidebarCollapsed" class="text-[13px] truncate">{{ item.label }}</span>
            </div>
            <ChevronDown 
              v-if="(item as any).subItems && !sidebarCollapsed" 
              :size="12" 
              :class="`transition-transform duration-200 ${expandedMenu === item.label ? 'rotate-180' : ''}`" 
            />
          </div>
          
          <!-- 二级菜单 -->
          <div v-if="(item as any).subItems && expandedMenu === item.label && !sidebarCollapsed" class="bg-[#111]">
            <div
              v-for="subItem in (item as any).subItems"
              :key="subItem"
              @click="handleSubMenuClick(subItem)"
              :class="`pl-12 pr-4 py-2 cursor-pointer transition-colors text-[12px] ${
                activeMenu === subItem 
                  ? 'bg-[#e53935] text-white' 
                  : 'hover:text-white hover:bg-[#333]'
              }`"
            >
              {{ subItem }}
            </div>
          </div>
        </div>
      </div>

      <!-- 底部留白 -->
      <div class="p-2 border-t border-[#333] flex items-center justify-center">
        <span v-if="!sidebarCollapsed" class="text-[10px] text-gray-600">移出侧栏自动收起</span>
      </div>
    </div>

    <!-- ====== 右侧主内容区 ====== -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- 顶部面包屑 -->
      <div class="h-12 bg-white border-b border-gray-200 flex items-center px-6 shrink-0">
        <div class="flex items-center gap-1.5 text-xs text-gray-400">
          <span class="cursor-pointer hover:text-gray-600">内容中心</span>
          <span>/</span>
          <span class="cursor-pointer hover:text-gray-600">内容库</span>
          <span>/</span>
          <span class="text-gray-800 font-medium">新建素材</span>
        </div>
      </div>

      <!-- 表单内容区域 -->
      <div class="flex-1 overflow-y-auto px-8 py-6">
        <div class="max-w-4xl mx-auto">
          
          <!-- ====== 内容类型 ====== -->
          <div class="flex items-center mb-5">
            <span class="text-gray-700 text-sm w-24 shrink-0 text-right">
              <span class="text-[#e53935] mr-0.5">*</span>内容类型：
            </span>
            <div class="flex items-center gap-5 ml-4">
              <label v-for="type in contentTypes" :key="type" class="flex items-center gap-1.5 cursor-pointer whitespace-nowrap">
                <input type="radio" :value="type" v-model="contentType" class="w-3.5 h-3.5 accent-[#e53935]" />
                <span :class="`text-[13px] ${contentType === type ? 'text-gray-900 font-medium' : 'text-gray-500'}`">{{ type }}</span>
              </label>
            </div>
          </div>

          <!-- ====== 标题 ====== -->
          <div class="flex items-center mb-5">
            <span class="text-gray-700 text-sm w-24 shrink-0 text-right">
              <span class="text-[#e53935] mr-0.5">*</span>标题：
            </span>
            <div class="flex-1 max-w-lg ml-4">
              <div class="relative">
                <input 
                  v-model="title" type="text" placeholder="请输入标题" maxlength="30"
                  class="w-full h-9 px-3 pr-14 border border-gray-300 rounded text-[13px] focus:outline-none focus:border-[#e53935] bg-white"
                />
                <span class="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-400">{{ titleCount }}/30</span>
              </div>
            </div>
          </div>

          <!-- ====== 上传图片（最多9张） ====== -->
          <div class="flex items-start mb-5">
            <span class="text-gray-700 text-sm w-24 shrink-0 text-right pt-1">
              <span class="text-[#e53935] mr-0.5">*</span>上传图片：
            </span>
            <div class="flex-1 ml-4">
              <p class="text-[11px] text-gray-400 mb-3">支持 jpg/png 格式，最多上传 <span class="text-[#e53935]">9</span> 张图片，第一张为封面，已上传 <span class="text-[#e53935]">{{ coverImages.length }}</span> 张</p>
              
              <!-- 已上传图片列表（拖拽排序） -->
              <div v-if="coverImages.length > 0" class="flex items-start gap-3 flex-wrap mb-3">
                <div
                  v-for="(img, index) in coverImages" :key="img.id"
                  draggable="true"
                  @dragstart="onDragStart(index)"
                  @dragover="onDragOver"
                  @drop="onDrop(index)"
                  @dragend="onDragEnd"
                  :class="`relative group rounded border-2 shrink-0 cursor-grab active:cursor-grabbing transition-all ${
                    dragIndex === index ? 'border-[#e53935] opacity-50' : 'border-gray-200 hover:border-[#e53935]/40'
                  } ${index === 0 ? 'ring-2 ring-[#e53935] ring-offset-1' : ''}`"
                >
                  <div class="w-28 h-20 bg-gray-100 rounded overflow-hidden">
                    <img :src="img.url" class="w-full h-full object-cover" />
                  </div>
                  <!-- 封面标签 -->
                  <div v-if="index === 0" class="absolute -top-2 -right-2 bg-[#e53935] text-white text-[10px] px-1.5 py-0.5 rounded shadow">
                    封面
                  </div>
                  <!-- 拖拽手柄 -->
                  <div class="absolute top-0.5 left-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical :size="12" class="text-white drop-shadow" />
                  </div>
                  <!-- 删除按钮 -->
                  <button 
                    @click="removeImage(img.id)"
                    class="absolute -top-2 -right-2 w-5 h-5 bg-gray-800 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow hover:bg-red-600"
                    :class="index === 0 ? 'right-2' : '-right-2'"
                  >
                    <X :size="11" />
                  </button>
                  <!-- 序号 -->
                  <div class="absolute bottom-0.5 left-0.5 bg-black/50 text-white text-[9px] px-1 rounded">
                    {{ index + 1 }}
                  </div>
                </div>
                
                <!-- 继续添加按钮 -->
                <button 
                  v-if="coverImages.length < MAX_IMAGES"
                  @click="triggerFileUpload"
                  class="w-28 h-20 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center gap-1 hover:border-[#e53935] hover:text-[#e53935] transition-colors text-gray-400 shrink-0"
                >
                  <Plus :size="18" />
                  <span class="text-[11px]">添加图片</span>
                </button>
              </div>

              <!-- 上传按钮（无图片时） -->
              <div v-else>
                <label
                  class="h-9 px-5 bg-[#e53935] text-white rounded text-[13px] flex items-center gap-1.5 hover:bg-red-700 transition-colors cursor-pointer inline-flex"
                >
                  <Plus :size="14" />
                  上传图片
                  <input 
                    type="file" accept="image/*" multiple 
                    class="absolute opacity-0 w-0 h-0" @change="handleFileChange"
                  />
                </label>
              </div>

              <!-- 始终存在的隐藏 file input -->
              <input 
                ref="fileInputRef" type="file" accept="image/*" multiple 
                class="absolute opacity-0 w-0 h-0 pointer-events-none" @change="handleFileChange"
              />
            </div>
          </div>

          <!-- ====== 描述 ====== -->
          <div class="flex items-center mb-5">
            <span class="text-gray-700 text-sm w-24 shrink-0 text-right">
              <span class="text-[#e53935] mr-0.5">*</span>描述：
            </span>
            <div class="flex-1 max-w-lg ml-4">
              <div class="relative">
                <input 
                  v-model="description" type="text" placeholder="请输入描述" maxlength="30"
                  class="w-full h-9 px-3 pr-14 border border-gray-300 rounded text-[13px] focus:outline-none focus:border-[#e53935] bg-white"
                />
                <span class="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-400">{{ descCount }}/30</span>
              </div>
            </div>
          </div>

          <!-- ====== 文章正文 ====== -->
          <div class="flex items-start mb-5">
            <span class="text-gray-700 text-sm w-24 shrink-0 text-right pt-2">
              <span class="text-[#e53935] mr-0.5">*</span>文章正文：
            </span>
            <div class="flex-1 max-w-3xl ml-4 border border-gray-200 rounded overflow-hidden bg-white">
              <!-- 工具栏 -->
              <div class="flex items-center gap-0.5 px-3 py-1.5 border-b border-gray-200 bg-gray-50 whitespace-nowrap overflow-x-auto">
                <span class="text-[11px] text-gray-500 mr-2 shrink-0">华康金刚黑</span>
                <button class="w-7 h-6 flex items-center justify-center text-[11px] font-bold hover:bg-gray-200 rounded">B</button>
                <button class="w-7 h-6 flex items-center justify-center text-[11px] italic hover:bg-gray-200 rounded">I</button>
                <button class="w-7 h-6 flex items-center justify-center text-[11px] underline hover:bg-gray-200 rounded">U</button>
                <button class="w-7 h-6 flex items-center justify-center text-[11px] line-through hover:bg-gray-200 rounded">S</button>
                <span class="w-px h-4 bg-gray-300 mx-0.5 shrink-0"></span>
                <button class="w-7 h-6 flex items-center justify-center text-[11px] hover:bg-gray-200 rounded">"</button>
                <button class="w-7 h-6 flex items-center justify-center text-[11px] hover:bg-gray-200 rounded">&lt;/&gt;</button>
                <span class="w-px h-4 bg-gray-300 mx-0.5 shrink-0"></span>
                <button class="w-7 h-6 flex items-center justify-center text-[11px] font-bold hover:bg-gray-200 rounded">H₁</button>
                <button class="w-7 h-6 flex items-center justify-center text-[11px] font-bold hover:bg-gray-200 rounded">H₂</button>
                <span class="w-px h-4 bg-gray-300 mx-0.5 shrink-0"></span>
                <button class="w-7 h-6 flex items-center justify-center text-[11px] hover:bg-gray-200 rounded">≡</button>
                <button class="w-7 h-6 flex items-center justify-center text-[11px] hover:bg-gray-200 rounded">≡</button>
                <button class="w-7 h-6 flex items-center justify-center text-[11px] hover:bg-gray-200 rounded">≡</button>
                <span class="w-px h-4 bg-gray-300 mx-0.5 shrink-0"></span>
                <button class="w-7 h-6 flex items-center justify-center text-[11px] hover:bg-gray-200 rounded">•</button>
                <button class="w-7 h-6 flex items-center justify-center text-[11px] hover:bg-gray-200 rounded">1.</button>
                <span class="w-px h-4 bg-gray-300 mx-0.5 shrink-0"></span>
                <button class="w-7 h-6 flex items-center justify-center text-[11px] hover:bg-gray-200 rounded">x²</button>
                <button class="w-7 h-6 flex items-center justify-center text-[11px] hover:bg-gray-200 rounded">x₂</button>
                <span class="w-px h-4 bg-gray-300 mx-0.5 shrink-0"></span>
                <button class="w-7 h-6 flex items-center justify-center text-[11px] hover:bg-gray-200 rounded">—</button>
                <span class="w-px h-4 bg-gray-300 mx-0.5 shrink-0"></span>
                <button class="w-7 h-6 flex items-center justify-center text-[11px] hover:bg-gray-200 rounded">14px</button>
                <button class="w-7 h-6 flex items-center justify-center text-[11px] hover:bg-gray-200 rounded">A</button>
                <span class="w-px h-4 bg-gray-300 mx-0.5 shrink-0"></span>
                <button class="w-7 h-6 flex items-center justify-center text-[11px] hover:bg-gray-200 rounded">🔗</button>
                <button class="w-7 h-6 flex items-center justify-center text-[11px] hover:bg-gray-200 rounded">🖼</button>
              </div>
              <!-- 编辑区域 -->
              <textarea 
                v-model="content" placeholder="请填写内容"
                class="w-full h-72 p-4 text-[13px] outline-none resize-none leading-relaxed"
              ></textarea>
            </div>
          </div>

          <!-- ====== 有效期 ====== -->
          <div class="flex items-center mb-5">
            <span class="text-gray-700 text-sm w-24 shrink-0 text-right">
              <span class="text-[#e53935] mr-0.5">*</span>有效期：
            </span>
            <div class="flex items-center gap-6 ml-4">
              <label class="flex items-center gap-1.5 cursor-pointer whitespace-nowrap">
                <input type="radio" value="永久有效" v-model="validityType" class="w-3.5 h-3.5 accent-[#e53935]" />
                <span class="text-[13px] text-gray-700">永久有效</span>
              </label>
              <label class="flex items-center gap-1.5 cursor-pointer whitespace-nowrap">
                <input type="radio" value="自定义" v-model="validityType" class="w-3.5 h-3.5 accent-[#e53935]" />
                <span class="text-[13px] text-gray-500">自定义</span>
              </label>
            </div>
          </div>

          <!-- ====== 所属业务 ====== -->
          <div class="flex items-center mb-5">
            <span class="text-gray-700 text-sm w-24 shrink-0 text-right">
              <span class="text-[#e53935] mr-0.5">*</span>所属业务：
            </span>
            <div class="flex items-center gap-5 ml-4">
              <label v-for="biz in businessOptions" :key="biz" class="flex items-center gap-1.5 cursor-pointer whitespace-nowrap">
                <input type="radio" :value="biz" v-model="selectedBusiness" class="w-3.5 h-3.5 accent-[#e53935]" />
                <span :class="`text-[13px] ${selectedBusiness === biz ? 'text-gray-900 font-medium' : 'text-gray-500'}`">{{ biz }}</span>
              </label>
            </div>
          </div>

          <!-- ====== 所属场景 ====== -->
          <div class="flex items-center mb-5">
            <span class="text-gray-700 text-sm w-24 shrink-0 text-right">
              <span class="text-[#e53935] mr-0.5">*</span>所属场景：
            </span>
            <div class="flex items-center gap-5 ml-4">
              <label v-for="scene in sceneOptions" :key="scene" class="flex items-center gap-1.5 cursor-pointer whitespace-nowrap">
                <input type="radio" :value="scene" v-model="selectedScene" class="w-3.5 h-3.5 accent-[#e53935]" />
                <span :class="`text-[13px] ${selectedScene === scene ? 'text-gray-900 font-medium' : 'text-gray-500'}`">{{ scene }}</span>
              </label>
            </div>
          </div>

          <!-- ====== 所属车系 ====== -->
          <div class="flex items-center mb-5">
            <span class="text-gray-700 text-sm w-24 shrink-0 text-right">
              <span class="text-[#e53935] mr-0.5">*</span>所属车系：
            </span>
            <div class="flex items-center gap-5 ml-4">
              <label v-for="series in seriesOptions" :key="series" class="flex items-center gap-1.5 cursor-pointer whitespace-nowrap">
                <input type="radio" :value="series" v-model="selectedSeries" class="w-3.5 h-3.5 accent-[#e53935]" />
                <span :class="`text-[13px] ${selectedSeries === series ? 'text-gray-900 font-medium' : 'text-gray-500'}`">{{ series }}</span>
              </label>
            </div>
          </div>

          <!-- ====== 所属车型 ====== -->
          <div class="flex items-center mb-5">
            <span class="text-gray-700 text-sm w-24 shrink-0 text-right">
              <span class="text-[#e53935] mr-0.5">*</span>所属车型：
            </span>
            <div class="flex items-center gap-5 ml-4">
              <label v-for="model in modelOptions" :key="model" class="flex items-center gap-1.5 cursor-pointer whitespace-nowrap">
                <input type="radio" :value="model" v-model="selectedModels" class="w-3.5 h-3.5 accent-[#e53935]" />
                <span :class="`text-[13px] ${selectedModels === model ? 'text-gray-900 font-medium' : 'text-gray-500'}`">{{ model }}</span>
              </label>
            </div>
          </div>

          <!-- ====== 使用范围 ====== -->
          <div class="flex items-center mb-5">
            <span class="text-gray-700 text-sm w-24 shrink-0 text-right">
              <span class="text-[#e53935] mr-0.5">*</span>使用范围：
            </span>
            <div class="flex items-center gap-3 ml-4">
              <span class="text-[13px] text-gray-700">{{ useScope }}</span>
              <button class="h-8 px-3 border border-gray-300 rounded text-[12px] text-gray-500 hover:bg-gray-50 transition-colors">
                + 添加部门
              </button>
            </div>
          </div>

          <!-- ====== 是否配置雷达 ====== -->
          <div class="mb-6">
            <!-- Label + 单选按钮 同一行 -->
            <div class="flex items-center mb-3">
              <span class="text-gray-700 text-sm w-[108px] shrink-0 text-right">
                <span class="text-[#e53935] mr-0.5">*</span>是否配置雷达：
              </span>
              <div class="flex items-center gap-6 ml-4">
                <label class="flex items-center gap-1.5 cursor-pointer whitespace-nowrap">
                  <input type="radio" value="否" v-model="radarEnabled" class="w-3.5 h-3.5 accent-[#e53935]" />
                  <span :class="`text-[13px] ${radarEnabled === '否' ? 'text-gray-900 font-medium' : 'text-gray-500'}`">否</span>
                </label>
                <label class="flex items-center gap-1.5 cursor-pointer whitespace-nowrap">
                  <input type="radio" value="是" v-model="radarEnabled" class="w-3.5 h-3.5 accent-[#e53935]" />
                  <span :class="`text-[13px] ${radarEnabled === '是' ? 'text-gray-900 font-medium' : 'text-gray-500'}`">是</span>
                </label>
              </div>
            </div>
            <!-- 描述文字 -->
            <p class="text-[12px] text-gray-400 leading-relaxed ml-[calc(108px+1rem)] pl-[22px] mb-3">开启后素材内容将会以链接形式发送给客户，员工可查看客户的点击次数和浏览时长等，同时支持行为轨迹追踪通知配置。</p>
            
            <!-- 雷达选项卡片 -->
            <div v-if="radarEnabled === '是'" class="grid grid-cols-4 gap-3 ml-[calc(108px+1rem)]">
              <div v-for="card in [
                { key: 'behaviorNotify', label: '行为通知', desc: '当客户点击素材时，发送图文消息通知员工，员工可及时跟进客户。' },
                { key: 'dynamicNotify', label: '动态通知', desc: '当客户点击素材时，发送图文消息通知员工，员工可及时跟进客户。' },
                { key: 'customerTag', label: '客户标签', desc: '当客户点击素材时，根据客户的点击行为自动打上对应的标签。' },
                { key: 'dataRadar', label: '数据雷达', desc: '记录客户对素材的点击次数、浏览时长等数据，帮助员工了解客户意向。' },
              ]" :key="card.key" class="border border-gray-200 rounded-lg p-3 bg-white hover:shadow-sm transition-shadow">
                <div class="flex items-center justify-between mb-1.5">
                  <span class="text-[13px] font-medium text-gray-700">{{ card.label }}</span>
                  <button 
                    @click="(radarOptions as any)[card.key] = !(radarOptions as any)[card.key]"
                    :class="`w-8 h-[18px] rounded-full transition-colors relative shrink-0 ${(radarOptions as any)[card.key] ? 'bg-[#e53935]' : 'bg-gray-300'}`"
                  >
                    <span :class="`absolute left-0 top-[2px] w-3.5 h-3.5 bg-white rounded-full shadow transition-transform ${(radarOptions as any)[card.key] ? 'translate-x-[14px]' : 'translate-x-[2px]'}`"></span>
                  </button>
                </div>
                <p class="text-[11px] text-gray-400 leading-relaxed">{{ card.desc }}</p>
              </div>
            </div>
          </div>

          <!-- ====== 内容标签 ====== -->
          <div class="mb-6">
            <div class="flex items-start">
              <span class="text-gray-700 text-sm font-medium w-24 shrink-0 text-right mt-1.5">内容标签：</span>
              <div class="flex-1 ml-4">
                <!-- 第一行：分类下拉 + 值下拉 + 添加按钮 -->
                <div class="flex items-center gap-2 mb-3">
                  <select
                    v-model="selectedTagCategory"
                    class="h-7 px-2.5 border border-gray-200 rounded text-[12px] text-gray-700 bg-white focus:outline-none focus:border-[#e53935] flex-1 cursor-pointer"
                  >
                    <option value="" disabled selected>选择标签组</option>
                    <option v-for="cat in tagCategoryOptions" :key="cat" :value="cat">{{ cat }}</option>
                  </select>
                  <select
                    v-model="selectedTagValue"
                    class="h-7 px-2.5 border border-gray-200 rounded text-[12px] text-gray-700 bg-white focus:outline-none focus:border-[#e53935] flex-1 cursor-pointer"
                  >
                    <option value="">选择标签值</option>
                    <option v-for="val in tagValueOptions" :key="val" :value="val">{{ val }}</option>
                  </select>
                  <button
                    @click="addTagFromDropdown"
                    class="h-7 px-3 rounded text-[12px] text-white font-medium transition-colors shrink-0 bg-[#e53935] hover:bg-red-700"
                  >
                    添加
                  </button>
                </div>

                <!-- 第二行：自定义标签输入 + 按钮 -->
                <div class="flex items-center gap-2 mb-3">
                  <input
                    v-model="customTagInput"
                    @keydown="handleCustomTagKeydown"
                    placeholder="输入自定义标签名称后按回车添加..."
                    class="h-7 px-2.5 border border-gray-200 rounded text-[12px] text-gray-700 placeholder-gray-300 bg-white focus:outline-none focus:border-[#e53935] flex-1 transition-all"
                  />
                  <button
                    @click="addCustomTag"
                    class="h-7 px-3 rounded text-[12px] font-medium transition-colors shrink-0 border text-[#e53935] border-[#e53935] hover:bg-[#FFF1F0]"
                  >
                    添加自定义标签
                  </button>
                </div>

                <!-- 已选标签展示区 -->
                <div v-if="addedTags.length > 0" class="mb-2">
                  <div class="flex items-center justify-between mb-1.5">
                    <span class="text-[11px] text-gray-400">已选标签（{{ addedTags.length }} 个）</span>
                    <button @click="clearAllTags" class="text-[11px] text-gray-400 hover:text-[#e53935] transition-colors">
                      清空全部
                    </button>
                  </div>
                  <div class="flex flex-wrap gap-1.5">
                    <span
                      v-for="(tag, index) in addedTags"
                      :key="index"
                      class="inline-flex items-center gap-0.5 px-2.5 py-1 rounded text-[12px] font-medium border bg-white text-[#e53935] border-[#e53935]/30 transition-all group hover:border-[#e53935]"
                    >
                      #{{ tag.value }}
                      <button @click="removeTag(index)" class="ml-0.5 opacity-50 group-hover:opacity-100 hover:text-red-700 transition-all">
                        <X :size="12" :strokeWidth="2.5" />
                      </button>
                    </span>
                  </div>
                </div>

                <p class="text-[11px] text-gray-300">选择分类和标签值后添加，或输入自定义标签。已选标签可在上方查看。</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- 底部按钮 -->
      <div class="h-14 bg-white border-t border-gray-200 flex items-center justify-end px-8 gap-3 shrink-0">
        <button @click="goBack" class="h-8 px-5 border border-gray-300 rounded text-[13px] text-gray-600 hover:bg-gray-50 transition-colors">
          返回
        </button>
        <button @click="handleSave" class="h-8 px-5 bg-[#e53935] text-white rounded text-[13px] hover:bg-red-700 transition-colors">
          保存
        </button>
        <button @click="handlePublish" class="h-8 px-5 bg-[#e53935] text-white rounded text-[13px] hover:bg-red-700 transition-colors">
          发布
        </button>
      </div>
    </div>
  </div>

  <!-- Toast 提示 -->
  <Teleport to="body">
    <Transition name="toast">
      <div
        v-if="toastVisible"
        class="fixed top-6 left-1/2 -translate-x-1/2 z-[200] bg-gray-900 text-white text-sm px-5 py-3 rounded-lg shadow-lg flex items-center gap-2"
      >
        <svg class="w-4 h-4 text-green-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        {{ toastMessage }}
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.toast-enter-active { transition: all 0.3s ease-out; }
.toast-leave-active { transition: all 0.2s ease-in; }
.toast-enter-from { opacity: 0; transform: translate(-50%, -12px); }
.toast-leave-to { opacity: 0; transform: translate(-50%, -8px); }
</style>
