import { Label, Select as UIKitSelect } from '@axenix/ui-kit';
import { FC } from 'react';

import { TrackerType } from '@shared/openapi';

import { TrackerTypeOption } from '../model/trackerIntegrationModel';

type TrackerTypeSelectProps = {
  value: TrackerTypeOption;
  onChange: (value: TrackerTypeOption) => void;
};

const TRACKER_OPTIONS = [
  { value: '', label: 'None' },
  { value: TrackerType.YandexTracker, label: 'Yandex Tracker' },
  { value: TrackerType.Kanboard, label: 'Kanboard' },
];

export const TrackerTypeSelect: FC<TrackerTypeSelectProps> = ({ onChange, value }) => {
  const handleChange = (selectedValue: string) => {
    onChange(selectedValue === '' ? null : (selectedValue as TrackerType));
  };

  return (
    <div>
      <Label>Tracker Type</Label>
      <UIKitSelect
        className="mt-[10px] min-w-[302px] [&>div]:rounded-[3px]"
        dropdownStyle={{ borderRadius: '3px' }}
        style={{ borderRadius: '3px' }}
        value={value ?? ''}
        onChange={handleChange}
        options={TRACKER_OPTIONS}
        data-testid="tracker-type-select"
      />
    </div>
  );
};
