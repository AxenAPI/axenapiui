import { Dropdown, useNotification } from '@axenix/ui-kit';
import { useGate, useUnit } from 'effector-react';

import { getBranchesTree, gitMenuOptions } from '../config';
import { branchSelectModel } from '../model/branchSelect.model';
import { getLastCommitDate } from '../utils/getLastCommitDate';
import { getTruncatedString } from '../utils/getTruncatedString';

export const useBranchSelectData = () => {
  const [api, contextHandler] = useNotification();

  useGate(branchSelectModel.gate, api);

  const {
    branchCheckoutApi,
    branchesData,
    branchSelected,
    currentBranch,
    gitActionSelected,
    isSelectOpen,
    selectOpened,
  } = useUnit({
    branchesData: branchSelectModel.stores.$branchesData,
    currentBranch: branchSelectModel.stores.$currentBranchName,
    isSelectOpen: branchSelectModel.stores.$isSelectOpen,
    selectOpened: branchSelectModel.events.selectOpened,
    branchCheckoutApi: branchSelectModel.api.branchCheckoutApi,
    gitActionSelected: branchSelectModel.events.gitActionSelected,
    branchSelected: branchSelectModel.events.branchSelected,
  });

  const branches = getBranchesTree(branchesData);

  const getBranchTitles = (data: { title: string; value: string }) => {
    if (branchesData.length < 1 || typeof data?.title !== 'string') {
      return data?.title;
    }

    const branch = branchesData?.find(item => item.name === data.title);
    const lastCommit = branch?.lastCommit;
    const isCurrent = branch?.current;
    const isBranch = !['local', 'remote', 'published', 'new', 'update'].includes(data.value);

    return (
      <div className="flex w-full items-center justify-between">
        {isBranch ? (
          <Dropdown
            trigger={isSelectOpen ? ['hover'] : []}
            overlayStyle={{ width: 300 }}
            menu={{
              items: gitMenuOptions!.map(item => {
                if (!item || (item && 'type' in item && item.type === 'divider')) {
                  return item;
                }

                if (item.key === 'checkout') {
                  return {
                    ...item,
                    onClick: () => branchCheckoutApi(data.value),
                  };
                }

                return {
                  ...item,
                  onClick: () => gitActionSelected({ action: item.key as string, branch: data.value }),
                };
              }),
            }}
          >
            <div>{getTruncatedString(data.title, 15)}</div>
          </Dropdown>
        ) : (
          <div>{getTruncatedString(data.title, 15)}</div>
        )}
        <div className="flex items-center whitespace-nowrap">
          {lastCommit && !isCurrent && <div className="text-gray-400/60">{getLastCommitDate(lastCommit)}</div>}
        </div>
      </div>
    );
  };

  const onBranchSelect = (value: string) => {
    branchSelected(value);
  };

  return { branches, contextHandler, currentBranch, selectOpened, getBranchTitles, onBranchSelect };
};
