import { combine, createEvent, createStore, sample } from 'effector';

import { gitIntegrationModel } from '@features/repositoryManager/gitIntegration';
import { trackerIntegrationModel } from '@features/repositoryManager/trackerIntegration';

import { notificationModel } from '@shared/notification/notification.model';
import { GitRepoDto } from '@shared/openapi';

const NOTIFICATION_KEY = {
  gitIntegrationError: 'gitIntegrationError',
  trackerIntegrationError: 'trackerIntegrationError',
  integrationSuccess: 'integrationSuccess',
};

// ===== Events =====

export const openDrawer = createEvent();
export const openDrawerForEdit = createEvent<GitRepoDto>();
export const closeDrawer = createEvent();
export const submitIntegrations = createEvent();

// ===== Stores =====

export const $isOpen = createStore<boolean>(false);
export const $isEditing = createStore<boolean>(false);
export const $editingRepo = createStore<GitRepoDto | null>(null);

// ===== Logic: Drawer state management =====

sample({
  clock: openDrawer,
  fn: () => true,
  target: $isOpen,
});

sample({
  clock: openDrawer,
  fn: () => false,
  target: $isEditing,
});

sample({
  clock: openDrawer,
  fn: () => null,
  target: $editingRepo,
});

sample({
  clock: openDrawerForEdit,
  fn: () => true,
  target: [$isOpen, $isEditing],
});

sample({
  clock: openDrawerForEdit,
  target: $editingRepo,
});

sample({
  clock: closeDrawer,
  fn: () => false,
  target: [$isOpen, $isEditing],
});

sample({
  clock: closeDrawer,
  fn: () => null,
  target: $editingRepo,
});

// ===== Logic: Load data for editing =====

// Load git repo data into gitIntegration form
sample({
  clock: openDrawerForEdit,
  target: gitIntegrationModel.events.loadGitRepo,
});

// Fetch tracker settings when editing
sample({
  clock: openDrawerForEdit,
  filter: repo => repo.id !== undefined,
  fn: repo => repo.id as string,
  target: trackerIntegrationModel.api.fetchTrackerSettingsApi,
});

// Load fetched tracker settings into form
sample({
  clock: trackerIntegrationModel.api.fetchTrackerSettingsApi.doneData,
  target: trackerIntegrationModel.events.loadTrackerSettings,
});

// Reset forms on open new
sample({
  clock: openDrawer,
  target: [gitIntegrationModel.events.resetForm, trackerIntegrationModel.events.resetForm],
});

// Reset forms on close
sample({
  clock: closeDrawer,
  target: [gitIntegrationModel.events.resetForm, trackerIntegrationModel.events.resetForm],
});

// ===== Logic: Submit flow =====

// Step 1: Submit triggers git save
sample({
  clock: submitIntegrations,
  target: gitIntegrationModel.events.submitForm,
});

// Step 2: After git save succeeds, save tracker settings if tracker type is selected
sample({
  clock: gitIntegrationModel.api.saveGitRepoFx.doneData,
  source: trackerIntegrationModel.stores.$formData,
  filter: (formData, gitRepo) => Boolean(formData.trackerType) && Boolean(gitRepo.id),
  fn: (formData, gitRepo) => ({
    repositoryId: gitRepo.id as string,
    data: formData,
  }),
  target: trackerIntegrationModel.api.saveTrackerSettingsApi,
});

// Step 2 (alternative): If tracker type was set but now is null, delete tracker settings (only when editing)
sample({
  clock: gitIntegrationModel.api.saveGitRepoFx.doneData,
  source: {
    formData: trackerIntegrationModel.stores.$formData,
    previousType: trackerIntegrationModel.stores.$previousTrackerType,
    isEditing: $isEditing,
  },
  filter: ({ formData, isEditing, previousType }) =>
    isEditing && formData.trackerType === null && previousType !== null,
  fn: (_, gitRepo) => gitRepo.id as string,
  target: trackerIntegrationModel.api.deleteTrackerSettingsApi,
});

// Step 3: Show success notifications and close drawer

// Show error notification when git save fails
sample({
  clock: gitIntegrationModel.api.saveGitRepoFx.failData,
  fn: error => ({
    key: NOTIFICATION_KEY.gitIntegrationError,
    message: error?.message || 'Failed to save repository',
  }),
  target: notificationModel.events.showError,
});

// Show error notification when tracker save fails
sample({
  clock: trackerIntegrationModel.api.saveTrackerSettingsApi.failData,
  fn: error => ({
    key: NOTIFICATION_KEY.trackerIntegrationError,
    message: error?.message || 'Failed to save tracker settings',
  }),
  target: notificationModel.events.showError,
});

// Show success notification when git save succeeds and no tracker settings to save/delete
sample({
  clock: gitIntegrationModel.api.saveGitRepoFx.doneData,
  source: {
    formData: trackerIntegrationModel.stores.$formData,
    previousType: trackerIntegrationModel.stores.$previousTrackerType,
    isEditing: $isEditing,
  },
  filter: ({ formData, isEditing, previousType }) => {
    const needsSaveTracker = formData.trackerType !== null;
    const needsDeleteTracker = isEditing && formData.trackerType === null && previousType !== null;
    return !needsSaveTracker && !needsDeleteTracker;
  },
  fn: ({ isEditing }) => ({
    key: NOTIFICATION_KEY.integrationSuccess,
    message: isEditing ? 'Repository updated successfully' : 'Repository created successfully',
  }),
  target: [notificationModel.events.showSuccess, closeDrawer],
});

// Show success notification after tracker settings saved or deleted
sample({
  clock: [
    trackerIntegrationModel.api.saveTrackerSettingsApi.done,
    trackerIntegrationModel.api.deleteTrackerSettingsApi.done,
  ],
  source: $isEditing,
  fn: isEditing => ({
    key: NOTIFICATION_KEY.integrationSuccess,
    message: isEditing ? 'Repository updated successfully' : 'Repository created successfully',
  }),
  target: [notificationModel.events.showSuccess, closeDrawer],
});

// ===== Derived stores =====

export const $isSubmitting = combine(
  [gitIntegrationModel.stores.$isSubmitting, trackerIntegrationModel.stores.$isSubmitting],
  ([gitSubmitting, trackerSubmitting]) => gitSubmitting || trackerSubmitting
);

export const $canSubmit = combine(
  [gitIntegrationModel.stores.$isFormValid, $isSubmitting],
  ([isValid, isSubmitting]) => isValid && !isSubmitting
);

// ===== Public API =====

export const integrationsModel = {
  stores: {
    $isOpen,
    $isEditing,
    $editingRepo,
    $isSubmitting,
    $canSubmit,
  },
  events: {
    openDrawer,
    openDrawerForEdit,
    closeDrawer,
    submitIntegrations,
  },
  api: {
    saveGitRepoFx: gitIntegrationModel.api.saveGitRepoFx,
  },
};
