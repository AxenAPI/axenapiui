import {MenuProps} from 'antd/es/menu';

import {EMPTY_CHAR} from '@/constants/common';
import {DocNodes} from '@/types/common';
import {getNextAvailableFileNumber} from '@/utils/getNextAvailableFileNumber';
import {fetchDocFolder} from '@/utils/readRepoTree';
import {saveFile} from '@/utils/saveFile';

export const buildDocSidebarContextMenu = (repoPath: string, folderName: string, files: DocNodes[]) => {
  const availableFileNumber = getNextAvailableFileNumber(files);
  const fileRelativePath = `${folderName}/File${availableFileNumber}`;
  const fileFullPath = `${repoPath + fileRelativePath}.md`;

  return {
    items: [
      {
        label: 'Add file',
        key: `addFile`,
        onClick: e => {
          e.domEvent.stopPropagation();
          window.electronAPI
            .createFile(fileFullPath, EMPTY_CHAR)
            .then(() => saveFile(fileFullPath, EMPTY_CHAR, fileRelativePath).then(() => fetchDocFolder(repoPath)));
        },
      },
      {
        label: 'Delete folder',
        key: `deleteFolder`,
        onClick: e => {
          e.domEvent.stopPropagation();
          window.electronAPI.deleteFolder(`${repoPath + folderName}`).then(() => fetchDocFolder(repoPath));
        },
      },
    ],
  } as MenuProps;
};
