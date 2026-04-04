<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import PrototypeCodeLocation from '../../components/PrototypeCodeLocation.vue';
import RuleGroup from './RuleGroup.vue';
import { BarChart2, Briefcase, ChevronDown, ChevronLeft, FileDown, LayoutGrid, MessageCircle, MessageSquare, Monitor, Plus, Settings, Trash2, Upload, User, Users, X } from 'lucide-vue-next';

const router = useRouter();
const route = useRoute();
const isViewMode = computed(() => route.name === 'audience-package-view');
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
const createModeLabel = computed(() => (createMode.value === 'cdpFilter' ? '标签/属性组合圈选' : '导入车辆VIN码'));

const hashString = (input: string) => {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

const mulberry32 = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a += 0x6D2B79F5;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const pick = <T,>(rnd: () => number, arr: T[]) => arr[Math.floor(rnd() * arr.length)];

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
  },
  scopeDepts: [] as string[]
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
  '最近到店经销商758 Code',
  '发票日期',
  '车辆开票时间',
  '车辆开票时间(截止)',
  '到店时间',
  '最近一次维修时间',
  '最近一次保养时间'
];

const dealerOptions = [
  '北京奥迪世达汽车销售服务有限公司',
  '上海奥迪东昌汽车销售服务有限公司',
  '广州奥迪锦龙汽车销售服务有限公司'
];

type ScopeNode = {
  id: string;
  label: string;
  children?: ScopeNode[];
};

const scopeTree: ScopeNode[] = [
  {
    id: 'root',
    label: '一汽奥迪销售有限责任公司',
    children: [
      {
        id: 'hb',
        label: '华北区',
        children: [
          { id: 'dealer-bj', label: dealerOptions[0] }
        ]
      },
      {
        id: 'hd',
        label: '华东区',
        children: [
          { id: 'dealer-sh', label: dealerOptions[1] }
        ]
      },
      {
        id: 'hn',
        label: '华南区',
        children: [
          { id: 'dealer-gz', label: dealerOptions[2] }
        ]
      }
    ]
  }
];

const tagFieldOptionItems = computed(() => {
  return tagFieldOptions.map(field => ({ key: `tag:${field}`, label: `标签-${field}` }));
});

const attrFieldOptionItems = computed(() => {
  return attributeFieldOptions.map(field => ({ key: `attr:${field}`, label: `属性-${field}` }));
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

const tagRuleRoot = ref<RuleGroupNode>({
  id: 'tag-root',
  type: 'group',
  op: 'OR',
  children: [
    createGroupNode('AND', [
      createCondition('tag:性别', '等于', '男'),
      createCondition('tag:动力类型', '等于', '油车')
    ]),
    createGroupNode('AND', [
      createCondition('tag:性别', '等于', '女'),
      createCondition('tag:动力类型', '等于', '电车')
    ])
  ]
});

const attrConditions = ref<RuleCondition[]>([
  createCondition('attr:最近到店经销商758 Code', '等于', '72346'),
  createCondition('attr:发票日期', '大于等于', '2026/01/01'),
  createCondition('attr:发票日期', '小于等于', '2026/01/01')
]);

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

const addConditionTo = (root: typeof tagRuleRoot, groupId: string, defaultFieldKey: string) => {
  const group = findGroupNode(root.value, groupId);
  if (!group) return;
  group.children.push(createCondition(defaultFieldKey, operatorOptions[0], ''));
};

const addGroupToRoot = (root: typeof tagRuleRoot, defaultFieldKey: string) => {
  root.value.children.push(createGroupNode('AND', [createCondition(defaultFieldKey, operatorOptions[0], '')]));
};

const removeNodeFrom = (root: typeof tagRuleRoot, parentId: string, nodeId: string, defaultFieldKey: string) => {
  const parent = findGroupNode(root.value, parentId);
  if (!parent) return;
  parent.children = parent.children.filter(child => child.id !== nodeId);
  if (parent.children.length === 0 && parent.id !== root.value.id) {
    parent.children.push(createCondition(defaultFieldKey, operatorOptions[0], ''));
  }
  if (root.value.children.length === 0) {
    addGroupToRoot(root, defaultFieldKey);
  }
};

const addTagCondition = (groupId: string) => addConditionTo(tagRuleRoot, groupId, tagFieldOptionItems.value[0]?.key || 'tag:性别');
const addTagGroup = (groupId: string) => {
  if (groupId !== tagRuleRoot.value.id) return;
  addGroupToRoot(tagRuleRoot, tagFieldOptionItems.value[0]?.key || 'tag:性别');
};
const addTagRootGroup = () => addTagGroup(tagRuleRoot.value.id);
const removeTagNode = (parentId: string, nodeId: string) => removeNodeFrom(tagRuleRoot, parentId, nodeId, tagFieldOptionItems.value[0]?.key || 'tag:性别');

const addAttrRow = () => {
  const defaultKey = attrFieldOptionItems.value[0]?.key || 'attr:年龄';
  attrConditions.value.push(createCondition(defaultKey, operatorOptions[0], ''));
};

const removeAttrRow = (id: string) => {
  attrConditions.value = attrConditions.value.filter(c => c.id !== id);
  if (attrConditions.value.length === 0) {
    addAttrRow();
  }
};

const layer1WrapEl = ref<HTMLElement | null>(null);
const tagDotEl = ref<HTMLElement | null>(null);
const attrDotEl = ref<HTMLElement | null>(null);
const layer1ConnectorVars = ref<Record<string, string>>({});
let layer1ResizeObserver: ResizeObserver | null = null;

const hydrateViewData = () => {
  const id = String(route.params.id || '');
  const seed = hashString(id || 'audience-package-view');
  const rnd = mulberry32(seed);

  const raw = localStorage.getItem('audience-package-detail');
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed?.id === id) {
        form.value.name = parsed?.name || '';
        form.value.description = parsed?.desc || parsed?.description || '';
        const modeLabel = String(parsed?.createMode || '');
        createMode.value = modeLabel.includes('导入') ? 'vinImport' : 'cdpFilter';
        if (Array.isArray(parsed?.scopeDepts)) {
          form.value.scopeDepts = parsed.scopeDepts.filter((d: unknown) => typeof d === 'string');
        }
      }
    } catch {}
  }
  if (!form.value.name.trim()) {
    form.value.name = id ? `人群包-${id}` : '人群包详情';
  }
  if (!form.value.description.trim()) {
    form.value.description = pick(rnd, ['用于活动触达的目标人群', '按标签/属性组合生成的人群', '仅用于原型展示的随机数据']);
  }

  if (form.value.scopeDepts.length === 0) {
    const rawDept = raw ? (() => { try { return JSON.parse(raw)?.dept; } catch { return null; } })() : null;
    const pickedDepts = dealerOptions.filter(() => rnd() > 0.5);
    if (rawDept && dealerOptions.includes(rawDept)) {
      form.value.scopeDepts = Array.from(new Set([rawDept, ...pickedDepts]));
    } else {
      form.value.scopeDepts = pickedDepts.length ? pickedDepts : [pick(rnd, dealerOptions)];
    }
  }

  form.value.relations.newCar = rnd() > 0.4;
  form.value.relations.owner = rnd() > 0.4;
  form.value.relations.lastService = rnd() > 0.6;
  if (!form.value.relations.newCar && !form.value.relations.owner && !form.value.relations.lastService) {
    form.value.relations.owner = true;
  }

  if (createMode.value === 'vinImport') {
    selectedFileName.value = `${id || '人群包'}-VIN导入.xlsx`;
    return;
  }

  const genders = ['男', '女'];
  const power = ['油车', '电车'];
  const series = ['A4L', 'A6L', 'Q5L', 'Q3', 'Q7'];
  const mileage = ['小于', '大于等于'];
  const mileageVal = ['1万', '3万', '5万', '8万'];
  const groupsCount = 2 + Math.floor(rnd() * 2);

  tagRuleRoot.value = {
    id: 'tag-root',
    type: 'group',
    op: 'OR',
    children: Array.from({ length: groupsCount }).map(() =>
      createGroupNode('AND', [
        createCondition('tag:性别', '等于', pick(rnd, genders)),
        createCondition('tag:动力类型', '等于', pick(rnd, power)),
        createCondition('tag:车系', '等于', pick(rnd, series)),
        createCondition('tag:行驶里程', pick(rnd, mileage), pick(rnd, mileageVal))
      ])
    )
  };

  const year = 2026;
  const codes = ['72346', '70123', '70988', '71234'];
  const ageOps = ['大于等于', '小于等于'];
  const ageVals = ['25', '30', '35', '40', '45'];

  attrConditions.value = [
    createCondition('attr:最近到店经销商758 Code', '等于', pick(rnd, codes)),
    createCondition('attr:发票日期', '大于等于', `${year}/01/01`),
    createCondition('attr:发票日期', '小于等于', `${year}/12/31`),
    createCondition('attr:年龄', pick(rnd, ageOps), pick(rnd, ageVals))
  ].slice(0, 3 + Math.floor(rnd() * 2));
};

const updateLayer1Connector = () => {
  if (!layer1WrapEl.value || !tagDotEl.value || !attrDotEl.value) return;
  const wrapRect = layer1WrapEl.value.getBoundingClientRect();
  const tagRect = tagDotEl.value.getBoundingClientRect();
  const attrRect = attrDotEl.value.getBoundingClientRect();

  const x0 = 12;
  const tagX = tagRect.left - wrapRect.left + tagRect.width / 2;
  const attrX = attrRect.left - wrapRect.left + attrRect.width / 2;
  const tagY = tagRect.top - wrapRect.top + tagRect.height / 2;
  const attrY = attrRect.top - wrapRect.top + attrRect.height / 2;
  const topY = Math.min(tagY, attrY);
  const bottomY = Math.max(tagY, attrY);
  const lineH = Math.max(bottomY - topY, 0);
  const midY = topY + lineH / 2;
  const tagW = Math.max(tagX - x0, 0);
  const attrW = Math.max(attrX - x0, 0);

  layer1ConnectorVars.value = {
    '--conn-x0': `${x0}px`,
    '--conn-tag-y': `${tagY}px`,
    '--conn-attr-y': `${attrY}px`,
    '--conn-top-y': `${topY}px`,
    '--conn-line-h': `${lineH}px`,
    '--conn-mid-y': `${midY}px`,
    '--conn-tag-w': `${tagW}px`,
    '--conn-attr-w': `${attrW}px`
  };
};

onMounted(() => {
  if (isViewMode.value) {
    hydrateViewData();
  }
  nextTick(() => {
    updateLayer1Connector();
    if (layer1WrapEl.value) {
      layer1ResizeObserver = new ResizeObserver(() => updateLayer1Connector());
      layer1ResizeObserver.observe(layer1WrapEl.value);
    }
    window.addEventListener('resize', updateLayer1Connector);
  });
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateLayer1Connector);
  layer1ResizeObserver?.disconnect();
  layer1ResizeObserver = null;
});

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

const hasValidScope = computed(() => {
  return form.value.scopeDepts.length > 0;
});

const showScopeModal = ref(false);
const scopeSearch = ref('');
const scopeExpanded = ref<Record<string, boolean>>({ root: true, hb: true, hd: true, hn: true });
const scopeTempDepts = ref<string[]>([]);

const normalizeText = (s: string) => s.trim().toLowerCase();

const filterScopeTree = (nodes: ScopeNode[], term: string): ScopeNode[] => {
  if (!term) return nodes;
  const t = normalizeText(term);
  const walk = (n: ScopeNode): ScopeNode | null => {
    const selfMatch = normalizeText(n.label).includes(t);
    const children = n.children?.map(walk).filter(Boolean) as ScopeNode[] | undefined;
    if (selfMatch) return { ...n, children: n.children };
    if (children && children.length) return { ...n, children };
    return null;
  };
  return nodes.map(walk).filter(Boolean) as ScopeNode[];
};

const getLeafLabels = (node: ScopeNode): string[] => {
  if (!node.children || node.children.length === 0) return [node.label];
  return node.children.flatMap(getLeafLabels);
};

const isNodeChecked = (node: ScopeNode, selected: string[]) => {
  const leaves = getLeafLabels(node);
  return leaves.length > 0 && leaves.every(l => selected.includes(l));
};

const toggleNode = (node: ScopeNode) => {
  const leaves = getLeafLabels(node);
  const next = new Set(scopeTempDepts.value);
  const allSelected = leaves.every(l => next.has(l));
  if (allSelected) {
    leaves.forEach(l => next.delete(l));
  } else {
    leaves.forEach(l => next.add(l));
  }
  scopeTempDepts.value = Array.from(next);
};

const scopeFlatList = computed(() => {
  const term = scopeSearch.value.trim();
  const expandAll = !!term;
  const filtered = filterScopeTree(scopeTree, term);
  const list: Array<{ node: ScopeNode; depth: number; hasChildren: boolean }> = [];
  const walk = (nodes: ScopeNode[], depth: number) => {
    for (const n of nodes) {
      const hasChildren = !!(n.children && n.children.length);
      list.push({ node: n, depth, hasChildren });
      const expanded = expandAll || !!scopeExpanded.value[n.id];
      if (hasChildren && expanded) walk(n.children!, depth + 1);
    }
  };
  walk(filtered, 0);
  return list;
});

const toggleExpand = (id: string) => {
  scopeExpanded.value = { ...scopeExpanded.value, [id]: !scopeExpanded.value[id] };
};

const openScopePicker = () => {
  scopeTempDepts.value = form.value.scopeDepts.slice();
  scopeSearch.value = '';
  showScopeModal.value = true;
};

const closeScopePicker = () => {
  showScopeModal.value = false;
  scopeSearch.value = '';
  scopeTempDepts.value = [];
};

const confirmScopePicker = () => {
  form.value.scopeDepts = scopeTempDepts.value.slice();
  closeScopePicker();
};

const persistScope = () => {
  const id = String(route.params.id || '');
  if (!id) return;
  const raw = localStorage.getItem('audience-package-detail');
  const next = (() => {
    if (!raw) return { id };
    try {
      const parsed = JSON.parse(raw);
      if (parsed?.id !== id) return { id };
      return parsed;
    } catch {
      return { id };
    }
  })();
  next.scopeDepts = form.value.scopeDepts.slice();
  localStorage.setItem('audience-package-detail', JSON.stringify(next));
};

const handleViewSave = () => {
  if (form.value.scopeDepts.length === 0) {
    openScopePicker();
    return;
  }
  persistScope();
  router.push('/features/audience-package');
};

const scopeDisplayText = computed(() => {
  if (form.value.scopeDepts.length === 0) return '请选择';
  if (form.value.scopeDepts.length <= 2) return form.value.scopeDepts.join('，');
  return `已选择 ${form.value.scopeDepts.length} 个部门/门店`;
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

const validateAttrConditions = (): boolean => {
  if (attrConditions.value.length === 0) return false;
  return attrConditions.value.every(c => c.fieldKey.trim() && c.operator.trim() && c.value.trim());
};

const canSave = computed(() => {
  if (!form.value.name.trim()) return false;
  if (!hasValidScope.value) return false;
  if (!hasValidRelations.value) return false;
  if (createMode.value === 'vinImport') return !!selectedFileName.value;
  return validateRuleTree(tagRuleRoot.value) && validateAttrConditions();
});

const showNameError = computed(() => !isViewMode.value && submitAttempted.value && !form.value.name.trim());
const showVinError = computed(() => !isViewMode.value && submitAttempted.value && createMode.value === 'vinImport' && !selectedFileName.value);
const showTagError = computed(() => !isViewMode.value && submitAttempted.value && createMode.value === 'cdpFilter' && !validateRuleTree(tagRuleRoot.value));
const showAttrError = computed(() => !isViewMode.value && submitAttempted.value && createMode.value === 'cdpFilter' && !validateAttrConditions());
const showRelationsError = computed(() => !isViewMode.value && submitAttempted.value && !hasValidRelations.value);
const showScopeError = computed(() => !isViewMode.value && submitAttempted.value && !hasValidScope.value);

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
          <div v-if="isViewMode" class="mb-4 px-4 py-3 bg-gray-50 border border-gray-200 rounded text-sm text-gray-700">
            提示：已创建的人群包仅可修改使用范围
          </div>
          <div class="grid grid-cols-[120px_1fr] gap-y-6 gap-x-6 max-w-6xl">
            <div class="text-gray-700 font-medium flex items-center justify-end">
              <span class="text-[#e53935] mr-1">*</span>人群包名称:
            </div>
            <div>
              <input v-model="form.name" :disabled="isViewMode" type="text" placeholder="请输入人群包名称" :class="`w-full max-w-xl h-10 px-3 border rounded focus:outline-none disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed ${showNameError ? 'border-[#e53935] focus:border-[#e53935]' : 'border-gray-300 focus:border-red-500'}`" />
              <div v-if="showNameError" class="text-xs text-[#e53935] mt-2">
                请输入人群包名称
              </div>
            </div>

            <div class="text-gray-700 font-medium flex items-start justify-end pt-2">
              人群包描述:
            </div>
            <div>
              <textarea v-model="form.description" :disabled="isViewMode" placeholder="请输入描述（可选）" class="w-full max-w-xl h-28 px-3 py-2 border border-gray-300 rounded focus:border-red-500 focus:outline-none resize-none disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"></textarea>
            </div>

            <div class="text-gray-700 font-medium flex items-center justify-end">
              <span class="text-[#e53935] mr-1">*</span>创建方式:
            </div>
            <div class="flex items-center gap-4">
              <template v-if="!isViewMode">
                <div class="inline-flex rounded-lg border border-gray-200 overflow-hidden bg-white">
                  <button
                    type="button"
                    @click="createMode = 'cdpFilter'"
                    :class="`px-4 h-10 text-sm font-bold transition-colors ${
                      createMode === 'cdpFilter' ? 'bg-[#e53935] text-white' : 'text-gray-600 hover:bg-gray-50'
                    }`"
                  >
                    标签/属性组合圈选
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
              </template>
              <template v-else>
                <div class="h-10 px-3 rounded border border-gray-200 bg-gray-50 text-sm text-gray-700 flex items-center">
                  {{ createModeLabel }}
                </div>
              </template>
            </div>

            <template v-if="createMode === 'vinImport'">
              <div class="text-gray-700 font-medium flex items-center justify-end">
                <span class="text-[#e53935] mr-1">*</span>导入车辆VIN码:
              </div>
              <div class="flex items-center gap-3">
                <button v-if="!isViewMode" @click="openUpload" class="h-10 px-4 border border-gray-300 rounded bg-white hover:bg-gray-50 transition-colors flex items-center gap-2">
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
              <div></div>
              <div class="w-full space-y-3">
                <div class="bg-gray-50 border border-gray-200 rounded p-3">
                  <div class="flex items-center justify-between gap-3">
                    <div class="flex items-center gap-2">
                      <div class="w-1 h-4 bg-[#e53935]"></div>
                      <div class="text-sm font-bold text-gray-900">功能说明</div>
                    </div>
                    <div class="relative group">
                      <button type="button" class="h-6 px-2 rounded border border-gray-200 bg-white text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors">
                        示例
                      </button>
                      <div class="hidden group-hover:block group-focus-within:block absolute z-[60] top-7 right-0 w-[520px] max-w-[calc(100vw-24px)] bg-white border border-gray-200 rounded-lg shadow-xl p-4 text-left">
                        <div class="text-sm font-bold text-gray-900">示例</div>
                        <div class="mt-2">
                          <div class="text-sm font-bold text-gray-900 leading-6">
                            若想筛选2026年的男性油车用户与女性电车用户，可使用以下方式进行组合
                          </div>

                          <div class="mt-3 text-xs text-gray-600 leading-6 space-y-2">
                            <div class="flex gap-2">
                              <div class="w-16 shrink-0 text-gray-500 font-bold">标签圈选</div>
                              <div class="flex-1">
                                <div>分组1：性别=男 且 动力类型=油车</div>
                                <div>或</div>
                                <div>分组2：性别=女 且 动力类型=电车</div>
                              </div>
                            </div>
                            <div class="flex gap-2">
                              <div class="w-16 shrink-0 text-gray-500 font-bold">属性圈选</div>
                              <div class="flex-1">发票日期在 2026/01/01 ~ 2026/12/31</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="mt-2 text-xs text-gray-700 leading-5 space-y-1">
                    <div>1、整体：【标签圈选】和【属性圈选】为同时满足的且关系；</div>
                    <div>2、标签圈选：分组间为或关系，分组内为且关系；</div>
                    <div>3、属性圈选：多条属性为同时满足的且关系；</div>
                  </div>
                </div>

                <div ref="layer1WrapEl" class="relative group space-y-3 pl-12">
                    <div class="absolute inset-0 pointer-events-none z-20" :style="layer1ConnectorVars">
                      <div class="absolute w-px bg-gradient-to-b from-[#e53935] to-[#1e88e5] opacity-80 group-hover:opacity-100" :style="{ left: 'var(--conn-x0)', top: 'var(--conn-top-y)', height: 'var(--conn-line-h)' }"></div>
                      <div class="absolute h-px bg-[#e53935] opacity-80 group-hover:opacity-100" :style="{ left: 'var(--conn-x0)', top: 'var(--conn-tag-y)', width: 'var(--conn-tag-w)' }"></div>
                      <div class="absolute h-px bg-[#1e88e5] opacity-80 group-hover:opacity-100" :style="{ left: 'var(--conn-x0)', top: 'var(--conn-attr-y)', width: 'var(--conn-attr-w)' }"></div>
                      <div class="absolute -translate-x-1/2 -translate-y-1/2" :style="{ left: 'var(--conn-x0)', top: 'var(--conn-mid-y)' }">
                        <div class="px-3 h-7 rounded-full bg-[#e53935] text-white text-xs font-bold inline-flex items-center justify-center shadow-sm ring-2 ring-white">
                          且
                        </div>
                      </div>
                    </div>

                    <div class="relative z-10 bg-white border border-[#f3b7b7] rounded p-3">
                    <div class="-mx-3 -mt-3 px-4 h-12 bg-[#fff1f2] border-b border-[#f3b7b7] rounded-t flex items-center justify-between gap-3">
                      <div class="flex items-center gap-2">
                        <div ref="tagDotEl" class="relative z-30 w-2.5 h-2.5 rounded-full bg-[#e53935]"></div>
                        <div class="text-[15px] font-bold text-gray-900">标签圈选</div>
                      </div>
                      <div v-if="!isViewMode" class="flex items-center gap-3 justify-end">
                        <button type="button" @click="addTagRootGroup" class="h-8 px-3 rounded border border-[#f3b7b7] bg-white hover:bg-gray-50 transition-colors text-xs font-bold text-gray-800 inline-flex items-center gap-2">
                          <Plus :size="14" />
                          新增一组（或）
                        </button>
                        <div class="text-xs text-gray-700 font-normal whitespace-nowrap">
                          组间「或」｜组内「且」
                        </div>
                      </div>
                    </div>
                    <RuleGroup
                      :group="tagRuleRoot"
                      :level="0"
                      is-root
                      hide-root-controls
                      :readonly="isViewMode"
                      :field-options="tagFieldOptionItems"
                      :operator-options="operatorOptions"
                      :on-add-condition="addTagCondition"
                      :on-add-group="addTagGroup"
                      :on-remove-node="removeTagNode"
                    />
                    <div v-if="showTagError" class="text-xs text-[#e53935] mt-2">
                      请完善所有标签条件（字段/条件/值均必填）
                    </div>
                  </div>

                  <div class="relative z-10 bg-white border border-[#b9d7ff] rounded p-3">
                    <div class="-mx-3 -mt-3 px-4 h-12 bg-[#eff6ff] border-b border-[#b9d7ff] rounded-t flex items-center gap-2">
                      <div ref="attrDotEl" class="relative z-30 w-2.5 h-2.5 rounded-full bg-[#1e88e5]"></div>
                      <div class="text-[15px] font-bold text-gray-900">属性圈选</div>
                    </div>
                    <div class="space-y-3 mt-2">
                      <div v-for="(cond, idx) in attrConditions" :key="cond.id" class="flex items-center gap-3">
                        <span v-if="idx > 0" class="px-2 h-6 rounded bg-[#e53935] text-white text-[11px] leading-6 inline-flex items-center justify-center shrink-0">
                          且
                        </span>

                        <div :class="`${idx === 0 ? 'w-[328px]' : 'w-72'} h-10 px-3 border border-gray-300 rounded flex items-center bg-white`">
                          <select v-model="cond.fieldKey" :disabled="isViewMode" class="w-full bg-transparent outline-none text-sm text-gray-700 disabled:text-gray-500">
                            <option value="" disabled>请选择属性</option>
                            <option v-for="opt in attrFieldOptionItems" :key="opt.key" :value="opt.key">{{ opt.label }}</option>
                          </select>
                        </div>

                        <div class="w-40 h-10 px-3 border border-gray-300 rounded flex items-center bg-white">
                          <select v-model="cond.operator" :disabled="isViewMode" class="w-full bg-transparent outline-none text-sm text-gray-700 disabled:text-gray-500">
                            <option value="" disabled>请选择</option>
                            <option v-for="opt in operatorOptions" :key="opt" :value="opt">{{ opt }}</option>
                          </select>
                        </div>

                        <input v-model="cond.value" :disabled="isViewMode" type="text" placeholder="请输入" class="flex-1 h-10 px-3 border border-gray-300 rounded focus:border-red-500 focus:outline-none bg-white disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed" />

                        <button v-if="!isViewMode" type="button" @click="removeAttrRow(cond.id)" class="h-10 w-10 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-800">
                          <Trash2 :size="16" />
                        </button>
                      </div>

                      <div v-if="!isViewMode">
                        <button type="button" @click="addAttrRow" class="text-sm font-bold text-[#e53935] hover:underline inline-flex items-center gap-2">
                          <Plus :size="16" />
                          添加条件
                        </button>
                      </div>
                    </div>
                    <div v-if="showAttrError" class="text-xs text-[#e53935] mt-2">
                      请完善所有属性条件（属性/条件/值均必填）
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <div class="text-gray-700 font-medium flex items-center justify-end pt-1">
              车辆关系:
            </div>
            <div>
              <div class="flex items-center gap-6 pt-1">
                <label class="flex items-center gap-2 text-gray-700">
                  <input v-model="form.relations.newCar" :disabled="isViewMode" type="checkbox" class="rounded border-gray-300 text-[#e53935] focus:ring-[#e53935] accent-[#e53935] disabled:opacity-60 disabled:cursor-not-allowed" />
                  APP绑车人
                </label>
                <label class="flex items-center gap-2 text-gray-700">
                  <input v-model="form.relations.owner" :disabled="isViewMode" type="checkbox" class="rounded border-gray-300 text-[#e53935] focus:ring-[#e53935] accent-[#e53935] disabled:opacity-60 disabled:cursor-not-allowed" />
                  购车车主
                </label>
                <label class="flex items-center gap-2 text-gray-700">
                  <input v-model="form.relations.lastService" :disabled="isViewMode" type="checkbox" class="rounded border-gray-300 text-[#e53935] focus:ring-[#e53935] accent-[#e53935] disabled:opacity-60 disabled:cursor-not-allowed" />
                  最近一次维修人
                </label>
              </div>
              <div v-if="showRelationsError" class="text-xs text-[#e53935] mt-2">
                至少选择一种车辆关系
              </div>
            </div>

            <div class="text-gray-700 font-medium flex items-center justify-end pt-1">
              <span class="text-[#e53935] mr-1">*</span>使用范围:
            </div>
            <div>
              <div class="flex items-center gap-3 mb-2 pt-2">
                <button type="button" @click="openScopePicker" class="text-sm font-bold text-[#e53935] inline-flex items-center gap-2 border-b border-[#e53935] hover:border-red-700 transition-colors">
                  <Plus :size="16" />
                  添加部门或门店
                </button>
              </div>
              <button type="button" @click="openScopePicker" class="w-full h-10 px-3 border border-gray-300 rounded bg-white flex items-center justify-between gap-3 text-left">
                <div :class="`text-sm ${form.scopeDepts.length ? 'text-gray-700' : 'text-gray-400'}`">
                  {{ scopeDisplayText }}
                </div>
                <ChevronDown :size="16" class="text-gray-400" />
              </button>
              <div v-if="showScopeError" class="text-xs text-[#e53935] mt-2">
                请选择使用范围
              </div>
            </div>
          </div>

          <div class="mt-auto pt-10">
            <div class="flex items-center gap-3">
              <button @click="handleCancel" class="h-9 px-5 border border-gray-300 text-gray-600 rounded hover:bg-gray-50 transition-colors">
                {{ isViewMode ? '返回' : '取消' }}
              </button>
              <button v-if="isViewMode" @click="handleViewSave" class="h-9 px-5 rounded transition-colors bg-[#e53935] text-white hover:bg-red-700">
                保存使用范围
              </button>
              <button v-else @click="handleSave" class="h-9 px-5 rounded transition-colors bg-[#e53935] text-white hover:bg-red-700">
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

    <div v-if="showScopeModal" class="fixed inset-0 z-[95] bg-black/30 flex items-center justify-center p-6">
      <div class="bg-white w-full max-w-4xl rounded shadow-lg border border-gray-200">
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div class="text-gray-800 font-bold">选择部门</div>
          <button @click="closeScopePicker" class="p-1 text-gray-400 hover:text-gray-600">
            <X :size="18" />
          </button>
        </div>
        <div class="px-6 py-4">
          <input v-model="scopeSearch" type="text" placeholder="输入部门" class="w-full h-10 px-3 border border-gray-300 rounded focus:border-red-500 focus:outline-none" />
          <div class="mt-3 border border-gray-200 rounded h-[420px] overflow-auto">
            <div
              v-for="item in scopeFlatList"
              :key="item.node.id"
              class="flex items-center gap-2 py-2 pr-3 hover:bg-gray-50"
              :style="{ paddingLeft: `${12 + item.depth * 16}px` }"
            >
              <button
                v-if="item.hasChildren"
                type="button"
                class="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600"
                @click="toggleExpand(item.node.id)"
              >
                <ChevronDown :size="14" :class="`${scopeExpanded[item.node.id] || scopeSearch.trim() ? '' : '-rotate-90'} transition-transform`" />
              </button>
              <div v-else class="w-5 h-5"></div>

              <input
                type="checkbox"
                :checked="isNodeChecked(item.node, scopeTempDepts)"
                class="rounded border-gray-300 text-[#e53935] focus:ring-[#e53935] accent-[#e53935]"
                @change="toggleNode(item.node)"
              />
              <div class="text-sm text-gray-700">{{ item.node.label }}</div>
            </div>
          </div>
        </div>
        <div class="px-6 pb-5 flex justify-end gap-3 border-t border-gray-100">
          <button @click="closeScopePicker" class="h-9 px-4 border border-gray-300 text-gray-600 rounded hover:bg-gray-50 transition-colors">
            取消
          </button>
          <button @click="confirmScopePicker" class="h-9 px-4 bg-[#e53935] text-white rounded hover:bg-red-700 transition-colors">
            确定
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
