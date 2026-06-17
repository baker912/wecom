<script setup lang="ts">
import { Tag, Edit2, Plus, Heart, Car, FileText, PieChart, Briefcase, User, Tag as TagIcon } from 'lucide-vue-next';
import VehicleSection from './VehicleSection.vue';
import type { TagGroup } from '../../types';

defineProps<{
  groups: TagGroup[]
}>();

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
</script>

<template>
  <div class="bg-white rounded-[12px] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)] mb-3 mt-0">
    <div class="flex justify-between items-center mb-4">
      <div class="flex items-center gap-2">
        <Tag :size="18" class="text-[#333] rotate-90" :strokeWidth="2" />
        <h3 class="font-bold text-[16px] text-[#333]">标签</h3>
      </div>
      <button class="text-[#1890FF] text-[13px] flex items-center">
        查看全部 <span class="ml-0.5 text-xs">&gt;</span>
      </button>
    </div>

    <div class="flex gap-3 mb-5">
      <button class="flex items-center gap-1.5 px-3 py-[6px] border border-[#e5e5e5] rounded-[4px] text-[13px] text-[#333] shadow-sm">
        <Plus :size="14" :strokeWidth="2" />
        打标签
      </button>
      <button class="flex items-center gap-1.5 px-3 py-[6px] border border-[#e5e5e5] rounded-[4px] text-[13px] text-[#333] shadow-sm">
        <Edit2 :size="12" :strokeWidth="2" />
        编辑展示标签组
      </button>
    </div>

    <div class="space-y-5">
      <template v-for="group in groups" :key="group.id">
        <VehicleSection v-if="group.isVehicleGroup" :group="group" />
        
        <div v-else>
          <div class="flex items-center gap-1.5 mb-2.5 text-[#333] text-[15px] font-medium">
            <span class="text-[#333] scale-90">
              <component :is="iconMap[group.icon] || TagIcon" :size="16" :strokeWidth="2" />
            </span>
            <span>{{ group.title }}</span>
          </div>
          <div class="flex flex-wrap gap-2.5">
            <span v-for="tag in group.tags" :key="tag.id" :class="getTagStyle(tag.color)">
              {{ tag.label }}
            </span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
