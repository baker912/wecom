<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ChevronLeft, Search, Image, FileText, Video, MoreHorizontal, Share2 } from 'lucide-vue-next';

const router = useRouter();
const activeTab = ref('全部');

const tabs = ['全部', '海报', '话术', '视频', '文章'];

const contents = [
  { id: 1, type: 'image', title: 'Q5L 2024款 宣传海报', date: '2024-03-12', views: 128 },
  { id: 2, type: 'text', title: '春季保养邀约话术', date: '2024-03-10', views: 345 },
  { id: 3, type: 'video', title: '奥迪e-tron 驾驶演示', date: '2024-03-08', views: 890 },
  { id: 4, type: 'article', title: '奥迪quattro技术解析', date: '2024-03-05', views: 567 },
  { id: 5, type: 'image', title: 'A6L 金融方案海报', date: '2024-03-01', views: 234 },
];

const goBack = () => {
  router.push('/');
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Header -->
    <div class="bg-white fixed top-0 left-0 right-0 z-10 px-4 py-3 pt-12 flex items-center justify-between border-b border-gray-100">
      <button @click="goBack" class="p-1 -ml-1">
        <ChevronLeft :size="24" class="text-gray-700" />
      </button>
      <h1 class="text-[17px] font-bold text-gray-900">营销内容库</h1>
      <button class="p-1 -mr-1">
        <MoreHorizontal :size="24" class="text-gray-700" />
      </button>
    </div>

    <!-- Padding for fixed header -->
    <div class="h-[92px]"></div>

    <!-- Search -->
    <div class="bg-white px-4 py-2 pb-3">
      <div class="bg-gray-100 rounded-lg flex items-center px-3 py-2 gap-2">
        <Search :size="16" class="text-gray-400" />
        <input type="text" placeholder="搜索海报、话术、视频..." class="bg-transparent text-sm flex-1 outline-none text-gray-700" />
      </div>
    </div>

    <!-- Tabs -->
    <div class="bg-white px-4 border-b border-gray-100 flex overflow-x-auto no-scrollbar gap-6">
      <button 
        v-for="tab in tabs" 
        :key="tab"
        @click="activeTab = tab"
        :class="`py-3 text-[15px] font-medium relative whitespace-nowrap ${
          activeTab === tab ? 'text-blue-600' : 'text-gray-500'
        }`"
      >
        {{ tab }}
        <div v-if="activeTab === tab" class="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-blue-600 rounded-full"></div>
      </button>
    </div>

    <!-- Content List -->
    <div class="flex-1 p-4 space-y-3">
      <div v-for="item in contents" :key="item.id" class="bg-white rounded-xl p-3 flex gap-3 shadow-sm active:scale-[0.99] transition-transform">
        <!-- Thumbnail -->
        <div class="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 text-gray-400">
          <Image v-if="item.type === 'image'" :size="24" />
          <FileText v-else-if="item.type === 'text'" :size="24" />
          <Video v-else-if="item.type === 'video'" :size="24" />
          <FileText v-else :size="24" />
        </div>
        
        <!-- Info -->
        <div class="flex-1 flex flex-col justify-between py-0.5">
          <div>
            <h3 class="text-[15px] font-bold text-gray-900 leading-snug mb-1">{{ item.title }}</h3>
            <span class="text-xs text-gray-400">{{ item.date }} · {{ item.views }}次使用</span>
          </div>
          
          <div class="flex justify-end">
            <button class="flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
              <Share2 :size="12" />
              发送给客户
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
