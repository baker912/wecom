<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ChevronDown, ChevronLeft, Eye, Filter, Grid3X3, Layers, MoreHorizontal, Play, Search, Share2, Star, X } from 'lucide-vue-next';

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
};

const router = useRouter();

const keyword = ref('');
const sortMode = ref<SortMode>('最新发布');
const showFilterSheet = ref(false);
const showDetail = ref(false);
const activeItemId = ref<string | null>(null);

const filterApplied = ref({
  series: '全部',
  creator: '全部',
  contentType: '全部' as '全部' | ContentType,
  publishTime: '全部'
});

const filterDraft = ref({ ...filterApplied.value });
const sectionExpanded = ref<Record<string, boolean>>({
  series: false,
  creator: false,
  contentType: false,
  publishTime: false,
  sortMode: false
});

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
    publishedAt: '2026-04-01'
  },
  {
    id: 'CL-002',
    title: '奥迪A5L cloudbase测试',
    coverUrl: 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1200&q=80',
    type: '图片',
    assetCount: 3,
    viewCount: 17,
    favCount: 0,
    authorName: '奥迪官方',
    authorTag: '奥',
    series: 'A5L',
    category: '车型介绍',
    publishedAt: '2026-04-02'
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
    videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'
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
    authorTag: '当',
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
    authorTag: '运',
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
    authorTag: '当',
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

const openFilter = () => {
  filterDraft.value = { ...filterApplied.value };
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
  sortMode.value = '最新发布';
};

const applyFilter = () => {
  filterApplied.value = { ...filterDraft.value };
  closeFilter();
};

const toggleSection = (key: string) => {
  sectionExpanded.value = { ...sectionExpanded.value, [key]: !sectionExpanded.value[key] };
};

const openDetail = (id: string) => {
  activeItemId.value = id;
  showDetail.value = true;
};

const closeDetail = () => {
  showDetail.value = false;
  activeItemId.value = null;
};

const backToHome = () => {
  router.push('/');
};
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <div v-if="!showDetail" class="min-h-screen bg-gray-100">
      <div class="bg-white fixed top-0 left-0 right-0 z-20 px-4 pt-12 pb-3 border-b border-gray-100">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 -ml-2">
            <button type="button" class="p-1" @click="backToHome">
              <ChevronLeft :size="22" class="text-gray-700" />
            </button>
            <button type="button" class="p-1">
              <X :size="20" class="text-gray-700" />
            </button>
          </div>
          <div class="text-[17px] font-bold text-gray-900">销售助手</div>
          <button type="button" class="p-1 -mr-1">
            <MoreHorizontal :size="22" class="text-gray-700" />
          </button>
        </div>
      </div>

      <div class="h-[92px]"></div>

      <div class="px-4 pb-3">
        <div class="flex items-center gap-3">
          <div class="flex-1 bg-white rounded-full border border-gray-200 h-10 px-3 flex items-center gap-2 shadow-sm">
            <Search :size="16" class="text-gray-400" />
            <input v-model="keyword" type="text" placeholder="搜索内容" class="flex-1 bg-transparent outline-none text-sm text-gray-700" />
            <button type="button" class="w-7 h-7 rounded-full bg-[#e53935] flex items-center justify-center shrink-0">
              <Search :size="14" class="text-white" />
            </button>
          </div>
          <button type="button" class="w-10 h-10 bg-white rounded-full border border-gray-200 shadow-sm flex items-center justify-center" @click="openFilter">
            <Filter :size="18" class="text-gray-600" />
          </button>
        </div>

        <div class="mt-3">
          <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-xs text-[#e53935] font-bold">
            排序方式： {{ sortMode }}
          </span>
        </div>
      </div>

      <div class="px-4 pb-24">
        <div class="columns-2 gap-3">
          <div v-for="item in filteredItems" :key="item.id" class="mb-3 break-inside-avoid">
            <button type="button" class="w-full text-left bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden active:scale-[0.99] transition-transform" @click="openDetail(item.id)">
              <div class="relative">
                <img :src="item.coverUrl" alt="" class="w-full h-auto object-cover" />

                <div class="absolute top-2 right-2 h-7 px-2 rounded bg-black/35 text-white text-xs flex items-center justify-center">
                  <div class="flex items-center gap-1">
                    <Layers :size="12" />
                    <span>{{ item.assetCount }}</span>
                  </div>
                </div>

                <div class="absolute left-2 bottom-2 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-black/35 text-white text-xs">
                  <Eye :size="12" />
                  {{ item.viewCount }}
                </div>

                <div v-if="item.type === '视频'" class="absolute left-3 bottom-12 w-9 h-9 rounded-full bg-black/35 flex items-center justify-center">
                  <Play :size="18" class="text-white translate-x-[1px]" />
                </div>
              </div>

              <div class="px-3 py-3">
                <div class="text-[15px] text-gray-900 leading-snug line-clamp-2">
                  {{ item.title }}
                </div>
                <div class="mt-2 flex items-center justify-between">
                  <div class="flex items-center gap-2 min-w-0">
                    <div class="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-[#e53935] shrink-0">
                      {{ item.authorTag }}
                    </div>
                    <div class="text-xs text-gray-500 truncate">{{ item.authorName }}</div>
                  </div>
                  <div class="flex items-center gap-1 text-xs text-gray-400 shrink-0">
                    <Star :size="14" />
                    {{ item.favCount }}
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      <button type="button" class="fixed bottom-8 right-5 z-30 w-14 h-14 rounded-full bg-[#e53935] shadow-lg flex items-center justify-center">
        <Grid3X3 :size="22" class="text-white" />
      </button>
    </div>

    <div v-else class="min-h-screen bg-white">
      <div class="relative">
        <img v-if="activeItem?.type === '图片'" :src="activeItem?.coverUrl" alt="" class="w-full h-[420px] object-cover" />
        <video
          v-else
          class="w-full h-[420px] object-cover"
          :src="activeItem?.videoUrl"
          :poster="activeItem?.coverUrl"
          controls
          playsinline
        ></video>

        <button type="button" class="absolute left-4 top-12 w-9 h-9 rounded-full bg-black/35 flex items-center justify-center" @click="closeDetail">
          <ChevronLeft :size="20" class="text-white" />
        </button>
      </div>

      <div class="-mt-12 rounded-t-3xl bg-white px-4 pt-4 pb-24 relative">
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 rounded-full bg-[#e53935] text-white flex items-center justify-center font-bold shrink-0">
            {{ activeItem?.authorTag }}
          </div>
          <div class="flex-1">
            <div class="text-[15px] font-bold text-gray-900">{{ activeItem?.authorName }}</div>
            <div class="text-xs text-gray-400 mt-0.5">{{ activeItem?.publishedAt }}</div>
          </div>
        </div>

        <div class="mt-3 flex items-center gap-2 text-xs">
          <span class="text-blue-600 font-bold"># {{ activeItem?.category }}</span>
          <span class="text-blue-600 font-bold"># {{ activeItem?.series }}</span>
        </div>

        <div class="mt-2 text-[18px] font-bold text-gray-900 leading-snug">
          {{ activeItem?.title }}
        </div>

        <div class="mt-3 text-sm text-gray-600 leading-7">
          全新奥迪{{ activeItem?.series }}带来更具运动感的外观与更智能的驾驶体验。建议结合客户画像与沟通场景，选择合适的内容触达方式，提高到店与试驾转化。
        </div>
      </div>

      <div class="fixed left-0 right-0 bottom-0 bg-white border-t border-gray-100 px-4 py-3 z-30">
        <div class="bg-white rounded-2xl border border-gray-200 shadow-sm px-4 py-3 flex items-center justify-between">
          <div class="flex items-center gap-2 text-gray-600">
            <Eye :size="18" />
            <span class="text-sm">{{ activeItem?.viewCount }}</span>
          </div>
          <button type="button" class="flex items-center gap-2 text-gray-600">
            <Star :size="18" />
            <span class="text-sm">0</span>
          </button>
          <button type="button" class="flex items-center gap-2 text-gray-600">
            <Share2 :size="18" />
            <span class="text-sm">1</span>
          </button>
        </div>
      </div>
    </div>

    <div v-if="showFilterSheet" class="fixed inset-0 z-[50] bg-black/35 flex items-end">
      <div class="w-full bg-white rounded-t-3xl px-5 pt-5 pb-4">
        <div class="flex items-center justify-between">
          <div class="text-[18px] font-bold text-gray-900">全部筛选</div>
          <button type="button" class="p-2 -mr-2 text-gray-400 hover:text-gray-600" @click="closeFilter">
            <X :size="18" />
          </button>
        </div>

        <div class="mt-4 space-y-3">
          <button type="button" class="w-full h-12 flex items-center justify-between border-b border-gray-100" @click="toggleSection('series')">
            <div class="text-sm font-bold text-gray-900">品质车系</div>
            <ChevronDown :size="18" :class="`${sectionExpanded.series ? '' : '-rotate-90'} transition-transform text-gray-400`" />
          </button>
          <div v-if="sectionExpanded.series" class="flex flex-wrap gap-2 pb-2">
            <button
              v-for="opt in seriesOptions"
              :key="opt"
              type="button"
              @click="filterDraft.series = opt"
              :class="`px-3 h-8 rounded-full text-xs font-bold border transition-colors ${filterDraft.series === opt ? 'bg-[#e53935] text-white border-[#e53935]' : 'bg-white text-gray-600 border-gray-200'}`"
            >
              {{ opt }}
            </button>
          </div>

          <button type="button" class="w-full h-12 flex items-center justify-between border-b border-gray-100" @click="toggleSection('creator')">
            <div class="text-sm font-bold text-gray-900">内容创作者</div>
            <ChevronDown :size="18" :class="`${sectionExpanded.creator ? '' : '-rotate-90'} transition-transform text-gray-400`" />
          </button>
          <div v-if="sectionExpanded.creator" class="flex flex-wrap gap-2 pb-2">
            <button
              v-for="opt in creatorOptions"
              :key="opt"
              type="button"
              @click="filterDraft.creator = opt"
              :class="`px-3 h-8 rounded-full text-xs font-bold border transition-colors ${filterDraft.creator === opt ? 'bg-[#e53935] text-white border-[#e53935]' : 'bg-white text-gray-600 border-gray-200'}`"
            >
              {{ opt }}
            </button>
          </div>

          <button type="button" class="w-full h-12 flex items-center justify-between border-b border-gray-100" @click="toggleSection('contentType')">
            <div class="text-sm font-bold text-gray-900">内容类型</div>
            <ChevronDown :size="18" :class="`${sectionExpanded.contentType ? '' : '-rotate-90'} transition-transform text-gray-400`" />
          </button>
          <div v-if="sectionExpanded.contentType" class="flex flex-wrap gap-2 pb-2">
            <button
              v-for="opt in contentTypeOptions"
              :key="opt"
              type="button"
              @click="filterDraft.contentType = opt"
              :class="`px-3 h-8 rounded-full text-xs font-bold border transition-colors ${filterDraft.contentType === opt ? 'bg-[#e53935] text-white border-[#e53935]' : 'bg-white text-gray-600 border-gray-200'}`"
            >
              {{ opt }}
            </button>
          </div>

          <button type="button" class="w-full h-12 flex items-center justify-between border-b border-gray-100" @click="toggleSection('publishTime')">
            <div class="text-sm font-bold text-gray-900">发布时间</div>
            <ChevronDown :size="18" :class="`${sectionExpanded.publishTime ? '' : '-rotate-90'} transition-transform text-gray-400`" />
          </button>
          <div v-if="sectionExpanded.publishTime" class="flex flex-wrap gap-2 pb-2">
            <button
              v-for="opt in publishTimeOptions"
              :key="opt"
              type="button"
              @click="filterDraft.publishTime = opt"
              :class="`px-3 h-8 rounded-full text-xs font-bold border transition-colors ${filterDraft.publishTime === opt ? 'bg-[#e53935] text-white border-[#e53935]' : 'bg-white text-gray-600 border-gray-200'}`"
            >
              {{ opt }}
            </button>
          </div>

          <button type="button" class="w-full h-12 flex items-center justify-between border-b border-gray-100" @click="toggleSection('sortMode')">
            <div class="text-sm font-bold text-gray-900">排序方式</div>
            <ChevronDown :size="18" :class="`${sectionExpanded.sortMode ? '' : '-rotate-90'} transition-transform text-gray-400`" />
          </button>
          <div v-if="sectionExpanded.sortMode" class="flex flex-wrap gap-2 pb-2">
            <button
              v-for="opt in sortOptions"
              :key="opt"
              type="button"
              @click="sortMode = opt"
              :class="`px-3 h-8 rounded-full text-xs font-bold border transition-colors ${sortMode === opt ? 'bg-[#e53935] text-white border-[#e53935]' : 'bg-white text-gray-600 border-gray-200'}`"
            >
              {{ opt }}
            </button>
          </div>
        </div>

        <div class="mt-5 flex items-center gap-3">
          <button type="button" class="flex-1 h-11 rounded-xl border border-gray-200 text-gray-700 font-bold bg-white" @click="resetFilter">
            重置
          </button>
          <button type="button" class="flex-1 h-11 rounded-xl bg-[#e53935] text-white font-bold" @click="applyFilter">
            确定
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
