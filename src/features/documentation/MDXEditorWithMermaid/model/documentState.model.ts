import { createEvent, createStore } from 'effector';

// Stores for document paths and content
const $fullPath = createStore<string>('');
const $relativePathForMR = createStore<string>('');
const $markdown = createStore<string>('');
const $dirty = createStore<boolean>(false);
const $isLoading = createStore<boolean>(false);
const $internalLink = createStore<string | null>(null);

// Events for updating values
const fullPathChanged = createEvent<string>();
const relativePathForMRChanged = createEvent<string>();
const markdownChanged = createEvent<string>();
const dirtyChanged = createEvent<boolean>();
const loadingChanged = createEvent<boolean>();
const internalLinkClicked = createEvent<string>();

// Event handlers
$fullPath.on(fullPathChanged, (_, fullPath) => fullPath);
$relativePathForMR.on(relativePathForMRChanged, (_, relativePath) => relativePath);
$markdown.on(markdownChanged, (_, markdown) => markdown);
$dirty.on(dirtyChanged, (_, dirty) => dirty);
$isLoading.on(loadingChanged, (_, isLoading) => isLoading);
$internalLink.on(internalLinkClicked, (_, link) => link);

export const documentStateModel = {
  events: {
    fullPathChanged,
    relativePathForMRChanged,
    markdownChanged,
    dirtyChanged,
    loadingChanged,
    internalLinkClicked,
  },
  stores: {
    $fullPath,
    $relativePathForMR,
    $markdown,
    $dirty,
    $isLoading,
    $internalLink,
  },
};
