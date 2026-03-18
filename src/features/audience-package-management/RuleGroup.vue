<script setup lang="ts">
import { computed } from 'vue';
import { Plus, Trash2 } from 'lucide-vue-next';

defineOptions({ name: 'RuleGroup' });

type RuleOperator = 'AND' | 'OR';

type FieldOption = {
  key: string;
  label: string;
};

type RuleCondition = {
  id: string;
  type: 'condition';
  fieldKey: string;
  operator: string;
  value: string;
};

type RuleGroup = {
  id: string;
  type: 'group';
  op: RuleOperator;
  children: Array<RuleGroup | RuleCondition>;
};

const props = defineProps<{
  group: RuleGroup;
  level: number;
  isRoot?: boolean;
  parentId?: string;
  groupIndex?: number;
  readonly?: boolean;
  fieldOptions: FieldOption[];
  operatorOptions: string[];
  onAddCondition: (groupId: string) => void;
  onAddGroup: (groupId: string) => void;
  onRemoveNode: (parentId: string, nodeId: string) => void;
}>();

const groupTitle = computed(() => {
  if (props.isRoot) return '';
  if (typeof props.groupIndex === 'number') return `分组${props.groupIndex}`;
  return '分组';
});

const wrapperClasses = computed(() => {
  if (props.isRoot) return '';
  if (props.level === 1) return 'border border-gray-200 rounded bg-white overflow-hidden';
  return 'border border-gray-200 rounded bg-white overflow-hidden ml-10';
});

const headerBg = computed(() => {
  if (props.isRoot) return '';
  return props.level === 1 ? 'bg-gray-50' : 'bg-white';
});

const getGroupIndexAt = (index: number) => {
  let count = 0;
  for (let i = 0; i <= index; i += 1) {
    const child = props.group.children[i];
    if (child && child.type === 'group') count += 1;
  }
  return count;
};
</script>

<template>
  <div :class="wrapperClasses">
    <div v-if="!isRoot" :class="`px-4 py-3 border-b border-gray-200 flex items-center justify-between ${headerBg}`">
      <div class="flex items-center gap-3">
        <div class="text-sm font-bold text-gray-900">{{ groupTitle }}</div>
      </div>
      <div v-if="!readonly" class="flex items-center gap-2">
        <button type="button" @click="onAddCondition(group.id)" class="h-8 px-3 border border-gray-300 rounded bg-white hover:bg-gray-50 transition-colors text-xs font-bold text-gray-800 inline-flex items-center gap-2">
          <Plus :size="14" />
          条件
        </button>
        <button v-if="parentId" type="button" @click="onRemoveNode(parentId, group.id)" class="h-8 px-3 border border-gray-300 rounded bg-white hover:bg-gray-50 transition-colors text-xs font-bold text-gray-800">
          删除
        </button>
      </div>
    </div>

    <div v-else class="flex items-center justify-start gap-3 h-10">
      <button v-if="!readonly" type="button" @click="onAddGroup(group.id)" class="h-9 px-4 border border-gray-300 rounded bg-white hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-bold text-gray-800">
        <Plus :size="16" class="text-gray-800" />
        新增一组（或）
      </button>
      <div class="text-xs text-gray-600 leading-5">
        组间为「或」，组内为「且」。每个分组可添加多条条件。
      </div>
    </div>

    <div :class="isRoot ? 'mt-3 space-y-4' : 'p-4 space-y-3'">
      <template v-for="(child, idx) in group.children" :key="child.id">
        <div v-if="idx > 0 && group.op === 'OR'" class="flex items-center justify-center">
          <div class="px-4 h-8 rounded-full bg-[#1a1a1a] text-white text-xs font-bold flex items-center justify-center">
            或
          </div>
        </div>

        <div v-if="child.type === 'condition'" class="flex items-center gap-3">
          <div class="flex items-center gap-2 w-64">
            <span v-if="idx > 0" class="px-2 h-6 rounded bg-[#e53935] text-white text-[11px] leading-6 inline-flex items-center justify-center shrink-0">
              且
            </span>
            <div class="h-10 px-3 border border-gray-300 rounded flex items-center bg-white w-full">
              <select v-model="child.fieldKey" :disabled="readonly" class="w-full bg-transparent outline-none text-sm text-gray-700 disabled:text-gray-500">
                <option v-for="opt in fieldOptions" :key="opt.key" :value="opt.key">{{ opt.label }}</option>
              </select>
            </div>
          </div>

          <div class="w-40 h-10 px-3 border border-gray-300 rounded flex items-center bg-white">
            <select v-model="child.operator" :disabled="readonly" class="w-full bg-transparent outline-none text-sm text-gray-700 disabled:text-gray-500">
              <option v-for="opt in operatorOptions" :key="opt" :value="opt">{{ opt }}</option>
            </select>
          </div>

          <input v-model="child.value" :disabled="readonly" type="text" placeholder="请输入" class="flex-1 h-10 px-3 border border-gray-300 rounded focus:border-red-500 focus:outline-none bg-white disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed" />

          <button v-if="!readonly" type="button" @click="onRemoveNode(group.id, child.id)" class="h-10 w-10 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-800">
            <Trash2 :size="16" />
          </button>
        </div>

        <RuleGroup
          v-else
          :group="child"
          :level="level + 1"
          :parent-id="group.id"
          :group-index="getGroupIndexAt(idx)"
          :field-options="fieldOptions"
          :operator-options="operatorOptions"
          :readonly="readonly"
          :on-add-condition="onAddCondition"
          :on-add-group="onAddGroup"
          :on-remove-node="onRemoveNode"
        />
      </template>
    </div>
  </div>
</template>
