<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import PrototypeCodeLocation from '../../components/PrototypeCodeLocation.vue';
import RuleGroup from './RuleGroup.vue';
import { BarChart2, Briefcase, ChevronDown, ChevronLeft, LayoutGrid, MessageCircle, MessageSquare, Monitor, Settings, User, Users } from 'lucide-vue-next';

const router = useRouter();
const route = useRoute();

const activeMenu = ref('人群包');
const expandedMenu = ref('运营工具');

const menuItems = [
  { icon: Settings, label: '系统设置' },
  { icon: User, label: '客户联系' },
  { icon: Users, label: '客群管理' },
  { icon: Monitor, label: '营销中心' },
  { icon: MessageSquare, label: '内容中心' },
  { 
    icon: Briefcase, 
    label: '运营工具',
    subItems: ['客户欢迎语', '消息群发', '客户朋友圈', '标签拉群', '个人SOP', '人群包']
  },
  { icon: BarChart2, label: 'BI看板' },
  { icon: LayoutGrid, label: '管理中心' },
];

const handleMenuClick = (item: typeof menuItems[0]) => {
  if ((item as any).subItems) {
    expandedMenu.value = expandedMenu.value === item.label ? '' : item.label;
  } else {
    activeMenu.value = item.label;
  }
};

const handleSubMenuClick = (subItem: string) => {
  activeMenu.value = subItem;
  if (subItem === '个人SOP') router.push('/features/personal-sop/new');
  if (subItem === '人群包') router.push('/features/audience-package');
};

type RuleOperator = 'AND' | 'OR';

type RuleCondition = {
  id: string;
  type: 'condition';
  fieldKey: string;
  operator: string;
  value: string;
};

type RuleGroupNode = {
  id: string;
  type: 'group';
  op: RuleOperator;
  children: Array<RuleGroupNode | RuleCondition>;
};

type DetailData = {
  id: string;
  name: string;
  desc: string;
  createMode: '标签组合圈选' | '导入车辆VIN码';
  creator: string;
  dept: string;
  createdAt: string;
  status: string;
  vinFileName?: string;
  relations: { newCar: boolean; owner: boolean; lastService: boolean };
  ruleTree: RuleGroupNode;
};

const fieldOptions = computed(() => {
  const tagFieldOptions = ['性别', '车系', '动力类型', '行驶里程', '维修偏好', '意向车型', '意向级别'];
  const attributeFieldOptions = ['年龄', '车辆开票时间', '车辆开票时间(截止)', '到店时间', '最近一次维修时间', '最近一次保养时间'];
  return [
    ...tagFieldOptions.map(field => ({ key: `tag:${field}`, label: `标签-${field}` })),
    ...attributeFieldOptions.map(field => ({ key: `attr:${field}`, label: `属性-${field}` }))
  ];
});

const operatorOptions = ['等于', '不等于', '包含', '不包含', '大于', '小于', '大于等于', '小于等于'];

const detail = ref<DetailData | null>(null);

const selectedId = computed(() => String(route.params.id || ''));

const relationText = computed(() => {
  const d = detail.value;
  if (!d) return '';
  const parts: string[] = [];
  if (d.relations.newCar) parts.push('APP绑车人');
  if (d.relations.owner) parts.push('购车车主');
  if (d.relations.lastService) parts.push('最近一次维修人');
  return parts.join('、');
});

onMounted(() => {
  const raw = localStorage.getItem('audience-package-detail');
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.id === selectedId.value) {
        const baseRuleTree: RuleGroupNode = {
          id: 'root',
          type: 'group',
          op: 'OR',
          children: [
            {
              id: 'g1',
              type: 'group',
              op: 'AND',
              children: [
                { id: 'c1', type: 'condition', fieldKey: 'tag:性别', operator: '等于', value: '男' }
              ]
            }
          ]
        };

        detail.value = {
          id: parsed.id,
          name: parsed.name,
          desc: parsed.desc,
          createMode: parsed.createMode,
          creator: parsed.creator,
          dept: parsed.dept,
          createdAt: parsed.createdAt,
          status: parsed.status,
          vinFileName: parsed.createMode === '导入车辆VIN码' ? `${parsed.id}.xlsx` : undefined,
          relations: { newCar: true, owner: true, lastService: true },
          ruleTree: baseRuleTree
        };
        return;
      }
    } catch {
    }
  }

  detail.value = {
    id: selectedId.value,
    name: '人群包详情',
    desc: '-',
    createMode: '标签组合圈选',
    creator: '-',
    dept: '-',
    createdAt: '-',
    status: '-',
    relations: { newCar: true, owner: true, lastService: true },
    ruleTree: {
      id: 'root',
      type: 'group',
      op: 'OR',
      children: [
        {
          id: 'g1',
          type: 'group',
          op: 'AND',
          children: [{ id: 'c1', type: 'condition', fieldKey: 'tag:车系', operator: '等于', value: 'A4L' }]
        }
      ]
    }
  };
});
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
              v-if="(item as any).subItems"
              :size="12"
              :class="`transition-transform duration-200 opacity-0 group-hover:opacity-100 ${expandedMenu === item.label ? 'rotate-180' : ''}`"
            />
          </div>

          <div v-if="(item as any).subItems && expandedMenu === item.label" class="bg-[#111] hidden group-hover:block">
            <div
              v-for="subItem in (item as any).subItems"
              :key="subItem"
              :class="`pl-11 pr-4 py-2 cursor-pointer transition-colors text-[13px] whitespace-nowrap ${
                activeMenu === subItem ? 'bg-[#e53935] text-white' : 'hover:text-white hover:bg-[#333]'
              }`"
              @click="handleSubMenuClick(subItem)"
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
          <span class="text-gray-800">人群包</span>
          <span class="text-gray-300">/</span>
          <span class="text-gray-800">详情</span>
        </div>
        <div class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded">
          <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
            闻
          </div>
          <span class="text-gray-700">闻浩</span>
          <ChevronDown :size="14" class="text-gray-400" />
        </div>
      </div>

      <div class="flex-1 overflow-y-auto p-4">
        <div class="bg-white rounded shadow-sm p-6 min-h-full flex flex-col">
          <div class="grid grid-cols-[120px_1fr] gap-y-6 gap-x-6 max-w-4xl">
            <div class="text-gray-700 font-medium flex items-center justify-end">
              人群包ID:
            </div>
            <div class="text-gray-900 font-mono">
              {{ detail?.id }}
            </div>

            <div class="text-gray-700 font-medium flex items-center justify-end">
              人群包名称:
            </div>
            <div class="text-gray-900">
              {{ detail?.name }}
            </div>

            <div class="text-gray-700 font-medium flex items-start justify-end pt-2">
              人群包描述:
            </div>
            <div class="text-gray-900 whitespace-pre-wrap">
              {{ detail?.desc }}
            </div>

            <div class="text-gray-700 font-medium flex items-center justify-end">
              创建方式:
            </div>
            <div class="text-gray-900">
              {{ detail?.createMode }}
            </div>

            <template v-if="detail?.createMode === '导入车辆VIN码'">
              <div class="text-gray-700 font-medium flex items-center justify-end">
                文件:
              </div>
              <div class="text-gray-900 font-mono">
                {{ detail?.vinFileName || '-' }}
              </div>
            </template>

            <template v-else>
              <div class="text-gray-700 font-medium flex items-start justify-end pt-2">
                标签组合圈选:
              </div>
              <div class="w-full">
                <RuleGroup
                  v-if="detail"
                  :group="detail.ruleTree"
                  :level="0"
                  is-root
                  readonly
                  :field-options="fieldOptions"
                  :operator-options="operatorOptions"
                  :on-add-condition="() => {}"
                  :on-add-group="() => {}"
                  :on-remove-node="() => {}"
                />
              </div>
            </template>

            <div class="text-gray-700 font-medium flex items-center justify-end">
              车辆关系:
            </div>
            <div class="text-gray-900">
              {{ relationText || '-' }}
            </div>
          </div>

          <div class="mt-auto pt-10">
            <div class="flex items-center gap-3">
              <button @click="router.push('/features/audience-package')" class="h-9 px-5 border border-gray-300 text-gray-600 rounded hover:bg-gray-50 transition-colors">
                返回
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <PrototypeCodeLocation
      mode="floating"
      position="top"
      containerClass="left-1/2 -translate-x-1/2 right-auto bottom-auto"
      folderPath="src/features/audience-package-management"
    />
  </div>
</template>
