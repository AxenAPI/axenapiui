import { Tag } from '@axenix/ui-kit';
import { ReactNode } from 'react';

/** Tag с обрезкой текста и тултипом */
export const TruncatedTag = (props: { text: string }): ReactNode => (
  <div
    style={{
      display: 'flex',
      gap: 16,
      flexDirection: 'column',
      maxWidth: 192,
      marginBottom: 4,
    }}
  >
    <Tag showTooltip>{props.text}</Tag>
  </div>
);
