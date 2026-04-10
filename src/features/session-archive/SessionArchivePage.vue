<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { 
  ChevronDown, Search, User, Users, Calendar, 
  Link, FileText, Gift, Box, MonitorSmartphone
} from 'lucide-vue-next';

const router = useRouter();

const employees = [
  '温洁狗', '王丽君', '常丹丹', '马丹', '张安雷', 
  '蒋斌彬', '柳升', '辛浩强', '葛文斌', '罗磊'
];

const activeEmployee = ref('温洁狗');

const customers = [
  { name: 'SU、朝阳', icon: '🚙' },
  { name: 'w.', icon: '👱‍♀️' },
  { name: '。', icon: '🐻' },
  { name: '杨珍珍', icon: '🌲' },
  { name: '不瘦十斤不改名', icon: '🎁' },
  { name: 'Fcxxxxxx', icon: '📸' },
  { name: '桔梗', icon: '🌸' },
  { name: 'Lea', icon: '👩‍💼' },
  { name: '奶油小生', icon: '👦' },
  { name: '工作号', icon: '💼' },
  { name: 'xiaozhou', icon: '👦' },
  { name: '芬芳', icon: '🌼' }
];

const activeCustomer = ref('SU、朝阳');

const backToHome = () => {
  router.push('/');
};
</script>

<template>
  <div class="min-h-screen flex bg-white text-sm font-sans text-gray-800">
    
    <!-- Left Sidebar -->
    <div class="w-[240px] bg-[#1d1e23] text-gray-300 flex flex-col h-screen shrink-0">
      <div class="h-16 flex items-center px-6 text-white font-bold text-base tracking-wide border-b border-white/5">
        企业微信管理平台
      </div>
      <div class="flex-1 overflow-y-auto py-4 custom-scrollbar">
        <!-- Menu Items -->
        <div class="space-y-1">
          <div class="px-6 py-3 flex items-center justify-between hover:text-white cursor-pointer transition-colors">
            <div class="flex items-center gap-3">
              <User :size="16" />
              <span>客户联系</span>
            </div>
            <ChevronDown :size="14" class="-rotate-90" />
          </div>
          <div class="px-6 py-3 flex items-center justify-between hover:text-white cursor-pointer transition-colors">
            <div class="flex items-center gap-3">
              <Users :size="16" />
              <span>客群管理</span>
            </div>
            <ChevronDown :size="14" class="-rotate-90" />
          </div>
          <div class="px-6 py-3 flex items-center justify-between text-white cursor-pointer transition-colors">
            <div class="flex items-center gap-3">
              <FileText :size="16" />
              <span>营销中心</span>
            </div>
            <ChevronDown :size="14" />
          </div>
          <!-- Sub-menu -->
          <div class="bg-[#141518] py-2 space-y-1">
            <div class="px-12 py-2 hover:text-white cursor-pointer transition-colors">报名活动</div>
            <div class="px-12 py-2 hover:text-white cursor-pointer transition-colors">邀约活动</div>
            <div class="px-12 py-2 hover:text-white cursor-pointer transition-colors">线索渠道管理</div>
            <div class="px-12 py-2 hover:text-white cursor-pointer transition-colors">渠道活码</div>
            <div class="px-12 py-2 hover:text-white cursor-pointer transition-colors">一客一码</div>
            <div class="px-12 py-2 hover:text-white cursor-pointer transition-colors">员工名片</div>
            <div class="px-12 py-2 hover:text-white cursor-pointer transition-colors">短链接</div>
            <div class="px-12 py-2 hover:text-white cursor-pointer transition-colors">车展管理</div>
          </div>
          
          <div class="px-6 py-3 flex items-center justify-between hover:text-white cursor-pointer transition-colors">
            <div class="flex items-center gap-3">
              <Gift :size="16" />
              <span>抽奖活动</span>
            </div>
            <ChevronDown :size="14" class="-rotate-90" />
          </div>
          
          <div class="px-6 py-3 flex items-center justify-between text-white cursor-pointer transition-colors">
            <div class="flex items-center gap-3">
              <MonitorSmartphone :size="16" />
              <span>内容中心</span>
            </div>
            <ChevronDown :size="14" />
          </div>
          <!-- Sub-menu Active -->
          <div class="bg-[#141518] py-2 space-y-1">
            <div class="px-12 py-2 hover:text-white cursor-pointer transition-colors">内容库</div>
            <div class="px-12 py-2 bg-[#e4393c] text-white cursor-pointer transition-colors">会话存档</div>
          </div>
          
          <div class="px-6 py-3 flex items-center justify-between hover:text-white cursor-pointer transition-colors">
            <div class="flex items-center gap-3">
              <Box :size="16" />
              <span>运营工具</span>
            </div>
            <ChevronDown :size="14" class="-rotate-90" />
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col bg-[#f5f6f8] min-w-0 h-screen overflow-hidden">
      <!-- Top Header -->
      <div class="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 relative">
        <!-- Quick back button to home -->
        <button @click="backToHome" class="absolute left-6 text-gray-400 hover:text-gray-600 transition-colors" title="返回导航首页">
          <Link :size="16" />
        </button>
        <div class="flex-1"></div>
        <div class="flex items-center gap-2 cursor-pointer">
          <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold">李</div>
          <span class="text-gray-600">李贺</span>
          <ChevronDown :size="14" class="text-gray-400" />
        </div>
      </div>

      <!-- Main Area Scrollable -->
      <div class="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <div class="bg-white min-h-full flex flex-col shadow-sm rounded-sm">
          
          <!-- Breadcrumb & Tabs -->
          <div class="px-6 pt-4 pb-0 border-b border-gray-200 shrink-0">
            <div class="text-gray-500 text-[13px] mb-4">内容中心 > <span class="text-gray-800">会话存档</span></div>
            <div class="flex gap-8">
              <button class="pb-3 text-[#e4393c] font-bold border-b-2 border-[#e4393c]">单聊</button>
              <button class="pb-3 text-gray-600 font-bold hover:text-gray-800">群聊</button>
            </div>
          </div>

          <!-- Filters -->
          <div class="px-6 py-4 flex flex-wrap items-center gap-4 shrink-0 bg-white">
            <div class="flex items-center gap-2">
              <span class="text-gray-600">员工姓名：</span>
              <input type="text" placeholder="请输入员工姓名" class="w-40 h-8 px-3 border border-gray-300 rounded-sm text-sm outline-none focus:border-blue-500 placeholder-gray-400" />
            </div>
            <div class="flex items-center gap-2">
              <span class="text-gray-600">员工部门：</span>
              <div class="relative">
                <input type="text" placeholder="请选择或搜索部门" class="w-48 h-8 px-3 pr-8 border border-gray-300 rounded-sm text-sm outline-none focus:border-blue-500 placeholder-gray-400 cursor-pointer" readonly />
                <ChevronDown :size="14" class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-gray-600">客户昵称：</span>
              <input type="text" placeholder="请输入客户昵称" class="w-40 h-8 px-3 border border-gray-300 rounded-sm text-sm outline-none focus:border-blue-500 placeholder-gray-400" />
            </div>
            <div class="flex items-center gap-2">
              <span class="text-gray-600">会话起始时间：</span>
              <div class="flex items-center border border-gray-300 rounded-sm h-8 px-3 w-64 bg-white">
                <Calendar :size="14" class="text-gray-400 mr-2" />
                <input type="text" placeholder="开始时间" class="w-full bg-transparent outline-none text-sm placeholder-gray-400 text-center" readonly />
                <span class="mx-2 text-gray-400">-</span>
                <input type="text" placeholder="结束时间" class="w-full bg-transparent outline-none text-sm placeholder-gray-400 text-center" readonly />
              </div>
            </div>
            <div class="flex-1"></div>
            <div class="flex items-center gap-2">
              <button class="px-5 h-8 bg-[#e4393c] text-white rounded-sm hover:bg-red-700 transition-colors">查询</button>
              <button class="px-5 h-8 bg-[#f5f5f5] text-gray-600 rounded-sm border border-gray-200 hover:bg-gray-200 transition-colors">重置</button>
              <button class="px-5 h-8 bg-[#e4393c] text-white rounded-sm hover:bg-red-700 transition-colors">导出</button>
            </div>
          </div>

          <!-- Content Columns -->
          <div class="flex-1 flex px-6 pb-6 min-h-[500px]">
            <!-- Employees Col -->
            <div class="w-[180px] border border-gray-200 rounded-sm flex flex-col mr-3">
              <div class="h-10 bg-[#f5f6f8] border-b border-gray-200 flex items-center px-4 font-bold text-gray-700 shrink-0">
                员工姓名
              </div>
              <div class="flex-1 overflow-y-auto py-1 custom-scrollbar">
                <button 
                  v-for="emp in employees" 
                  :key="emp"
                  @click="activeEmployee = emp"
                  :class="['w-full text-left px-4 py-3 hover:bg-[#f0f7ff] transition-colors', activeEmployee === emp ? 'bg-[#f0f7ff] text-[#e4393c] border-l-2 border-[#e4393c]' : 'text-gray-600 border-l-2 border-transparent']"
                >
                  {{ emp }}
                </button>
              </div>
            </div>

            <!-- Customers Col -->
            <div class="w-[240px] border border-gray-200 rounded-sm flex flex-col mr-3">
              <div class="h-10 bg-[#f5f6f8] border-b border-gray-200 flex items-center px-4 font-bold text-gray-700 shrink-0">
                客户昵称(134)
              </div>
              <div class="flex-1 overflow-y-auto py-1 custom-scrollbar">
                <!-- Add a dummy blue active item at top like screenshot -->
                <div class="w-full px-4 py-2 bg-[#f0f7ff] flex items-center gap-3 cursor-pointer">
                  <div class="w-6 h-6 rounded bg-gray-200 flex items-center justify-center text-xs">🤖</div>
                  <span class="text-gray-800"></span>
                </div>
                
                <button 
                  v-for="cus in customers" 
                  :key="cus.name"
                  @click="activeCustomer = cus.name"
                  :class="['w-full text-left px-4 py-2 hover:bg-[#f0f7ff] transition-colors flex items-center gap-3', activeCustomer === cus.name ? 'bg-gray-50' : '']"
                >
                  <div class="w-6 h-6 rounded bg-gray-100 flex items-center justify-center text-xs shrink-0 shadow-sm border border-gray-200">{{ cus.icon }}</div>
                  <span class="text-gray-700 truncate">{{ cus.name }}</span>
                </button>
              </div>
            </div>

            <!-- Chat Content Col -->
            <div class="flex-1 border border-gray-200 rounded-sm flex flex-col mr-3 bg-[#fafafa]">
              <div class="h-10 bg-[#f5f6f8] border-b border-gray-200 flex items-center justify-center font-bold text-gray-700 shrink-0">
                会话内容
              </div>
              <div class="flex-1 flex flex-col items-center justify-center text-gray-400 gap-2">
                <div class="flex items-center gap-2 text-xs">
                  <span class="w-6 h-[1px] bg-gray-300"></span>
                  <Calendar :size="14" />
                  <span class="w-6 h-[1px] bg-gray-300"></span>
                </div>
                <div class="text-[13px]">-数据已全部加载-</div>
              </div>
            </div>

            <!-- Keyword Search Col -->
            <div class="w-[280px] border border-gray-200 rounded-sm flex flex-col">
              <div class="h-10 bg-white border-b border-gray-200 flex items-center px-4 font-bold text-gray-700 shrink-0">
                关键内容搜索
              </div>
              <div class="p-4 flex-1 bg-[#fafafa]">
                <div class="relative">
                  <input type="text" placeholder="请输入关键词搜索" class="w-full h-8 px-3 pr-8 border border-gray-300 rounded-sm text-sm outline-none focus:border-blue-500 placeholder-gray-400 bg-white" />
                  <Search :size="14" class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600" />
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div class="h-12 border-t border-gray-200 flex items-center justify-end px-6 text-[13px] text-gray-500 shrink-0">
            <span class="mr-4">共 5836 条</span>
            <div class="relative mr-4 cursor-pointer border border-gray-300 rounded-sm h-7 px-2 flex items-center gap-2 hover:border-gray-400">
              <span>10条/页</span>
              <ChevronDown :size="12" />
            </div>
            <div class="flex items-center gap-1 mr-4">
              <button class="w-7 h-7 flex items-center justify-center hover:text-blue-600"><ChevronDown :size="14" class="rotate-90" /></button>
              <button class="w-7 h-7 flex items-center justify-center text-[#e4393c] font-bold">1</button>
              <button class="w-7 h-7 flex items-center justify-center hover:text-blue-600">2</button>
              <button class="w-7 h-7 flex items-center justify-center hover:text-blue-600">3</button>
              <button class="w-7 h-7 flex items-center justify-center hover:text-blue-600">4</button>
              <button class="w-7 h-7 flex items-center justify-center hover:text-blue-600">5</button>
              <button class="w-7 h-7 flex items-center justify-center hover:text-blue-600">6</button>
              <span>...</span>
              <button class="w-8 h-7 flex items-center justify-center hover:text-blue-600">584</button>
              <button class="w-7 h-7 flex items-center justify-center hover:text-blue-600"><ChevronDown :size="14" class="-rotate-90" /></button>
            </div>
            <div class="flex items-center gap-2">
              <span>前往</span>
              <input type="text" value="1" class="w-10 h-7 border border-gray-300 rounded-sm text-center outline-none focus:border-blue-500" />
              <span>页</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <div class="h-8 bg-[#8a8b8e] text-white/80 text-xs flex items-center justify-center gap-6 shrink-0">
        <span>京ICP备09000793号</span>
        <span>京公网安备22017102000263号</span>
        <span>运维联系电话：0431-85990175</span>
        <span>运维邮箱：ITeMail@faw-vw.com</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>
