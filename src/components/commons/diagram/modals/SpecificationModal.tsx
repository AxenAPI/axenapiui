import {Drawer, NodeSkeleton, Row, Button as UIKitButton, Col} from '@axenix/ui-kit';
import {Editor} from '@monaco-editor/react';
import {AxiosResponse} from 'axios';
import {useUnit} from 'effector-react';
import yaml from 'js-yaml';
import {FC, useEffect, useState} from 'react';
import SwaggerUI from 'swagger-ui-react';

import {RadioButtonGroup} from '@/components/commons/buttons/RadioGroupButton';
import {
  FORMAT_OPTIONS,
  SPECIFICATION_OPTIONS,
  SPECIFICATION_VIEW,
  specificationDataInitialState,
} from '@/components/commons/diagram/modals/constants';
import {
  $specificationModal,
  closeSpecificationModal,
  fetchServiceSpecificationFx,
  updateServiceSpecification,
} from '@/components/commons/diagram/model/modals-models/drawer-specification/SpecificationModalModel';
import {EMPTY_CHAR} from '@/constants/common';
import {$eventGraph, setEventGraph} from '@/models/EventGraphModel';
import {GetServiceSpecificationPost200Response, GetServiceSpecificationPostRequest} from '@/shared/api/event-graph-api';
import 'swagger-ui-react/swagger-ui.css';

type EditorFormat = 'json' | 'yaml';

export const SpecificationModal: FC = () => {
  const editSpecificationModal = useUnit($specificationModal);
  const {isOpen, nodeId} = editSpecificationModal;
  const eventGraph = useUnit($eventGraph);
  const [specificationResponse, setSpecificationResponse] =
    useState<AxiosResponse<GetServiceSpecificationPost200Response>>(specificationDataInitialState);

  const [editedSpecification, setEditedSpecification] = useState<string>(EMPTY_CHAR);
  const [selectedView, setSelectedView] = useState<SPECIFICATION_VIEW>(SPECIFICATION_VIEW.FULL);

  const [editorFormat, setEditorFormat] = useState<EditorFormat>('json');

  const handleSave = () => {
    if (!nodeId) {
      throw new Error('NodeId is missing, cannot edit node.');
    }

    try {
      let jsonSpecification: string;

      if (editorFormat === 'yaml') {
        const parsed = yaml.load(editedSpecification);
        jsonSpecification = JSON.stringify(parsed, null, 2);
      } else {
        jsonSpecification = editedSpecification;
      }

      updateServiceSpecification({
        eventGraph,
        serviceNodeId: specificationResponse.data.serviceNodeId,
        specification: jsonSpecification,
      }).then(result => {
        setEventGraph(result.data);
      });

      closeSpecificationModal();
    } catch (error) {
      throw new Error('Ошибка при сохранении спецификации: неверный формат данных', error);
    }
  };

  const handleClose = () => {
    closeSpecificationModal();
  };

  const handleSpecificationChange = (data: string | undefined) => {
    if (data !== undefined) setEditedSpecification(data);
  };

  const handleTypeSelect = (value: SPECIFICATION_VIEW) => {
    setSelectedView(value);
  };

  // Функция для переключения формата редактора и конвертации данных
  const handleFormatSwitch = (format: EditorFormat) => {
    // если выбран тот же режим — не меняем
    if (format === editorFormat) return;

    try {
      if (format === 'yaml') {
        // текущие данные в JSON — преобразую в YAML
        const parsedJson = JSON.parse(editedSpecification);
        const yamlStr = yaml.dump(parsedJson);
        setEditedSpecification(yamlStr);
        setEditorFormat('yaml');
      } else {
        // текущие данные в YAML — преобразую в JSON
        const parsedYaml = yaml.load(editedSpecification);
        const jsonStr = JSON.stringify(parsedYaml, null, 2);
        setEditedSpecification(jsonStr);
        setEditorFormat('json');
      }
    } catch (error) {
      throw new Error(`Ошибка конвертации между JSON и YAML: ${(error as Error).message}`);
    }
  };

  useEffect(() => {
    if (!eventGraph || !nodeId) {
      return;
    }
    const request: GetServiceSpecificationPostRequest = {serviceNodeId: nodeId, eventGraph};
    fetchServiceSpecificationFx(request).then(result => {
      setSpecificationResponse(result);
      try {
        // Парсим JSON для редактора в json-формате по-умолчанию
        setEditedSpecification(JSON.stringify(JSON.parse(result?.data.specification), null, 2));
        setEditorFormat('json');
      } catch {
        setSpecificationResponse(specificationDataInitialState);
        setEditedSpecification(EMPTY_CHAR);
      }
    });
  }, [eventGraph, nodeId]);

  useEffect(() => {
    if (isOpen) {
      setEditorFormat('json');
      setSelectedView(SPECIFICATION_VIEW.FULL);
      setEditedSpecification(EMPTY_CHAR);
      setSpecificationResponse(specificationDataInitialState);
    }
  }, [isOpen]);

  return (
    <Drawer
      title="Service specification"
      isOpen={isOpen}
      onClose={closeSpecificationModal}
      placement="right"
      size="1500px"
      width={1500}
      customFooter={
        <div className="flex h-[100%] flex-row gap-2 py-2.5">
          <UIKitButton type="primary" onClick={handleSave} style={{borderRadius: '3px'}}>
            Save
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
      <Row wrap={false} className="mb-4 flex justify-between">
        <RadioButtonGroup
          options={FORMAT_OPTIONS}
          value={editorFormat}
          onChange={(val: 'json' | 'yaml') => handleFormatSwitch(val)}
        />
        <RadioButtonGroup options={SPECIFICATION_OPTIONS} value={selectedView} onChange={handleTypeSelect} />
      </Row>

      <Row wrap={false} className="h-full" gutter={16}>
        {[SPECIFICATION_VIEW.EDITOR, SPECIFICATION_VIEW.FULL].includes(selectedView) && (
          <Col flex={selectedView === SPECIFICATION_VIEW.FULL ? '0 0 50%' : '1 1 100%'}>
            <Editor
              key={specificationResponse.data.serviceNodeId + editorFormat}
              loading={<NodeSkeleton className="h-[100px] w-full" isActive />}
              className="h-full min-h-[529px] w-full rounded border border-[#D9D9D9]"
              value={editedSpecification}
              language={editorFormat === 'json' ? 'json' : 'yaml'}
              onChange={handleSpecificationChange}
              options={{
                minimap: {enabled: false},
                stickyScroll: {enabled: false},
                scrollBeyondLastLine: false,
                wordWrap: 'on',
              }}
            />
          </Col>
        )}
        {[SPECIFICATION_VIEW.SWAGGER, SPECIFICATION_VIEW.FULL].includes(selectedView) && (
          <Col flex={selectedView === SPECIFICATION_VIEW.FULL ? '0 0 50%' : '1 1 100%'}>
            <div className="h-full overflow-auto rounded border border-[#D9D9D9]">
              {(() => {
                try {
                  const spec =
                    editorFormat === 'json' ? JSON.parse(editedSpecification) : yaml.load(editedSpecification);
                  return <SwaggerUI spec={spec} />;
                } catch {
                  return <p className="p-4 text-red-500">Неверный формат спецификации</p>;
                }
              })()}
            </div>
          </Col>
        )}
      </Row>
    </Drawer>
  );
};
