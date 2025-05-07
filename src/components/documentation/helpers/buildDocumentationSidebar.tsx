import {Button, Dropdown} from '@axenix/ui-kit';
import {ItemType} from 'antd/lib/menu/interface';
import {Minus} from 'tabler-icons-react';

import {buildDocSidebarContextMenu} from '@/helpers/buildDocSidebarContextMenu';
import {addDocumentationPostFx, closeDocumentation, selectDocumentation} from '@/models/DocumentationModel';
import {DocNodes} from '@/types/common';
import {fetchDocFolder} from '@/utils/readRepoTree';

export const buildDocumentationSidebar = (repoPath: string, documents?: DocNodes[]) => {
  const handleDeleteFile = (folderName: string, fileName: string) => {
    const filePath = `${repoPath + folderName}/${fileName}.md`;
    const fileRelativePath = `${folderName}/${fileName}.md`;
    window.electronAPI.deleteFile(filePath).then(() =>
      addDocumentationPostFx(fileRelativePath)
        .then(() => fetchDocFolder(repoPath))
        .then(() => closeDocumentation)
    );
  };

  const items: ItemType[] = documents?.map((document, index) => ({
    key: index,
    label: (
      <Dropdown
        trigger={['contextMenu']}
        menu={buildDocSidebarContextMenu(repoPath, document.title, document.children)}
      >
        {document.title}
      </Dropdown>
    ),
    children: document.children?.map(children => ({
      key: index + children.id,
      label: (
        <div className="flex w-full items-center justify-between">
          {children.title}
          <Button className="border-0" size="small" onClick={() => handleDeleteFile(document.title, children.title)}>
            <Minus />
          </Button>
        </div>
      ),
      onClick: () => selectDocumentation({mainLabel: document.title, childLabel: children.title}),
    })),
  }));

  return items;
};
