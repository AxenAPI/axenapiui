import type { MenuProps } from 'antd';
import { Plus, Rotate } from 'tabler-icons-react';

import { BranchInfo, BranchInfoRemoteStatusEnum } from '@shared/openapi';

import { branchSelectModel } from '../model/branchSelect.model';

export const gitMenuOptions: MenuProps['items'] = [
  { key: 'checkout', label: 'Checkout' },
  { key: 'rebase', label: 'Rebase' },
  { key: 'merge', label: "Merge into 'main'" },
  { type: 'divider' },
  { key: 'update', label: 'Update' },
  { key: 'push', label: 'Push' },
  { type: 'divider' },
  { key: 'rename', label: 'Rename' },
  { key: 'delete', label: 'Delete' },
];

export const getBranchesTree = (branchesData: BranchInfo[]) => [
  {
    title: (
      <div className="flex items-center gap-[10px]" onClick={() => branchSelectModel.events.openNewBranchDrawer()}>
        <Plus size={14} /> <div>New branch</div>
      </div>
    ),
    value: 'new',
    selectable: false,
  },
  {
    title: (
      <div className="flex items-center gap-[10px]" onClick={() => branchSelectModel.events.updateRepository()}>
        <Rotate size={14} /> <div>Update</div>
      </div>
    ),
    value: 'update',
    selectable: false,
  },
  {
    title: 'Local',
    value: 'local',
    selectable: false,
    children: branchesData
      .filter(item => item.remoteStatus === BranchInfoRemoteStatusEnum.Local)
      .map(item => ({ title: item.name, value: item.name, selectable: false })),
  },
  {
    title: 'Remote',
    value: 'remote',
    selectable: false,
    children: branchesData
      .filter(item => item.remoteStatus === BranchInfoRemoteStatusEnum.Remote)
      .map(item => ({ title: item.name, value: item.name, selectable: false })),
  },
  {
    title: 'Published',
    value: 'published',
    selectable: false,
    children: branchesData
      .filter(item => item.remoteStatus === BranchInfoRemoteStatusEnum.Published)
      .map(item => ({ title: item.name, value: item.name, selectable: false })),
  },
];
