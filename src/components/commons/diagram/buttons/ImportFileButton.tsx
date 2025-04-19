import {Button, FileInput, NFileInput} from '@axenix/ui-kit';
import {useState} from 'react';
import {FileImport} from 'tabler-icons-react';

import {fetchEventGraphDataFx} from '@/models/EventGraphModel';

export const ImportFileButton = () => {
  const [fileList, setFileList] = useState<NFileInput.TUploadFile[]>([]);

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const handleCustomRequest = ({file, onSuccess}: any) => {
    if (onSuccess) {
      onSuccess('File added successfully', file);
    }
  };

  const handleOnChange = ({fileList: newFileList}: NFileInput.TUploadChangeParam) => {
    setFileList([...newFileList]);

    const allFilesSelected = newFileList.every(file => file.status === 'done');

    if (allFilesSelected) {
      fetchEventGraphDataFx({fileList}).finally(() => {
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
      >
        Import
      </Button>
    </FileInput>
  );
};
