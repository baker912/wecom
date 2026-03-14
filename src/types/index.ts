export interface Customer {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  gender: '男' | '女';
  wecomAddDate: string;
}

export type TagColor = 'blue' | 'red' | 'yellow' | 'green';

export interface Tag {
  id: string;
  category: string;
  label: string;
  color: TagColor;
}

export interface VehicleInfo {
  vin: string;
  model: string;
  tags: Tag[];
}

export interface TagGroup {
  id: string;
  title: string;
  icon: 'tag' | 'heart' | 'car' | 'user' | 'briefcase' | 'file-text' | 'pie-chart';
  tags: Tag[];
  isVehicleGroup?: boolean;
  vehicles?: VehicleInfo[];
}

export interface Activity {
  id: string;
  type: 'activity' | 'lead' | 'friend' | 'browse';
  title: string;
  timestamp: string;
  description?: string;
}

export interface ArchiveTab {
  id: string;
  label: string;
  active?: boolean;
}
