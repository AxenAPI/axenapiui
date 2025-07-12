import {addDocumentationPostFx, commitDocumentationPostFx} from '@/models/DocumentationModel';
import {dirtyChanged} from '@/models/SaveFileModel';

/**
 * Функция для сохранения файла и добавления его в МР
 *
 * @param {string} fileFullPath - Полный путь до файла, включая его расширение md
 * @param {string} content - Содержимое файла
 * @param {string} fileRelativePath - Относительный путь до файла, без расширения md
 */
export const saveFile = async (fileFullPath: string, content: string, fileRelativePath: string) => {
  try {
    await window.electronAPI.writeFile(fileFullPath, content);

    const response = await addDocumentationPostFx(`${fileRelativePath}.md`);

    // @ts-ignore
    if (response?.data && 'code' in response.data && response.data.code !== 70039) {
      return response;
    }

    await commitDocumentationPostFx();
    dirtyChanged(false);
  } catch (err) {
    console.warn('Процесс прерван:', err.message);
  }
};
