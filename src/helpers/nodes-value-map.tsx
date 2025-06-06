import {IconServerCog, IconTopologyStar} from '@tabler/icons-react';
import {JSX} from 'react';
import {ArrowsSplit, BracketsContain, CircleLetterH} from 'tabler-icons-react';

import {Jms, KafkaIcon, RabbitMqIcon} from '@/shared/ui/icons';

export const IconMap: {[key: string]: JSX.Element} = {
  SERVICE: <IconTopologyStar />,
  TOPIC: <IconServerCog />,
  HTTP: <CircleLetterH />,
  LINK: <ArrowsSplit />,
  EVENTS: <BracketsContain />,
  KAFKA: <KafkaIcon />,
  JMS: <Jms />,
  RABBITMQ: <RabbitMqIcon />,
};

export const NodeColorMap: {[key: string]: string} = {
  SERVICE: 'border-colorful-green-border',
  TOPIC: 'border-colorful-blue-border',
  HTTP: 'border-colorful-purple-border',
};

export const NodeSelectedColorMap: {[key: string]: string} = {
  SERVICE: 'bg-colorful-green-bg',
  TOPIC: 'bg-colorful-blue-bg',
  HTTP: 'bg-colorful-purple-bg',
};
