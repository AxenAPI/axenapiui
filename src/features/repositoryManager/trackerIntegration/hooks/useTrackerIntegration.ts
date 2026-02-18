import { useUnit } from 'effector-react';

import { trackerIntegrationModel } from '../model/trackerIntegrationModel';

export const useTrackerIntegration = () => {
  const stories = useUnit({
    trackerType: trackerIntegrationModel.stores.$trackerType,
    baseUrl: trackerIntegrationModel.stores.$baseUrl,
    federationId: trackerIntegrationModel.stores.$federationId,
    orgId: trackerIntegrationModel.stores.$orgId,
    apiToken: trackerIntegrationModel.stores.$apiToken,
    isSubmitting: trackerIntegrationModel.stores.$isSubmitting,
    projectId: trackerIntegrationModel.stores.$projectId,
    projectName: trackerIntegrationModel.stores.$projectName,
    username: trackerIntegrationModel.stores.$username,
    projectKey: trackerIntegrationModel.stores.$projectKey,
  });

  const events = useUnit({
    setTrackerType: trackerIntegrationModel.events.setTrackerType,
    setBaseUrl: trackerIntegrationModel.events.setBaseUrl,
    setFederationId: trackerIntegrationModel.events.setFederationId,
    setOrgId: trackerIntegrationModel.events.setOrgId,
    setApiToken: trackerIntegrationModel.events.setApiToken,
    setProjectId: trackerIntegrationModel.events.setProjectId,
    setProjectName: trackerIntegrationModel.events.setProjectName,
    setUsername: trackerIntegrationModel.events.setUsername,
    setProjectKey: trackerIntegrationModel.events.setProjectKey,
  });

  return { ...stories, ...events };
};
