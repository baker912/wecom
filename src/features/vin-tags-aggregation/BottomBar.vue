<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { PenSquare, ChevronLeft, ChevronRight, MessageCircle, Sparkles, X, Lightbulb, Clock, Car, ListChecks, ChevronUp, ChevronDown } from 'lucide-vue-next';
import ExpandableText from './ExpandableText.vue';

const isAiModalOpen = ref(false);
const activeTab = ref<'preference' | 'summary'>('preference');
const summaryExpanded = ref(false);
const showToast = ref(false);
const toastMessage = ref('');
const lastUpdated = ref(new Date());

// Log update time changes for debugging
watch(lastUpdated, (newVal) => {
  console.log(`[Update Log] Data timestamp updated: ${newVal.toISOString()}`);
});

const handleAiRecommend = () => {
  toastMessage.value = '正在开发中，敬请期待 🚀';
  showToast.value = true;
  setTimeout(() => { showToast.value = false; }, 2000);
};

const handleCopyContent = () => {
  aiGeneratedReply.value = null;
  toastMessage.value = '已复制到剪贴板 ✅';
  showToast.value = true;
  setTimeout(() => { showToast.value = false; }, 2000);
};

const summaryData = ref([
  {
    date: '2024-03-10',
    question: 'Q5L现在的油耗怎么样？市区开费油吗？听说这车如果不跑高速的话，油耗会比较高，我想了解一下真实的油耗情况，不要官方数据。',
    dimension: '使用成本',
    effectiveness: '有效回复',
    effectivenessColor: 'text-green-600 bg-green-50 border-green-100',
    reply: '目前车主反馈市区大概在9-10个油，高速能跑进7个，对于这个级别的SUV来说很省油了。确实如您所说，经常堵车的话油耗会高一点，大概11-12个左右，但配合自动启停功能，整体还是在可接受范围内的。'
  },
  {
    date: '2024-03-05',
    question: '现在买有优惠吗？落地大概多少？我看网上说最近有大促销。',
    dimension: '购车成本',
    effectiveness: '无效回复',
    effectivenessColor: 'text-red-600 bg-red-50 border-red-100',
    reply: '姐，咱们五一有车展活动，您要不过来看看？'
  },
  {
    date: '2024-02-28',
    question: '动力够不够用？起步肉不肉？家里人多，怕坐满人跑不动。',
    dimension: '动力性能',
    effectiveness: '未回复',
    effectivenessColor: 'text-gray-500 bg-gray-50 border-gray-200',
    reply: '(未回复内容)'
  },
  {
    date: '2024-02-20',
    question: 'Q5L的后排空间怎么样？中间凸起是不是很高？',
    dimension: '空间舒适性',
    effectiveness: '有效回复',
    effectivenessColor: 'text-green-600 bg-green-50 border-green-100',
    reply: '后排空间非常宽敞，腿部空间有两拳以上。中间地台确实有隆起，这是因为四驱系统的传动轴，为了保证通过性和操控稳定性。'
  },
  {
    date: '2024-02-15',
    question: '保养一次大概多少钱？送几次保养？',
    dimension: '售后服务',
    effectiveness: '有效回复',
    effectivenessColor: 'text-green-600 bg-green-50 border-green-100',
    reply: '小保养大概在1000-1200元左右。现在订车我们可以送您3次基础保养。'
  },
  {
    date: '2024-02-10',
    question: '有没有现车？定金交多少？',
    dimension: '购车流程',
    effectiveness: '有效回复',
    effectivenessColor: 'text-green-600 bg-green-50 border-green-100',
    reply: '目前黑外红内有现车。定金交1万即可锁车。'
  }
]);

const aiGeneratedReply = ref<{ index: number; content: string } | null>(null);

const handleGenerateReply = (index: number) => {
  // Simulate API call delay
  setTimeout(() => {
      let replyContent = '';
      const currentItem = summaryData.value[index];
      if (currentItem.dimension === '购车成本') {
          replyContent = '目前Q5L全系优惠大概在7-8万元左右，40时尚动感型落地大概在33万上下。五一车展期间还有额外的保养礼包赠送，您看这周末方便来店里详谈吗？';
      } else if (currentItem.dimension === '动力性能') {
           replyContent = 'Q5L搭载的2.0T高功率发动机动力非常充沛，百公里加速仅需6.9秒，满载情况下超车也很有信心。建议您亲自试驾体验一下。';
      } else {
           replyContent = 'AI为您生成的回复：感谢您的咨询，针对您关心的问题，我们的建议是...';
      }
      
      aiGeneratedReply.value = { index, content: replyContent };
  }, 500);
};

const visibleSummary = computed(() => {
  return summaryExpanded.value ? summaryData.value : summaryData.value.slice(0, 5);
});

const preferenceItems = [
  { 
    title: '地域 (上牌)', 
    conclusion: '沈阳', 
    evidence: '客户询问“沈阳这边上牌有没有优惠”。' 
  },
  { 
    title: '购车预算', 
    conclusion: '35-40 万', 
    evidence: '对话中用户提到“预算大概在40万以内，希望能办下来”。' 
  },
  { 
    title: '意向车型', 
    conclusion: 'Q5L', 
    evidence: '客户多次询问 Q5L 的配置和价格，对比了豪华动感型和致雅型。' 
  },
  { 
    title: '竞品行为', 
    conclusion: '对比 BMW X3', 
    evidence: '客户提到“也看了宝马X3，感觉内饰不如奥迪，但是宝马的操控好像更好一点，正在纠结”。' 
  },
  { 
    title: '用车场景', 
    conclusion: '家庭 / 代步', 
    evidence: '提到“主要是接送孩子和周末出去玩，偶尔回趟老家，需要空间大一点”。' 
  },
  { 
    title: '意向度', 
    conclusion: '高 (询价3次)', 
    evidence: '本周已询价3次，主动询问“这周末能不能试驾”，并且问了分期付款的具体费率。' 
  },
  { 
    title: '专业度', 
    conclusion: '中等 (技术敏感)', 
    evidence: '询问“听说2.0T高功率版油耗比较高？”以及“Q5L是不是快换代了，现在的优惠是不是清库存”。' 
  }
];
</script>

<template>
  <div>
    <!-- Floating AI Button -->
    <div class="fixed bottom-[88px] right-4 z-[100]">
      <button 
        @click="isAiModalOpen = true"
        class="w-[52px] h-[52px] bg-gradient-to-br from-[#6366f1] to-[#a855f7] rounded-full flex flex-col items-center justify-center text-white shadow-lg border-2 border-white/20 hover:scale-105 transition-transform relative overflow-hidden group"
      >
        <div class="absolute inset-0 bg-white/20 blur-xl group-hover:bg-white/30 transition-colors" />
        <Sparkles :size="22" :strokeWidth="1.5" class="mb-0.5 relative z-10 animate-pulse" />
        <span class="text-[9px] font-medium leading-none relative z-10">AI分析</span>
      </button>
    </div>

    <!-- AI Assistant Modal Overlay -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="isAiModalOpen" class="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[100]" @click="isAiModalOpen = false"></div>
    </Transition>

    <!-- AI Assistant Modal Content -->
    <Transition
      enter-active-class="transition duration-400 cubic-bezier(0.34, 1.56, 0.64, 1)"
      enter-from-class="translate-y-full"
      enter-to-class="translate-y-0"
      leave-active-class="transition duration-300 ease-in"
      leave-from-class="translate-y-0"
      leave-to-class="translate-y-full"
    >
      <div v-if="isAiModalOpen" class="fixed bottom-0 left-0 right-0 bg-[#F8F9FC] rounded-t-[32px] shadow-[0_-8px_40px_rgba(0,0,0,0.12)] z-[110] flex flex-col max-h-[92%] overflow-hidden border-t border-white">
          <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-full bg-gradient-to-br from-[#6366f1] to-[#a855f7] flex items-center justify-center text-white">
                <Sparkles :size="16" />
              </div>
              <h3 class="font-bold text-lg text-gray-800">AI 智能画像分析</h3>
            </div>
            <button 
              @click="isAiModalOpen = false"
              class="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X :size="20" class="text-gray-500" />
            </button>
          </div>
          
          <div class="flex-1 overflow-hidden flex flex-col bg-gray-50/50">
            <!-- 核心洞察 - 始终显示 -->
            <div class="px-4 pt-4 shrink-0">
              <div class="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 mb-2 border border-indigo-100 shadow-sm relative overflow-hidden">
                <div class="absolute -right-4 -bottom-4 opacity-[0.08] transform -rotate-12 pointer-events-none">
                  <Lightbulb :size="120" class="text-indigo-600" />
                </div>
                <div class="relative z-10">
                  <div class="flex items-center justify-between mb-2">
                    <h4 class="font-bold text-indigo-900 text-[15px]">核心洞察</h4>
                    <div class="flex items-center gap-1 text-[10px] text-indigo-800/70 bg-white/60 px-2 py-0.5 rounded-full border border-indigo-100/50 backdrop-blur-sm">
                       <Clock :size="10" />
                       <span class="animate-pulse w-1 h-1 bg-green-500 rounded-full mr-0.5"></span>
                       更新于：{{ lastUpdated.toISOString().slice(0, 10) }} {{ lastUpdated.toTimeString().slice(0, 5) }}
                    </div>
                  </div>
                  <p class="text-[14px] text-indigo-900/80 leading-relaxed">
                    基于近3个月数据，客户购车意向<span class="font-bold text-indigo-700 bg-indigo-100/50 px-1 rounded mx-0.5">极高</span>。重点关注<span class="font-bold text-indigo-700">车辆配置</span>与<span class="font-bold text-indigo-700">售后服务</span>。建议跟进 Q5L 试驾及保养介绍。
                  </p>
                </div>
              </div>
            </div>

            <!-- Tab Navigation -->
            <div class="px-4 border-b border-gray-100 bg-white sticky top-0 z-20 shrink-0">
              <div class="flex gap-4 pt-0">
                <button
                  @click="activeTab = 'preference'"
                  :class="`flex-1 py-2.5 px-2 text-[13px] font-bold relative transition-all rounded-t-lg flex items-center justify-center gap-1.5 ${
                    activeTab === 'preference' 
                      ? 'text-indigo-600 bg-indigo-50/50' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`"
                >
                  <Car :size="16" :class="activeTab === 'preference' ? 'text-indigo-600' : 'text-gray-400'" />
                  购车偏好预测
                  <div 
                    v-if="activeTab === 'preference'"
                    class="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 shadow-[0_-2px_6px_rgba(79,70,229,0.3)]" 
                  />
                </button>
                
                <!-- Vertical Divider -->
                <div class="w-[1px] bg-gray-100 my-2 h-5 self-center"></div>

                <button
                  @click="activeTab = 'summary'"
                  :class="`flex-1 py-2.5 px-2 text-[13px] font-bold relative transition-all rounded-t-lg flex items-center justify-center gap-1.5 ${
                    activeTab === 'summary' 
                      ? 'text-orange-500 bg-orange-50/50' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`"
                >
                  <ListChecks :size="16" :class="activeTab === 'summary' ? 'text-orange-500' : 'text-gray-400'" />
                  关注点总结
                  <div 
                    v-if="activeTab === 'summary'"
                    class="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 shadow-[0_-2px_6px_rgba(249,115,22,0.3)]" 
                  />
                </button>
              </div>
            </div>

            <!-- Tab Content -->
            <div class="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar relative">
              <Transition
                mode="out-in"
                enter-active-class="transition duration-200 ease-out"
                enter-from-class="opacity-0 translate-x-2"
                enter-to-class="opacity-100 translate-x-0"
                leave-active-class="transition duration-200 ease-in"
                leave-from-class="opacity-100 translate-x-0"
                leave-to-class="opacity-0 -translate-x-2"
              >
                <div v-if="activeTab === 'preference'" key="preference" class="space-y-3 pt-1">
                    <div class="bg-white rounded-xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100">
                      <h5 class="text-[14px] font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <span class="w-1 h-3 bg-indigo-500 rounded-full"></span>
                        购车偏好预测
                      </h5>
                      
                      <div class="space-y-3">
                        <div v-for="(item, index) in preferenceItems" :key="index" class="bg-gray-50 rounded-lg p-2.5 border border-gray-100">
                          <div class="flex justify-between items-center mb-1.5">
                            <span class="text-[12px] text-gray-500 font-medium">{{ item.title }}</span>
                          </div>
                          <div class="space-y-1">
                            <div class="flex items-start gap-2">
                              <span class="text-[12px] text-indigo-600 font-bold shrink-0 leading-relaxed">核心结论：</span>
                              <span class="text-[12px] text-gray-900 font-bold leading-relaxed">{{ item.conclusion }}</span>
                            </div>
                            <div class="flex flex-col gap-0.5">
                              <span class="text-[11px] text-gray-400 shrink-0 leading-relaxed mt-0.5">支撑依据：</span>
                              <div class="text-[11px] text-gray-600 leading-relaxed bg-white px-2 py-1 rounded border border-gray-100/50">
                                <ExpandableText :text="item.evidence" :limit="60" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                </div>

                <div v-else key="summary" class="space-y-4 pt-2">
                     <div class="bg-white rounded-xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100">
                      <h5 class="text-[15px] font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span class="w-1 h-3.5 bg-orange-500 rounded-full"></span>
                        关注点总结
                      </h5>
                      <div class="space-y-0">
                        <div v-for="(item, index) in visibleSummary" :key="index" :class="`flex gap-3 relative pl-4 ${index !== visibleSummary.length - 1 ? 'pb-6 border-l border-dashed border-gray-200 ml-1' : 'ml-1'}`">
                            <div class="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-white border-2 border-orange-300 z-10"></div>
                            <div class="flex-1 -mt-1">
                              <div class="flex justify-between items-center mb-1.5 gap-2">
                                <div class="flex items-center gap-2 overflow-hidden">
                                  <span class="text-[12px] text-gray-400 font-mono bg-gray-50 px-1.5 rounded shrink-0">{{ item.date }}</span>
                                  <span class="text-[11px] text-orange-600 bg-orange-50 px-2 py-0.5 rounded flex items-center gap-1 truncate">
                                    <span class="w-1 h-1 bg-orange-400 rounded-full shrink-0"></span>
                                    {{ item.dimension }}
                                  </span>
                                </div>
                                <span :class="`text-[10px] px-1.5 py-0.5 rounded border shrink-0 ${item.effectivenessColor}`">
                                  {{ item.effectiveness }}
                                </span>
                              </div>
                              <div class="text-[13px] text-gray-800 font-medium mb-2 leading-relaxed">
                                <ExpandableText :text="item.question" :limit="40" className="font-bold text-gray-800" />
                              </div>
                              <div class="bg-gray-50 rounded p-2 mb-2 border border-gray-100/50 relative group">
                                  <div class="text-[11px] text-gray-400 mb-0.5 flex items-center justify-between">
                                      <div class="flex items-center gap-1">
                                          <MessageCircle :size="10" />
                                          顾问回复
                                      </div>
                                      <button 
                                          v-if="item.effectiveness === '无效回复' || item.effectiveness === '未回复'"
                                          @click="handleGenerateReply(index)"
                                          class="flex items-center gap-1 text-[10px] text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 hover:bg-indigo-100 transition-colors"
                                      >
                                          <Sparkles :size="10" />
                                          AI帮写
                                      </button>
                                  </div>
                                  <div :class="`text-[12px] leading-relaxed ${item.reply === '(未回复内容)' ? 'text-gray-400 italic' : 'text-gray-600'}`">
                                      <ExpandableText :text="item.reply" :limit="60" :className="item.reply === '(未回复内容)' ? 'text-gray-400 italic' : 'text-gray-600'" />
                                  </div>
                              </div>
                            </div>
                        </div>
                      </div>
                      
                      <div v-if="summaryData.length > 5" class="mt-4 pt-3 border-t border-gray-50 flex justify-center">
                        <button 
                          @click="summaryExpanded = !summaryExpanded"
                          class="text-[12px] text-gray-500 hover:text-indigo-600 flex items-center gap-1 px-4 py-1.5 rounded-full hover:bg-gray-50 transition-colors"
                        >
                            <span v-if="summaryExpanded" class="flex items-center gap-1">收起 <ChevronUp :size="14" /></span>
                            <span v-else class="flex items-center gap-1">共 {{ summaryData.length }} 条，展开更多 <ChevronDown :size="14" /></span>
                        </button>
                      </div>
                    </div>
                </div>
              </Transition>
            </div>
          </div>

          <div class="p-4 border-t border-gray-100 bg-white safe-area-bottom">
            <button 
              @click="handleAiRecommend"
              class="w-full bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white py-3 rounded-lg font-medium shadow-lg shadow-indigo-200 active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
            >
              <MessageCircle :size="18" />
              AI实时话术推荐
            </button>
          </div>
        </div>
      </Transition>

    <!-- AI Reply Modal -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-4"
    >
      <div 
        v-if="aiGeneratedReply"
        class="fixed inset-0 z-[130] flex items-center justify-center p-6 bg-black/20 backdrop-blur-[2px]"
        @click="aiGeneratedReply = null"
      >
        <div
          class="bg-white rounded-2xl p-6 shadow-2xl w-full max-w-sm border border-white"
          @click.stop
        >
          <div class="bg-gradient-to-r from-indigo-500 to-purple-500 p-4 flex justify-between items-center text-white">
            <div class="flex items-center gap-2">
              <Sparkles :size="18" />
              <h3 class="font-bold">AI 推荐回复</h3>
            </div>
            <button @click="aiGeneratedReply = null" class="hover:bg-white/20 p-1 rounded-full transition-colors">
              <X :size="20" />
            </button>
          </div>
          
          <div class="p-5">
            <div class="bg-gray-50 rounded-lg p-4 text-gray-700 text-[14px] leading-relaxed mb-4 border border-gray-100">
              {{ aiGeneratedReply.content }}
            </div>
            
            <div class="flex gap-3">
              <button 
                @click="aiGeneratedReply = null"
                class="flex-1 py-2.5 border border-gray-200 rounded-lg text-gray-600 font-medium hover:bg-gray-50 transition-colors text-[14px]"
              >
                重新生成
              </button>
              <button 
                @click="handleCopyContent"
                class="flex-1 py-2.5 bg-indigo-600 rounded-lg text-white font-medium hover:bg-indigo-700 transition-colors text-[14px]"
              >
                复制内容
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Toast Notification -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-300 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-4"
    >
      <div v-if="showToast" class="fixed inset-0 z-[140] flex items-center justify-center pointer-events-none">
        <div class="bg-black/80 text-white px-6 py-3 rounded-lg shadow-xl backdrop-blur-sm text-sm font-medium pointer-events-auto">
          {{ toastMessage }}
        </div>
      </div>
    </Transition>

    <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 pt-3 pb-8 flex flex-col gap-3 z-40">
      <div class="flex justify-center w-full">
        <button class="flex items-center gap-2 px-8 py-2.5 border border-gray-300 rounded-[4px] text-[16px] text-[#333] font-normal shadow-sm w-full max-w-[300px] justify-center bg-white">
          <PenSquare :size="18" :strokeWidth="1.5" />
          写好友跟进
        </button>
      </div>
      
      <div class="flex justify-between items-center px-10 py-1">
        <ChevronLeft :size="28" class="text-[#333] stroke-[1.5]" />
        <ChevronRight :size="28" class="text-[#333] stroke-[1.5]" />
      </div>
    </div>
  </div>
</template>
