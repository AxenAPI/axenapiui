// компонент отображения открывающихся элементов
import { TraictangleIcon } from '@shared/ui/icons/triangle';

export const ExpandIcon = ({ isOpen }: { isOpen: boolean }) => (
  <span
    style={{
      display: 'flex',
      transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
      transition: 'transform 0.3s ease',
    }}
  >
    <TraictangleIcon />
  </span>
);
