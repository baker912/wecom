<script setup lang="ts">
import { ref, computed } from 'vue';
import { Heart, Car, FileText, PieChart, Briefcase, User, Tag as TagIcon, ChevronDown } from 'lucide-vue-next';
import type { TagGroup } from '../../types';

const props = defineProps<{
  group: TagGroup
}>();

const currentVinIndex = ref(0);
const isSwitching = ref(false);
const isDropdownOpen = ref(false);

const vehicles = computed(() => props.group.vehicles || []);
const currentVehicle = computed(() => vehicles.value[currentVinIndex.value]);

// Helper for icon component mapping
const iconMap: Record<string, any> = {
  heart: Heart,
  car: Car,
  'file-text': FileText,
  'pie-chart': PieChart,
  briefcase: Briefcase,
  user: User,
  tag: TagIcon
};

const getTagStyle = (color: string) => {
  switch (color) {
    case 'red': return 'bg-[#FFF1F0] text-[#F5222D] border border-[#FFA39E] px-[8px] py-[3px] rounded-[4px] text-[12px] inline-block';
    case 'yellow': return 'bg-[#FFFBE6] text-[#FAAD14] border border-[#FFE58F] px-[8px] py-[3px] rounded-[4px] text-[12px] inline-block';
    case 'green': return 'bg-[#F6FFED] text-[#52C41A] border border-[#B7EB8F] px-[8px] py-[3px] rounded-[4px] text-[12px] inline-block';
    default: return 'bg-[#E6F7FF] text-[#1890FF] border border-[#91D5FF] px-[8px] py-[3px] rounded-[4px] text-[12px] inline-block';
  }
};

const handleVinChange = (index: number) => {
  if (index === currentVinIndex.value) {
    isDropdownOpen.value = false;
    return;
  }
  isSwitching.value = true;
  isDropdownOpen.value = false;
  
  setTimeout(() => {
    currentVinIndex.value = index;
    isSwitching.value = false;
  }, 200);
};

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};
</script>

<template>
  <div class="mt-6 pt-6 border-t border-dashed border-gray-200">
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-1.5 text-[#333] text-[15px] font-medium">
        <span class="text-[#333] scale-90">
          <component :is="iconMap[group.icon] || TagIcon" :size="16" :strokeWidth="2" />
        </span>
        <div class="flex items-baseline gap-1">
          <span>{{ group.title }}</span>
          <span class="text-xs text-gray-500 font-normal">({{ vehicles.length }})</span>
        </div>
      </div>
    </div>

    <!-- Compact Dropdown VIN Selector -->
    <div class="mb-4 relative z-20 group/selector">
      <div class="absolute -inset-1 bg-blue-500/20 rounded-[12px] blur opacity-0 group-hover/selector:opacity-100 transition duration-500 animate-pulse-slow"></div>
      <button 
        @click="toggleDropdown"
        class="relative w-full flex items-center justify-between px-3 py-2.5 bg-[#F7F8FA] border-2 border-blue-500 rounded-[8px] text-[13px] text-[#333] transition-all active:bg-gray-100 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
      >
        <div class="flex items-center gap-2">
          <Car :size="14" class="text-blue-600" />
          <span class="font-bold font-mono text-blue-700">{{ currentVehicle?.vin }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded font-bold animate-bounce">本次功能</span>
          <ChevronDown 
            :size="16" 
            :class="`text-blue-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`" 
          />
        </div>
      </button>

      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="transform opacity-0 -translate-y-2 scale-95"
        enter-to-class="transform opacity-100 translate-y-0 scale-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="transform opacity-100 translate-y-0 scale-100"
        leave-to-class="transform opacity-0 -translate-y-2 scale-95"
      >
        <div
          v-if="isDropdownOpen"
          class="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E5E7EB] rounded-[8px] shadow-lg overflow-hidden z-30"
        >
          <div class="max-h-[200px] overflow-y-auto custom-scrollbar">
            <button
              v-for="(v, idx) in vehicles"
              :key="v.vin"
              @click="handleVinChange(idx)"
              :class="`w-full flex items-center justify-between px-3 py-2.5 text-[13px] text-left border-b border-gray-50 last:border-0 transition-colors ${
                currentVinIndex === idx 
                  ? 'bg-blue-50 text-blue-600 font-medium' 
                  : 'text-[#333] hover:bg-gray-50'
              }`"
            >
              <span class="font-mono">{{ v.vin }}</span>
              <div v-if="currentVinIndex === idx" class="w-1.5 h-1.5 rounded-full bg-blue-500" />
            </button>
          </div>
        </div>
      </Transition>
    </div>
    
    <Transition mode="out-in" enter-active-class="transition duration-150 ease-out" enter-from-class="opacity-0 translate-x-2" enter-to-class="opacity-100 translate-x-0" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100 translate-x-0" leave-to-class="opacity-0 -translate-x-2">
      <div v-if="isSwitching" key="loading" class="h-24 flex flex-col items-center justify-center text-gray-400 gap-2">
        <div class="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
      
      <div v-else :key="currentVehicle?.vin" class="relative z-10">
        <div class="flex flex-wrap gap-2 transition-all duration-300 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
          <span v-for="tag in currentVehicle?.tags" :key="tag.id" :class="getTagStyle(tag.color)">
            {{ tag.label }}
          </span>
        </div>

        <div v-if="currentVehicle?.tags.length === 0" class="text-center py-8 text-gray-400 text-xs bg-gray-50 rounded-lg border border-dashed border-gray-200">
          暂无相关标签数据
        </div>
      </div>
    </Transition>
  </div>
</template>
