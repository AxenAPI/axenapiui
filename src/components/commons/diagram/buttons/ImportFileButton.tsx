import { Button, FileInput, NFileInput } from '@axenix/ui-kit';
import { UploadRequestFile } from 'rc-upload/lib/interface';
import { useState } from 'react';
import { FileImport } from 'tabler-icons-react';

import { fetchEventGraphDataFx } from '@/models/EventGraphModel';

export const ImportFileButton = () => {
  const [fileList, setFileList] = useState<NFileInput.TUploadFile[]>([]);

  const handleCustomRequest = ({
    file,
    onSuccess,
  }: {
    file: UploadRequestFile;
    onSuccess?: (body: string, fileOrXhr?: UploadRequestFile) => void;
  }) => {
    if (onSuccess) {
      onSuccess('File added successfully', file);
    }
  };

  const handleOnChange = ({ fileList: newFileList }: NFileInput.TUploadChangeParam) => {
    setFileList([...newFileList]);

    const allFilesSelected = newFileList.every(file => file.status === 'done');

    if (allFilesSelected) {
      fetchEventGraphDataFx({ fileList }).finally(() => {
        setFileList([]);
      });
    }
  };

  return (
    <FileInput
      data-testid="import-file-input"
      accept=".yaml,.yml,.json"
      onChange={handleOnChange}
      customRequest={handleCustomRequest}
      shouldShowUploadList={false}
      fileList={fileList}
      isMultiple
    >
      <Button
        data-testid="import-file-btn"
        key="sixButton"
        icon={<FileImport />}
        isBlock={false}
        isDisabled={false}
        isLoading={false}
        size="middle"
        type="default"
        tooltip="Import"
        placementTooltip="bottomLeft"
      />
    </FileInput>
  );
};
