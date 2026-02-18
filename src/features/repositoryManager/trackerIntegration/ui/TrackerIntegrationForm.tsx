import { FC } from 'react';

import { TrackerType } from '@shared/openapi';

import { useTrackerIntegration } from '../hooks/useTrackerIntegration';

import { KanboardFields } from './KanboardFields';
import { TrackerTypeSelect } from './TrackerTypeSelect';
import { YandexTrackerFields } from './YandexTrackerFields';

export const TrackerIntegrationForm: FC = () => {
  const {
    apiToken,
    baseUrl,
    federationId,
    orgId,
    projectId,
    projectKey,
    projectName,
    setApiToken,
    setBaseUrl,
    setFederationId,
    setOrgId,
    setProjectId,
    setProjectKey,
    setProjectName,
    setTrackerType,
    setUsername,
    trackerType,
    username,
  } = useTrackerIntegration();

  return (
    <div className="flex flex-col gap-4">
      <div className="text-sm font-bold text-gray-700">Task Tracker Integration</div>

      <TrackerTypeSelect value={trackerType} onChange={setTrackerType} />

      {trackerType === TrackerType.YandexTracker && (
        <YandexTrackerFields
          baseUrl={baseUrl}
          federationId={federationId}
          orgId={orgId}
          onBaseUrlChange={setBaseUrl}
          onFederationIdChange={setFederationId}
          onOrgIdChange={setOrgId}
          projectKey={projectKey}
          projectId={projectId}
          projectName={projectName}
          onProjectNameChange={setProjectName}
          onProjectIdChange={setProjectId}
          onProjectKeyChange={setProjectKey}
        />
      )}

      {trackerType === TrackerType.Kanboard && (
        <KanboardFields
          baseUrl={baseUrl}
          apiToken={apiToken}
          onBaseUrlChange={setBaseUrl}
          onApiTokenChange={setApiToken}
          projectId={projectId}
          onProjectIdChange={setProjectId}
          projectName={projectName}
          onProjectNameChange={setProjectName}
          username={username}
          onUsernameChange={setUsername}
        />
      )}
    </div>
  );
};
