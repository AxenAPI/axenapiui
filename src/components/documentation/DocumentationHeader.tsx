import {Breadcrumbs, Button} from '@axenix/ui-kit';
import {useUnit} from 'effector-react';
import {Dots, ListDetails} from 'tabler-icons-react';

import {
  $documentationBreadcrumbs,
  $repoPath,
  closeDocumentation,
  createMRDocumentationPostFx,
} from '@/models/DocumentationModel';
import {$fullPath, $markdown, $relativePathForMR} from '@/models/SaveFileModel';
import {fetchDocFolder} from '@/utils/readRepoTree';
import {saveFile} from '@/utils/saveFile';

export const DocumentationHeader = ({onClose}: {onClose: () => void}) => {
  const repoPath = useUnit($repoPath);
  const breadcrumbs = useUnit($documentationBreadcrumbs);
  const relativePathForMR = useUnit($relativePathForMR);
  const fullPath = useUnit($fullPath);
  const markdown = useUnit($markdown);

  const headerClass = 'flex min-h-[40px] w-full items-center justify-between border-b border-gray-200 px-6 py-2';
  const buttonsContainerClass = 'flex gap-2';

  const handlePublish = () => {
    saveFile(fullPath, markdown, relativePathForMR).then(response => {
      // @ts-ignore
      if (response?.data && 'code' in response.data) {
        return;
      }

      return createMRDocumentationPostFx().then(() => fetchDocFolder(repoPath).then(() => closeDocumentation));
    });
  };

  return (
    <div className={headerClass}>
      <Breadcrumbs items={breadcrumbs} />
      {breadcrumbs[0]?.title && (
        <div className={buttonsContainerClass}>
          <ListDetails />
          <Dots />
          <Button size="small" type="default" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handlePublish} size="small" type="primary">
            Publish
          </Button>
        </div>
      )}
    </div>
  );
};
