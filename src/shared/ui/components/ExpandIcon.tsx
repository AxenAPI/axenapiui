import {TraictangleIcon} from '../icons/triangle';

// компонент отображения открывающихся элементов
export const ExpandIcon = ({isOpen}: {isOpen: boolean}) => (
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
