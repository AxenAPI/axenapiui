import { Input as UIKitInput, Label } from '@axenix/ui-kit';
import { ChangeEvent, FC } from 'react';

type KanboardFieldsProps = {
  baseUrl: string;
  apiToken: string;
  projectId: string;
  projectName: string;
  username: string;
  onBaseUrlChange: (value: string) => void;
  onApiTokenChange: (value: string) => void;
  onProjectIdChange: (value: string) => void;
  onProjectNameChange: (value: string) => void;
  onUsernameChange: (value: string) => void;
};

export const KanboardFields: FC<KanboardFieldsProps> = ({
  apiToken,
  baseUrl,
  onApiTokenChange,
  onBaseUrlChange,
  onProjectIdChange,
  onProjectNameChange,
  onUsernameChange,
  projectId,
  projectName,
  username,
}) => {
  const handleBaseUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    onBaseUrlChange(e.target.value);
  };

  const handleApiTokenChange = (e: ChangeEvent<HTMLInputElement>) => {
    onApiTokenChange(e.target.value);
  };

  const handleProjectIdChange = (e: ChangeEvent<HTMLInputElement>) => {
    onProjectIdChange(e.target.value);
  };

  const handleProjectNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    onProjectNameChange(e.target.value);
  };

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    onUsernameChange(e.target.value);
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
          placeholder="https://kanboard.example.com"
          data-testid="kanboard-base-url-input"
        />
      </div>

      <div>
        <Label>API Token *</Label>
        <UIKitInput
          className="mt-[10px]"
          name="apiToken"
          value={apiToken}
          onChange={handleApiTokenChange}
          placeholder="Enter API Token"
          data-testid="kanboard-api-token-input"
        />
      </div>

      <div>
        <Label>Username *</Label>
        <UIKitInput
          className="mt-[10px]"
          name="username"
          value={username}
          onChange={handleUsernameChange}
          placeholder="Enter User Name"
          data-testid="kanboard-api-token-input"
        />
      </div>

      <div>
        <Label>Project ID *</Label>
        <UIKitInput
          className="mt-2.5"
          name="projectId"
          type="number"
          value={projectId}
          onChange={handleProjectIdChange}
          placeholder="Enter Project ID"
          data-testid="kanboard-project-id-input"
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
          data-testid="kanboard-project-id-input"
        />
      </div>
    </div>
  );
};
