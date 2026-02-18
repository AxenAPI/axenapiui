import { Icon as UIKitIcon } from '@axenix/ui-kit';
import { IconServerCog, IconTopologyStar } from '@tabler/icons-react';
import { CircleLetterH } from 'tabler-icons-react';

import { NodeDTOBrokerTypeEnum, NodeDTOTypeEnum } from '@shared/openapi';
import { Jms, KafkaIcon, RabbitMqIcon } from '@shared/ui/icons';

import { getNodeIcon } from '@/helpers/node-helpers';

describe('/src/helpers/node-helpers.tsx/getNodeIcon', () => {
  test.each([
    { type: NodeDTOTypeEnum.Service, expectedIcon: <UIKitIcon icon={<IconTopologyStar />} size={16} /> },
    { type: NodeDTOTypeEnum.Topic, expectedIcon: <UIKitIcon icon={<IconServerCog />} size={16} /> },
    { type: NodeDTOTypeEnum.Http, expectedIcon: <UIKitIcon icon={<CircleLetterH />} size={16} /> },
    { type: NodeDTOBrokerTypeEnum.Kafka, expectedIcon: <UIKitIcon icon={<KafkaIcon />} size={16} /> },
    { type: NodeDTOBrokerTypeEnum.Jms, expectedIcon: <UIKitIcon icon={<Jms />} size={16} /> },
    { type: NodeDTOBrokerTypeEnum.Rabbitmq, expectedIcon: <UIKitIcon icon={<RabbitMqIcon />} size={16} /> },
  ])('returns correct wrapped icon for $type', ({ expectedIcon, type }) => {
    const result = getNodeIcon(type);
    expect(result).toEqual(expectedIcon);
  });

  test('returns default wrapped icon for unknown type', () => {
    const unknownType = 'UNKNOWN_TYPE';
    // @ts-expect-error Testing default case with an unknown type
    const result = getNodeIcon(unknownType);
    const expectedIcon = <UIKitIcon icon={<IconServerCog />} size={16} />;
    expect(result).toEqual(expectedIcon);
  });
});
