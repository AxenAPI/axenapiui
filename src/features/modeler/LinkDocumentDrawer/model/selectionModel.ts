import { combine, createEvent, createStore, sample } from 'effector';

// Events

const initSelection = createEvent<string[]>();
const toggleSelection = createEvent<string>();
const resetSelection = createEvent();

// Stores

const $selectedIds = createStore<Set<string>>(new Set());
const $initialIds = createStore<Set<string>>(new Set());

// Derived stores

const $toAdd = combine(
  $selectedIds,
  $initialIds,
  (selected, initial) => new Set([...selected].filter(id => !initial.has(id)))
);

const $toRemove = combine(
  $selectedIds,
  $initialIds,
  (selected, initial) => new Set([...initial].filter(id => !selected.has(id)))
);

const $hasChanges = combine($toAdd, $toRemove, (toAdd, toRemove) => toAdd.size > 0 || toRemove.size > 0);

// Logic

sample({
  clock: initSelection,
  fn: ids => new Set(ids),
  target: [$selectedIds, $initialIds],
});

sample({
  clock: toggleSelection,
  source: $selectedIds,
  fn: (selected, id) => {
    const newSelected = new Set(selected);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    return newSelected;
  },
  target: $selectedIds,
});

sample({
  clock: resetSelection,
  fn: () => new Set<string>(),
  target: [$selectedIds, $initialIds],
});

// Public api

export const selectionModel = {
  stores: {
    $selectedIds,
    $initialIds,
    $toAdd,
    $toRemove,
    $hasChanges,
  },
  events: {
    initSelection,
    toggleSelection,
    resetSelection,
  },
};
