import {Icon as UIKitIcon} from '@axenix/ui-kit';
import {IconUserCircle} from '@tabler/icons-react';

export const HeaderButtons = () => (
  <div className="flex items-center gap-16">
    <div data-testid="profile" className="flex h-full min-w-fit items-center gap-2">
      <UIKitIcon icon={<IconUserCircle data-testid="icon-user-circle" className="text-placeholder" />} />
      <span className="text-placeholder">Anonim</span>
    </div>
  </div>
);
