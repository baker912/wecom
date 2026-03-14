<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ChevronLeft } from 'lucide-vue-next';

const router = useRouter();

const goBack = () => {
  router.push('/');
};
</script>

<template>
  <div class="fixed top-0 left-0 right-0 z-50 pt-11 bg-white/90 backdrop-blur-md border-b border-gray-100/50">
    <!-- Navigation Bar -->
    <div class="relative flex items-center justify-center h-[44px]">
      <button 
        @click="goBack"
        class="absolute left-4 p-2 -ml-2 flex items-center gap-1 text-[#333333]"
      >
        <ChevronLeft :size="24" :strokeWidth="1.5" />
        <span class="text-[16px]">返回</span>
      </button>
      <h1 class="text-[17px] font-semibold text-[#333333]">客户画像</h1>
    </div>
  </div>
</template>
