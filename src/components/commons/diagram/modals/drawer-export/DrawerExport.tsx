import {
  Button as UIKitButton,
  Checkbox as UIKitCheckbox,
  Drawer as UIKitDrawer,
  Form as UIKitForm,
  FormItem as UIKitFormItem,
  NodeSkeleton as UIKitSkeleton,
} from '@axenix/ui-kit';
import { useUnit } from 'effector-react';
import { FC, useState } from 'react';

import type { TDownloadItem } from '@common/types';

import { API_URL } from '@shared/api';
import { GenerateSpecPost200Response } from '@shared/openapi';

import {
  $drawerExport,
  closeDrawerExport,
  fetchExportLinksFx,
} from '@/components/commons/diagram/model/modals-models/drawer-export/DrawerExportModel';
import { downloadFiles } from '@/helpers/download-file';
import { $eventGraph } from '@/models/EventGraphModel';

export const DrawerExport: FC = () => {
  const drawerExport = useUnit($drawerExport);
  const eventGraph = useUnit($eventGraph);
  const { isOpen } = drawerExport;
  const [exportLinks, setExportLinks] = useState<GenerateSpecPost200Response['downloadLinks'] | null>(null);
  const [specsToDownload, setSpecsToDownload] = useState<string[]>([]);

  const handleClose = () => {
    closeDrawerExport();
    setExportLinks(null);
    setSpecsToDownload([]);
  };

  const handleExport = async () => {
    if (!exportLinks) {
      return;
    }
    const downloadItems: TDownloadItem[] = specsToDownload
      .filter(filename => filename in exportLinks)
      .map(serviceName => ({
        filename: `${serviceName}.json`,
        url: `${API_URL}${exportLinks[serviceName]}`,
      }));

    downloadFiles(downloadItems);
  };

  const fetchExportLinks = async (isVisible: boolean) => {
    if (isVisible) {
      fetchExportLinksFx(eventGraph).then(result => {
        setExportLinks(result.downloadLinks);
      });
    }
  };

  const toggleSpecsToDownload = (serviceName: string) => {
    if (specsToDownload.includes(serviceName)) {
      setSpecsToDownload(prevState => prevState.filter(specName => specName !== serviceName));
    } else {
      setSpecsToDownload(prevState => [...prevState, serviceName]);
    }
  };

  return (
    <UIKitDrawer
      width={350}
      isResizable
      isDestroyOnClose
      isOpen={isOpen}
      onClose={handleClose}
      placement="right"
      title="Export"
      customFooter={
        <div className="flex h-[100%] flex-row gap-2 py-2.5">
          <UIKitButton
            type="primary"
            isDisabled={!specsToDownload.length}
            onClick={handleExport}
            style={{ borderRadius: '3px' }}
          >
            Export
          </UIKitButton>
          <UIKitButton type="default" onClick={handleClose} style={{ borderRadius: '3px' }}>
            Cancel
          </UIKitButton>
        </div>
      }
      classNames={{
        // @ts-expect-error 'body' is not in type
        body: 'scrollbar',
      }}
      afterOpenChange={fetchExportLinks}
    >
      <UIKitForm labelAlign="left" layout="vertical">
        <UIKitFormItem label="Services">
          {exportLinks ? (
            <div className="flex w-full flex-col gap-4 overflow-hidden">
              {Object.keys(exportLinks).map(serviceName => (
                <UIKitCheckbox
                  key={serviceName}
                  isChecked={specsToDownload.includes(serviceName)}
                  onChange={() => toggleSpecsToDownload(serviceName)}
                >
                  {serviceName}
                </UIKitCheckbox>
              ))}
            </div>
          ) : (
            <UIKitSkeleton className="h-[100px] w-full" isActive />
          )}
        </UIKitFormItem>
      </UIKitForm>
    </UIKitDrawer>
  );
};
