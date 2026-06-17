<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ChevronLeft, ChevronRight, Camera, Sparkles } from 'lucide-vue-next';

const router = useRouter();

const goBack = () => {
  router.push('/');
};

// AI帮写状态
const aiThinking = ref(false);
const aiSuccess = ref(false);
const aiGeneratedContent = ref('');
const isAiGenerated = ref(false);

const handleAiClick = () => {
  if (aiThinking.value) return;
  aiThinking.value = true;
  aiSuccess.value = false;
  setTimeout(() => {
    aiThinking.value = false;
    aiSuccess.value = true;
    // 模拟 AI 填充内容
    const aiContent = '客户对A5 Sportback表现出较高兴趣，询问了车辆配置及价格优惠。客户预算充足，计划采用按揭方式购车，关注厂方促销政策和政府补贴。建议下次邀约到店试驾，重点介绍车辆科技配置及金融方案。';
    feedback.value = aiContent;
    aiGeneratedContent.value = aiContent;
    isAiGenerated.value = true;
    // AI预填预约到店时间和事项
    预约到店时间.value = '2026-06-20 10:00';
    预约到店事项.value = '试驾';
    // AI成功状态保持，不再自动变回去
  }, 2000);
};

const onFeedbackInput = () => {
  // 手动编辑后，如果内容与AI生成的不一致，移除AI标记
  if (isAiGenerated.value && feedback.value !== aiGeneratedContent.value) {
    isAiGenerated.value = false;
  }
};

// 意向信息表单数据
const vehicleCategory = ref('FBU ICE');
const intentSeries = ref('A5SPORTBACK | A5 Sportback');
const vehicleModel = ref('');
const expectedDate = ref('2023-06-15');
const purchaseCycle = ref('已过期');
const purchaseBudget = ref('');
const planBuyMethod = ref<string[]>([]);
const customerFocus = ref('');

// 购置类型
const buyTypeTags = ref([
  { label: '新购', active: true },
  { label: '增购', active: false },
  { label: '换购', active: false }
]);

// 政策关注
const policyTags = ref([
  { label: '厂方政策', active: false },
  { label: '店铺政策', active: false },
  { label: '政府补贴', active: false },
  { label: '其他优惠', active: false }
]);

// 是否关注现车
const followCurrentCar = ref('否');

// 跟进情况
const actualFollowDate = ref('');
const followMethod = ref('');
const feedback = ref('');
const imagePreviewUrl = ref<string | null>(null);
const 意向级别 = ref('A');
const 跟进结果 = ref('跟进');
const 是否预约到店 = ref('是');
const 预约到店时间 = ref('');
const 预约到店事项 = ref('');
const 下次跟进日期 = ref('2026-06-15 16:47');
const 下次跟进方式 = ref('');

// 购买方式选项
const methodOptions = ['全款', '按揭', '分期'];

const toggleBuyType = (tag: any) => {
  tag.active = !tag.active;
};

const togglePolicyTag = (tag: any) => {
  tag.active = !tag.active;
};

const togglePlanBuyMethod = (method: string) => {
  const idx = planBuyMethod.value.indexOf(method);
  if (idx >= 0) {
    planBuyMethod.value.splice(idx, 1);
  } else {
    planBuyMethod.value.push(method);
  }
};

const handleImageUpload = () => {
  // Mock: 使用一个示例图片
  imagePreviewUrl.value = null; // 无图片状态
};
</script>

<template>
  <div class="min-h-screen bg-[#f5f6fa] pb-24 pt-0">
    <!-- 导航栏 - 只有返回按钮，去掉标题 -->
    <div class="fixed top-0 left-0 right-0 z-50 pt-11 bg-white border-b border-gray-100">
      <div class="relative flex items-center h-[44px]">
        <button @click="goBack" class="absolute left-4 p-2 -ml-2 flex items-center gap-1 text-[#333333]">
          <ChevronLeft :size="26" :strokeWidth="1.5" />
        </button>
      </div>
    </div>

    <!-- 客户基本信息区 - 优化排版 -->
    <div class="pt-11 bg-white px-4 pb-3">
      <!-- 姓名 + 手机号 同行 -->
      <div class="flex items-center justify-between mb-2">
        <span class="text-base font-bold text-gray-900">测试</span>
        <span class="text-sm text-gray-600">18988888888</span>
      </div>
      <!-- 意向级别标签 + 车系 -->
      <div class="flex items-center gap-2 mb-2">
        <span class="inline-flex items-center justify-center w-5 h-5 rounded bg-red-600 text-white text-[10px] font-bold leading-none">A</span>
        <span class="text-sm text-gray-700">A5 Sportback</span>
      </div>
      <!-- 信息标签行 -->
      <div class="flex items-center gap-4 text-xs text-gray-500">
        <span>客户来源：线上集客</span>
        <span class="text-gray-300">|</span>
        <span>销售顾问：李方滔</span>
      </div>
      <div class="flex items-center gap-4 text-xs text-gray-500 mt-1">
        <span>消客状态：递交新车</span>
      </div>
    </div>

    <!-- ====== 意向信息 ====== -->
    <div class="mt-2 px-4 py-2 bg-[#f5f6fa]">
      <h2 class="text-[15px] font-semibold text-gray-900">意向信息</h2>
    </div>

    <div class="bg-white px-4">
      <!-- 车辆类别 -->
      <div class="flex items-center justify-between py-3 border-b border-gray-50">
        <div class="flex items-center gap-1 min-w-0">
          <span class="text-red-500 mr-0.5">*</span>
          <span class="text-sm text-gray-700 shrink-0">车辆类别</span>
          <label class="flex items-center gap-1 ml-2 shrink-0 cursor-pointer">
            <input type="radio" name="vehicleCat" value="CKD ICE" :checked="vehicleCategory === 'CKD ICE'" v-model="vehicleCategory" class="accent-red-500 w-4 h-4" />
            <span class="text-sm text-gray-700">CKD ICE</span>
          </label>
          <label class="flex items-center gap-1 ml-3 shrink-0 cursor-pointer">
            <input type="radio" name="vehicleCat" value="FBU ICE" :checked="vehicleCategory === 'FBU ICE'" v-model="vehicleCategory" class="accent-red-500 w-4 h-4" />
            <span class="text-sm text-gray-700">FBU ICE</span>
          </label>
          <label class="flex items-center gap-1 ml-3 shrink-0 cursor-pointer">
            <input type="radio" name="vehicleCat" value="NEV" :checked="vehicleCategory === 'NEV'" v-model="vehicleCategory" class="accent-red-500 w-4 h-4" />
            <span class="text-sm text-gray-700">NEV</span>
          </label>
        </div>
      </div>

      <!-- 意向车系 -->
      <div class="flex items-center justify-between py-3 border-b border-gray-50">
        <span class="text-sm text-gray-700"><span class="text-red-500 mr-0.5">*</span>意向车系</span>
        <div class="flex items-center gap-1 min-w-0">
          <span class="text-sm text-gray-900 truncate">{{ intentSeries }}</span>
          <ChevronRight :size="16" class="text-gray-400 shrink-0" />
        </div>
      </div>

      <!-- 意向车型 -->
      <div class="flex items-center justify-between py-3 border-b border-gray-50">
        <span class="text-sm text-gray-700">意向车型</span>
        <div class="flex items-center gap-1 min-w-0">
          <span class="text-sm text-gray-400 truncate">{{ vehicleModel || '请输入意向车型' }}</span>
          <ChevronRight :size="16" class="text-gray-400 shrink-0" />
        </div>
      </div>

      <!-- 预购日期 -->
      <div class="flex items-center justify-between py-3 border-b border-gray-50">
        <span class="text-sm text-gray-700">预购日期</span>
        <div class="flex items-center gap-1 min-w-0">
          <span class="text-sm text-gray-900">{{ expectedDate }}</span>
          <ChevronRight :size="16" class="text-gray-400 shrink-0" />
        </div>
      </div>

      <!-- 购车周期 -->
      <div class="flex items-center justify-between py-3 border-b border-gray-50">
        <span class="text-sm text-gray-700">购车周期</span>
        <div class="flex items-center gap-1 min-w-0">
          <span class="text-sm text-gray-900">{{ purchaseCycle }}</span>
          <ChevronRight :size="16" class="text-gray-400 shrink-0" />
        </div>
      </div>

      <!-- 购车预算 -->
      <div class="flex items-center justify-between py-3 border-b border-gray-50">
        <span class="text-sm text-gray-700">购车预算</span>
        <div class="flex items-center gap-1 min-w-0">
          <span class="text-sm text-gray-400 truncate">{{ purchaseBudget || '请输入购车预算' }}</span>
          <ChevronRight :size="16" class="text-gray-400 shrink-0" />
        </div>
      </div>

      <!-- 计划购买方式 -->
      <div class="flex items-center justify-between py-3 border-b border-gray-50">
        <span class="text-sm text-gray-700">计划购买方式</span>
        <div class="flex items-center gap-2 min-w-0">
          <div class="flex gap-2">
            <button
              v-for="m in methodOptions"
              :key="m"
              @click="togglePlanBuyMethod(m)"
              class="px-2.5 py-0.5 text-xs rounded border transition-colors"
              :class="planBuyMethod.includes(m) ? 'border-red-500 text-red-500' : 'border-gray-300 text-gray-500'"
            >{{ m }}</button>
          </div>
        </div>
      </div>

      <!-- 客户关注点 -->
      <div class="flex items-center justify-between py-3 border-b border-gray-50">
        <span class="text-sm text-gray-700">客户关注点</span>
        <div class="flex items-center gap-1 min-w-0">
          <span class="text-sm text-gray-400 truncate">{{ customerFocus || '请输入客户关注点' }}</span>
          <ChevronRight :size="16" class="text-gray-400 shrink-0" />
        </div>
      </div>

      <!-- 购置类型 -->
      <div class="flex items-center justify-between py-3 border-b border-gray-50">
        <span class="text-sm text-gray-700">购置类型</span>
        <div class="flex items-center gap-2">
          <button
            v-for="tag in buyTypeTags"
            :key="tag.label"
            @click="toggleBuyType(tag)"
            class="px-2.5 py-0.5 text-xs rounded border transition-colors"
            :class="tag.active ? 'bg-red-500 text-white border-red-500' : 'border-gray-300 text-gray-500'"
          >{{ tag.label }}</button>
        </div>
      </div>

      <!-- 政策关注 -->
      <div class="flex items-start justify-between py-3 border-b border-gray-50">
        <span class="text-sm text-gray-700 pt-0.5">政策关注</span>
        <div class="flex flex-wrap gap-2 justify-end max-w-[220px]">
          <button
            v-for="tag in policyTags"
            :key="tag.label"
            @click="togglePolicyTag(tag)"
            class="px-2.5 py-0.5 text-xs rounded border transition-colors"
            :class="tag.active ? 'bg-red-500 text-white border-red-500' : 'border-gray-300 text-gray-500'"
          >{{ tag.label }}</button>
        </div>
      </div>

      <!-- 是否关注现车 -->
      <div class="flex items-center justify-between py-3">
        <span class="text-sm text-gray-700">是否关注现车</span>
        <div class="flex items-center gap-2">
          <button
            @click="followCurrentCar = '是'"
            class="w-12 h-7 rounded-full border transition-colors text-xs font-medium"
            :class="followCurrentCar === '是' ? 'bg-gray-200 border-gray-300 text-gray-500' : ''"
          >是</button>
          <button
            @click="followCurrentCar = '否'"
            class="w-12 h-7 rounded-full border transition-colors text-xs font-medium bg-red-500 border-red-500 text-white"
          >否</button>
        </div>
      </div>
    </div>

    <!-- ====== 跟进情况 ====== -->
    <div class="mt-2 px-4 py-2 bg-[#f5f6fa] flex items-center justify-between">
      <h2 class="text-[15px] font-semibold text-gray-900">跟进情况</h2>
      <button
        @click="handleAiClick"
        :disabled="aiThinking || aiSuccess"
        class="ai-btn relative flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] font-medium overflow-hidden transition-all duration-300"
        :class="{ 'cursor-wait': aiThinking, 'cursor-pointer': !aiThinking && !aiSuccess }"
      >
        <!-- 动态光晕背景 -->
        <span class="ai-btn-glow"></span>
        <!-- 扫光动画条 -->
        <span v-if="!aiSuccess" class="ai-btn-scan"></span>
        <Sparkles :size="14" class="ai-icon relative z-10" :class="{ 'ai-icon-active': aiThinking, 'ai-icon-success': aiSuccess }" />
        <span class="relative z-10" :class="aiThinking ? 'ai-text-active' : aiSuccess ? 'ai-text-success' : 'ai-text-idle'">
          {{ aiThinking ? 'AI正在思考中...' : aiSuccess ? 'AI分析成功' : 'AI跟进' }}
        </span>
      </button>
    </div>

    <div class="bg-white px-4">
      <!-- 实际跟进日期 -->
      <div class="flex items-center justify-between py-3 border-b border-gray-50">
        <span class="text-sm text-gray-700"><span class="text-red-500 mr-0.5">*</span>实际跟进日期：</span>
      </div>

      <!-- 跟进方式 -->
      <div class="flex items-center justify-between py-3 border-b border-gray-50">
        <span class="text-sm text-gray-700"><span class="text-red-500 mr-0.5">*</span>跟进方式：</span>
        <span class="text-sm text-gray-900">电话</span>
      </div>

      <!-- 客户反馈 -->
      <div class="py-3 border-b border-gray-50">
        <div class="flex items-center gap-1 mb-2">
          <span class="text-red-500 text-sm">*</span>
          <span class="text-sm text-gray-700">客户反馈：</span>
        </div>
        <div class="ai-feedback-wrapper relative rounded-lg" :class="{ 'ai-active': isAiGenerated }">
          <div v-if="isAiGenerated" class="ai-border-glow"></div>
          <textarea
            v-model="feedback"
            @input="onFeedbackInput"
            placeholder="请输入客户反馈"
            rows="3"
            class="w-full text-sm text-gray-900 bg-transparent resize-none outline-none placeholder:text-gray-300 relative z-10 px-3 py-2"
          ></textarea>
        </div>
        <div v-if="isAiGenerated" class="flex items-center gap-1 mt-1.5 px-1">
          <Sparkles :size="11" class="text-violet-400" />
          <span class="text-[11px] text-violet-400">内容由AI生成，仅供参考</span>
        </div>
      </div>

      <!-- 图片上传 -->
      <div class="py-3 flex items-end justify-between">
        <div class="flex flex-col items-center justify-center w-20 h-20 border border-dashed border-gray-300 rounded-lg cursor-pointer" @click="handleImageUpload">
          <Camera :size="28" class="text-gray-300" />
          <span class="text-[11px] text-gray-400 mt-1">添加图片</span>
        </div>
      </div>

      <!-- 意向级别 -->
      <div class="flex items-center justify-between py-3 border-t border-gray-50">
        <span class="text-sm text-gray-700"><span class="text-red-500 mr-0.5">*</span>意向级别:</span>
        <div class="flex items-center gap-1">
          <span class="text-base font-bold text-gray-900">A</span>
        </div>
      </div>

      <!-- 跟进结果 -->
      <div class="flex items-center justify-between py-3 border-b border-gray-50">
        <span class="text-sm text-gray-700"><span class="text-red-500 mr-0.5">*</span>跟进结果:</span>
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-900">跟进</span>
        </div>
      </div>

      <!-- 是否预约到店 -->
      <div class="flex items-center justify-between py-3 border-b border-gray-50">
        <span class="text-sm text-gray-700">是否预约到店</span>
        <div class="flex items-center gap-2">
          <button
            @click="是否预约到店 = '是'"
            class="w-8 h-7 rounded border transition-colors text-xs font-medium bg-red-500 border-red-500 text-white"
          >是</button>
          <button
            @click="是否预约到店 = '否'"
            class="w-8 h-7 rounded border transition-colors text-xs font-medium border-gray-300 text-gray-500"
          >否</button>
        </div>
      </div>

      <!-- 预约到店时间 -->
      <div class="flex items-center justify-between py-3 border-b border-gray-50">
        <span class="text-sm text-gray-700"><span class="text-red-500 mr-0.5">*</span>预约到店时间</span>
        <div class="flex items-center gap-1 min-w-0">
          <span class="text-sm text-gray-400 truncate">{{ 预约到店时间 || '请选择预约到店时间' }}</span>
          <ChevronRight :size="16" class="text-gray-400 shrink-0" />
        </div>
      </div>

      <!-- 预约到店事项 - 三选一 -->
      <div class="flex items-center justify-between py-3 border-b border-gray-50">
        <span class="text-sm text-gray-700"><span class="text-red-500 mr-0.5">*</span>预约到店事项</span>
        <div class="flex items-center gap-2">
          <button
            v-for="item in ['试驾', '谈判', '其他']"
            :key="item"
            @click="预约到店事项 = item"
            class="px-2.5 py-0.5 text-xs rounded border transition-colors"
            :class="预约到店事项 === item ? 'bg-red-500 text-white border-red-500' : 'border-gray-300 text-gray-500'"
          >{{ item }}</button>
        </div>
      </div>

      <!-- 下次跟进日期 -->
      <div class="flex items-center justify-between py-3 border-b border-gray-50">
        <span class="text-sm text-gray-700"><span class="text-red-500 mr-0.5">*</span>下次跟进日期:</span>
        <div class="flex items-center gap-1 min-w-0">
          <span class="text-sm text-gray-900">{{ 下次跟进日期 }}</span>
        </div>
      </div>

      <!-- 下次跟进方式 -->
      <div class="flex items-center justify-between py-3 border-b border-gray-50">
        <span class="text-sm text-gray-700"><span class="text-red-500 mr-0.5">*</span>下次跟进方式 :</span>
        <div class="flex items-center gap-1 min-w-0">
          <span class="text-sm text-gray-900">电话</span>
        </div>
      </div>
    </div>

    <!-- 保存按钮 -->
    <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 pb-5 pt-2 z-40">
      <button class="w-full py-3 bg-black text-white text-base font-medium rounded-lg active:bg-gray-800 transition-colors">
        保存
      </button>
    </div>

    <!-- 底部导航栏占位 - 模拟企微底部tab -->
    <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex z-30" style="padding-bottom: env(safe-area-inset-bottom);">
      <div class="flex-1 flex flex-col items-center justify-center py-1.5">
        <div class="w-5 h-5 mb-0.5 flex items-center justify-center">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#999" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        </div>
        <span class="text-[10px] text-gray-400">消息</span>
      </div>
      <div class="flex-1 flex flex-col items-center justify-center py-1.5">
        <div class="w-5 h-5 mb-0.5 flex items-center justify-center">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#999" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
        </div>
        <span class="text-[10px] text-gray-400">业务</span>
      </div>
      <div class="flex-1 flex flex-col items-center justify-center py-1.5">
        <div class="w-5 h-5 mb-0.5 flex items-center justify-center">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#999" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
        </div>
        <span class="text-[10px] text-gray-400">自媒体</span>
      </div>
      <div class="flex-1 flex flex-col items-center justify-center py-1.5">
        <div class="w-5 h-5 mb-0.5 flex items-center justify-center">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#999" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
        </div>
        <span class="text-[10px] text-gray-400">分析</span>
      </div>
      <div class="flex-1 flex flex-col items-center justify-center py-1.5">
        <div class="w-5 h-5 mb-0.5 flex items-center justify-center">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#999" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
        </div>
        <span class="text-[10px] text-gray-400">我的</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ===== AI跟进按钮 - 科技感霓虹风格 ===== */
.ai-btn {
  background: linear-gradient(135deg, #0c0c2e 0%, #1a1a4e 50%, #0c0c2e 100%);
  border: 1px solid rgba(100, 120, 255, 0.35);
  color: #c7d2fe;
  text-shadow: 0 0 8px rgba(139, 92, 246, 0.5);
  isolation: isolate;
}

.ai-btn:active {
  transform: scale(0.96);
}

/* 霓虹外发光 */
.ai-btn-glow {
  position: absolute;
  inset: -1px;
  border-radius: 9999px;
  background: conic-gradient(
    from 0deg,
    rgba(139, 92, 246, 0),
    rgba(99, 102, 241, 0.4),
    rgba(56, 189, 248, 0.4),
    rgba(139, 92, 246, 0),
    rgba(99, 102, 241, 0.4),
    rgba(56, 189, 248, 0.4),
    rgba(139, 92, 246, 0)
  );
  z-index: -1;
  animation: glow-rotate 4s linear infinite;
  filter: blur(4px);
  opacity: 0.7;
}

@keyframes glow-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 扫光效果 */
.ai-btn-scan {
  position: absolute;
  top: 0;
  left: -100%;
  width: 60%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(139, 92, 246, 0.15),
    rgba(56, 189, 248, 0.2),
    rgba(139, 92, 246, 0.15),
    transparent
  );
  z-index: 1;
  animation: scan-sweep 3s ease-in-out infinite;
}

@keyframes scan-sweep {
  0% { left: -60%; }
  50% { left: 100%; }
  100% { left: 100%; }
}

/* 图标样式 */
.ai-icon {
  filter: drop-shadow(0 0 4px rgba(139, 92, 246, 0.6));
  transition: all 0.3s ease;
}

.ai-icon-active {
  animation: icon-pulse 1s ease-in-out infinite;
  filter: drop-shadow(0 0 8px rgba(56, 189, 248, 0.8));
  color: #38bdf8;
}

.ai-icon-success {
  color: #34d399;
  filter: drop-shadow(0 0 6px rgba(52, 211, 153, 0.7));
}

@keyframes icon-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.3); opacity: 0.7; }
}

/* 文字样式 - 调亮 */
.ai-text-idle {
  background: linear-gradient(90deg, #c7d2fe, #a5f3fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.ai-text-active {
  background: linear-gradient(90deg, #38bdf8, #c4b5fd, #38bdf8);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: text-shimmer 2s linear infinite;
}

.ai-text-success {
  background: linear-gradient(90deg, #34d399, #6ee7b7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

@keyframes text-shimmer {
  from { background-position: 0% center; }
  to { background-position: 200% center; }
}

/* ===== AI反馈区域 - 动态渐变边框 ===== */
.ai-feedback-wrapper {
  position: relative;
  border: 1px solid #f0f0f0;
  border-radius: 0.5rem;
  transition: border-color 0.3s ease;
}

.ai-feedback-wrapper.ai-active {
  border-color: transparent;
}

.ai-border-glow {
  position: absolute;
  inset: -2px;
  border-radius: 0.6rem;
  z-index: 0;
  background: linear-gradient(
    90deg,
    #8b5cf6,
    #6366f1,
    #38bdf8,
    #8b5cf6,
    #6366f1,
    #38bdf8
  );
  background-size: 300% 100%;
  animation: border-flow 3s linear infinite;
  filter: blur(0.5px);
}

.ai-border-glow::after {
  content: '';
  position: absolute;
  inset: 2px;
  border-radius: 0.45rem;
  background: white;
}

@keyframes border-flow {
  from { background-position: 0% center; }
  to { background-position: 300% center; }
}
</style>
