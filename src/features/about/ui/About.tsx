import { Modal as UIKitModal } from '@axenix/ui-kit';
import clsx from 'clsx';
import { X } from 'tabler-icons-react';

import { UiKitMenuButton } from '@/components/commons/buttons/UiKitMenuButton';

import { useAbout } from '../hooks/useAbout';

import { AboutContent } from './AboutContent';
import { AboutFooter } from './AboutFooter';

export const About = () => {
  const { isAboutModalOpen, toggleAboutModalOpen } = useAbout();
  return (
    <>
      <UIKitModal
        className={clsx('w-[520px]')}
        closeIcon={<X size={22} />}
        isOpen={isAboutModalOpen}
        onCancel={toggleAboutModalOpen}
        centered
        footer={<AboutFooter />}
      >
        <AboutContent />
      </UIKitModal>
      <UiKitMenuButton onClick={toggleAboutModalOpen} text="About AxenAPI" />
    </>
  );
};
