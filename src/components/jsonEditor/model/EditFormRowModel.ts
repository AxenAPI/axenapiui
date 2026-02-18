import { createEvent, createStore, sample } from 'effector';

import { TSchema, TSchemaObject } from '@/types/common';

type TDrawerStore = {
  isOpen: boolean;
};

type TDrawerData = Partial<TSchemaObject> & {
  property?: string;
  type?: string;
  onSave?: (formData: Record<string, string | undefined | boolean | unknown>) => void;
  items?: TSchema;
};

// Events
export const toggleDrawer = createEvent();
export const saveDrawer = createEvent();
export const passData = createEvent<TDrawerData>();
export const setSubTypeValue = createEvent<string>();

// Stores
export const $isDrawerOpen = createStore<TDrawerStore>({ isOpen: false });
export const $drawerData = createStore<TDrawerData>({});
export const $subTypeValue = createStore('');

sample({
  clock: $drawerData,
  filter: data => !!data.items,
  fn: data => (data?.items as TSchemaObject)?.type || '',
  target: $subTypeValue,
});

sample({
  clock: toggleDrawer,
  source: $isDrawerOpen,
  fn: store => ({ isOpen: !store.isOpen }),
  target: [$isDrawerOpen],
});

sample({
  clock: passData,
  target: [$drawerData],
});

sample({
  clock: setSubTypeValue,
  target: $subTypeValue,
});
