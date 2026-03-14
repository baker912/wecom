<script setup lang="ts">
import { Phone, Users, MessageSquare } from 'lucide-vue-next';
import type { Customer } from '../types';

defineProps<{
  customer: Customer
}>();
</script>

<template>
  <div class="relative bg-gradient-to-b from-[#4285f4] to-[#cbe0ff] pt-[64px] pb-16 px-3 -mb-12">
    <div class="bg-white rounded-[12px] p-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)] relative z-10">
      <div class="flex justify-between items-start mb-5">
        <div class="flex gap-3 items-center">
          <img 
            :src="customer.avatar" 
            :alt="customer.name" 
            class="w-[52px] h-[52px] rounded-full object-cover border border-gray-100"
          />
          <div class="flex flex-col gap-1">
            <div class="flex items-baseline gap-2">
              <h2 class="text-[17px] font-bold text-[#333]">{{ customer.name }}</h2>
            </div>
            <span class="text-[#999] text-[13px]">姓名：{{ customer.name }}</span>
          </div>
        </div>
        <button class="text-[#1890FF] text-[13px] mt-1 flex items-center">
          客户详情 <span class="ml-0.5 text-xs">&gt;</span>
        </button>
      </div>

      <div class="flex items-center justify-between text-[13px] text-[#666] mb-4 px-1">
        <span>手机号：{{ customer.phone }}</span>
        <span>性别：{{ customer.gender }}</span>
      </div>

      <div class="h-px bg-gray-100 mb-3" />

      <div class="flex justify-between px-6 pt-1">
        <button class="flex items-center gap-2 text-[#333]">
          <Phone :size="18" :strokeWidth="1.5" />
          <span class="text-[14px]">电话</span>
        </button>
        <button class="flex items-center gap-2 text-[#333]">
          <Users :size="18" :strokeWidth="1.5" />
          <span class="text-[14px]">群聊</span>
        </button>
        <button class="flex items-center gap-2 text-[#333]">
          <MessageSquare :size="18" :strokeWidth="1.5" />
          <span class="text-[14px]">单聊</span>
        </button>
      </div>
    </div>
  </div>
</template>
