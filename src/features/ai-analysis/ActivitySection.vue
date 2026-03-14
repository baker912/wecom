<script setup lang="ts">
import { ref } from 'vue';
import { User, Flag } from 'lucide-vue-next';
import type { Activity } from '../../types';

const props = defineProps<{
  tabs: string[];
  activities: Activity[];
}>();

const activeTab = ref(props.tabs[0]);
</script>

<template>
  <div class="card mb-20">
    <div class="flex items-center gap-2 mb-3 border-b border-gray-100 pb-2">
      <User :size="18" />
      <h3 class="font-bold">客户动态</h3>
    </div>

    <div class="flex border-b border-gray-100 mb-4 overflow-x-auto no-scrollbar">
      <button
        v-for="tab in tabs"
        :key="tab"
        @click="activeTab = tab"
        :class="`flex-shrink-0 px-4 py-2 text-sm font-medium relative whitespace-nowrap ${
          activeTab === tab ? 'text-black font-bold' : 'text-gray-500'
        }`"
      >
        {{ tab }}
        <div v-if="activeTab === tab" class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-0.5 bg-primary rounded-full" />
      </button>
    </div>

    <div class="space-y-4">
      <div v-for="activity in activities" :key="activity.id" class="flex gap-3 items-start">
        <div class="mt-1">
          <Flag :size="16" class="text-primary" />
        </div>
        <div class="flex-1">
          <div class="flex justify-between items-start">
            <h4 class="text-sm font-medium text-blue-600">{{ activity.title }}</h4>
            <span class="text-xs text-gray-400">{{ activity.timestamp }}</span>
          </div>
          <p v-if="activity.description" class="text-sm text-gray-600 mt-1">{{ activity.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
