import { useUnit } from 'effector-react';

import backendInfo from '@shared/openapi/backend-info.json';

import data from '@packageJson';

import { $isAboutModalOpen, toggleIsAboutModalOpen } from '../model/aboutModel';

export const useAbout = () => {
  const { version } = data;
  const { backendVersion, buildDate } = backendInfo;

  const isAboutModalOpen = useUnit($isAboutModalOpen);
  const toggleAboutModalOpen = () => {
    toggleIsAboutModalOpen();
  };

  return {
    isAboutModalOpen,
    toggleAboutModalOpen,
    version,
    backendVersion,
    buildDate,
  };
};
