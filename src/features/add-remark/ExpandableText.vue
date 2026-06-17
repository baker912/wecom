<script setup lang="ts">
import { ref, computed } from 'vue';
import { ChevronUp, ChevronDown, X } from 'lucide-vue-next';

const props = withDefaults(defineProps<{
  text: string;
  limit?: number;
  className?: string;
  type?: 'text' | 'link';
}>(), {
  limit: 50,
  className: '',
  type: 'text'
});

const isExpanded = ref(false);
const showFullText = ref(false);

const shouldTruncate = computed(() => props.text.length > props.limit);

const truncatedText = computed(() => {
  return `${props.text.slice(0, props.limit)}...`;
});

const openModal = (e: Event) => {
  e.stopPropagation();
  showFullText.value = true;
};

const closeModal = (e?: Event) => {
  if (e) e.stopPropagation();
  showFullText.value = false;
};

const toggleExpand = (e: Event) => {
  e.stopPropagation();
  isExpanded.value = !isExpanded.value;
};
</script>

<template>
  <span v-if="!shouldTruncate" :class="className">{{ text }}</span>

  <template v-else-if="type === 'link'">
    <span :class="className">
      {{ truncatedText }}
      <button 
        @click="openModal"
        class="text-indigo-600 font-medium ml-1 hover:underline inline-block"
      >
        查看全部
      </button>
    </span>

    <!-- Full Text Modal/Sheet -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="showFullText"
        class="fixed inset-0 bg-black/50 z-[70] flex items-end sm:items-center justify-center p-4"
        @click="closeModal"
      >
        <div
          class="bg-white rounded-t-xl sm:rounded-xl w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl transition-transform duration-300"
          :class="showFullText ? 'translate-y-0' : 'translate-y-full'"
          @click.stop
        >
          <div class="p-4 border-b border-gray-100 flex justify-between items-center">
            <h3 class="font-bold text-gray-800">完整内容</h3>
            <button @click="closeModal" class="p-1 hover:bg-gray-100 rounded-full">
              <X :size="20" class="text-gray-500" />
            </button>
          </div>
          <div class="p-5 overflow-y-auto text-[14px] leading-relaxed text-gray-700 whitespace-pre-wrap">
            {{ text }}
          </div>
        </div>
      </div>
    </Transition>
  </template>

  <template v-else>
    <div :class="`relative transition-all duration-300 ${className}`">
      <div class="transition-all duration-300">
        {{ isExpanded ? text : truncatedText }}
      </div>
      <button 
        @click="toggleExpand"
        class="text-indigo-600 text-[12px] font-medium mt-1 flex items-center gap-0.5 hover:bg-indigo-50 px-1.5 py-0.5 rounded transition-colors w-fit"
      >
        <span v-if="isExpanded" class="flex items-center gap-0.5">收起 <ChevronUp :size="12" /></span>
        <span v-else class="flex items-center gap-0.5">展开 <ChevronDown :size="12" /></span>
      </button>
    </div>
  </template>
</template>
