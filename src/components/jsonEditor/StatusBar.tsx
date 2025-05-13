import {FC} from 'react';
import {AlertCircle, AlertTriangle, InfoCircle} from 'tabler-icons-react';

// TODO доделать копмонент, как будет функционал
export const StatusBar: FC = () => (
  <div className="mr-0 flex items-center gap-2 rounded-sm border-2 border-[#D9D9D9] px-4 py-2 text-sm">
    <AlertCircle size={14} color="#FF4D4F" />
    0
    <AlertTriangle size={15} color="#FAAD14" />
    0
    <InfoCircle size={14} color="#4096FF" />0
  </div>
);
