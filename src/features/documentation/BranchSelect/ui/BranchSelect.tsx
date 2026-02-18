import { TreeSelect } from '@axenix/ui-kit';
import { FC } from 'react';

import { useBranchSelectData } from '../hooks/useBranchSelectData';

export const BranchSelect: FC = () => {
  const { branches, contextHandler, currentBranch, getBranchTitles, onBranchSelect, selectOpened } =
    useBranchSelectData();

  return (
    <>
      {contextHandler}
      <TreeSelect
        value={currentBranch}
        treeData={branches}
        treeTitleRender={getBranchTitles}
        minWidth={300}
        onSelect={onBranchSelect}
        onDropdownVisibleChange={selectOpened}
      />
    </>
  );
};
