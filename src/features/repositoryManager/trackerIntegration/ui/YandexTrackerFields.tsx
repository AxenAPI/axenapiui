import { Input as UIKitInput, Label } from '@axenix/ui-kit';
import { ChangeEvent, FC } from 'react';

type YandexTrackerFieldsProps = {
  baseUrl: string;
  federationId: string;
  orgId: string;
  projectId: string;
  projectName: string;
  projectKey: string;
  onBaseUrlChange: (value: string) => void;
  onFederationIdChange: (value: string) => void;
  onOrgIdChange: (value: string) => void;
  onProjectIdChange: (value: string) => void;
  onProjectNameChange: (value: string) => void;
  onProjectKeyChange: (value: string) => void;
};

export const YandexTrackerFields: FC<YandexTrackerFieldsProps> = ({
  baseUrl,
  federationId,
  onBaseUrlChange,
  onFederationIdChange,
  onOrgIdChange,
  onProjectIdChange,
  onProjectKeyChange,
  onProjectNameChange,
  orgId,
  projectId,
  projectKey,
  projectName,
}) => {
  const handleBaseUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    onBaseUrlChange(e.target.value);
  };

  const handleFederationIdChange = (e: ChangeEvent<HTMLInputElement>) => {
    onFederationIdChange(e.target.value);
  };

  const handleOrgIdChange = (e: ChangeEvent<HTMLInputElement>) => {
    onOrgIdChange(e.target.value);
  };

  const handleProjectIdChange = (e: ChangeEvent<HTMLInputElement>) => {
    onProjectIdChange(e.target.value);
  };

  const handleProjectNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    onProjectNameChange(e.target.value);
  };

  const handleProjectKeyChange = (e: ChangeEvent<HTMLInputElement>) => {
    onProjectKeyChange(e.target.value);
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Label>Base URL *</Label>
        <UIKitInput
          className="mt-[10px]"
          name="baseUrl"
          value={baseUrl}
          onChange={handleBaseUrlChange}
          placeholder="https://tracker.yandex.ru"
          data-testid="yandex-tracker-base-url-input"
        />
      </div>

      <div>
        <Label>Federation ID</Label>
        <UIKitInput
          className="mt-[10px]"
          name="federationId"
          value={federationId}
          onChange={handleFederationIdChange}
          placeholder="Enter Federation ID"
          data-testid="yandex-tracker-federation-id-input"
        />
      </div>

      <div>
        <Label>Organization ID *</Label>
        <UIKitInput
          className="mt-[10px]"
          name="orgId"
          value={orgId}
          onChange={handleOrgIdChange}
          placeholder="Enter Organization ID"
          data-testid="yandex-tracker-org-id-input"
        />
      </div>

      <div>
        <Label>Project Key *</Label>
        <UIKitInput
          className="mt-2.5"
          name="projectKey"
          type="string"
          value={projectKey}
          onChange={handleProjectKeyChange}
          placeholder="Enter Project ID"
          data-testid="yandex-tracker-org-id-input"
        />
      </div>

      <div>
        <Label>Project ID *</Label>
        <UIKitInput
          className="mt-2.5"
          name="projectId"
          type="string"
          value={projectId}
          onChange={handleProjectIdChange}
          placeholder="Enter Project ID"
          data-testid="yandex-tracker-org-id-input"
        />
      </div>

      <div>
        <Label>Project Name</Label>
        <UIKitInput
          className="mt-2.5"
          name="projectName"
          type="string"
          value={projectName}
          onChange={handleProjectNameChange}
          placeholder="Enter Project ID"
          data-testid="yandex-tracker-org-id-input"
        />
      </div>
    </div>
  );
};
