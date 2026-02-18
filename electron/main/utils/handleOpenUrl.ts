import { shell } from 'electron';

export const handleOpenUrl = (url: string) => shell.openExternal(url);
