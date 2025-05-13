import {Button as UIKitButton, Drawer as UIKitDrawer} from '@axenix/ui-kit';
import {useUnit} from 'effector-react';
import {useState} from 'react';

import {RadioButtonGroup} from '@/components/commons/buttons/RadioGroupButton';
import {SelectableList} from '@/components/commons/lists/SelectableList';
import {EXPORT_AS_OPTIONS} from '@/constants/menu';
import {EExportTypes} from '@/enums/common';
import {useDownload} from '@/hooks/useDownload';
import {$eventGraph} from '@/models/EventGraphModel';
import {
  $headerModel,
  closeDrawerExportAs,
  generateDocFx,
  generatePdfFx,
  setExportType,
  setSelectedServices,
} from '@/models/HeaderMenuModel';
import {NodeDTOTypeEnum} from '@/shared/api/event-graph-api';

export const DrawerExportAs = () => {
  const {isOpen, selectedServices: serviceIds, selectedType} = useUnit($headerModel);
  const eventGraphDTO = useUnit($eventGraph);
  const {downloadFile, downloadTextAsFile} = useDownload();
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const services = eventGraphDTO.nodes
    .filter(node => node.type === NodeDTOTypeEnum.Service)
    .map(node => ({id: node.id, label: node.name}));
  const buttonDisable = isExporting || eventGraphDTO.nodes.length === 0 || services.length === 0;

  const handleClose = () => {
    closeDrawerExportAs();
  };

  const handleTypeSelect = (value: EExportTypes) => {
    setExportType(value);
  };

  const handleServicesSelect = (value: string[]) => {
    setSelectedServices(value);
  };

  const fetchAndDownload = async () => {
    let response;
    switch (selectedType) {
      case EExportTypes.PDF:
        response = await generatePdfFx({eventGraphDTO, serviceIds});
        break;
      case EExportTypes.DOC:
        response = await generateDocFx({eventGraphDTO, serviceIds});
        break;
      case EExportTypes.JSON:
        return;
      default:
        throw new Error(`Unsupported export type: ${selectedType}`);
    }

    const downloadLinks = response?.data?.downloadLinks;

    if (!downloadLinks || Object.keys(downloadLinks).length === 0) {
      throw new Error('No download links received from server');
    }

    Object.entries(downloadLinks).forEach(([fileName, url]) => {
      downloadFile(url, fileName);
    });
  };

  const handleExport = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      await fetchAndDownload();
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown export error';
      downloadTextAsFile(msg, 'export_error.txt');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <UIKitDrawer
      size="500px"
      width={500}
      isResizable
      isDestroyOnClose
      isOpen={isOpen}
      onClose={handleClose}
      placement="right"
      title="Export as"
      customFooter={
        <div className="flex h-[100%] flex-row gap-2 py-2.5">
          <UIKitButton isDisabled={buttonDisable} type="primary" style={{borderRadius: '3px'}} onClick={handleExport}>
            {isExporting ? 'Export in process' : 'Export'}
          </UIKitButton>
          <UIKitButton type="default" onClick={handleClose} style={{borderRadius: '3px'}}>
            Cancel
          </UIKitButton>
        </div>
      }
      classNames={{
        body: 'scrollbar',
      }}
    >
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          Format
          <RadioButtonGroup options={EXPORT_AS_OPTIONS} defaultValue="JSON" onChange={handleTypeSelect} />
        </div>

        {services.length > 0 ? (
          <div className="flex flex-col gap-2">
            Services
            <SelectableList items={services} onSelectionChange={handleServicesSelect} />
          </div>
        ) : (
          <div>There are no services</div>
        )}
      </div>
    </UIKitDrawer>
  );
};
