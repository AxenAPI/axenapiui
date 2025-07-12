import {addDocumentationPostFx, Breadcrumb, editSelectedDocumentationChild} from '@/models/DocumentationModel';
import {fetchDocFolder} from '@/utils/readRepoTree';

export async function renameFileWithAddToCommit(newTitle: string, breadcrumbs: Breadcrumb[], repoPath: string) {
  if (breadcrumbs[1]?.title === newTitle) return;
  await window.electronAPI.renameFile(breadcrumbs[1]?.title, newTitle, `${repoPath}/${breadcrumbs[0].title}`).then(() =>
    fetchDocFolder(repoPath)
      .then(() => editSelectedDocumentationChild({childLabel: newTitle}))
      .then(() => addDocumentationPostFx(`${repoPath}/${newTitle}`))
  );
}
