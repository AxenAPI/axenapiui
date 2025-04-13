import {Button} from '@axenix/ui-kit';
import {FC} from 'react';

interface IUiKitMenuButton {
  text: string;
  onClick?: () => void;
}

export const UiKitMenuButton: FC<IUiKitMenuButton> = ({onClick, text}) => (
  <Button
    onClick={onClick}
    className="h-11 border-0 bg-transparent px-4 py-2 font-normal text-current transition-colors duration-200 hover:text-orange-500 focus:outline-none active:text-orange-600"
  >
    {text}
  </Button>
);
