import { Button } from '@axenix/ui-kit';
import { FC } from 'react';

interface YandexViewFooterProps {
  isCapturing: boolean;
  onCancel: () => void;
  onImport: () => void;
}

export const YandexViewFooter: FC<YandexViewFooterProps> = ({ isCapturing, onCancel, onImport }) => (
  <div className="flex gap-2">
    <Button type="primary" onClick={onImport} isLoading={isCapturing} disabled={isCapturing}>
      Import
    </Button>
    <Button onClick={onCancel} disabled={isCapturing}>
      Cancel
    </Button>
  </div>
);
