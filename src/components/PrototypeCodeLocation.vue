<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  folderPath: string;
  mode?: 'inline' | 'floating';
  position?: 'top' | 'bottom';
  containerClass?: string;
}>(), {
  mode: 'inline',
  position: 'bottom',
  containerClass: ''
});

const containerClasses = computed(() => {
  if (props.mode === 'floating') {
    const posClass = props.position === 'top' ? 'top-4' : 'bottom-4';
    return `fixed ${posClass} right-4 z-[70] pointer-events-none ${props.containerClass}`.trim();
  }
  return `px-3 ${props.containerClass}`.trim();
});
</script>

<template>
  <div :class="containerClasses">
    <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/80 backdrop-blur-md border border-gray-200 text-[11px] text-gray-600 shadow-sm pointer-events-auto max-w-[calc(100vw-2rem)]">
      <span class="font-bold text-gray-700">代码目录</span>
      <span class="font-mono text-gray-800 break-all">{{ folderPath }}</span>
    </div>
  </div>
</template>
