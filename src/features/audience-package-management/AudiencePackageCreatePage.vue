<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import PrototypeCodeLocation from '../../components/PrototypeCodeLocation.vue';
import RuleGroup from './RuleGroup.vue';
import { BarChart2, Briefcase, ChevronDown, ChevronLeft, FileDown, LayoutGrid, MessageCircle, MessageSquare, Monitor, Settings, Upload, User, Users, X } from 'lucide-vue-next';

const router = useRouter();
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

type CreateMode = 'vinImport' | 'cdpFilter';

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

const createMode = ref<CreateMode>('cdpFilter');

const createId = () => {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const form = ref({
  name: '',
  description: '',
  relations: {
    newCar: true,
    owner: true,
    lastService: true
  }
});

const operatorOptions = [
  '等于',
  '不等于',
  '包含',
  '不包含',
  '大于',
  '小于',
  '大于等于',
  '小于等于'
];

const tagFieldOptions = [
  '性别',
  '车系',
  '动力类型',
  '行驶里程',
  '维修偏好',
  '意向车型',
  '意向级别'
];

const attributeFieldOptions = [
  '年龄',
  '车辆开票时间',
  '车辆开票时间(截止)',
  '到店时间',
  '最近一次维修时间',
  '最近一次保养时间'
];

const fieldOptions = computed(() => {
  return [
    ...tagFieldOptions.map(field => ({ key: `tag:${field}`, label: `标签-${field}` })),
    ...attributeFieldOptions.map(field => ({ key: `attr:${field}`, label: `属性-${field}` }))
  ];
});

const createCondition = (fieldKey: string, operator: string, value: string): RuleCondition => {
  return {
    id: createId(),
    type: 'condition',
    fieldKey,
    operator,
    value
  };
};

const createGroupNode = (op: RuleOperator, children: RuleGroupNode['children']): RuleGroupNode => {
  return {
    id: createId(),
    type: 'group',
    op,
    children
  };
};

const rootRuleGroup = ref<RuleGroupNode>({
  id: 'root',
  type: 'group',
  op: 'OR',
  children: [
    createGroupNode('AND', [
      createCondition('tag:性别', '等于', '男'),
      createCondition('attr:年龄', '大于', '40'),
      createCondition('tag:动力类型', '等于', '油车')
    ]),
    createGroupNode('AND', [
      createCondition('tag:性别', '等于', '女'),
      createCondition('attr:年龄', '大于', '30'),
      createCondition('tag:动力类型', '等于', '电车')
    ])
  ]
});

const findGroupNode = (group: RuleGroupNode, id: string): RuleGroupNode | null => {
  if (group.id === id) return group;
  for (const child of group.children) {
    if (child.type === 'group') {
      const found = findGroupNode(child, id);
      if (found) return found;
    }
  }
  return null;
};

const addCondition = (groupId: string) => {
  const group = findGroupNode(rootRuleGroup.value, groupId);
  if (!group) return;
  const defaultFieldKey = fieldOptions.value[0]?.key || 'tag:性别';
  group.children.push(createCondition(defaultFieldKey, operatorOptions[0], ''));
};

const addGroup = (groupId: string) => {
  if (groupId !== rootRuleGroup.value.id) return;
  const group = findGroupNode(rootRuleGroup.value, groupId);
  if (!group) return;
  const defaultFieldKey = fieldOptions.value[0]?.key || 'tag:性别';
  group.children.push(createGroupNode('AND', [createCondition(defaultFieldKey, operatorOptions[0], '')]));
};

const removeNode = (parentId: string, nodeId: string) => {
  const parent = findGroupNode(rootRuleGroup.value, parentId);
  if (!parent) return;
  parent.children = parent.children.filter(child => child.id !== nodeId);
  if (parent.children.length === 0 && parent.id !== rootRuleGroup.value.id) {
    const defaultFieldKey = fieldOptions.value[0]?.key || 'tag:性别';
    parent.children.push(createCondition(defaultFieldKey, operatorOptions[0], ''));
  }
  if (rootRuleGroup.value.children.length === 0) {
    addGroup(rootRuleGroup.value.id);
  }
};

const showUploadModal = ref(false);
const selectedFileName = ref<string | null>(null);
const submitAttempted = ref(false);

const openUpload = () => {
  showUploadModal.value = true;
};

const closeUpload = () => {
  showUploadModal.value = false;
};

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  selectedFileName.value = file?.name || null;
};

const hasValidRelations = computed(() => {
  const { newCar, owner, lastService } = form.value.relations;
  return !!(newCar || owner || lastService);
});

const validateRuleTree = (group: RuleGroupNode): boolean => {
  let hasAny = false;
  for (const child of group.children) {
    if (child.type === 'condition') {
      hasAny = true;
      if (!child.fieldKey.trim()) return false;
      if (!child.operator.trim()) return false;
      if (!child.value.trim()) return false;
      continue;
    }
    hasAny = true;
    if (!validateRuleTree(child)) return false;
  }
  return hasAny;
};

const canSave = computed(() => {
  if (!form.value.name.trim()) return false;
  if (!hasValidRelations.value) return false;
  if (createMode.value === 'vinImport') return !!selectedFileName.value;
  return validateRuleTree(rootRuleGroup.value);
});

const showNameError = computed(() => submitAttempted.value && !form.value.name.trim());
const showVinError = computed(() => submitAttempted.value && createMode.value === 'vinImport' && !selectedFileName.value);
const showRuleError = computed(() => submitAttempted.value && createMode.value === 'cdpFilter' && !validateRuleTree(rootRuleGroup.value));
const showRelationsError = computed(() => submitAttempted.value && !hasValidRelations.value);

const handleCancel = () => {
  router.push('/features/audience-package');
};

const handleSave = () => {
  submitAttempted.value = true;
  if (!canSave.value) return;
  router.push('/features/audience-package');
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
                activeMenu === subItem 
                  ? 'bg-[#e53935] text-white' 
                  : 'hover:text-white hover:bg-[#333]'
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
          <span class="text-gray-800">新增</span>
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
              <span class="text-[#e53935] mr-1">*</span>人群包名称:
            </div>
            <div>
              <input v-model="form.name" type="text" placeholder="请输入人群包名称" :class="`w-full max-w-xl h-10 px-3 border rounded focus:outline-none ${showNameError ? 'border-[#e53935] focus:border-[#e53935]' : 'border-gray-300 focus:border-red-500'}`" />
              <div v-if="showNameError" class="text-xs text-[#e53935] mt-2">
                请输入人群包名称
              </div>
            </div>

            <div class="text-gray-700 font-medium flex items-start justify-end pt-2">
              人群包描述:
            </div>
            <div>
              <textarea v-model="form.description" placeholder="请输入描述（可选）" class="w-full max-w-xl h-28 px-3 py-2 border border-gray-300 rounded focus:border-red-500 focus:outline-none resize-none"></textarea>
            </div>

            <div class="text-gray-700 font-medium flex items-center justify-end">
              <span class="text-[#e53935] mr-1">*</span>创建方式:
            </div>
            <div class="flex items-center gap-4">
              <div class="inline-flex rounded-lg border border-gray-200 overflow-hidden bg-white">
                <button
                  type="button"
                  @click="createMode = 'cdpFilter'"
                  :class="`px-4 h-10 text-sm font-bold transition-colors ${
                    createMode === 'cdpFilter' ? 'bg-[#e53935] text-white' : 'text-gray-600 hover:bg-gray-50'
                  }`"
                >
                  标签组合圈选
                </button>
                <button
                  type="button"
                  @click="createMode = 'vinImport'"
                  :class="`px-4 h-10 text-sm font-bold transition-colors border-l border-gray-200 ${
                    createMode === 'vinImport' ? 'bg-[#e53935] text-white' : 'text-gray-600 hover:bg-gray-50'
                  }`"
                >
                  导入车辆VIN码
                </button>
              </div>
              <div class="text-xs text-gray-400">
                二选一：导入 VIN 或按标签/属性组合圈选
              </div>
            </div>

            <template v-if="createMode === 'vinImport'">
              <div class="text-gray-700 font-medium flex items-center justify-end">
                <span class="text-[#e53935] mr-1">*</span>导入车辆VIN码:
              </div>
              <div class="flex items-center gap-3">
                <button @click="openUpload" class="h-10 px-4 border border-gray-300 rounded bg-white hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <Upload :size="16" class="text-gray-600" />
                  +导入车辆VIN码
                </button>
                <div class="text-xs text-gray-400">
                  {{ selectedFileName ? `已选择文件：${selectedFileName}` : '支持 Excel/CSV（原型展示）' }}
                </div>
                <div v-if="showVinError" class="text-xs text-[#e53935]">
                  请先选择文件
                </div>
              </div>

            </template>

            <template v-else>
              <div class="text-gray-700 font-medium flex items-start justify-end pt-2">
                标签组合圈选:
              </div>
              <div class="w-full">
                <RuleGroup
                  :group="rootRuleGroup"
                  :level="0"
                  is-root
                  :field-options="fieldOptions"
                  :operator-options="operatorOptions"
                  :on-add-condition="addCondition"
                  :on-add-group="addGroup"
                  :on-remove-node="removeNode"
                />
                <div v-if="showRuleError" class="text-xs text-[#e53935] mt-2">
                  请完善所有标签条件（字段/条件/值均必填）
                </div>
              </div>
            </template>

            <div class="text-gray-700 font-medium flex items-start justify-end pt-2">
              车辆关系:
            </div>
            <div>
              <div class="flex items-center gap-6 pt-1">
                <label class="flex items-center gap-2 text-gray-700">
                  <input v-model="form.relations.newCar" type="checkbox" class="rounded border-gray-300 text-[#e53935] focus:ring-[#e53935] accent-[#e53935]" />
                  APP绑车人
                </label>
                <label class="flex items-center gap-2 text-gray-700">
                  <input v-model="form.relations.owner" type="checkbox" class="rounded border-gray-300 text-[#e53935] focus:ring-[#e53935] accent-[#e53935]" />
                  购车车主
                </label>
                <label class="flex items-center gap-2 text-gray-700">
                  <input v-model="form.relations.lastService" type="checkbox" class="rounded border-gray-300 text-[#e53935] focus:ring-[#e53935] accent-[#e53935]" />
                  最近一次维修人
                </label>
              </div>
              <div v-if="showRelationsError" class="text-xs text-[#e53935] mt-2">
                至少选择一种车辆关系
              </div>
            </div>
          </div>

          <div class="mt-auto pt-10">
            <div class="flex items-center gap-3">
              <button @click="handleCancel" class="h-9 px-5 border border-gray-300 text-gray-600 rounded hover:bg-gray-50 transition-colors">
                取消
              </button>
              <button @click="handleSave" class="h-9 px-5 rounded transition-colors bg-[#e53935] text-white hover:bg-red-700">
                保存
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

    <div v-if="showUploadModal" class="fixed inset-0 z-[90] bg-black/30 flex items-center justify-center p-6">
      <div class="bg-white w-full max-w-2xl rounded shadow-lg border border-gray-200">
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div class="text-gray-800 font-bold">导入车辆VIN码</div>
          <div class="flex items-center gap-3">
            <button class="h-8 px-3 bg-[#e53935] text-white rounded hover:bg-red-700 transition-colors flex items-center gap-2">
              <FileDown :size="14" />
              下载模板
            </button>
            <button @click="closeUpload" class="p-1 text-gray-400 hover:text-gray-600">
              <X :size="18" />
            </button>
          </div>
        </div>
        <div class="px-6 py-10 flex flex-col items-center">
          <label class="w-full max-w-sm h-36 border border-dashed border-gray-300 rounded flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
            <input type="file" accept=".xlsx,.xls,.csv" class="hidden" @change="handleFileChange" />
            <div class="text-[#e53935] font-bold">点击上传</div>
            <div class="text-xs text-gray-400 mt-2">每次仅能上传一个文件</div>
          </label>
          <div v-if="selectedFileName" class="text-sm text-gray-600 mt-4">
            已选择：<span class="font-mono">{{ selectedFileName }}</span>
          </div>
          <div class="text-xs text-gray-400 mt-3 text-center max-w-xl">
            请下载模板，按模板填写后上传（excel文件）。原型仅展示交互与布局。
          </div>
        </div>
        <div class="px-6 pb-5 flex justify-end gap-3">
          <button @click="closeUpload" class="h-9 px-4 border border-gray-300 text-gray-600 rounded hover:bg-gray-50 transition-colors">
            关闭
          </button>
          <button @click="closeUpload" class="h-9 px-4 bg-[#e53935] text-white rounded hover:bg-red-700 transition-colors">
            确认
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
