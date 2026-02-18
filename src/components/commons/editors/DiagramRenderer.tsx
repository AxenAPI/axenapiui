import { FC } from 'react';

export const DiagramEmpty: FC<{ message: string }> = ({ message }) => <div className="diagram-placard">{message}</div>;

export const DiagramError: FC<{ message: string }> = ({ message }) => (
  <div className="diagram-placard placard__error">{message}</div>
);
