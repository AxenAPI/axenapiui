import { Button as UIKitButton, Collapse, Drawer } from '@axenix/ui-kit';
import { useUnit } from 'effector-react';
import { ChangeEvent, FC, useEffect, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import {
  HttpContentBody,
  HttpContentBodyDefaultFormatEnum,
  HttpContentDTO,
  HttpContentTypeEnum,
  HttpParameterDTO,
  HttpParameterTypeEnum,
  HttpStatusCodeEnum,
  NodeDTO,
  NodeDTOMethodTypeEnum,
  NodeDTOTypeEnum,
} from '@shared/openapi';

import { EMPTY_ARRAY, EMPTY_CHAR } from '@/constants/common';
import { $eventGraph, editNode } from '@/models/EventGraphModel';

import {
  $availableHttpContentTypes,
  $editHttpNodeModal,
  $selectedContentType,
  closeEditHttpNodeModal,
} from '../model/modals-models/edit-http-node-modal/EditHttpNodeModalModel';

import { EParamsType, TargetType } from './constants';
import { General } from './EditHttpNodeSection/General';
import { Request } from './EditHttpNodeSection/Request';
import { Response } from './EditHttpNodeSection/Response';
import { NodeFormData, nodeToFormData } from './lib/nodeToFormData';

const makeDefaultBody = (
  mediaType: HttpContentTypeEnum,
  description: string,
  format: HttpContentBodyDefaultFormatEnum = HttpContentBodyDefaultFormatEnum.Json
): HttpContentBody => ({ type: mediaType, description, format }) as unknown as HttpContentBody;

const makeJsonBody = (eventId: string): HttpContentBody =>
  ({ type: HttpContentTypeEnum.ApplicationJson, eventId }) as unknown as HttpContentBody;

const makeMultipartBody = (eventId: string, files: Record<string, string>): HttpContentBody =>
  ({ type: HttpContentTypeEnum.MultipartFormData, eventId, files }) as unknown as HttpContentBody;

export const EditHttpNodeModal: FC = () => {
  const editHttpNodeModal = useUnit($editHttpNodeModal);
  const { isOpen, nodeId } = editHttpNodeModal;
  const eventGraph = useUnit($eventGraph);
  const [nodeData, setNodeData] = useState<NodeFormData>({
    id: '',
    httpParameters: {
      pathParameters: EMPTY_ARRAY,
      queryParameters: EMPTY_ARRAY,
      headerParameters: EMPTY_ARRAY,
    },
    httpRequestBody: {
      content: EMPTY_ARRAY,
    },
    httpResponses: EMPTY_ARRAY,
    name: '',
    belongsToGraph: EMPTY_ARRAY,
    type: NodeDTOTypeEnum.Http,
    nodeDescription: '',
    nodeUrl: '',
    requestBody: '',
    responseBody: '',
    methodType: NodeDTOMethodTypeEnum.Get,
  });

  const selectedContentType = useUnit($selectedContentType);

  const selectedContent = nodeData?.httpRequestBody?.content?.find(c => c.mediaType === selectedContentType);

  const jsonEditorValue = (() => {
    const b = selectedContent?.body as HttpContentBody | undefined;
    return b && 'description' in (b as object)
      ? (b as Extract<HttpContentBody, { description: string }>).description
      : '';
  })();

  const isValidJSON = (str: string) => {
    try {
      JSON.parse(str);
      return true;
    } catch {
      return false;
    }
  };

  const updateRequestContentBody = (mediaType: HttpContentTypeEnum, description: string) => {
    setNodeData(prev => {
      const hasContent = prev.httpRequestBody?.content?.length;
      const exists = hasContent && prev.httpRequestBody!.content!.some(c => c.mediaType === mediaType);
      const updatedContent = hasContent
        ? prev.httpRequestBody!.content!.map(content =>
            content.mediaType === mediaType ? { ...content, body: makeDefaultBody(mediaType, description) } : content
          )
        : [];

      const finalContent = exists
        ? updatedContent
        : ([...updatedContent, { mediaType, body: makeDefaultBody(mediaType, description) }] as HttpContentDTO[]);

      return {
        ...prev,
        httpRequestBody: {
          ...(prev.httpRequestBody ?? {}),
          content: finalContent,
        },
      };
    });
  };

  const updateRequestContentEventId = (mediaType: HttpContentTypeEnum, eventId: string) => {
    setNodeData(prev => {
      const hasContent = prev.httpRequestBody?.content?.length;
      const exists = hasContent && prev.httpRequestBody!.content!.some(c => c.mediaType === mediaType);
      const updatedContent = hasContent
        ? prev.httpRequestBody!.content!.map(content =>
            content.mediaType === mediaType ? { ...content, body: makeJsonBody(eventId) } : content
          )
        : [];

      const finalContent = exists
        ? updatedContent
        : ([...updatedContent, { mediaType, body: makeJsonBody(eventId) }] as HttpContentDTO[]);

      return {
        ...prev,
        httpRequestBody: {
          ...(prev.httpRequestBody ?? {}),
          content: finalContent,
        },
      };
    });
  };

  const updateResponseContentEventId = (statusCode: HttpStatusCodeEnum, eventId: string) => {
    setNodeData(prev => {
      const updatedResponses = (prev.httpResponses ?? EMPTY_ARRAY).map(response => {
        if (response.statusCode === statusCode) {
          const updatedContent = response.content?.length
            ? response.content.map((content, idx) => {
                // Обновляем eventId только у первого элемента (или у всех)
                if (idx === 0) {
                  return { ...content, eventId };
                }
                return content;
              })
            : [{ eventId, mediaType: HttpContentTypeEnum.ApplicationJson }]; // если content пустой, создаём с eventId

          return { ...response, content: updatedContent };
        }
        return response;
      });

      return {
        ...prev,
        httpResponses: updatedResponses,
      };
    });
  };

  const addHeaderToResponse = (statusCode: HttpStatusCodeEnum) => {
    setNodeData(prev => {
      const updatedResponses = (prev.httpResponses ?? EMPTY_ARRAY).map(resp => {
        if (resp.statusCode === statusCode) {
          return {
            ...resp,
            headers: [
              ...(resp.headers ?? EMPTY_ARRAY),
              {
                key: uuidv4(),
                name: EMPTY_CHAR,
                type: HttpParameterTypeEnum.String,
                description: EMPTY_CHAR,
                required: false,
              },
            ],
          };
        }
        return resp;
      });
      return {
        ...prev,
        httpResponses: updatedResponses,
      };
    });
  };

  const deleteHeaderFromResponse = (statusCode: HttpStatusCodeEnum, headerKey: string) => {
    setNodeData(prev => {
      const updatedResponses = (prev.httpResponses ?? EMPTY_ARRAY).map(resp => {
        if (resp.statusCode === statusCode) {
          return {
            ...resp,
            headers: (resp.headers ?? EMPTY_ARRAY).filter(h => h.key !== headerKey),
          };
        }
        return resp;
      });
      return {
        ...prev,
        httpResponses: updatedResponses,
      };
    });
  };

  const updateHeaderValueInResponse = (
    statusCode: HttpStatusCodeEnum,
    headerKey: string,
    field: keyof HttpParameterDTO,
    value: string | boolean
  ) => {
    setNodeData(prev => {
      const updatedResponses = (prev.httpResponses ?? EMPTY_ARRAY).map(resp => {
        if (resp.statusCode === statusCode) {
          const updatedHeaders = (resp.headers ?? EMPTY_ARRAY).map(h =>
            h.key === headerKey ? { ...h, [field]: value } : h
          );
          return { ...resp, headers: updatedHeaders };
        }
        return resp;
      });
      return { ...prev, httpResponses: updatedResponses };
    });
  };

  const addParameters = (paramType: EParamsType) => {
    const paramKeyMap: Record<EParamsType, keyof NodeFormData['httpParameters']> = {
      [EParamsType.PATH]: 'pathParameters',
      [EParamsType.QUERY]: 'queryParameters',
      [EParamsType.HEADERS]: 'headerParameters',
    };

    const key = paramKeyMap[paramType];

    setNodeData(prev => ({
      ...prev,
      httpParameters: {
        ...prev.httpParameters,
        [key]: [
          ...(prev.httpParameters?.[key] ?? EMPTY_ARRAY),
          {
            key: uuidv4(),
            name: EMPTY_CHAR,
            type: 'string',
            description: EMPTY_CHAR,
            required: false,
          },
        ],
      },
    }));
  };

  const deleteParameters = (id: string, paramType: EParamsType) => {
    const paramKeyMap: Record<EParamsType, keyof NodeFormData['httpParameters']> = {
      [EParamsType.PATH]: 'pathParameters',
      [EParamsType.QUERY]: 'queryParameters',
      [EParamsType.HEADERS]: 'headerParameters',
    };

    const key = paramKeyMap[paramType];

    setNodeData(prev => ({
      ...prev,
      httpParameters: {
        ...prev.httpParameters,
        [key]: (prev.httpParameters?.[key] ?? EMPTY_ARRAY).filter(param => param.key !== id),
      },
    }));
  };

  // Добавление тегов типа или статус кода
  const addContentType = (newVal: HttpContentTypeEnum | HttpStatusCodeEnum, target: TargetType = 'request') => {
    if (target === 'request') {
      setNodeData(prev => ({
        ...prev,
        httpRequestBody: {
          ...prev.httpRequestBody,
          content: [...(prev.httpRequestBody?.content ?? EMPTY_ARRAY), { mediaType: newVal as HttpContentTypeEnum }],
        },
      }));
    }

    if (target === 'response') {
      setNodeData(prev => ({
        ...prev,
        httpResponses: [
          ...(prev.httpResponses || EMPTY_ARRAY),
          {
            statusCode: newVal as HttpStatusCodeEnum,
            description: EMPTY_CHAR,
            headers: EMPTY_ARRAY,
          },
        ],
      }));
    }
  };

  // Удаление тегов типа или статус кода
  const removeContentType = (valueToRemove: string, target: TargetType = 'request') => {
    if (target === 'request') {
      setNodeData(prev => ({
        ...prev,
        httpRequestBody: {
          ...prev.httpRequestBody,
          content: (prev.httpRequestBody?.content ?? EMPTY_ARRAY).filter(c => c.mediaType !== valueToRemove),
        },
      }));
    }

    if (target === 'response') {
      setNodeData(prev => ({
        ...prev,
        httpResponses: (prev.httpResponses ?? EMPTY_ARRAY).filter(r => r.statusCode !== valueToRemove),
      }));
    }
  };

  useEffect(() => {
    if (isOpen && eventGraph.nodes) {
      const node = eventGraph.nodes.find(n => n.id === nodeId);
      if (node) {
        setNodeData(nodeToFormData(node));
      }
    }
  }, [isOpen, eventGraph.nodes, nodeId]);

  const handleChange = (field: keyof NodeDTO) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string) => {
    if (typeof e === 'string') {
      setNodeData({ ...nodeData, [field]: e });
    } else {
      setNodeData({ ...nodeData, [field]: e.target.value });
    }
  };
  const handleHttpRequestBodyDescriptionChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string) => {
    const value = typeof e === 'string' ? e : e.target.value;

    setNodeData(prev => ({
      ...prev,
      httpRequestBody: {
        ...prev.httpRequestBody,
        description: value,
      },
    }));
  };

  const updateParameterValue = (
    paramType: EParamsType,
    key: string,
    field: keyof HttpParameterDTO,
    value: string | boolean
  ) => {
    const paramKeyMap: Record<EParamsType, keyof NodeFormData['httpParameters']> = {
      [EParamsType.PATH]: 'pathParameters',
      [EParamsType.QUERY]: 'queryParameters',
      [EParamsType.HEADERS]: 'headerParameters',
    };

    const keyName = paramKeyMap[paramType];

    setNodeData(prev => {
      const currentParams = prev.httpParameters?.[keyName] ?? EMPTY_ARRAY;

      const updatedParams = currentParams.map(param => (param.key === key ? { ...param, [field]: value } : param));

      return {
        ...prev,
        httpParameters: {
          ...prev.httpParameters,
          [keyName]: updatedParams,
        },
      };
    });
  };

  // multipart/form-data helpers
  const updateRequestMultipartEventId = (mediaType: HttpContentTypeEnum, eventId: string) => {
    setNodeData(prev => {
      const hasContent = prev.httpRequestBody?.content?.length;
      const exists = hasContent && prev.httpRequestBody!.content!.some(c => c.mediaType === mediaType);
      const updatedContent = hasContent
        ? prev.httpRequestBody!.content!.map(content => {
            if (content.mediaType !== mediaType) return content;
            const body = content.body as HttpContentBody | undefined;
            const files =
              body && 'files' in (body as object)
                ? (body as Extract<HttpContentBody, { files: Record<string, string> }>).files
                : {};
            return { ...content, body: makeMultipartBody(eventId, files) };
          })
        : [];

      const finalContent = exists
        ? updatedContent
        : ([...updatedContent, { mediaType, body: makeMultipartBody(eventId, {}) }] as HttpContentDTO[]);

      return {
        ...prev,
        httpRequestBody: {
          ...(prev.httpRequestBody ?? {}),
          content: finalContent,
        },
      };
    });
  };

  const addMultipartFileField = (mediaType: HttpContentTypeEnum) => {
    setNodeData(prev => {
      const content = prev.httpRequestBody?.content ?? [];
      const idx = content.findIndex(c => c.mediaType === mediaType);
      const current = idx >= 0 ? content[idx] : undefined;
      const body = current?.body as HttpContentBody | undefined;
      const currentFiles: Record<string, string> =
        body && 'files' in (body as object)
          ? (body as Extract<HttpContentBody, { files: Record<string, string> }>).files
          : {};
      // generate unique key
      let i = Object.keys(currentFiles).length + 1;
      let key = `file${i}`;
      while (currentFiles[key] !== undefined) {
        i += 1;
        key = `file${i}`;
      }
      const newFiles = { ...currentFiles, [key]: 'single' };
      const evId =
        body && 'eventId' in (body as object) ? (body as Extract<HttpContentBody, { eventId: string }>).eventId : '';
      const newContentItem: HttpContentDTO = {
        mediaType,
        body: makeMultipartBody(evId, newFiles),
      };
      const newContent = [...content];
      if (idx >= 0) newContent[idx] = newContentItem;
      else newContent.push(newContentItem);
      return {
        ...prev,
        httpRequestBody: { ...(prev.httpRequestBody ?? {}), content: newContent },
      };
    });
  };

  const updateMultipartFileFieldType = (mediaType: HttpContentTypeEnum, name: string, value: 'single' | 'list') => {
    setNodeData(prev => {
      const content = prev.httpRequestBody?.content ?? [];
      const idx = content.findIndex(c => c.mediaType === mediaType);
      if (idx < 0) return prev;
      const current = content[idx];
      const body = current.body as HttpContentBody | undefined;
      const files: Record<string, string> = {
        ...(body && 'files' in (body as object)
          ? (body as Extract<HttpContentBody, { files: Record<string, string> }>).files
          : {}),
      };
      files[name] = value;
      const evId =
        body && 'eventId' in (body as object) ? (body as Extract<HttpContentBody, { eventId: string }>).eventId : '';
      const newContent = [...content];
      newContent[idx] = {
        ...current,
        body: makeMultipartBody(evId, files),
      };
      return { ...prev, httpRequestBody: { ...(prev.httpRequestBody ?? {}), content: newContent } };
    });
  };

  const renameMultipartFileField = (mediaType: HttpContentTypeEnum, oldName: string, newName: string) => {
    setNodeData(prev => {
      const content = prev.httpRequestBody?.content ?? [];
      const idx = content.findIndex(c => c.mediaType === mediaType);
      if (idx < 0 || !newName) return prev;
      const current = content[idx];
      const body = current.body as HttpContentBody | undefined;
      const files: Record<string, string> = {
        ...(body && 'files' in (body as object)
          ? (body as Extract<HttpContentBody, { files: Record<string, string> }>).files
          : {}),
      };
      if (oldName === newName) return prev;
      if (files[newName] !== undefined) return prev; // prevent overwrite
      const value = files[oldName];
      delete files[oldName];
      files[newName] = value ?? 'single';
      const newContent = [...content];
      const evId =
        body && 'eventId' in (body as object) ? (body as Extract<HttpContentBody, { eventId: string }>).eventId : '';
      newContent[idx] = {
        ...current,
        body: makeMultipartBody(evId, files),
      };
      return { ...prev, httpRequestBody: { ...(prev.httpRequestBody ?? {}), content: newContent } };
    });
  };

  const deleteMultipartFileField = (mediaType: HttpContentTypeEnum, name: string) => {
    setNodeData(prev => {
      const content = prev.httpRequestBody?.content ?? [];
      const idx = content.findIndex(c => c.mediaType === mediaType);
      if (idx < 0) return prev;
      const current = content[idx];
      const body = current.body as HttpContentBody | undefined;
      const files: Record<string, string> = {
        ...(body && 'files' in (body as object)
          ? (body as Extract<HttpContentBody, { files: Record<string, string> }>).files
          : {}),
      };
      delete files[name];
      const evId =
        body && 'eventId' in (body as object) ? (body as Extract<HttpContentBody, { eventId: string }>).eventId : '';
      const newContent = [...content];
      newContent[idx] = {
        ...current,
        body: makeMultipartBody(evId, files),
      };
      return { ...prev, httpRequestBody: { ...(prev.httpRequestBody ?? {}), content: newContent } };
    });
  };

  const availableContentTypes = useUnit($availableHttpContentTypes);
  const selectedTypeInfo = useMemo(
    () => availableContentTypes.find(item => item.type === selectedContentType),
    [availableContentTypes, selectedContentType]
  );

  const handleSave = () => {
    const cleanParams = (params?: HttpParameterDTO[]) =>
      (params ?? EMPTY_ARRAY).filter(p => (p?.name ?? '').trim().length > 0);

    const sanitized: NodeFormData = {
      ...nodeData,
      httpParameters: nodeData.httpParameters
        ? {
            ...nodeData.httpParameters,
            pathParameters: cleanParams(nodeData.httpParameters.pathParameters),
            queryParameters: cleanParams(nodeData.httpParameters.queryParameters),
            headerParameters: cleanParams(nodeData.httpParameters.headerParameters),
          }
        : nodeData.httpParameters,
      httpResponses: (nodeData.httpResponses ?? EMPTY_ARRAY).map(resp => ({
        ...resp,
        headers: cleanParams(resp.headers),
      })),
    };

    editNode({ id: nodeId, updates: sanitized });
    closeEditHttpNodeModal();
  };

  const isJsonDefaultEditorActive =
    Boolean(selectedContentType && selectedTypeInfo) &&
    (!selectedTypeInfo!.isSupport ||
      (selectedContentType !== HttpContentTypeEnum.ApplicationJson &&
        selectedContentType !== HttpContentTypeEnum.MultipartFormData));

  const isSaveDisabled =
    isJsonDefaultEditorActive && selectedContent && (jsonEditorValue?.trim?.().length ?? 0) > 0
      ? !isValidJSON(jsonEditorValue)
      : false;

  const HttpParametersTypeOptions = Object.entries(HttpParameterTypeEnum).map(([, value]) => ({
    label: value,
    value,
  }));

  return (
    <Drawer
      title="HTTP-node edit"
      isOpen={isOpen}
      onClose={() => closeEditHttpNodeModal()}
      placement="right"
      customFooter={
        <div className="flex h-[100%] flex-row gap-2 py-2.5">
          <UIKitButton type="primary" isDisabled={isSaveDisabled} onClick={handleSave} style={{ borderRadius: '3px' }}>
            Save
          </UIKitButton>
          <UIKitButton type="default" onClick={() => closeEditHttpNodeModal()} style={{ borderRadius: '3px' }}>
            Cancel
          </UIKitButton>
        </div>
      }
    >
      <Collapse
        className="mb-3"
        key="general"
        items={[
          {
            key: 0,
            label: 'General',
            children: (
              <General
                pathParametrs={nodeData.httpParameters?.pathParameters}
                queryParametrs={nodeData.httpParameters?.queryParameters}
                addParameters={addParameters}
                deleteParameters={deleteParameters}
                updateParameterValue={updateParameterValue}
                handleChange={handleChange}
                nodeData={nodeData}
                HttpParametersTypeOptions={HttpParametersTypeOptions}
                handleHttpRequestBodyDescriptionChange={handleHttpRequestBodyDescriptionChange}
              />
            ),
          },
          {
            key: 1,
            label: 'Request',
            children: (
              <Request
                addContentType={addContentType}
                removeContentType={removeContentType}
                contentTypeList={nodeData.httpRequestBody?.content}
                events={eventGraph.events}
                headerParametrs={nodeData.httpParameters?.headerParameters}
                updateParameterValue={updateParameterValue}
                addParameters={addParameters}
                deleteParameters={deleteParameters}
                HttpParametersTypeOptions={HttpParametersTypeOptions}
                updateRequestContentEventId={updateRequestContentEventId}
                updateRequestContentBody={updateRequestContentBody}
                updateRequestMultipartEventId={updateRequestMultipartEventId}
                addMultipartFileField={addMultipartFileField}
                updateMultipartFileFieldType={updateMultipartFileFieldType}
                renameMultipartFileField={renameMultipartFileField}
                deleteMultipartFileField={deleteMultipartFileField}
              />
            ),
          },
          {
            key: 2,
            label: 'Response',
            children: (
              <Response
                addContentType={addContentType}
                removeContentType={removeContentType}
                httpResponses={nodeData.httpResponses}
                events={eventGraph.events}
                HttpParametersTypeOptions={HttpParametersTypeOptions}
                addHeaderToResponse={addHeaderToResponse}
                deleteHeaderFromResponse={deleteHeaderFromResponse}
                updateHeaderValueInResponse={updateHeaderValueInResponse}
                updateResponseContentEventId={updateResponseContentEventId}
              />
            ),
          },
        ]}
        isBordered={false}
      />
    </Drawer>
  );
};
