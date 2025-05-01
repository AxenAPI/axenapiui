import {Handle, Position} from '@xyflow/react';
import clsx from 'clsx';

export const GhostNode = () => (
  <div className={clsx('h-[48px] border-none bg-transparent transition-all')}>
    <Handle className="border-none bg-transparent" type="target" position={Position.Left} isConnectable={false} />
    <Handle className="border-none bg-transparent" type="source" position={Position.Left} isConnectable={false} />
  </div>
);
