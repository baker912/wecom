<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import PrototypeCodeLocation from '../../components/PrototypeCodeLocation.vue';
import { 
  Settings, 
  Users, 
  MessageSquare, 
  Briefcase, 
  BarChart2, 
  LayoutGrid, 
  ChevronDown, 
  Monitor,
  User,
  MessageCircle,
  ChevronLeft
} from 'lucide-vue-next';

const router = useRouter();
const activeMenu = ref('个人SOP');
const expandedMenu = ref('运营工具');

const sopData = [
  { id: 1, type: '新客激活', name: '0226测试客户群发定时...', content: '--', sendTime: '一汽奥迪销售有限责任公司', creator: '李松浩', template: '--', createTime: '2026-02-26 15:59', status: 'active' },
  { id: 2, type: '新客激活', name: '20260205测试附件预览', content: '--', sendTime: '一汽奥迪销售有限责任公司', creator: '佟麟阁', template: '--', createTime: '2026-02-05 15:14', status: 'inactive' },
  { id: 3, type: '新客激活', name: '2026年2月4日09:45:441', content: '2026年2月4日09:45:44', sendTime: '一汽奥迪销售有限责任公司', creator: '佟麟阁', template: '2026年2月4日09:...', createTime: '2026-02-05 14:52', status: 'inactive' },
  { id: 4, type: '生日关怀', name: '25测试视频预览', content: '--', sendTime: '一汽奥迪销售有限责任公司', creator: '佟麟阁', template: '--', createTime: '2026-02-05 14:48', status: 'inactive' },
  { id: 5, type: '生日关怀', name: '25测试预览', content: '--', sendTime: '一汽奥迪销售有限责任公司', creator: '佟麟阁', template: '--', createTime: '2026-02-05 14:44', status: 'inactive' },
  { id: 6, type: '新客激活', name: '2026年2月5日14:40:51', content: '2026年2月5日14:40:51', sendTime: '长春昌融汽车销售服务有...', creator: '李万滔', template: '--', createTime: '2026-02-05 14:41', status: 'inactive' },
  { id: 7, type: '新客激活', name: '测试好友12138', content: '测试好友12138', sendTime: '一汽奥迪销售有限责任公司', creator: '佟麟阁', template: '--', createTime: '2026-02-04 15:04', status: 'inactive' },
  { id: 8, type: '新客激活', name: '20260204加好友回归测试', content: '--', sendTime: '一汽奥迪销售有限责任公司', creator: '李松浩', template: '--', createTime: '2026-02-04 13:19', status: 'inactive' },
  { id: 9, type: '新客激活', name: '2026年2月4日09:45:44', content: '2026年2月4日09:45:44', sendTime: '一汽奥迪销售有限责任公司', creator: '佟麟阁', template: '2026年2月4日09:...', createTime: '2026-02-04 13:02', status: 'inactive' },
  { id: 10, type: '生日关怀', name: '4测试23-副本-副本', content: '车展活动', sendTime: '一汽奥迪销售有限责任公司', creator: '佟麟阁', template: '--', createTime: '2026-02-04 13:00', status: 'inactive' },
];

const menuItems = [
  { icon: Settings, label: '系统设置' },
  { icon: User, label: '客户联系' },
  { icon: Users, label: '客群管理' },
  { icon: Monitor, label: '营销中心' },
  { icon: MessageSquare, label: '内容中心' },
  { 
    icon: Briefcase, 
    label: '运营工具',
    subItems: ['客户欢迎语', '消息群发', '客户朋友圈', '标签拉群', '个人SOP']
  },
  { icon: BarChart2, label: 'BI看板' },
  { icon: LayoutGrid, label: '管理中心' },
];

onMounted(() => {
  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport) {
    viewport.setAttribute('content', 'width=1440, initial-scale=0.5');
  }
});

onUnmounted(() => {
  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport) {
    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
  }
});

const handleMenuClick = (item: typeof menuItems[0]) => {
  if (item.subItems) {
    expandedMenu.value = expandedMenu.value === item.label ? '' : item.label;
  } else {
    activeMenu.value = item.label;
  }
};
</script>

<template>
  <div class="flex min-h-screen bg-gray-100 font-sans text-sm min-w-[1280px]">
    <div class="w-16 hover:w-52 bg-[#1a1a1a] text-[#b3b3b3] flex flex-col shrink-0 transition-all duration-300 group overflow-hidden relative z-50">
      <div class="h-14 flex items-center px-4 border-b border-[#333] gap-2 whitespace-nowrap overflow-hidden">
        <button 
          @click="router.push('/')" 
          class="text-white bg-[#333] p-1 rounded-full hover:bg-[#444] transition-colors shrink-0 flex items-center justify-center" 
          title="返回首页"
        >
          <ChevronLeft :size="16" />
        </button>
        <span class="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 truncate">企业微信管理平台</span>
      </div>
      
      <div class="flex-1 overflow-y-auto overflow-x-hidden py-3">
        <div v-for="item in menuItems" :key="item.label">
          <div 
            :class="`px-4 py-2.5 flex items-center justify-between cursor-pointer hover:text-white hover:bg-[#333] transition-colors whitespace-nowrap ${
              activeMenu === item.label ? 'text-white' : ''
            }`"
            @click="handleMenuClick(item)"
          >
            <div class="flex items-center gap-2.5">
              <div class="shrink-0">
                <component :is="item.icon" :size="20" />
              </div>
              <span class="text-[13px] opacity-0 group-hover:opacity-100 transition-opacity duration-300">{{ item.label }}</span>
            </div>
            <ChevronDown 
              v-if="item.subItems" 
              :size="12" 
              :class="`transition-transform duration-200 opacity-0 group-hover:opacity-100 ${expandedMenu === item.label ? 'rotate-180' : ''}`" 
            />
          </div>
          
          <div v-if="item.subItems && expandedMenu === item.label" class="bg-[#111] hidden group-hover:block">
            <div
              v-for="subItem in item.subItems"
              :key="subItem"
              :class="`pl-11 pr-4 py-2 cursor-pointer transition-colors text-[13px] whitespace-nowrap ${
                activeMenu === subItem 
                  ? 'bg-[#e53935] text-white' 
                  : 'hover:text-white hover:bg-[#333]'
              }`"
              @click="activeMenu = subItem"
            >
              {{ subItem }}
            </div>
          </div>
        </div>
      </div>
      
      <div class="p-3 border-t border-[#333] flex justify-center group-hover:justify-start">
         <button class="flex items-center gap-2 text-[#b3b3b3] hover:text-white">
           <MessageCircle :size="20" />
           <span class="text-[13px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap hidden group-hover:inline">消息通知</span>
         </button>
      </div>
    </div>

    <div class="flex-1 flex flex-col min-w-0">
      <div class="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-10">
        <div class="flex items-center text-gray-500 gap-2">
          <span>运营工具</span>
          <span class="text-gray-300">/</span>
          <span class="text-gray-800">个人SOP</span>
        </div>
        <div class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded">
          <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
            李
          </div>
          <span class="text-gray-700">李贤</span>
          <ChevronDown :size="14" class="text-gray-400" />
        </div>
      </div>

      <div class="flex-1 overflow-y-auto p-4">
        <div class="bg-white rounded shadow-sm p-6 min-h-full flex flex-col">
          <div class="grid grid-cols-3 gap-x-8 gap-y-4 mb-6">
            <div class="flex items-center gap-3">
              <span class="text-gray-600 w-20 text-right">SOP名称:</span>
              <input type="text" placeholder="Q5" class="flex-1 h-9 px-3 border border-gray-300 rounded focus:border-red-500 focus:outline-none" />
            </div>
            <div class="flex items-center gap-3">
              <span class="text-gray-600 w-20 text-right">所属部门:</span>
              <div class="flex-1 h-9 px-3 border border-gray-300 rounded flex items-center justify-between text-gray-400 cursor-pointer">
                <span>请选择或者搜索部门</span>
                <ChevronDown :size="14" />
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-gray-600 w-20 text-right">SOP类型:</span>
              <div class="flex-1 h-9 px-3 border border-gray-300 rounded flex items-center justify-between text-gray-400 cursor-pointer">
                <span>请选择SOP类型</span>
                <ChevronDown :size="14" />
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-gray-600 w-20 text-right">状态:</span>
              <div class="flex-1 h-9 px-3 border border-gray-300 rounded flex items-center justify-between text-gray-400 cursor-pointer">
                <span>请选择当前状态</span>
                <ChevronDown :size="14" />
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-gray-600 w-20 text-right">创建时间:</span>
              <div class="flex-1 flex items-center gap-2">
                 <div class="flex-1 h-9 px-3 border border-gray-300 rounded flex items-center text-gray-400">
                   <span class="text-xs">开始日期</span>
                 </div>
                 <span class="text-gray-400">至</span>
                 <div class="flex-1 h-9 px-3 border border-gray-300 rounded flex items-center text-gray-400">
                   <span class="text-xs">结束日期</span>
                 </div>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-gray-600 w-20 text-right">SOP模板:</span>
              <div class="flex-1 flex gap-2">
                <input type="text" placeholder="请搜索SOP模板" class="flex-1 h-9 px-3 border border-gray-300 rounded focus:border-red-500 focus:outline-none" />
                <button class="h-9 px-4 bg-[#e53935] text-white rounded hover:bg-red-700 transition-colors">查询</button>
                <button class="h-9 px-4 border border-gray-300 text-gray-600 rounded hover:bg-gray-50 transition-colors">重置</button>
              </div>
            </div>
          </div>

          <div class="h-[1px] bg-gray-100 mb-6"></div>

          <div class="flex justify-between items-center mb-4">
            <div class="flex gap-3">
              <button class="h-9 px-4 bg-[#e53935] text-white rounded flex items-center gap-1 hover:bg-red-700 transition-colors shadow-sm">
                新增SOP
              </button>
              <button class="h-9 px-4 bg-[#e53935] text-white rounded flex items-center gap-1 hover:bg-red-700 transition-colors shadow-sm">
                SOP模板管理
              </button>
              <div class="relative group">
                <button class="h-9 px-4 border border-[#e53935] text-[#e53935] rounded flex items-center gap-1 hover:bg-red-50 transition-colors bg-white">
                  <span class="w-4 h-4 border border-[#e53935] rounded-sm mr-1"></span>
                  一键关闭
                </button>
                
                <div class="absolute top-full left-0 mt-2 w-96 bg-[#e53935] text-white text-xs p-3 rounded shadow-lg z-20 hidden group-hover:block opacity-0 group-hover:opacity-100 transition-opacity">
                  <div class="absolute -top-1 left-6 w-2 h-2 bg-[#e53935] rotate-45"></div>
                  <p class="mb-1">1、一键关闭后，sop不再推送给顾问；</p>
                  <p class="mb-1">2、一键关闭后，【固定时间】类型的sop：</p>
                  <p class="pl-4 mb-0.5">a、如果是立即发送类型的，不再允许开启，开启按钮置灰；</p>
                  <p class="pl-4 mb-0.5">b、如果是固定时间类型，未到达开始时间的，允许二次或多次关闭/开启；</p>
                  <p class="pl-4 mb-1">c、如果是固定时间类型，过了开始时间的，无法开启；</p>
                  <p>3、其它类型，可以重复开启/关闭；</p>
                </div>
              </div>
            </div>
            <div class="text-gray-400 text-xs">
              最新数据同步时间：2026-02-26 16:09:57
            </div>
          </div>

          <div class="flex-1 border border-gray-200 rounded overflow-hidden flex flex-col">
            <div class="overflow-x-auto">
              <table class="w-full min-w-[1000px]">
                <thead class="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th class="px-4 py-3 text-left font-medium text-gray-600 w-12">
                      <input type="checkbox" class="rounded border-gray-300 text-red-600 focus:ring-red-500" />
                    </th>
                    <th class="px-4 py-3 text-left font-medium text-gray-600">SOP类型</th>
                    <th class="px-4 py-3 text-left font-medium text-gray-600">SOP名称</th>
                    <th class="px-4 py-3 text-left font-medium text-gray-600">推送内容</th>
                    <th class="px-4 py-3 text-left font-medium text-gray-600">所属部门</th>
                    <th class="px-4 py-3 text-left font-medium text-gray-600">创建人</th>
                    <th class="px-4 py-3 text-left font-medium text-gray-600">使用模板</th>
                    <th class="px-4 py-3 text-left font-medium text-gray-600">创建时间</th>
                    <th class="px-4 py-3 text-center font-medium text-gray-600 w-[200px]">操作</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr v-for="row in sopData" :key="row.id" class="hover:bg-gray-50 transition-colors">
                    <td class="px-4 py-3">
                      <input type="checkbox" class="rounded border-gray-300 text-red-600 focus:ring-red-500" />
                    </td>
                    <td class="px-4 py-3 text-gray-700">{{ row.type }}</td>
                    <td class="px-4 py-3 text-gray-700">{{ row.name }}</td>
                    <td class="px-4 py-3 text-gray-700">{{ row.content }}</td>
                    <td class="px-4 py-3 text-gray-700">{{ row.sendTime }}</td>
                    <td class="px-4 py-3 text-gray-700">{{ row.creator }}</td>
                    <td class="px-4 py-3 text-gray-700">{{ row.template }}</td>
                    <td class="px-4 py-3 text-gray-500">{{ row.createTime }}</td>
                    <td class="px-4 py-3 text-center">
                      <div class="flex items-center justify-center gap-2">
                        <template v-if="row.status === 'active'">
                          <button class="text-[#e53935] hover:underline">关闭</button>
                          <button class="text-[#e53935] hover:underline">详情</button>
                          <button class="text-[#e53935] hover:underline">复制</button>
                        </template>
                        <template v-else>
                          <button class="text-[#e53935] hover:underline">开启</button>
                          <button class="text-[#e53935] hover:underline">编辑</button>
                          <button class="text-[#e53935] hover:underline">复制</button>
                          <button class="text-[#e53935] hover:underline">删除</button>
                        </template>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="flex items-center justify-end gap-4 mt-4 text-gray-600 text-xs">
            <span>共 10 条</span>
            <div class="flex items-center gap-2 border border-gray-300 rounded px-2 py-1">
              10条/页
              <ChevronDown :size="14" />
            </div>
            <div class="flex items-center gap-2">
              <button class="w-6 h-6 flex items-center justify-center border border-gray-200 rounded disabled:opacity-50" disabled>&lt;</button>
              <button class="w-6 h-6 flex items-center justify-center bg-[#e53935] text-white rounded">1</button>
              <button class="w-6 h-6 flex items-center justify-center border border-gray-200 rounded">&gt;</button>
            </div>
            <div class="flex items-center gap-2">
              <span>前往</span>
              <input type="text" value="1" class="w-8 h-6 border border-gray-300 rounded text-center" />
              <span>页</span>
            </div>
          </div>
        </div>
        
        <div class="mt-4 text-center text-xs text-gray-400 pb-2">
          吉ICP备09000793号 吉公网安备22017102000263号 运维联系电话: 0431-85990175 运维邮箱: ITEMail@faw-vw.com
        </div>
      </div>
    </div>

    <PrototypeCodeLocation
      mode="floating"
      position="top"
      containerClass="left-1/2 -translate-x-1/2 right-auto bottom-auto"
      folderPath="src/prototypes/wecom-admin"
    />
  </div>
</template>
