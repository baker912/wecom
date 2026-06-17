<script setup lang="ts">
import { ref } from 'vue';
import { FolderOpen, ChevronRight } from 'lucide-vue-next';
import type { ArchiveTab, ProspectRecord } from '../../types';

const props = defineProps<{
  tabs: ArchiveTab[];
  prospects?: ProspectRecord[];
}>();

const activeTab = ref(props.tabs[0].id);
</script>

<template>
  <div class="card">
    <div class="flex items-center gap-2 mb-3 border-b border-gray-100 pb-2">
      <FolderOpen :size="18" />
      <h3 class="font-bold">客户档案</h3>
    </div>

    <div class="flex border-b border-gray-100 mb-4 overflow-x-auto hide-scrollbar">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="`flex-shrink-0 px-4 py-2 text-sm font-medium relative ${
          activeTab === tab.id ? 'text-primary' : 'text-gray-500'
        }`"
      >
        {{ tab.label }}
        <div v-if="activeTab === tab.id" class="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />
      </button>
    </div>

    <!-- 潜客数据 -->
    <div v-if="activeTab === 'prospect' && prospects && prospects.length > 0" class="space-y-3">
      <div v-for="item in prospects" :key="item.id" class="bg-gray-50 rounded-xl p-4 border border-gray-100">
        <div class="flex items-center justify-between mb-3">
          <span class="px-2 py-0.5 bg-red-50 text-red-600 text-xs font-bold rounded border border-red-100">{{ item.level }}</span>
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-bold rounded border border-blue-100">{{ item.status }}</span>
            <ChevronRight :size="16" class="text-gray-400" />
          </div>
        </div>
        <div class="flex flex-col gap-2 text-sm">
          <div>
            <span class="text-gray-400 text-xs">渠道大类：</span>
            <span class="text-gray-800 font-medium">{{ item.channel }}</span>
          </div>
          <div>
            <span class="text-gray-400 text-xs">意向车型：</span>
            <span class="text-gray-800 font-medium">{{ item.intentModel }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="py-8 text-center text-gray-400 text-sm">
      没有更多数据了
    </div>
  </div>
</template>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
