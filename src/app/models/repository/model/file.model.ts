import { createEffect } from 'effector';

import { ElectronService } from '@shared/electron/api';

export const readFileContentFx = createEffect(async (filePath: string) => {
  try {
    return await ElectronService.readFile(`${filePath}`);
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : 'File reading failed');
  }
});

export const writeFileLocallyFx = createEffect(async ({ content, path }: { path: string; content: string }) => {
  try {
    await ElectronService.writeFile(path, content);
    return { path, content };
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : 'Local file writing failed');
  }
});
