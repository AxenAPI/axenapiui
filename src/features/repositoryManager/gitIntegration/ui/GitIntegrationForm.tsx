import { Input as UIKitInput, Label } from '@axenix/ui-kit';
import { ChangeEvent, FC } from 'react';

import { useGitIntegration } from '../hooks/useGitIntegration';

export const GitIntegrationForm: FC = () => {
  const { setToken, setUrl, token, url } = useGitIntegration();

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleTokenChange = (e: ChangeEvent<HTMLInputElement>) => {
    setToken(e.target.value);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="text-sm font-bold text-gray-700">Git Repository</div>

      <div>
        <Label>Repository URL *</Label>
        <UIKitInput
          className="mt-[10px]"
          name="url"
          value={url}
          onChange={handleUrlChange}
          placeholder="https://gitlab.example.com/project/repo.git"
          data-testid="git-integration-url-input"
        />
      </div>

      <div>
        <Label>Token *</Label>
        <UIKitInput
          className="mt-[10px]"
          name="token"
          value={token}
          onChange={handleTokenChange}
          placeholder="glpat-xxxxxxxxxxxx"
          data-testid="git-integration-token-input"
        />
      </div>
    </div>
  );
};
