import { useUnit } from 'effector-react';

import { gitIntegrationModel } from '../model/gitIntegrationModel';

export const useGitIntegration = () => {
  const [url, token, isFormValid, isSubmitting] = useUnit([
    gitIntegrationModel.stores.$url,
    gitIntegrationModel.stores.$token,
    gitIntegrationModel.stores.$isFormValid,
    gitIntegrationModel.stores.$isSubmitting,
  ]);

  const [setUrl, setToken] = useUnit([gitIntegrationModel.events.setUrl, gitIntegrationModel.events.setToken]);

  return {
    url,
    token,
    isFormValid,
    isSubmitting,
    setUrl,
    setToken,
  };
};
