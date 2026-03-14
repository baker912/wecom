<script setup lang="ts">
defineProps<{
  folderPath: string;
}>();
</script>

<template>
  <div class="px-3">
    <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/80 backdrop-blur-md border border-gray-200 text-[11px] text-gray-600 shadow-sm">
      <span class="font-bold text-gray-700">代码目录</span>
      <span class="font-mono text-gray-800">{{ folderPath }}</span>
    </div>
  </div>
</template>
