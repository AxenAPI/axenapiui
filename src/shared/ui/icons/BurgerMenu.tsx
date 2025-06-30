import {FC} from 'react';

interface IBurgerIconProps {
  isOpen: boolean;
  onClick: () => void;
}

export const BurgerIcon: FC<IBurgerIconProps> = ({isOpen, onClick}) => (
  <button
    onClick={onClick}
    className="relative h-8 w-8 focus:outline-none"
    aria-label={isOpen ? 'Закрыть меню' : 'Открыть меню'}
  >
    <div className="absolute top-1/2 left-1/2 w-6 -translate-x-1/2 -translate-y-1/2 transform">
      <span
        className={`absolute block h-0.5 w-6 transform rounded-full bg-white transition-all duration-300 ${isOpen ? 'translate-y-0 rotate-45' : '-translate-y-2'}`}
      />

      <span
        className={`absolute block h-0.5 w-6 transform rounded-full bg-white transition-all duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`}
      />

      <span
        className={`absolute block h-0.5 w-6 transform rounded-full bg-white transition-all duration-300 ${isOpen ? 'translate-y-0 -rotate-45' : 'translate-y-2'}`}
      />
    </div>
  </button>
);
