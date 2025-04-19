import {MultipleSelect as UIKitMultipleSelect} from '@axenix/ui-kit';
import {useUnit} from 'effector-react';
import {FC} from 'react';

import {$filterTags, setTags} from '@/components/commons/diagram/model/FilterTagsModel';
import {SimpleValues} from '@/helpers/SimpleValues';
import {$eventGraph} from '@/models/EventGraphModel';

const NotFoundContentFilterStub = () => (
  <div className="flex flex-col">
    <p className="text-black opacity-[.88]">No tags found</p>
    <p>You can create tags in event editing</p>
  </div>
);

export const FilterByTag: FC = () => {
  const eventGraph = useUnit($eventGraph);
  const filterTags = useUnit($filterTags);

  const options = eventGraph && eventGraph.tags ? new SimpleValues(...eventGraph.tags) : [];

  return (
    <UIKitMultipleSelect
      className="max-h-[32px] max-w-[320px] min-w-[320px] [&>div]:rounded-[3px]"
      notFoundContent={<NotFoundContentFilterStub />}
      dropdownStyle={{borderRadius: '3px'}}
      isAllowClear
      defaultValue={[]}
      maxTagTextLength={8}
      maxTagCount={2}
      mode="multiple"
      placeholder="Filter"
      style={{borderRadius: '3px '}}
      onSelect={() => {}}
      options={options}
      onChange={setTags}
      value={filterTags}
    />
  );
};
