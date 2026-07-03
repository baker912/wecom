<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import PrototypeCodeLocation from '../../components/PrototypeCodeLocation.vue';
import { 
  BarChart2, Briefcase, ChevronDown, ChevronLeft, ChevronRight, Folder, FolderOpen, LayoutGrid, 
  MessageSquare, Monitor, Plus, 
  Search, Settings, Smartphone, User, Users 
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
    // 点击当前已展开的菜单：收起
    if (expandedMenu.value === item.label) {
      expandedMenu.value = '';
    } else {
      // 点击其他菜单：展开当前，收起其他
      expandedMenu.value = item.label;
    }
  } else {
    activeMenu.value = item.label;
  }
};

const handleSubMenuClick = (subItem: string) => {
  activeMenu.value = subItem;
};

// ====== 文件夹树 ======
interface FolderNode {
  id: string;
  name: string;
  count?: number;
  children?: FolderNode[];
}

const expandedFolders = ref<Set<string>>(new Set(['all', 'group1']));

const folderTree: FolderNode[] = [
  { id: 'all', name: '全部', count: 156 },
  { 
    id: 'group1', name: '2024车型', count: 45,
    children: [
      { id: 'g1-1', name: '营销海报', count: 20 },
      { id: 'g1-2', name: '新疆车展知识包', count: 15 },
      { id: 'g1-3', name: '车型配置长图', count: 10 },
    ]
  },
  { id: 'group2', name: '售后活动素材', count: 32 },
  { id: 'group3', name: '新Q8素材', count: 28 },
];

const selectedFolder = ref('all');

const toggleFolder = (id: string) => {
  const s = new Set(expandedFolders.value);
  if (s.has(id)) s.delete(id); else s.add(id);
  expandedFolders.value = s;
};

const selectFolder = (id: string) => {
  selectedFolder.value = id;
};

// ====== 筛选条件 ======
const filters = ref({
  region: '',
  dealer: '',
  materialType: '全部',
  title: '',
  business: '',
  scene: '',
  publishStatus: '',
  startDate: '',
  endDate: '',
});

const regions = ['请选择大区', '华东大区', '华南大区', '华北大区', '西部大区'];
const dealers = ['请选择经销商', '北京奥迪世达', '上海奥迪东昌', '广州奥迪锦龙', '长春昌融'];
const businesses = ['请选择所属业务', '新车上市', '试驾邀约', '售后保养', '置换政策', '品牌宣传'];
const scenes = ['请选择所属场景', '客户朋友圈', '客户群发', '欢迎语', '标签拉群'];

const statusMap: Record<string, { label: string; color: string }> = {
  '已发布': { label: '已发布', color: 'text-green-600' },
  '已下架': { label: '已下架', color: 'text-red-500' },
};

const resetFilters = () => {
  filters.value = {
    region: '', dealer: '', materialType: '全部', title: '',
    business: '', scene: '', publishStatus: '', startDate: '', endDate: '',
  };
};

// ====== 素材数据（按截图） ======
interface Material {
  id: number;
  source: string;
  type: string;
  cover: string;
  title: string;
  scene: string;
  series: string;
  model: string;
  status: string;
  business: string;
  operator: string;
  updateTime: string;
}

const materials = ref<Material[]>([
  { 
    id: 1, source: '企微创建', type: '图片',
    cover: 'https://placehold.co/80x100/e53935/white?text=A6L',
    title: '年中礼遇季...', scene: '营销海报', series: '纯电', model: 'Q6L e-tron',
    status: '已下架', business: '品质车型', operator: '侯羽佳', updateTime: '2026-06-2...'
  },
  { 
    id: 2, source: '企微创建', type: '图片',
    cover: 'https://placehold.co/80x100/1e88e5/white?text=A6L',
    title: '年中礼遇季...', scene: '营销海报', series: '纯电', model: 'A6L e-tron',
    status: '已下架', business: '品质车型', operator: '侯羽佳', updateTime: '2026-06-2...'
  },
  { 
    id: 3, source: '企微创建', type: '海报',
    cover: 'https://placehold.co/80x100/43a047/white?text=Q5L',
    title: '金华博奥六...', scene: '--', series: '--', model: '--',
    status: '已发布', business: '经销商素材', operator: '熊豆', updateTime: '2026-06-2...'
  },
  { 
    id: 4, source: '企微创建', type: '链接',
    cover: 'https://placehold.co/80x100/8e24aa/white?text=Link',
    title: '河北奥吉通...', scene: '--', series: '--', model: '--',
    status: '已发布', business: '经销商素材', operator: '程玉龙', updateTime: '2026-06-2...'
  },
  { 
    id: 5, source: '企微创建', type: '海报',
    cover: 'https://placehold.co/80x100/f57c00/white?text=RS',
    title: '超级星期三...', scene: '权益政策', series: '--', model: '--',
    status: '已发布', business: '品牌种草', operator: '王鹤', updateTime: '2026-06-2...'
  },
  { 
    id: 6, source: '企微创建', type: '小程序',
    cover: 'https://placehold.co/80x100/00acc1/white?text=小程序',
    title: '点击查看售...', scene: '用户关爱', series: '--', model: '--',
    status: '已下架', business: '售后服务', operator: '魏兰', updateTime: '2026-06-2...'
  },
  { 
    id: 7, source: '内容中台', type: '图片',
    cover: 'https://placehold.co/80x100/5e35b1/white?text=A8L',
    title: '全系政策', scene: '营销海报', series: 'A系列', model: 'A8L',
    status: '已发布', business: '品质车型', operator: '内容中台同步', updateTime: '2026-06-1...'
  },
]);

const filteredMaterials = computed(() => {
  return materials.value.filter(m => {
    if (filters.value.region && !filters.value.region.includes('请选择') && !m.operator.includes(filters.value.region)) return false;
    if (filters.value.materialType && filters.value.materialType !== '全部' && m.type !== filters.value.materialType) return false;
    if (filters.value.title && !m.title.includes(filters.value.title)) return false;
    if (filters.value.business && !filters.value.business.includes('请选择') && m.business !== filters.value.business) return false;
    if (filters.value.scene && !filters.value.scene.includes('请选择') && m.scene !== filters.value.scene) return false;
    if (filters.value.publishStatus && m.status !== filters.value.publishStatus) return false;
    return true;
  });
});

// ====== 新建/编辑素材弹窗 ======
const showCreateDialog = ref(false);
const editingId = ref<number | null>(null);

const form = ref({
  title: '',
  type: '图片' as string,
  business: '',
  scene: '',
  images: [] as string[],
  content: '',
  description: '',
  dealer: '',
  region: '',
});

const openCreate = () => {
  router.push('/content-library-admin/create');
};

const openEdit = (id: number) => {
  const m = materials.value.find(item => item.id === id);
  if (!m) return;
  editingId.value = id;
  form.value = {
    title: m.title, type: m.type, business: m.business, scene: m.scene,
    images: [m.cover], content: '', description: '', dealer: '', region: '',
  };
  showCreateDialog.value = true;
};

const submitAttempted = ref(false);

const handleSave = () => {
  submitAttempted.value = true;
  if (!form.value.title.trim()) return;
  if (!form.value.business) return;
  
  if (editingId.value) {
    const idx = materials.value.findIndex(m => m.id === editingId.value);
    if (idx >= 0) {
      Object.assign(materials.value[idx], {
        title: form.value.title, type: form.value.type,
        business: form.value.business, scene: form.value.scene,
        updateTime: new Date().toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }) + '...',
      });
      if (form.value.images.length > 0) materials.value[idx].cover = form.value.images[0];
    }
  } else {
    materials.value.unshift({
      id: Date.now(),
      source: '企微创建',
      title: form.value.title, type: form.value.type,
      cover: form.value.images[0] || `https://placehold.co/80x100/e53935/white?text=${encodeURIComponent(form.value.title.slice(0, 4))}`,
      scene: form.value.scene || '--', series: '--', model: '--',
      status: '已发布', business: form.value.business, operator: '闻浩', updateTime: '2026-06-23...',
    });
  }
  showCreateDialog.value = false;
  submitAttempted.value = false;
};

const closeDialog = () => {
  showCreateDialog.value = false;
  submitAttempted.value = false;
};

// ====== 图片上传 & Toast ======
const toastVisible = ref(false);
const toastMessage = ref('');

const showToast = (msg: string) => {
  toastMessage.value = msg;
  toastVisible.value = true;
  setTimeout(() => { toastVisible.value = false; }, 2000);
};

const MAX_IMAGES = 9;
const uploadInputRef = ref<HTMLInputElement | null>(null);

const triggerUpload = () => {
  uploadInputRef.value?.click();
};

const handleImageUpload = (e: Event) => {
  const input = e.target as HTMLInputElement;
  const files = input.files;
  if (!files || files.length === 0) return;

  const remaining = MAX_IMAGES - form.value.images.length;
  if (remaining <= 0) {
    showToast(`最多上传 ${MAX_IMAGES} 张图片`);
    input.value = '';
    return;
  }

  const filesToProcess = Math.min(files.length, remaining);
  let loaded = 0;

  for (let i = 0; i < filesToProcess; i++) {
    const file = files[i];
    if (!file.type.startsWith('image/')) {
      showToast('请选择图片文件');
      continue;
    }
    const reader = new FileReader();
    reader.onload = (evt) => {
      const dataUrl = evt.target?.result as string;
      if (dataUrl) {
        form.value.images.push(dataUrl);
      }
      loaded++;
      if (loaded === filesToProcess) {
        showToast(`已上传 ${form.value.images.length} 张图片`);
      }
    };
    reader.readAsDataURL(file);
  }

  if (files.length > remaining) {
    showToast(`最多上传 ${MAX_IMAGES} 张，已自动截取前 ${remaining} 张`);
  }

  input.value = '';
};

const removeImage = (index: number) => {
  form.value.images.splice(index, 1);
};

const titleCount = computed(() => form.value.title.length);

const handlePublish = (id: number) => {
  const idx = materials.value.findIndex(m => m.id === id);
  if (idx >= 0) materials.value[idx].status = '已发布';
};

const handleUnpublish = (id: number) => {
  const idx = materials.value.findIndex(m => m.id === id);
  if (idx >= 0) materials.value[idx].status = '已下架';
};

// ====== 回到手机端内容库 ======
const goToMobileContentLibrary = () => {
  router.push('/content-library');
};

const goBack = () => {
  router.push('/');
};
</script>

<template>
  <div class="flex min-h-screen bg-gray-50 font-sans text-sm min-w-[1400px]">
    <!-- ====== 左侧深色侧边栏 ====== -->
    <div 
      @mouseenter="sidebarCollapsed = false"
      @mouseleave="sidebarCollapsed = true"
      :class="`bg-[#1a1a1a] text-[#b3b3b3] flex flex-col shrink-0 transition-all duration-200 relative z-50 ${sidebarCollapsed ? 'w-16' : 'w-56'}`"
    >
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
      <!-- 顶部栏 -->
      <div class="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-10">
        <div class="flex items-center gap-2 text-gray-500 text-xs">
          <span>内容中心</span>
          <span class="text-gray-300">/</span>
          <span class="text-gray-800 font-medium">内容库</span>
        </div>
        <div class="flex items-center gap-3">
          <button 
            @click="goToMobileContentLibrary"
            class="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded text-xs text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <Smartphone :size="14" />
            手机端预览
          </button>
          <div class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded">
            <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-xs">
              闻
            </div>
            <span class="text-gray-700 text-xs">闻浩</span>
            <ChevronDown :size="14" class="text-gray-400" />
          </div>
        </div>
      </div>

      <!-- 主内容区域 -->
      <div class="flex-1 overflow-y-auto p-4">
        <!-- ====== 筛选区域 ====== -->
        <div class="bg-white rounded shadow-sm p-4 mb-4">
          <!-- 第一行 -->
          <div class="flex items-center gap-4 mb-3">
            <div class="flex items-center gap-2">
              <span class="text-gray-500 text-xs w-14 shrink-0 text-right">大区：</span>
              <select v-model="filters.region" class="h-8 px-2 border border-gray-300 rounded text-xs bg-white w-36">
                <option v-for="r in regions" :key="r" :value="r">{{ r }}</option>
              </select>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-gray-500 text-xs w-14 shrink-0 text-right">经销商：</span>
              <select v-model="filters.dealer" class="h-8 px-2 border border-gray-300 rounded text-xs bg-white w-36">
                <option v-for="d in dealers" :key="d" :value="d">{{ d }}</option>
              </select>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-gray-500 text-xs w-14 shrink-0 text-right">所属业务：</span>
              <select v-model="filters.business" class="h-8 px-2 border border-gray-300 rounded text-xs bg-white w-36">
                <option v-for="b in businesses" :key="b" :value="b">{{ b }}</option>
              </select>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-gray-500 text-xs w-14 shrink-0 text-right">发布状态：</span>
              <select v-model="filters.publishStatus" class="h-8 px-2 border border-gray-300 rounded text-xs bg-white w-36">
                <option value="">请选择发布状态</option>
                <option>已发布</option>
                <option>已下架</option>
              </select>
            </div>
          </div>
          <!-- 第二行 -->
          <div class="flex items-center gap-4 mb-3">
            <div class="flex items-center gap-2">
              <span class="text-gray-500 text-xs w-14 shrink-0 text-right">素材类型：</span>
              <select v-model="filters.materialType" class="h-8 px-2 border border-gray-300 rounded text-xs bg-white w-36">
                <option>全部</option>
                <option>图片</option>
                <option>视频</option>
                <option>海报</option>
                <option>链接</option>
                <option>小程序</option>
              </select>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-gray-500 text-xs w-14 shrink-0 text-right">标题：</span>
              <input v-model="filters.title" type="text" placeholder="请输入标题" class="h-8 px-3 border border-gray-300 rounded text-xs bg-white w-44 outline-none" />
            </div>
            <div class="flex items-center gap-2">
              <span class="text-gray-500 text-xs w-14 shrink-0 text-right">所属场景：</span>
              <select v-model="filters.scene" class="h-8 px-2 border border-gray-300 rounded text-xs bg-white w-36">
                <option v-for="s in scenes" :key="s" :value="s">{{ s }}</option>
              </select>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-gray-500 text-xs w-14 shrink-0 text-right">更新时间：</span>
              <input v-model="filters.startDate" type="date" class="h-8 px-2 border border-gray-300 rounded text-xs bg-white w-32" />
              <span class="text-gray-400 text-xs">至</span>
              <input v-model="filters.endDate" type="date" class="h-8 px-2 border border-gray-300 rounded text-xs bg-white w-32" />
            </div>
          </div>
          <!-- 按钮行 -->
          <div class="flex items-center justify-end gap-2">
            <button class="h-8 px-4 bg-[#e53935] text-white rounded text-xs hover:bg-red-700 transition-colors">
              查询
            </button>
            <button @click="resetFilters" class="h-8 px-4 border border-gray-300 rounded text-xs text-gray-600 hover:bg-gray-50 transition-colors">
              重置
            </button>
          </div>
        </div>

        <!-- ====== 下方内容区：文件夹 + 素材列表 ====== -->
        <div class="flex gap-4">
          <!-- 左侧文件夹树 -->
          <div class="w-56 bg-white rounded shadow-sm flex flex-col shrink-0">
            <div class="px-3 py-2 border-b border-gray-100 flex items-center gap-2">
              <div class="flex items-center gap-1.5 flex-1 h-7 px-2 bg-gray-50 rounded border border-gray-200">
                <Search :size="12" class="text-gray-400 shrink-0" />
                <input type="text" placeholder="搜索文件夹" class="flex-1 bg-transparent outline-none text-[11px]" />
              </div>
              <button class="w-7 h-7 bg-[#e53935] text-white rounded flex items-center justify-center hover:bg-red-700 transition-colors shrink-0" title="新建文件夹">
                <Plus :size="14" />
              </button>
            </div>
            <div class="flex-1 overflow-y-auto py-1">
              <div v-for="folder in folderTree" :key="folder.id">
                <!-- 父级文件夹 -->
                <div
                  @click="selectFolder(folder.id)"
                  :class="`flex items-center gap-1.5 px-3 py-2 cursor-pointer text-[12px] transition-colors ${
                    selectedFolder === folder.id ? 'bg-red-50 text-[#e53935]' : 'text-gray-700 hover:bg-gray-50'
                  }`"
                >
                  <button @click.stop="toggleFolder(folder.id)" class="p-0.5 hover:bg-gray-200 rounded">
                    <ChevronRight v-if="!expandedFolders.has(folder.id)" :size="12" class="text-gray-400" />
                    <ChevronDown v-else :size="12" class="text-gray-400" />
                  </button>
                  <Folder v-if="!expandedFolders.has(folder.id)" :size="14" class="text-amber-400 shrink-0" />
                  <FolderOpen v-else :size="14" class="text-amber-500 shrink-0" />
                  <span class="truncate flex-1">{{ folder.name }}</span>
                  <span class="text-[11px] text-gray-400 shrink-0">{{ folder.count }}</span>
                </div>
                <!-- 子文件夹 -->
                <div v-if="folder.children && expandedFolders.has(folder.id)">
                  <div
                    v-for="child in folder.children" :key="child.id"
                    @click="selectFolder(child.id)"
                    :class="`flex items-center gap-1.5 pl-8 pr-3 py-1.5 cursor-pointer text-[11px] transition-colors ${
                      selectedFolder === child.id ? 'bg-red-50 text-[#e53935]' : 'text-gray-600 hover:bg-gray-50'
                    }`"
                  >
                    <Folder :size="12" class="text-amber-300 shrink-0" />
                    <span class="truncate flex-1">{{ child.name }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧素材列表 -->
          <div class="flex-1 bg-white rounded shadow-sm overflow-hidden">
            <!-- 操作按钮栏 -->
            <div class="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
              <button @click="openCreate" class="h-8 px-4 bg-[#e53935] text-white rounded text-xs flex items-center gap-1.5 hover:bg-red-700 transition-colors">
                <Plus :size="14" />
                添加
              </button>
              <button class="h-8 px-4 border border-gray-300 rounded text-xs text-gray-600 hover:bg-gray-50 transition-colors">
                场景车系维护
              </button>
              <button class="h-8 px-4 border border-gray-300 rounded text-xs text-gray-600 hover:bg-gray-50 transition-colors ml-auto">
                批量下载
              </button>
            </div>

            <!-- 表格 -->
            <table class="w-full">
              <thead>
                <tr class="border-b border-gray-200 bg-gray-50">
                  <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 w-10">
                    <input type="checkbox" class="rounded border-gray-300" />
                  </th>
                  <th class="px-2 py-3 text-left text-xs font-medium text-gray-500 w-16">来源</th>
                  <th class="px-2 py-3 text-left text-xs font-medium text-gray-500 w-16">类型</th>
                  <th class="px-2 py-3 text-left text-xs font-medium text-gray-500 w-20">图片</th>
                  <th class="px-2 py-3 text-left text-xs font-medium text-gray-500">标题</th>
                  <th class="px-2 py-3 text-left text-xs font-medium text-gray-500 w-20">所属场景</th>
                  <th class="px-2 py-3 text-left text-xs font-medium text-gray-500 w-16">所属车系</th>
                  <th class="px-2 py-3 text-left text-xs font-medium text-gray-500 w-20">所属车型</th>
                  <th class="px-2 py-3 text-left text-xs font-medium text-gray-500 w-16">素材状态</th>
                  <th class="px-2 py-3 text-left text-xs font-medium text-gray-500 w-20">所属业务</th>
                  <th class="px-2 py-3 text-left text-xs font-medium text-gray-500 w-16">运营人员</th>
                  <th class="px-2 py-3 text-left text-xs font-medium text-gray-500 w-24">更新时间</th>
                  <th class="px-2 py-3 text-left text-xs font-medium text-gray-500 w-32">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in filteredMaterials" :key="item.id" class="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td class="px-3 py-3">
                    <input type="checkbox" class="rounded border-gray-300" />
                  </td>
                  <td class="px-2 py-3 text-xs text-gray-600">{{ item.source }}</td>
                  <td class="px-2 py-3 text-xs text-gray-600">{{ item.type }}</td>
                  <td class="px-2 py-3">
                    <div class="w-12 h-16 bg-gray-100 rounded overflow-hidden shrink-0 border border-gray-200">
                      <img :src="item.cover" class="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td class="px-2 py-3">
                    <span class="text-xs text-gray-900">{{ item.title }}</span>
                  </td>
                  <td class="px-2 py-3 text-xs text-gray-600">{{ item.scene }}</td>
                  <td class="px-2 py-3 text-xs text-gray-600">{{ item.series }}</td>
                  <td class="px-2 py-3 text-xs text-gray-600">{{ item.model }}</td>
                  <td class="px-2 py-3">
                    <span :class="`text-xs ${statusMap[item.status]?.color || 'text-gray-500'}`">
                      {{ item.status }}
                    </span>
                  </td>
                  <td class="px-2 py-3 text-xs text-gray-600">{{ item.business }}</td>
                  <td class="px-2 py-3 text-xs text-gray-600">{{ item.operator }}</td>
                  <td class="px-2 py-3 text-xs text-gray-500 whitespace-nowrap">{{ item.updateTime }}</td>
                  <td class="px-2 py-3">
                    <div class="flex items-center gap-2">
                      <button @click="openEdit(item.id)" class="text-xs text-[#e53935] hover:underline">编辑</button>
                      <button v-if="item.status === '已下架'" @click="handlePublish(item.id)" class="text-xs text-green-600 hover:underline">发布</button>
                      <button v-if="item.status === '已发布'" @click="handleUnpublish(item.id)" class="text-xs text-gray-500 hover:underline">下架</button>
                      <button class="text-xs text-gray-500 hover:underline">推广</button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredMaterials.length === 0">
                  <td colspan="13" class="px-4 py-16 text-center text-gray-400 text-sm">
                    <FolderOpen :size="40" class="mx-auto mb-3 text-gray-200" />
                    暂无素材数据
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ====== 新建/编辑素材弹窗 ====== -->
  <Teleport to="body">
    <div v-if="showCreateDialog" class="fixed inset-0 z-[100] flex items-center justify-center">
      <div class="absolute inset-0 bg-black/40" @click="closeDialog"></div>
      <div class="relative bg-white rounded-lg shadow-2xl w-[680px] max-h-[85vh] overflow-y-auto">
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h3 class="text-base font-bold text-gray-900">{{ editingId ? '编辑素材' : '新建素材' }}</h3>
          <button @click="closeDialog" class="p-1 hover:bg-gray-100 rounded transition-colors">
            <ChevronLeft :size="18" class="text-gray-400" />
          </button>
        </div>

        <div class="p-6 space-y-5">
          <!-- 素材名称 -->
          <div class="grid grid-cols-[100px_1fr] gap-4 items-center">
            <div class="text-sm text-gray-700 text-right">
              <span class="text-[#e53935]">*</span> 素材名称
            </div>
            <div>
              <div class="flex items-center gap-3">
                <input v-model="form.title" maxlength="30" type="text" placeholder="请输入素材名称"
                  :class="`flex-1 h-10 px-3 border rounded text-sm focus:outline-none ${submitAttempted && !form.title.trim() ? 'border-red-400' : 'border-gray-300 focus:border-[#e53935]'}`" />
                <span class="text-xs text-gray-400 w-14 text-right">{{ titleCount }}/30</span>
              </div>
              <p v-if="submitAttempted && !form.title.trim()" class="text-xs text-red-500 mt-1">请输入素材名称</p>
            </div>
          </div>

          <!-- 素材类型 + 所属业务 -->
          <div class="grid grid-cols-[100px_1fr] gap-4 items-center">
            <div class="text-sm text-gray-700 text-right">
              <span class="text-[#e53935]">*</span> 素材类型
            </div>
            <div class="flex items-center gap-6">
              <select v-model="form.type" class="h-10 px-3 border border-gray-300 rounded text-sm bg-white min-w-[120px] focus:border-[#e53935] focus:outline-none">
                <option>图片</option>
                <option>视频</option>
                <option>海报</option>
                <option>链接</option>
                <option>小程序</option>
              </select>
              <div class="flex items-center gap-2">
                <span class="text-sm text-gray-500 shrink-0">所属业务</span>
                <select v-model="form.business" :class="`h-10 px-3 border rounded text-sm bg-white min-w-[140px] focus:border-[#e53935] focus:outline-none ${submitAttempted && !form.business ? 'border-red-400' : 'border-gray-300'}`">
                  <option value="">请选择</option>
                  <option v-for="b in businesses.slice(1)" :key="b" :value="b">{{ b }}</option>
                </select>
              </div>
            </div>
          </div>

          <!-- 所属场景 + 经销商 -->
          <div class="grid grid-cols-[100px_1fr] gap-4 items-center">
            <div class="text-sm text-gray-700 text-right">所属场景</div>
            <div class="flex items-center gap-6">
              <select v-model="form.scene" class="h-10 px-3 border border-gray-300 rounded text-sm bg-white min-w-[140px] focus:border-[#e53935] focus:outline-none">
                <option value="">请选择</option>
                <option v-for="s in scenes.slice(1)" :key="s" :value="s">{{ s }}</option>
              </select>
              <div class="flex items-center gap-2">
                <span class="text-sm text-gray-500 shrink-0">经销商</span>
                <select v-model="form.dealer" class="h-10 px-3 border border-gray-300 rounded text-sm bg-white min-w-[160px] focus:border-[#e53935] focus:outline-none">
                  <option value="">请选择</option>
                  <option v-for="d in dealers.slice(1)" :key="d" :value="d">{{ d }}</option>
                </select>
              </div>
            </div>
          </div>

          <!-- 上传图片（最多9张） -->
          <div class="grid grid-cols-[100px_1fr] gap-4 items-start">
            <div class="text-sm text-gray-700 text-right pt-2">上传图片</div>
            <div>
              <div class="flex flex-wrap gap-2">
                <!-- 已上传图片 -->
                <div
                  v-for="(img, idx) in form.images" :key="idx"
                  class="w-20 h-20 border border-gray-200 rounded overflow-hidden relative group shrink-0"
                >
                  <img :src="img" class="w-full h-full object-cover" />
                  <button
                    @click="removeImage(idx)"
                    class="absolute -top-1.5 -right-1.5 w-5 h-5 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronLeft :size="12" class="rotate-45" />
                  </button>
                </div>
                <!-- 上传按钮 -->
                <div
                  v-if="form.images.length < MAX_IMAGES"
                  @click="triggerUpload"
                  class="w-20 h-20 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-[#e53935] hover:bg-red-50 transition-colors shrink-0"
                >
                  <Plus :size="18" class="text-gray-400" />
                  <span class="text-[10px] text-gray-400">上传</span>
                </div>
                <input
                  ref="uploadInputRef"
                  type="file"
                  accept="image/*"
                  multiple
                  class="hidden"
                  @change="handleImageUpload"
                />
              </div>
              <p class="text-xs text-gray-400 mt-2">
                支持 jpg/png 格式，最多上传 <span class="text-[#e53935]">{{ MAX_IMAGES }}</span> 张图片，已上传 <span class="text-[#e53935]">{{ form.images.length }}</span> 张
              </p>
            </div>
          </div>

          <!-- 素材描述 -->
          <div class="grid grid-cols-[100px_1fr] gap-4 items-start">
            <div class="text-sm text-gray-700 text-right pt-2">素材描述</div>
            <div>
              <textarea v-model="form.description" maxlength="200" placeholder="请输入素材描述"
                class="w-full h-20 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#e53935] resize-none"></textarea>
              <div class="text-xs text-gray-400 mt-1 text-right">{{ form.description.length }}/200</div>
            </div>
          </div>

          <!-- 素材内容 -->
          <div class="grid grid-cols-[100px_1fr] gap-4 items-start">
            <div class="text-sm text-gray-700 text-right pt-2">素材内容</div>
            <div>
              <textarea v-model="form.content" placeholder="请输入素材正文内容"
                class="w-full h-32 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#e53935] resize-none"></textarea>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg sticky bottom-0">
          <button @click="closeDialog" class="h-9 px-6 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-100 transition-colors">取消</button>
          <button @click="handleSave" class="h-9 px-6 bg-[#e53935] text-white rounded text-sm hover:bg-red-700 transition-colors">
            {{ editingId ? '保存修改' : '确认新建' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>

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

  <PrototypeCodeLocation folder-path="src/features/content-library-admin/ContentLibraryAdminPage.vue" />
</template>

<style scoped>
.toast-enter-active { transition: all 0.3s ease-out; }
.toast-leave-active { transition: all 0.2s ease-in; }
.toast-enter-from { opacity: 0; transform: translate(-50%, -12px); }
.toast-leave-to { opacity: 0; transform: translate(-50%, -8px); }
</style>
