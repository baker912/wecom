<script setup lang="ts">
import { ref } from 'vue';
import { FolderOpen } from 'lucide-vue-next';
import type { ArchiveTab } from '../../types';

const props = defineProps<{
  tabs: ArchiveTab[]
}>();

const activeTab = ref(props.tabs[0].id);
</script>

<template>
  <div class="card">
    <div class="flex items-center gap-2 mb-3 border-b border-gray-100 pb-2">
      <FolderOpen :size="18" />
      <h3 class="font-bold">客户档案</h3>
    </div>

    <div class="flex border-b border-gray-100 mb-4 overflow-x-auto no-scrollbar">
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

    <div class="py-8 text-center text-gray-400 text-sm">
      没有更多数据了
    </div>
  </div>
</template>
