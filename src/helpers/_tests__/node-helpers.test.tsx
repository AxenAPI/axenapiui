import {Icon as UIKitIcon} from '@axenix/ui-kit';
import {IconServerCog, IconTopologyStar} from '@tabler/icons-react';
import {CircleLetterH} from 'tabler-icons-react';

import {getNodeIcon} from '@/helpers/node-helpers';
import {NodeDTOBrokerTypeEnum, NodeDTOTypeEnum} from '@/shared/api/event-graph-api';
import {Jms, KafkaIcon, RabbitMqIcon} from '@/shared/ui/icons';

describe('/src/helpers/node-helpers.tsx/getNodeIcon', () => {
  test.each([
    {type: NodeDTOTypeEnum.Service, expectedIcon: <UIKitIcon icon={<IconTopologyStar />} size={16} />},
    {type: NodeDTOTypeEnum.Topic, expectedIcon: <UIKitIcon icon={<IconServerCog />} size={16} />},
    {type: NodeDTOTypeEnum.Http, expectedIcon: <UIKitIcon icon={<CircleLetterH />} size={16} />},
    {type: NodeDTOBrokerTypeEnum.Kafka, expectedIcon: <UIKitIcon icon={<KafkaIcon />} size={16} />},
    {type: NodeDTOBrokerTypeEnum.Jms, expectedIcon: <UIKitIcon icon={<Jms />} size={16} />},
    {type: NodeDTOBrokerTypeEnum.Rabbitmq, expectedIcon: <UIKitIcon icon={<RabbitMqIcon />} size={16} />},
  ])('returns correct wrapped icon for $type', ({expectedIcon, type}) => {
    const result = getNodeIcon(type);
    expect(result).toEqual(expectedIcon);
  });

  test('returns default wrapped icon when type is undefined', () => {
    const result = getNodeIcon(undefined);
    const expectedIcon = <UIKitIcon icon={<IconServerCog />} size={16} />;
    expect(result).toEqual(expectedIcon);
  });

  test('returns default wrapped icon when type is null', () => {
    const result = getNodeIcon(null);
    const expectedIcon = <UIKitIcon icon={<IconServerCog />} size={16} />;
    expect(result).toEqual(expectedIcon);
  });

  test('returns default wrapped icon for unknown type', () => {
    const unknownType = 'UNKNOWN_TYPE';
    // @ts-ignore
    const result = getNodeIcon(unknownType);
    const expectedIcon = <UIKitIcon icon={<IconServerCog />} size={16} />;
    expect(result).toEqual(expectedIcon);
  });
});
