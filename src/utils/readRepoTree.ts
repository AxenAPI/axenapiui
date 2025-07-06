import {setDocNodesTree} from '@/models/DocumentationModel';

/**
 * Функция для получения дерева файлов в репозитории и обновлении его значения в сторе
 *
 * @param {string} repoPath Путь к репозиторию
 */
export function fetchDocFolder(repoPath: string) {
  return window.electronAPI.getRepoTree(repoPath).then(setDocNodesTree);
}
