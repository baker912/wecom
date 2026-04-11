<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { ChevronLeft, Eye, Filter, Play, Search, Share2, Star, X, Layers, MessageSquare, Download, FolderSearch } from 'lucide-vue-next';

type ContentType = '图片' | '视频';
type SortMode = '最新发布' | '热度最高';

type ContentItem = {
  id: string;
  title: string;
  coverUrl: string;
  type: ContentType;
  assetCount: number;
  viewCount: number;
  favCount: number;
  authorName: string;
  authorTag: string;
  series: string;
  category: string;
  publishedAt: string;
  videoUrl?: string;
  description?: string;
};

const router = useRouter();

const keyword = ref('');
const sortMode = ref<SortMode>('最新发布');
const sortDraft = ref<SortMode>(sortMode.value);
const showFilterSheet = ref(false);
const showDetail = ref(false);
const activeItemId = ref<string | null>(null);
const isLoading = ref(false);

const filterApplied = ref({
  series: '全部',
  creator: '全部',
  contentType: '全部' as '全部' | ContentType,
  publishTime: '全部'
});

const filterDraft = ref({ ...filterApplied.value });

const seriesOptions = ['全部', 'A4L', 'A5L', 'A6L', 'Q3', 'Q5L', 'Q7', 'e-tron'];
const creatorOptions = ['全部', '奥迪官方', '销售助手', '经销商运营'];
const contentTypeOptions: Array<'全部' | ContentType> = ['全部', '图片', '视频'];
const publishTimeOptions = ['全部', '近7天', '近30天', '近90天'];
const sortOptions: SortMode[] = ['最新发布', '热度最高'];

const items = ref<ContentItem[]>([
  {
    id: 'CL-001',
    title: '奥迪A5L cloudbase测试',
    coverUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    type: '图片',
    assetCount: 1,
    viewCount: 41,
    favCount: 1,
    authorName: '奥迪官方',
    authorTag: '奥',
    series: 'A5L',
    category: '新车上市',
    publishedAt: '2026-04-01',
    description: '全新奥迪A5L带来更具运动感的外观与更智能的驾驶体验。建议结合客户画像与沟通场景，选择合适的内容触达方式，提高到店与试驾转化。'
  },
  {
    id: 'CL-002',
    title: '奥迪A5L 静态品鉴实拍',
    coverUrl: 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1200&q=80',
    type: '图片',
    assetCount: 3,
    viewCount: 17,
    favCount: 0,
    authorName: '奥迪官方',
    authorTag: '奥',
    series: 'A5L',
    category: '车型介绍',
    publishedAt: '2026-04-02',
    description: '内饰空间及科技配置静态体验，展现越级豪华。'
  },
  {
    id: 'CL-003',
    title: '一汽奥迪A5L 乾崑智驾®版正式上市',
    coverUrl: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80',
    type: '视频',
    assetCount: 1,
    viewCount: 68,
    favCount: 2,
    authorName: '奥迪官方',
    authorTag: '奥',
    series: 'A5L',
    category: '新车上市',
    publishedAt: '2026-03-30',
    videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    description: '全面搭载华为乾崑智驾系统，开启智能出行新篇章。'
  },
  {
    id: 'CL-004',
    title: '全新奥迪A6L爆料来了！直接推家里？',
    coverUrl: 'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1200&q=80',
    type: '图片',
    assetCount: 1,
    viewCount: 150,
    favCount: 0,
    authorName: '奥迪官方',
    authorTag: '奥',
    series: 'A6L',
    category: '车型介绍',
    publishedAt: '2026-03-28'
  },
  {
    id: 'CL-005',
    title: '一图看懂 2026 一汽奥迪金融方案',
    coverUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
    type: '图片',
    assetCount: 4,
    viewCount: 96,
    favCount: 3,
    authorName: '销售助手',
    authorTag: '销',
    series: 'A4L',
    category: '购车政策',
    publishedAt: '2026-03-21'
  },
  {
    id: 'CL-006',
    title: 'Q5L 试驾路线推荐：城市+高速组合',
    coverUrl: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80',
    type: '视频',
    assetCount: 1,
    viewCount: 34,
    favCount: 0,
    authorName: '经销商运营',
    authorTag: '经',
    series: 'Q5L',
    category: '试驾体验',
    publishedAt: '2026-03-25',
    videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'
  },
  {
    id: 'CL-007',
    title: '保养知识：刹车片更换建议（话术配图）',
    coverUrl: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1200&q=80',
    type: '图片',
    assetCount: 2,
    viewCount: 58,
    favCount: 1,
    authorName: '销售助手',
    authorTag: '销',
    series: 'Q3',
    category: '保养知识',
    publishedAt: '2026-03-18'
  },
  {
    id: 'CL-008',
    title: 'e-tron 充电指南：家充与公充选择',
    coverUrl: 'https://images.unsplash.com/photo-1605559424843-9e8f19859d9e?auto=format&fit=crop&w=1200&q=80',
    type: '图片',
    assetCount: 1,
    viewCount: 22,
    favCount: 0,
    authorName: '奥迪官方',
    authorTag: '奥',
    series: 'e-tron',
    category: '用车知识',
    publishedAt: '2026-03-12'
  }
]);

const activeItem = computed(() => {
  const id = activeItemId.value;
  if (!id) return null;
  return items.value.find(i => i.id === id) || null;
});

const normalize = (s: string) => s.trim().toLowerCase();

const inPublishTimeRange = (dateStr: string, range: string) => {
  if (range === '全部') return true;
  const now = new Date('2026-04-05T00:00:00');
  const d = new Date(`${dateStr}T00:00:00`);
  const diffDays = Math.floor((+now - +d) / 86400000);
  if (range === '近7天') return diffDays <= 7;
  if (range === '近30天') return diffDays <= 30;
  if (range === '近90天') return diffDays <= 90;
  return true;
};

const filteredItems = computed(() => {
  const k = normalize(keyword.value);
  const f = filterApplied.value;
  let list = items.value.slice();

  if (k) {
    list = list.filter(i => {
      return [i.title, i.authorName, i.series, i.category, i.type].some(x => normalize(String(x)).includes(k));
    });
  }
  if (f.series !== '全部') list = list.filter(i => i.series === f.series);
  if (f.creator !== '全部') list = list.filter(i => i.authorName === f.creator);
  if (f.contentType !== '全部') list = list.filter(i => i.type === f.contentType);
  if (f.publishTime !== '全部') list = list.filter(i => inPublishTimeRange(i.publishedAt, f.publishTime));

  if (sortMode.value === '热度最高') {
    list.sort((a, b) => b.viewCount - a.viewCount);
  } else {
    list.sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
  }
  return list;
});

// 模拟加载态
const simulateLoading = () => {
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
  }, 400);
};

// 监听搜索词变化触发加载
let searchTimeout: any = null;
watch(keyword, () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(simulateLoading, 300);
});

const openFilter = () => {
  filterDraft.value = { ...filterApplied.value };
  sortDraft.value = sortMode.value;
  showFilterSheet.value = true;
};

const closeFilter = () => {
  showFilterSheet.value = false;
};

const resetFilter = () => {
  filterDraft.value = {
    series: '全部',
    creator: '全部',
    contentType: '全部',
    publishTime: '全部'
  };
  sortDraft.value = '最新发布';
};

const applyFilter = () => {
  filterApplied.value = { ...filterDraft.value };
  sortMode.value = sortDraft.value;
  closeFilter();
  simulateLoading();
};

type AppliedFilterKey = 'series' | 'creator' | 'contentType' | 'publishTime';

const appliedChips = computed(() => {
  const f = filterApplied.value;
  const chips: Array<{ key: AppliedFilterKey; label: string; value: string }> = [];
  if (f.series !== '全部') chips.push({ key: 'series', label: '车系', value: f.series });
  if (f.creator !== '全部') chips.push({ key: 'creator', label: '创作者', value: f.creator });
  if (f.contentType !== '全部') chips.push({ key: 'contentType', label: '类型', value: f.contentType });
  if (f.publishTime !== '全部') chips.push({ key: 'publishTime', label: '时间', value: f.publishTime });
  return chips;
});

const clearApplied = (key: AppliedFilterKey) => {
  filterApplied.value = { ...filterApplied.value, [key]: '全部' };
  filterDraft.value = { ...filterDraft.value, [key]: '全部' };
  simulateLoading();
};

const openDetail = (id: string) => {
  activeItemId.value = id;
  showDetail.value = true;
  document.body.style.overflow = 'hidden'; // 防止背景滚动
};

const closeDetail = () => {
  showDetail.value = false;
  setTimeout(() => {
    activeItemId.value = null;
    document.body.style.overflow = '';
  }, 300); // 配合动画时间
};

const backToHome = () => {
  router.push('/');
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col font-sans">
    <!-- 顶部导航栏 (固定) -->
    <header class="bg-white sticky top-0 z-30 shadow-sm border-b border-gray-100">
      <!-- 状态栏与返回 -->
      <div class="h-12 flex items-center justify-between px-4 max-w-7xl mx-auto w-full">
        <button type="button" class="p-1 -ml-1 text-gray-600 hover:text-gray-900 transition-colors rounded-md" @click="backToHome" aria-label="返回">
          <ChevronLeft :size="24" />
        </button>
        <div class="text-[17px] font-bold text-gray-900">内容库</div>
        <div class="w-8"></div> <!-- 占位保持居中 -->
      </div>
      
      <!-- 搜索与过滤栏 -->
      <div class="px-4 pb-3 max-w-7xl mx-auto w-full flex flex-col gap-3">
        <div class="flex items-center gap-3 mt-1">
          <div class="flex-1 bg-gray-100/80 hover:bg-gray-100 focus-within:bg-white focus-within:ring-2 focus-within:ring-red-500/20 focus-within:border-red-500 transition-all rounded-xl h-11 px-3 flex items-center gap-2 border border-transparent">
            <Search :size="18" class="text-gray-400" />
            <input 
              v-model="keyword" 
              type="text" 
              placeholder="搜索素材标题、车系或标签..." 
              class="flex-1 bg-transparent outline-none text-[15px] text-gray-800 placeholder-gray-400" 
            />
            <button v-if="keyword" @click="keyword=''" class="p-1 rounded-full text-gray-400 hover:text-gray-600">
              <X :size="14" />
            </button>
          </div>
          <button 
            type="button" 
            class="h-11 px-4 bg-white rounded-xl border border-gray-200 shadow-sm flex items-center gap-2 hover:bg-gray-50 transition-colors text-gray-700 font-medium" 
            @click="openFilter"
          >
            <Filter :size="18" />
            <span class="hidden sm:inline">筛选</span>
          </button>
        </div>

        <!-- 选中的筛选标签 (横向滚动) -->
        <div class="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1 -mb-1">
          <span class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 text-[13px] text-gray-600 font-medium whitespace-nowrap shrink-0">
            排序: {{ sortMode }}
          </span>
          <span
            v-for="chip in appliedChips"
            :key="chip.key"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-[13px] text-red-600 font-medium border border-red-100 whitespace-nowrap shrink-0 transition-all hover:bg-red-100"
          >
            {{ chip.label }}: {{ chip.value }}
            <button type="button" class="p-0.5 rounded-full hover:bg-red-200 transition-colors" @click="clearApplied(chip.key)">
              <X :size="12" />
            </button>
          </span>
        </div>
      </div>
    </header>

    <!-- 主体瀑布流内容 -->
    <main class="flex-1 px-4 py-5 max-w-7xl mx-auto w-full">
      <!-- 骨架屏加载态 -->
      <div v-if="isLoading" class="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4">
        <div v-for="i in 8" :key="i" class="mb-4 break-inside-avoid">
          <div class="bg-white rounded-2xl p-2 animate-pulse shadow-sm">
            <div class="w-full h-40 bg-gray-200 rounded-xl mb-3"></div>
            <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div class="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>

      <!-- 空态提示 -->
      <div v-else-if="filteredItems.length === 0" class="flex flex-col items-center justify-center py-20 text-center">
        <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <FolderSearch :size="40" class="text-gray-400" />
        </div>
        <h3 class="text-lg font-bold text-gray-800 mb-1">未找到相关素材</h3>
        <p class="text-sm text-gray-500 max-w-xs">尝试更换关键词或清除筛选条件，以发现更多精彩内容。</p>
        <button @click="resetFilter(); applyFilter(); keyword=''" class="mt-6 px-6 py-2 bg-red-500 text-white rounded-full font-medium hover:bg-red-600 transition-colors">
          清除所有筛选
        </button>
      </div>

      <!-- 瀑布流网格 -->
      <div v-else class="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4">
        <div v-for="item in filteredItems" :key="item.id" class="mb-4 break-inside-avoid">
          <button 
            type="button" 
            class="w-full text-left bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 overflow-hidden active:scale-[0.98] transition-all group" 
            @click="openDetail(item.id)"
          >
            <!-- 封面图区域 -->
            <div class="relative overflow-hidden">
              <img :src="item.coverUrl" alt="" class="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />

              <!-- 左上角分类标签 -->
              <div class="absolute top-2 left-2 px-2 py-1 rounded bg-black/40 backdrop-blur-sm text-white text-[11px] font-medium tracking-wide">
                {{ item.category }}
              </div>

              <!-- 右上角图集标识 -->
              <div v-if="item.assetCount > 1" class="absolute top-2 right-2 px-2 py-1 rounded bg-black/40 backdrop-blur-sm text-white text-[11px] flex items-center gap-1 font-medium">
                <Layers :size="12" />
                <span>{{ item.assetCount }}</span>
              </div>

              <!-- 视频播放标识 -->
              <div v-if="item.type === '视频'" class="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
                <div class="w-10 h-10 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center">
                  <Play :size="20" class="text-white translate-x-[1px]" />
                </div>
              </div>

              <!-- 底部浏览量统计 -->
              <div class="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <div class="inline-flex items-center gap-1 text-white text-[11px] font-medium">
                  <Eye :size="12" />
                  {{ item.viewCount }}
                </div>
              </div>
            </div>

            <!-- 信息区域 -->
            <div class="p-3">
              <h3 class="text-[14px] font-bold text-gray-900 leading-snug line-clamp-2 mb-2 group-hover:text-red-600 transition-colors">
                {{ item.title }}
              </h3>
              <div class="flex items-center justify-between mt-auto">
                <div class="flex items-center gap-1.5 min-w-0">
                  <div class="w-5 h-5 rounded-full bg-red-50 flex items-center justify-center text-[10px] font-bold text-red-600 shrink-0">
                    {{ item.authorTag }}
                  </div>
                  <span class="text-[11px] text-gray-500 truncate">{{ item.authorName }}</span>
                </div>
                <div class="flex items-center gap-1 text-[11px] text-gray-400 shrink-0">
                  <Star :size="12" />
                  {{ item.favCount }}
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </main>

    <!-- 侧边栏/底部抽屉筛选面板 (统一铺平选项，减少点击) -->
    <div v-if="showFilterSheet" class="fixed inset-0 z-[60] flex items-end md:items-stretch md:justify-end">
      <!-- 背景遮罩 -->
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" @click="closeFilter"></div>
      
      <!-- 面板内容 -->
      <div class="relative w-full md:w-96 bg-white rounded-t-3xl md:rounded-none md:rounded-l-3xl shadow-2xl flex flex-col h-[85vh] md:h-full transform transition-transform animate-slide-up md:animate-slide-left">
        <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div class="text-[18px] font-bold text-gray-900">高级筛选</div>
          <button type="button" class="p-2 -mr-2 bg-gray-50 rounded-full text-gray-500 hover:text-gray-900 transition-colors" @click="closeFilter">
            <X :size="18" />
          </button>
        </div>

        <div class="flex-1 overflow-y-auto px-5 py-4 space-y-6 hide-scrollbar">
          <!-- 排序方式 -->
          <section>
            <h4 class="text-sm font-bold text-gray-900 mb-3">排序方式</h4>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="opt in sortOptions" :key="opt" type="button"
                @click="sortDraft = opt"
                :class="['px-4 py-2 rounded-lg text-[13px] font-medium transition-all', sortDraft === opt ? 'bg-red-50 text-red-600 border border-red-200 shadow-sm' : 'bg-gray-50 text-gray-600 border border-transparent hover:bg-gray-100']"
              >
                {{ opt }}
              </button>
            </div>
          </section>

          <!-- 品质车系 -->
          <section>
            <h4 class="text-sm font-bold text-gray-900 mb-3">品质车系</h4>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="opt in seriesOptions" :key="opt" type="button"
                @click="filterDraft.series = opt"
                :class="['px-4 py-2 rounded-lg text-[13px] font-medium transition-all', filterDraft.series === opt ? 'bg-red-50 text-red-600 border border-red-200 shadow-sm' : 'bg-gray-50 text-gray-600 border border-transparent hover:bg-gray-100']"
              >
                {{ opt }}
              </button>
            </div>
          </section>

          <!-- 创作者 -->
          <section>
            <h4 class="text-sm font-bold text-gray-900 mb-3">内容创作者</h4>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="opt in creatorOptions" :key="opt" type="button"
                @click="filterDraft.creator = opt"
                :class="['px-4 py-2 rounded-lg text-[13px] font-medium transition-all', filterDraft.creator === opt ? 'bg-red-50 text-red-600 border border-red-200 shadow-sm' : 'bg-gray-50 text-gray-600 border border-transparent hover:bg-gray-100']"
              >
                {{ opt }}
              </button>
            </div>
          </section>

          <!-- 内容类型 -->
          <section>
            <h4 class="text-sm font-bold text-gray-900 mb-3">内容类型</h4>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="opt in contentTypeOptions" :key="opt" type="button"
                @click="filterDraft.contentType = opt"
                :class="['px-4 py-2 rounded-lg text-[13px] font-medium transition-all', filterDraft.contentType === opt ? 'bg-red-50 text-red-600 border border-red-200 shadow-sm' : 'bg-gray-50 text-gray-600 border border-transparent hover:bg-gray-100']"
              >
                {{ opt }}
              </button>
            </div>
          </section>

          <!-- 发布时间 -->
          <section>
            <h4 class="text-sm font-bold text-gray-900 mb-3">发布时间</h4>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="opt in publishTimeOptions" :key="opt" type="button"
                @click="filterDraft.publishTime = opt"
                :class="['px-4 py-2 rounded-lg text-[13px] font-medium transition-all', filterDraft.publishTime === opt ? 'bg-red-50 text-red-600 border border-red-200 shadow-sm' : 'bg-gray-50 text-gray-600 border border-transparent hover:bg-gray-100']"
              >
                {{ opt }}
              </button>
            </div>
          </section>
        </div>

        <div class="p-4 border-t border-gray-100 bg-white flex items-center gap-3 shrink-0">
          <button type="button" class="w-1/3 h-12 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors" @click="resetFilter">
            重置
          </button>
          <button type="button" class="flex-1 h-12 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 shadow-md shadow-red-500/20 transition-all" @click="applyFilter">
            查看结果
          </button>
        </div>
      </div>
    </div>

    <!-- 详情模态框 (响应式：移动端全屏，桌面端弹窗) -->
    <div v-if="showDetail && activeItem" class="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 md:bg-black/60 md:p-6 backdrop-blur-sm transition-opacity">
      <div class="relative w-full h-full md:max-w-5xl md:h-[85vh] bg-white md:rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl animate-fade-in">
        
        <!-- 左侧媒体展示区 -->
        <div class="relative w-full h-[45vh] md:h-full md:w-3/5 bg-black flex items-center justify-center group shrink-0">
          <img v-if="activeItem.type === '图片'" :src="activeItem.coverUrl" alt="" class="w-full h-full object-contain" />
          <video
            v-else
            class="w-full h-full object-contain"
            :src="activeItem.videoUrl"
            :poster="activeItem.coverUrl"
            controls
            playsinline
            autoplay
          ></video>

          <!-- 悬浮返回/关闭按钮 (移动端左上，桌面端悬浮) -->
          <button 
            type="button" 
            class="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md flex items-center justify-center text-white transition-colors z-10" 
            @click="closeDetail"
          >
            <ChevronLeft :size="24" class="md:hidden" />
            <X :size="20" class="hidden md:block" />
          </button>
        </div>

        <!-- 右侧信息交互区 -->
        <div class="flex-1 flex flex-col bg-white overflow-hidden">
          <div class="flex-1 overflow-y-auto px-6 py-6 hide-scrollbar">
            <!-- 作者信息 -->
            <div class="flex items-center gap-3 mb-5">
              <div class="w-10 h-10 rounded-full bg-red-50 text-red-600 border border-red-100 flex items-center justify-center font-bold shrink-0">
                {{ activeItem.authorTag }}
              </div>
              <div class="flex-1">
                <div class="text-[15px] font-bold text-gray-900">{{ activeItem.authorName }}</div>
                <div class="text-[12px] text-gray-400 mt-0.5">{{ activeItem.publishedAt }}</div>
              </div>
              <button class="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-[13px] font-bold rounded-full transition-colors">
                关注
              </button>
            </div>

            <!-- 标签 -->
            <div class="flex flex-wrap items-center gap-2 mb-3">
              <span class="px-2.5 py-1 bg-gray-100 text-gray-600 text-[12px] font-medium rounded"># {{ activeItem.category }}</span>
              <span class="px-2.5 py-1 bg-gray-100 text-gray-600 text-[12px] font-medium rounded"># {{ activeItem.series }}</span>
            </div>

            <!-- 标题与描述 -->
            <h2 class="text-xl font-extrabold text-gray-900 leading-snug mb-3">
              {{ activeItem.title }}
            </h2>
            <p class="text-[15px] text-gray-600 leading-relaxed">
              {{ activeItem.description || `全新奥迪${activeItem.series}带来更具运动感的外观与更智能的驾驶体验。建议结合客户画像与沟通场景，选择合适的内容触达方式，提高到店与试驾转化。` }}
            </p>
          </div>

          <!-- 底部交互动作栏 -->
          <div class="p-4 border-t border-gray-100 bg-white flex items-center justify-around shrink-0">
            <button class="flex flex-col items-center gap-1 text-gray-500 hover:text-red-600 transition-colors group">
              <div class="w-10 h-10 rounded-full bg-gray-50 group-hover:bg-red-50 flex items-center justify-center transition-colors">
                <Star :size="20" />
              </div>
              <span class="text-[12px] font-medium">{{ activeItem.favCount }} 收藏</span>
            </button>
            <button class="flex flex-col items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors group">
              <div class="w-10 h-10 rounded-full bg-gray-50 group-hover:bg-blue-50 flex items-center justify-center transition-colors">
                <MessageSquare :size="20" />
              </div>
              <span class="text-[12px] font-medium">评论</span>
            </button>
            <button class="flex flex-col items-center gap-1 text-gray-500 hover:text-green-600 transition-colors group">
              <div class="w-10 h-10 rounded-full bg-gray-50 group-hover:bg-green-50 flex items-center justify-center transition-colors">
                <Share2 :size="20" />
              </div>
              <span class="text-[12px] font-medium">转发</span>
            </button>
            <button class="flex flex-col items-center gap-1 text-gray-500 hover:text-purple-600 transition-colors group">
              <div class="w-10 h-10 rounded-full bg-gray-50 group-hover:bg-purple-50 flex items-center justify-center transition-colors">
                <Download :size="20" />
              </div>
              <span class="text-[12px] font-medium">保存</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 隐藏滚动条但保留滚动功能 */
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* 简单的进场动画 */
@keyframes slide-up {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
.animate-slide-up {
  animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes slide-left {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
@media (min-width: 768px) {
  .md\:animate-slide-left {
    animation: slide-left 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
}

@keyframes fade-in {
  from { opacity: 0; transform: scale(0.98); }
  to { opacity: 1; transform: scale(1); }
}
.animate-fade-in {
  animation: fade-in 0.2s ease-out forwards;
}
</style>

