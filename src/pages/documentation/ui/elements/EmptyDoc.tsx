import { Button, Empty } from '@axenix/ui-kit';

import { AntEmptyIcon } from '@shared/ui/icons/AntEmptyIcon';

import { reloadApp } from '@/helpers/reload-app';

export const EmptyDoc = () => (
  <div className="flex h-full w-full flex-col items-center justify-center">
    <Empty
      image={<AntEmptyIcon />}
      description=""
      imageStyle={{ width: '13.25rem', height: '10.166rem' }}
      style={{ width: '17.5rem', height: '12.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    />
    <div className="text-center">
      <h1 className="mb-2 text-2xl font-bold">Добро пожаловать!</h1>
      <p className="text-gray-600">Для начала работы создайте новую страницу</p>
    </div>

    <Button className="mt-3" type="primary" onClick={reloadApp}>
      Создать
    </Button>
  </div>
);
