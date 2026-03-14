import { Customer, TagGroup, Activity, ArchiveTab } from '../types';

export const mockCustomer: Customer = {
  id: '1',
  name: '李贤',
  avatar: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=illustration%20of%20a%20person%20avatar%2C%20artistic%20style%2C%20soft%20colors&image_size=square',
  phone: '16601515280',
  gender: '男',
  wecomAddDate: '2025-07-04',
};

export const mockTagGroups: TagGroup[] = [
  {
    id: 'basic',
    title: '基础信息',
    icon: 'file-text',
    tags: [
      { id: '1', category: '企微添加时间', label: '企微添加时间_7月', color: 'blue' },
      { id: '2', category: '企微添加时间', label: '企微添加时间_4日', color: 'blue' },
      { id: '3', category: '企微添加时间', label: '企微添加时间_2025年', color: 'blue' },
      { id: '4', category: '客户类型', label: '客户类型_私人', color: 'blue' },
      { id: '5', category: '是否会员绑定', label: '是否会员绑定_否', color: 'blue' },
    ]
  },
  {
    id: 'business',
    title: '业务状态',
    icon: 'briefcase', // Changed from tag to briefcase
    tags: [
      { id: '6', category: '留资状态', label: '留资状态_有手机号', color: 'red' },
      { id: '7', category: '线索状态', label: '线索状态_无效', color: 'yellow' },
      { id: '8', category: '到店状态', label: '到店状态_未到店', color: 'yellow' },
      { id: '9', category: '试驾次数', label: '试驾次数_2次', color: 'yellow' },
    ]
  },
  {
    id: 'marketing',
    title: '营销偏好',
    icon: 'heart',
    tags: [
      { id: '10', category: '活动标签', label: '活动标签_活动参与', color: 'yellow' },
    ]
  },
  {
    id: 'vehicle',
    title: '车辆信息',
    icon: 'car',
    isVehicleGroup: true,
    tags: [], // Fallback for old behavior
    vehicles: [
      {
        vin: 'LFV3A2198H102938',
        model: 'Audi A6L 45 TFSI',
        tags: Array.from({ length: 35 }).map((_, i) => ({
          id: `v1-${i}`,
          category: i < 5 ? '基础信息' : i < 15 ? '配置信息' : '状态信息',
          label: i < 5 ? `购车时间_${2020 + i}年` : i < 15 ? `配置_${['天窗', '导航', '真皮座椅', 'LED大灯', '自动泊车', 'ACC', 'HUD', 'BOSE音响', '全景影像', '无钥匙进入'][i - 5]}` : `状态_${['良好', '需保养', '无事故', '正常', '在保'][i % 5]}`,
          color: i < 5 ? 'blue' : i < 15 ? 'green' : 'yellow'
        }))
      },
      {
        vin: 'WAUZZZ4G8EN03847',
        model: 'Audi Q5L 40 TFSI',
        tags: Array.from({ length: 20 }).map((_, i) => ({
          id: `v2-${i}`,
          category: i < 5 ? '基础信息' : '状态信息',
          label: i < 5 ? `购车时间_${2022 + i}年` : `状态_${['新车', '首次保养', '原厂漆'][i % 3]}`,
          color: i < 5 ? 'blue' : 'green'
        }))
      },
      {
        vin: 'LZWAA24G8HN19283',
        model: 'Audi A4L 40 TFSI',
        tags: Array.from({ length: 15 }).map((_, i) => ({
          id: `v3-${i}`,
          category: '维修记录',
          label: `维修_${['更换机油', '更换滤芯', '轮胎检测', '刹车片更换'][i % 4]}`,
          color: 'yellow'
        }))
      },
      {
        vin: 'WAUZZZ4G9FN04829',
        model: 'Audi A5 40 TFSI',
        tags: Array.from({ length: 10 }).map((_, i) => ({
          id: `v4-${i}`,
          category: '基础信息',
          label: `状态_${['在保', '正常', '无违章'][i % 3]}`,
          color: 'blue'
        }))
      },
      {
        vin: 'LFV3A2198H201938',
        model: 'Audi Q7 55 TFSI',
        tags: Array.from({ length: 25 }).map((_, i) => ({
          id: `v5-${i}`,
          category: '配置信息',
          label: `配置_${['空气悬挂', '四轮转向', '电吸门'][i % 3]}`,
          color: 'green'
        }))
      }
    ]
  }
];

export const mockArchiveTabs: ArchiveTab[] = [
  { id: 'pre-sales', label: '售前线索', active: true },
  { id: 'prospect', label: '潜客' },
  { id: 'after-sales', label: '售后线索' },
  { id: 'owner', label: '车主档案' },
];

export const mockActivityTabs: string[] = [
  '全部', '线索跟进', '好友跟进', '潜客跟进', '好友浏览', '活动'
];

export const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'activity',
    title: '活动参与记录',
    timestamp: '2026-03-05 18:21:35',
    description: '生产验证优化无参与'
  }
];
